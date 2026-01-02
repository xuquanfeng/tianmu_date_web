import pandas as pd
import sys
import json
from astropy.io import fits
import numpy as np
import os
import shutil

path = '/data/public/xqf/works/show_ipv4/20250329'
save_path = '/datapool/ATMA00/ATMA250329'
os.makedirs(save_path, exist_ok=True)
name = []
Date = []
for i in os.listdir(path):
    if i.endswith('.fits'):
        with fits.open(os.path.join(path, i)) as hdul:
            data = hdul[0].data
            header = hdul[0].header
            date = header['DATE-OBS']
            # sys.exit()
        name.append(i.replace('.fits', ''))
        Date.append(date)
        os.makedirs(os.path.join(save_path, date), exist_ok=True)
        if os.path.exists(os.path.join(save_path, date, i)):
            print(f'{os.path.join(save_path, date, i)} already exists')
            continue
        else:
            shutil.copy(os.path.join(path, i), os.path.join(save_path, date, i))
for i in os.listdir(path):
    if not i.endswith('.fits'):
        aa = i.split('.')[0]
        if aa in name:
            idx = name.index(aa)
            date = Date[idx]
        else:
            continue
        if os.path.exists(os.path.join(save_path, date, i)):
            print(f'{os.path.join(save_path, date, i)} already exists')
            continue
        else:
            shutil.copy(os.path.join(path, i), os.path.join(save_path, date, i))
