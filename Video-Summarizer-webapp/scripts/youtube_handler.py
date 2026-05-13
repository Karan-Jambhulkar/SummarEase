import yt_dlp
import os
import re
from typing import Any, Dict
print("youtube_handler started")
def is_valid_youtube_url(url: str) -> bool:
    """
    Validates if the provided string is a properly formatted YouTube URL.
    This prevents the backend from crashing due to malformed strings.
    """
    youtube_regex = (
        r'(https?://)?(www\.)?'
        '(youtube|youtu|youtube-nocookie)\.(com|be)/' # type: ignore
        '(watch\?v=|embed/|v/|.+\?v=)?([^&=%\?]{11})') # type: ignore
    
    return bool(re.match(youtube_regex, url))

def download_youtube_video(url: str, job_id: str) -> str:
    """
    Downloads a YouTube video into a job-specific folder.
    Optimized for MP4 format to ensure OpenCV compatibility.
    """
    if not is_valid_youtube_url(url):
        raise ValueError("Invalid YouTube URL provided.")

    # Create a unique subfolder inside uploads for this specific job
    # This prevents file collisions if multiple users summarize the same video
    output_dir = os.path.join("uploads", job_id)
    os.makedirs(output_dir, exist_ok=True)
    
    # Define options with explicit typing for Pylance compatibility
    # We force 'bestvideo' to be mp4 to ensure your visual pipeline works
    ydl_opts: Dict[str, Any] = {
        'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'outtmpl': os.path.join(output_dir, 'video.%(ext)s'),
        'noplaylist': True,
        'quiet': True,
        'no_warnings': True,
        'merge_output_format': 'mp4',
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl: #type:ignore
            info = ydl.extract_info(url, download=True)
            if info is None:
                raise Exception("Failed to extract video information.")
            
            # Returns the full path to the downloaded file (e.g., uploads/uuid/video.mp4)
            return ydl.prepare_filename(info)
            
    except Exception as e:
        # Cleanup the directory if the download fails
        if os.path.exists(output_dir):
            import shutil
            shutil.rmtree(output_dir)
        raise Exception(f"yt-dlp error: {str(e)}")