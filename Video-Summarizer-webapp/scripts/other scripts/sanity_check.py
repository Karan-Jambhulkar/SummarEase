import os
import cv2
import matplotlib.pyplot as plt

def visual_sanity_check(frames_dir, num_frames=5):

    frame_files = sorted(os.listdir(frames_dir))[:num_frames]

    plt.figure(figsize=(12, 4))

    for i, frame_name in enumerate(frame_files):
        frame_path = os.path.join(frames_dir, frame_name)
        frame = cv2.imread(frame_path)
        if frame is None:
          print(f"Failed to load {frame_name}")
          continue
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        plt.subplot(1, num_frames, i + 1)
        plt.imshow(frame)
        plt.axis("off")
        plt.title(frame_name)

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    visual_sanity_check("data/frames", num_frames=5)