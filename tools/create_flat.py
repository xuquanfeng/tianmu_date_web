## Creat new real flat file(by 钟靖老师)
import glob
import random
import numpy as np
from astropy.io import fits
from matplotlib.backends.backend_pdf import PdfPages
import matplotlib.pyplot as plt

def main():
    ######################################
    inputdir=glob.glob('/datapool/ATMA00/ATMA00/2023*') #这里需要改一下原始文件夹的位置信息，到日期目录下即可
    ######################################
    for i,idir in enumerate(inputdir):
        allfile=glob.glob(idir+'/*.fits')
        dirname=idir.split('/')[-1]
        create_flat(dirname,allfile)
        print(idir)

def create_flat(dirname,allfile):
    for i, ifile in enumerate(allfile):
        data=fits.getdata(ifile)
        ifilename=ifile.split('/')[-1]

        if np.median(data) < 20000:
            dat=data[np.newaxis,:]
            if 'data_cube' in dir():
                data_cube=np.concatenate((data_cube,dat),axis=0)
                if len(data_cube[:,0,0]) == 50: break
            else:
                data_cube=dat
                print('create new data_cube')

    if 'data_cube' in dir():
        #create flat median
        medflat=np.median(data_cube,axis=0)
        hdu=fits.PrimaryHDU(data=medflat)
    ######################################
        hdu.writeto('/datapool/ATMA00/flat/'+dirname+'_flat.fits',overwrite=True)  #这里需要改一下创建的文件位置信息，放在flat文件夹中
    ######################################
    else:
        print(dirname,' cannot create flat file！')
    return

if __name__=='__main__':
    main()
