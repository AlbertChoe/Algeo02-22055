from PIL import Image
import numpy as np
import time
import math


def imageToTextureVektor(image_path):
    img = Image.open(image_path)

    if img.mode != 'RGB':
        img = img.convert('RGB')

    img_np = np.array(img)
    grayscale = img_np[:,:,0]*0.29 + img_np[:,:,1]*0.587 + img_np[:,:,2]*0.114
    grayscale = np.floor(grayscale + 0.5).astype(int)

    coomatrix = np.zeros((256, 256), dtype=int)

    cur_pix = grayscale[:, :-1].ravel() 
    next_pix = grayscale[:, 1:].ravel()  

    idx = np.ravel_multi_index([cur_pix, next_pix], (256, 256))
    cooccurrence_counts = np.bincount(idx, minlength=256*256)
    coomatrix = cooccurrence_counts.reshape((256, 256))

    transpose_coomatriks = np.transpose(coomatrix)

    sum_coomatriks = coomatrix + transpose_coomatriks

    glcmNorm = coomatrix / np.sum(sum_coomatriks)

    vektor = getCHE(glcmNorm)
    return vektor

def getCHE(matriks_glcm):
    contrast = 0
    homogeneity = 0
    entropy = 0
    for i in range(len(matriks_glcm)):
        for j in range(len(matriks_glcm[0])):
            contrast += (matriks_glcm[i][j] * (i - j) * (i - j))
            homogeneity += ((matriks_glcm[i][j])/(1 + pow((i-j),2)))
            if(matriks_glcm[i][j] > 0):
                entropy += (matriks_glcm[i][j]* math.log(matriks_glcm[i][j]))
            
            

    entropy = entropy * -1
    vektor = [contrast,homogeneity,entropy]
    return vektor

def cosineSimilarity(histo1,histo2):
    dot_product = np.dot(histo1,histo2)
    lenghtHisto1 = math.sqrt(np.dot(histo1,histo1))
    lengthHisto2 = math.sqrt(np.dot(histo2,histo2))
    result = dot_product / (lenghtHisto1 * lengthHisto2)
    return result

mulai = time.time()
vektor1 = imageToTextureVektor("image/1.jpg")
vektor2 = imageToTextureVektor("image/2.jpg")
cosinus = cosineSimilarity(vektor1,vektor2)
end = time.time()

print(cosinus)
print(end - mulai)