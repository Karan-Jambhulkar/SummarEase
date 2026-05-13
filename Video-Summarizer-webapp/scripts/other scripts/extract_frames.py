import os
import cv2


def extract_frames(video_path,output_dir,fps=1,resize_dim=(224,224)):
    os.makedirs(output_dir,exist_ok=True)
    cap=cv2.VideoCapture(video_path)
    video_fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_interval = max(video_fps//fps,1)

    frame_count = 0
    saved_count = 0
    while True:
        ret,frame = cap.read()
        if not ret: 
            break
        if frame_count % frame_interval == 0:
            frame = cv2.resize(frame,resize_dim)
            frame_path=os.path.join(output_dir, f"frame_{saved_count:05d}.jpg")
            cv2.imwrite(frame_path,frame)
            saved_count += 1
        frame_count += 1
    cap.release()
    print(f"extracted {saved_count} frames")

if __name__ == "__main__":
    extract_frames(
        video_path="data/input.mp4",
        output_dir="data/frames",
        fps=1
    )

