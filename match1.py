import numpy as np
from astropy.coordinates import EarthLocation, AltAz, SkyCoord, Angle
from astropy.time import Time
import astropy.units as u
import pandas as pd
import json
import sys

def from_radec(ra, dec, atma_info_pd, latitude="-69d22m31.25s", longitude="76d22m31.95s", elevation=0, alt_center=45.72778912838103, az_center=359.617459701301):
    pixel_scale = 10.871 * u.arcsec  # arcsec per pixel
    max_pixel_distance = 1500  # pixels
    max_distance = (pixel_scale * max_pixel_distance).to(u.deg)  # 转换为度
    location = EarthLocation(lat=Angle(latitude), lon=Angle(longitude), height=elevation)
    times = Time((atma_info_pd['DATE-OBS'] + 'T' + atma_info_pd['TIME-OBS']).to_list())
    alt_centers = np.full_like(times, alt_center) * u.degree
    az_centers = np.full_like(times, az_center) * u.degree
    altaz_frame = AltAz(obstime=times, location=location)
    target_coord = SkyCoord(ra=ra*u.deg, dec=dec*u.deg)
    altaz_target = target_coord.transform_to(altaz_frame)
    center_coord = SkyCoord(alt=alt_centers, az=az_centers, frame=altaz_frame)
    separation = altaz_target.separation(center_coord)
    
    mask = separation < max_distance
    
    matched_indices = np.where(mask)[0]
    files_names = atma_info_pd['file_name'].tolist()
    # matched_files2 = ['/'.join(i.split('/')[-2:]) for i in matched_files1]
    files = ['/'.join(files_names[idx].split('/')[-2:]) for idx in matched_indices]
    return files
ra = float(sys.argv[1])
dec = float(sys.argv[2])
atma_info_pd = pd.read_csv("/datapool/ATMA00/atma_driftscan_info.csv")
files = from_radec(ra, dec, atma_info_pd)
b = json.dumps(files)
f2 = open('/datapool/ATMA00/result.json', 'w')
f2.write(b)
f2.close()
# print(json.dumps(files))
print(b)