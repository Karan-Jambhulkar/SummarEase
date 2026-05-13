import cv2
import os
from skimage.metrics import structural_similarity as ssim
print("visual scene detect started")

def is_unique(frame_a, frame_b, threshold=0.35):
    try:
        gray_a = cv2.cvtColor(frame_a, cv2.COLOR_BGR2GRAY)
        gray_b = cv2.cvtColor(frame_b, cv2.COLOR_BGR2GRAY)
        
        # Resize to 256x256 to speed up the i7 processing with the lower threshold
        gray_a = cv2.resize(gray_a, (256, 256))
        gray_b = cv2.resize(gray_b, (256, 256))
        
        result = ssim(gray_a, gray_b, full=True)
        score = result[0] if isinstance(result, (tuple, list)) else result
            
        return score < threshold
    except Exception as e:
        return True

def detect_scenes(video_path, output_folder, max_frames=15):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Calculate an interval to scan the video
    interval = total_frames // (max_frames * 2) 
    
    unique_frames = []
    last_frame = None
    count = 0

    while len(unique_frames) < max_frames and count < total_frames:
        cap.set(cv2.CAP_PROP_POS_FRAMES, count)
        ret, frame = cap.read()
        if not ret:
            break

        # If it's the first frame or different enough from the last saved one
        if last_frame is None or is_unique(frame, last_frame):
            frame_path = os.path.join(output_folder, f"frame_{len(unique_frames)}.jpg")
            cv2.imwrite(frame_path, frame)
            unique_frames.append(frame_path)
            last_frame = frame
        
        count += interval

    cap.release()
    return unique_frames