import colorfeatures as cf
import math
import os
import numpy as np
from PIL import Image

path = "./dataset"
filename = "apel.jpg"
image = Image.open(os.path.join(path, filename))
bufferimg = np.array(image)
print(bufferimg)
for i in range(image.width):
    for j in range(image.height):
        bufferimg[i][j] = np.array(cf.getHSV(bufferimg[i][j]))
print(bufferimg)