import os
import zipfile
from tqdm import tqdm

path_zip = '/datapool/ATMA00/ATMA01'
need = '/datapool/ATMA00/ATMA00'
a = []
b = []
for i in os.listdir(need):
    if '-' in i:
        a.append(need)
        b.append(i)
a.append('/datapool/ATMA00')
b.append('Dark')
a.append('/datapool/ATMA00')
b.append('flat')
# b.append('falt')
def zip_folder(folder_path, zip_file_path):
    with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, folder_path)
                zipf.write(file_path, relative_path)
for i in tqdm(range(len(a))):
    zip_folder(os.path.join(a[i],b[i]),os.path.join(path_zip,b[i]+'.zip'))
    # z.write()#将需要压缩的文件添加到压缩包对象中


