import numpy as np
from sklearn.cluster import KMeans

# ---------- CONFIG ----------
features_path = "features/features.npy"
output_path = "features/selected_frames.npy"
num_keyframes = 32     # change based on summary length you want
random_state = 42

# ---------- LOAD FEATURES ----------
features = np.load(features_path)
num_frames = features.shape[0]

# ---------- SAFETY CHECK ----------
num_keyframes = min(num_keyframes, num_frames)

# ---------- K-MEANS CLUSTERING ----------
kmeans = KMeans(
    n_clusters=num_keyframes,
    random_state=random_state,
    n_init=10
)

labels = kmeans.fit_predict(features)
centers = kmeans.cluster_centers_

# ---------- SELECT REPRESENTATIVE FRAME PER CLUSTER ----------
selected_indices = []

for i in range(num_keyframes):
    cluster_indices = np.where(labels == i)[0]
    cluster_features = features[cluster_indices]

    distances = np.linalg.norm(
        cluster_features - centers[i],
        axis=1
    )

    closest = cluster_indices[np.argmin(distances)]
    selected_indices.append(int(closest))

# ---------- SORT & SAVE ----------
selected_indices = sorted(selected_indices)
np.save(output_path, np.array(selected_indices))

print("Keyframes selected:", len(selected_indices))
print("Saved to:", output_path)