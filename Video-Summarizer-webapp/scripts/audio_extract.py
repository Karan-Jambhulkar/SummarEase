import subprocess
import os
print("audio extraction started")
def extract_audio(video_path, output_dir):
    """
    Extracts audio using a direct system call. 
    This is faster and more reliable for long (7-28 min) videos.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Output filename: same as video but .wav
    filename = os.path.basename(video_path).rsplit('.', 1)[0] + ".wav"
    output_path = os.path.join(output_dir, filename)

    print(f"Step AUDIO: Extracting from {video_path}")

    try:
        # We use a simple ffmpeg command (MoviePy uses this under the hood)
        # -y: overwrite output
        # -i: input file
        # -vn: disable video
        # -acodec pcm_s16le: standard wav format
        # -ar 16000: 16kHz (best for Whisper)
        command = [
            'ffmpeg', '-y', '-i', video_path, 
            '-vn', '-acodec', 'pcm_s16le', 
            '-ar', '16000', '-ac', '1', output_path
        ]
        
        # Run the command silently
        subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            return output_path
        else:
            return None

    except Exception as e:
        print(f"Extraction failed: {e}")
        return None