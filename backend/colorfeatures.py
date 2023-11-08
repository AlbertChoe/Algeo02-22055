from multiprocessing import Process
import time
import os
import numpy as np
from PIL import Image

def get_hsv(image):
    buffer_img = np.array(image) / 255.0
    Rn, Gn, Bn = buffer_img[:, :, 0], buffer_img[:, :, 1], buffer_img[:, :, 2]

    Cmax = np.max(buffer_img, axis=2)
    Cmin = np.min(buffer_img, axis=2)
    delta = Cmax - Cmin

    H = np.zeros_like(Cmax)
    non_zero_mask = delta != 0
    H[non_zero_mask] = 60 * (
        (np.where(Cmax == Rn, (Gn - Bn) / delta,
                   np.where(Cmax == Gn, (Bn - Rn) / delta + 2, (Rn - Gn) / delta + 4)) % 6)[non_zero_mask])

    S = np.where(Cmax != 0, delta / Cmax, 0)
    V = Cmax

    hsv_img = np.dstack((H, S, V))
    
    return hsv_img

def quantify(hsv_img):
    hsv_img = np.array(hsv_img)
    h = hsv_img[:, :, 0]
    H = np.where(np.logical_and(h >= 316, h <= 360), 0,
                 np.where(np.logical_and(h >= 1, h <= 25), 1,
                          np.where(np.logical_and(h <= 40, h >= 26), 2,
                                   np.where(np.logical_and(h >= 41, h <= 120), 3,
                                            np.where(np.logical_and(h >= 121, h <= 190), 4,
                                                     np.where(np.logical_and(h >= 191, h <= 270), 5,
                                                              np.where(np.logical_and(h >= 271, h <= 295), 6, 7)))))))
    s = hsv_img[:, :, 1]
    S = np.where(np.logical_and(s >= 0, s < 0.2), 0, np.where(np.logical_and(s >= 0.2, s < 0.7), 1, 2))
    v = hsv_img[:, :, 2]
    V = np.where(np.logical_and(v >= 0, v < 0.2), 0, np.where(np.logical_and(v >= 0.2, v < 0.7), 1, 2))
    hsv_img = np.dstack((H, S, V))
    return hsv_img

def histvectorize(hsv_img):
    hsv = np.array(hsv_img)
    num_bins = 72
    arr = np.zeros(num_bins)
    indices = hsv[:, :, 0] * 9 + hsv[:, :, 1] * 3 + hsv[:, :, 2]
    unique_indices, counts = np.unique(indices, return_counts=True)
    arr[unique_indices] = counts
    return arr

def dotprod(a, b):
    return np.dot(a, b)

def cosinesim(a, b):
    dot = dotprod(a, b)
    lengtha = np.linalg.norm(a)
    lengthb = np.linalg.norm(b)
    csim = dot / (lengtha * lengthb)
    return csim

def process_image(filename):
    image = Image.open(os.path.join(path, filename))
    bufferimg = np.array(image)
    return histvectorize(quantify(get_hsv(bufferimg)))

if __name__ == "__main__":
    path = "./dataset"
    filename = "apel.jpg"
    file2name = "1.jpg"

    st = time.time()
    image1 = process_image(filename)
    image2 = process_image(file2name)
    similarity = cosinesim(image1, image2)
    print(similarity)
    fn = time.time()
    print(fn - st)