import cv2
import os
import numpy as np

# ---------- CONFIG ----------
input_video = "data/input.mp4"
frames_dir = "data/frames"
selected_indices_path = "features/selected_frames.npy"
output_path = "data/summary.mp4"

context = 5          # frames before & after each keyframe
summary_fps = 10     # fps of output summary
resize_dim = (640, 360)

# ---------- LOAD ----------
selected_indices = np.load(selected_indices_path)
total_frames = len(os.listdir(frames_dir))

# ---------- BUILD FRAME SET ----------
summary_frames = set()

for idx in selected_indices:
    for i in range(idx - context, idx + context + 1):
        if 0 <= i < total_frames:
            summary_frames.add(i)

summary_frames = sorted(summary_frames)

# ---------- VIDEO WRITER ----------
fourcc = cv2.VideoWriter.fourcc(*'mp4v')
out = cv2.VideoWriter(output_path, fourcc, summary_fps, resize_dim)

# ---------- WRITE SUMMARY ----------
cap = cv2.VideoCapture(input_video)
frame_idx = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    if frame_idx in summary_frames:
        frame = cv2.resize(frame, resize_dim)
        out.write(frame)

    frame_idx += 1

cap.release()
out.release()