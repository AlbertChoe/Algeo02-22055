import colorfeatures as cf
import math
import time
import os
import numpy as np
from PIL import Image

path = "./dataset"
filename = "apel.jpg"
image = Image.open(os.path.join(path, filename))
bufferimg = np.array(image).astype("float64")
st = time.time()
print(st)
def get_hsv(image):
    buffer_img = np.array(image)
    Rn = buffer_img[:, :, 0] / 255
    Gn = buffer_img[:, :, 1] / 255
    Bn = buffer_img[:, :, 2] / 255

    Cmax = np.max(buffer_img / 255, axis=2)
    Cmin = np.min(buffer_img / 255, axis=2)
    delta = Cmax - Cmin

    H = np.zeros_like(Cmax)
    H[delta != 0] = 60 * ((np.where(Cmax == Rn, (Gn - Bn) / delta, np.where(Cmax == Gn, (Bn - Rn) / delta + 2, (Rn - Gn) / delta + 4)) % 6)[delta != 0])

    S = np.where(Cmax == 0, 0, delta / Cmax)
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
    # Calculate the indices for the histogram bins
    idxMat = hsv[:, :, 0] * 9 + hsv[:, :, 1] * 3 + hsv[:, :, 2]

    # Count the occurrences of each bin
    hist = np.bincount(idxMat.ravel())

    return hist

def cosinesim(a, b):
    a = np.array(a)
    b = np.array(b)
    dotprod = np.dot(a,b)
    lengtha = np.linalg.norm(a)
    lengthb = np.linalg.norm(b)
    csim = dotprod/(lengtha*lengthb)
    return csim
# print(np.dot([1,2],[2,3]))
print(cosinesim(histvectorize(quantify(get_hsv(bufferimg))), histvectorize(quantify(get_hsv(bufferimg)))))
fn = time.time()
print(fn)
print("TIME: ")
print(fn-st)