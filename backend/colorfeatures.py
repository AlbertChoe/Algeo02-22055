import numpy as np

def getHSV(a: [int]):
    Rn = a[0]/255
    Gn = a[1]/255
    Bn = a[2]/255
    Cmax = max(Rn,Gn,Bn)
    Cmin = min(Rn,Gn,Bn)
    delta = Cmax - Cmin
    if delta == 0:
        H = 0
    elif Cmax == Rn:
        H = 60 * (((Gn-Bn)/delta) % 6) 
    elif Cmax == Gn:
        H = 60 * ((Bn-Rn)/delta + 2) 
    elif Cmax == Bn:
        H = 60 * ((Rn-Gn)/delta + 4)
    
    if Cmax == 0:
        S = 0
    else:
        S = delta/Cmax

    V = Cmax
    return [H,S,V]