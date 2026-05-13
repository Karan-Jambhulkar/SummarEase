import os
import shutil
import uuid
import time
import cv2
from typing import Dict, Any
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Query
from fastapi.middleware.cors import CORSMiddleware

# Pipeline Scripts
from scripts.audio_extract import extract_audio
from scripts.audio_splitter import split_audio
from scripts.speech_to_text import transcribe_audio_transcripts
from scripts.text_summary import summarize_chunks
from scripts.visual_scene_detect import detect_scenes
from scripts.keyframe_extract import extract_keyframes
from scripts.image_captions import generate_captions

# YouTube Integration Script
from scripts.youtube_handler import download_youtube_video

app = FastAPI(title="AI Video Summarizer - BTech Project")

# Enable CORS for frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global dictionary to track job progress and performance stats
jobs_status: Dict[str, Any] = {}

def process_video_task(job_id: str, video_path: str, format_type: str, length_mode: str):
    """
    The master background worker that handles the multi-modal pipeline.
    Works for both uploaded files and YouTube downloads.
    """
    try:
        start_time_total = time.time()
        job_dir = f"outputs/{job_id}"
        os.makedirs(job_dir, exist_ok=True)
        temp_frames = f"temp_frames_{job_id}"

        # --- STEP 1: AUDIO EXTRACTION ---
        s_time = time.time()
        jobs_status[job_id] = "Extracting Audio..."
        audio_path = extract_audio(video_path, f"{job_dir}/audio")
        audio_duration = time.time() - s_time

        # --- STEP 2: TRANSCRIPTION ---
        s_time = time.time()
        jobs_status[job_id] = "Transcribing Speech (Whisper)..."
        audio_chunks = split_audio(audio_path, f"{job_dir}/chunks")
        transcripts = transcribe_audio_transcripts(audio_chunks)
        transcribe_duration = time.time() - s_time

        # --- STEP 3: VISUAL ANALYSIS ---
        s_time = time.time()
        jobs_status[job_id] = "Analyzing Visual Scenes (BLIP)..."
        
        # Calculate dynamic frame limit based on video duration
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_f = cap.get(cv2.CAP_PROP_FRAME_COUNT)
        duration_seconds = total_f / fps if fps > 0 else 60
        cap.release()

        max_v_frames = 25 if duration_seconds < 120 else 15
        scenes = detect_scenes(video_path, temp_frames, max_frames=max_v_frames)
        
        # Performance cap: ensure CPU isn't overwhelmed by too many scenes
        if len(scenes) > 15:
            step = len(scenes) // 15
            scenes = scenes[::step][:15]

        keyframes = extract_keyframes(video_path, scenes, f"{job_dir}/keyframes")
        captions = generate_captions(keyframes)
        visual_duration = time.time() - s_time

        # --- STEP 4: MULTI-MODAL FUSION & SUMMARY ---
        s_time = time.time()
        jobs_status[job_id] = "Synthesizing Final Summary..."
        
        labeled_captions = [f"[Visual Scene {i+1}]: {c}" for i, c in enumerate(captions)]
        combined_input = transcripts + labeled_captions if transcripts else labeled_captions
        
        final_summary = summarize_chunks(combined_input, format_type, length_mode)
        summary_duration = time.time() - s_time

        total_duration = time.time() - start_time_total

        # Save results to global status
        jobs_status[job_id] = {
            "status": "Completed", 
            "summary": final_summary,
            "benchmarks": {
                "audio_s": round(audio_duration, 2),
                "transcribe_s": round(transcribe_duration, 2),
                "visual_s": round(visual_duration, 2),
                "total_s": round(total_duration, 2)
            }
        }

    except Exception as e:
        print(f"Error in job {job_id}: {e}")
        jobs_status[job_id] = {"status": "Error", "message": str(e)}

    finally:
        # CLEANUP: Remove temporary frames and original video to save disk space
        if os.path.exists(temp_frames):
            shutil.rmtree(temp_frames)
        
        # Clean up the specific upload folder for this job
        video_dir = os.path.dirname(video_path)
        if "uploads" in video_dir and job_id in video_dir:
            shutil.rmtree(video_dir)

async def process_youtube_task(job_id: str, url: str, format_type: str, length_mode: str):
    """
    Downloads YouTube video then hands off to the main pipeline.
    """
    try:
        jobs_status[job_id] = "Downloading from YouTube..."
        # Uses the new job-id based download handler
        video_path = download_youtube_video(url, job_id)
        process_video_task(job_id, video_path, format_type, length_mode)
    except Exception as e:
        jobs_status[job_id] = {"status": "Error", "message": f"YouTube Failure: {str(e)}"}

@app.post("/summarize-video/")
async def summarize_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    format_type: str = "paragraph",
    length_mode: str = "medium"
):
    job_id = str(uuid.uuid4())
    jobs_status[job_id] = "Uploading local file..."

    # Create job-specific directory for the upload
    job_upload_dir = f"uploads/{job_id}"
    os.makedirs(job_upload_dir, exist_ok=True)
    video_path = os.path.join(job_upload_dir, file.filename) # type: ignore
    
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    background_tasks.add_task(process_video_task, job_id, video_path, format_type, length_mode)
    return {"job_id": job_id, "message": "File processing started."}

@app.post("/summarize-youtube/")
async def summarize_youtube(
    background_tasks: BackgroundTasks,
    url: str = Query(...),
    format_type: str = "paragraph",
    length_mode: str = "medium"
):
    job_id = str(uuid.uuid4())
    jobs_status[job_id] = "Queued: YouTube Processing"
    
    background_tasks.add_task(process_youtube_task, job_id, url, format_type, length_mode)
    return {"job_id": job_id, "message": "YouTube link accepted."}

@app.get("/status/{job_id}")
async def get_status(job_id: str):
    # Returns the current string status or the full data object if completed
    return {"job_id": job_id, "data": jobs_status.get(job_id, "Job not found")}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)