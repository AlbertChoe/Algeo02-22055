from PIL import Image
import numpy as np
import time
import math

def convertImageToGrayScale(Path):
    np.seterr(divide='ignore', invalid='ignore')
    img = Image.open(Path)
    img_np = np.array(img)
    R = img_np[:,:,0]
    G = img_np[:,:,1]
    B = img_np[:,:,2]
    grayImg = 0.29*R + 0.587*G + 0.114*B
    return grayImg.astype(np.int64)

def createOccurenceMatrix(grayImg):
    grayImg = np.array(grayImg)
    occMat = np.zeros((256,256))
    for i in range(grayImg.shape[0]-1):
        for j in range(grayImg.shape[1]-1):
            idxRow = grayImg[i,j] 
            idxCol = grayImg[i,j+1]
            occMat[idxRow,idxCol] += 1
    return occMat

def getTextureFeatures(occMat):
    occMat = np.array(occMat)
    contrast = 0
    homogeneity = 0
    entropy = 0
    for i in range(256):
        for j in range(256):
            contrast += occMat[i,j] * (i-j)**2
            homogeneity += occMat[i,j]/ (1 + (i-j)**2)
            if occMat[i,j] != 0:
                entropy += occMat[i,j] * math.log(occMat[i,j])
    
    return np.array((contrast, homogeneity, entropy))

def cosineSimilarity(a, b):
    a = np.array(a).astype(np.int64)
    b = np.array(b).astype(np.int64)
    dot_product = np.dot(a, b)
    lengtha = math.sqrt(np.dot(a, a))
    lengthb = math.sqrt(np.dot(b, b))
    result = dot_product / (lengtha * lengthb)
    return result

if __name__ == "__main__":
    st = time.time()
    path1 = "image/9.jpg"
    path2 = "image/1.jpg"
    v1 = getTextureFeatures(createOccurenceMatrix(convertImageToGrayScale(path1)))
    v2 = getTextureFeatures(createOccurenceMatrix(convertImageToGrayScale(path2)))
    print("Cos : ", cosineSimilarity(v1,v2))
    fn = time.time()
    print("Time : ", (fn-st))