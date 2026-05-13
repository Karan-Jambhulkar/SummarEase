import numpy as np

# ---------- CONFIG ----------
input_indices_path = "features/selected_frames.npy"
output_indices_path = "features/selected_frames.npy"  # overwrite is OK
min_gap = 5   # minimum frame distance between keyframes

# ---------- LOAD ----------
indices = np.load(input_indices_path)
indices = sorted(indices)

# ---------- TEMPORAL FILTERING ----------
final_indices = [indices[0]]

for idx in indices[1:]:
    if idx - final_indices[-1] >= min_gap:
        final_indices.append(idx)

final_indices = np.array(final_indices)

# ---------- SAVE ----------
np.save(output_indices_path, final_indices)

print("Before filtering:", len(indices))
print("After filtering:", len(final_indices))
print("Saved to:", output_indices_path)