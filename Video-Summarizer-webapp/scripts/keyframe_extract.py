import cv2
import os
import shutil

print("keyframe extraction started")

def extract_keyframes(video_path, scenes, output_folder="outputs/keyframes"):
    """
    Since 'scenes' is now a list of pre-saved frame paths from detect_scenes,
    this function will ensure they are in the correct output folder and resized for BLIP.
    """
    os.makedirs(output_folder, exist_ok=True)
    keyframes = []

    for i, frame_path in enumerate(scenes):
        # Generate the new path in the final output folder
        new_frame_path = os.path.join(output_folder, f"keyframe_{i}.jpg")
        
        # Load, resize to 384x384 (BLIP standard), and save
        frame = cv2.imread(frame_path)
        if frame is not None:
            frame = cv2.resize(frame, (384, 384)) 
            cv2.imwrite(new_frame_path, frame, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
            keyframes.append(new_frame_path)

    return keyframes