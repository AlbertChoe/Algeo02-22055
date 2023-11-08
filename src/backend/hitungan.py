from PIL import Image
import numpy as np
import time
import math


def rgb_to_hsv(img_np):
    img_np = img_np / 255.0

    r, g, b = img_np[:, :, 0], img_np[:, :, 1], img_np[:, :, 2]
    cmax = np.maximum.reduce([r, g, b])
    cmin = np.minimum.reduce([r, g, b])
    delta = cmax - cmin

    h = np.zeros_like(cmax)
    s = np.zeros_like(cmax)
    v = cmax

    # Calculate Hue
    mask = delta != 0
    mask_r = (cmax == r) & mask
    mask_g = (cmax == g) & mask
    mask_b = (cmax == b) & mask

    h[delta == 0] = 0
    h[mask_r] = 60 * (((g - b) / delta)[mask_r] % 6)
    h[mask_g] = 60 * (((b - r) / delta)[mask_g] + 2)
    h[mask_b] = 60 * (((r - g) / delta)[mask_b] + 4)

    # Calculate Saturation
    s[cmax != 0] = delta[cmax != 0] / v[cmax != 0]
    s[cmax == 0] = 0
    # Set hue to 0 for black/white colors

    h, s, v = hsv_to_hsvFeature(h, s, v)
    # Combine H, S, V into one matrix
    hsv = np.stack((h, s, v), axis=-1)

    return hsv


def hsv_to_hsvFeature(h, s, v):
    h0 = ((h >= 316) & (h <= 360)) | (h == 0)
    h1 = (1 <= h) & (h < 26)
    h2 = (26 <= h) & (h < 41)
    h3 = (41 <= h) & (h < 121)
    h4 = (121 <= h) & (h < 191)
    h5 = (191 <= h) & (h < 271)
    h6 = (271 <= h) & (h < 295)
    h7 = (295 <= h) & (h < 316)

    s0 = (0 <= s) & (s < 0.2)
    s1 = (0.2 <= s) & (s < 0.7)
    s2 = (0.7 <= s) & (s <= 1)

    v0 = (0 <= v) & (v < 0.2)
    v1 = (0.2 <= v) & (v < 0.7)
    v2 = (0.7 <= v) & (v <= 1)

    h[h0] = 0
    h[h1] = 1
    h[h2] = 2
    h[h3] = 3
    h[h4] = 4
    h[h5] = 5
    h[h6] = 6
    h[h7] = 7

    s[s0] = 0
    s[s1] = 1
    s[s2] = 2

    v[v0] = 0
    v[v1] = 1
    v[v2] = 2

    return h, s, v


def makeHistogram(array):

    indices = array[:, :, 0]*9 + array[:, :, 1]*3 + array[:, :, 2]
    indices = indices.flatten()

    temp_arr = np.zeros(72, dtype=int)

    np.add.at(temp_arr, indices, 1)

    return temp_arr


def imageToHistogram(image_path):

    np.seterr(divide='ignore', invalid='ignore')

    img = Image.open(image_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')

    img_np = np.array(img)

    hsv_arr = rgb_to_hsv(img_np)
    hsv_arr_int = hsv_arr.astype(int)

    histogram_arr = makeHistogram(hsv_arr_int)
    return histogram_arr


def cosineSimilarity(histo1, histo2):
    dot_product = np.dot(histo1, histo2)
    lenghtHisto1 = math.sqrt(np.dot(histo1, histo1))
    lengthHisto2 = math.sqrt(np.dot(histo2, histo2))
    result = dot_product / (lenghtHisto1 * lengthHisto2)
    return result


# start = time.time()
# myhisto1 = imageToHistogram("image1.jpeg")
# myhisto2 = imageToHistogram("image2.jpeg")
# myhisto1 = myhisto1.astype(np.int64)
# myhisto2 = myhisto2.astype(np.int64)
# print(myhisto1)
# print(myhisto2)
# cosinus = cosineSimilarity(myhisto1, myhisto2)
# print("cosinus = " + str(cosinus))
# end = time.time()
# print("Time : " + str(end - start))
