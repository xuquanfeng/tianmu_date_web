import json
import os
from tqdm import tqdm
f = open('result.json', 'r')
content = f.read()
a = json.loads(content)
f.close()
# print(type(a))
# print(a)
header = 'http://202.127.24.18:3400/fs/ATMA00/'
for i in tqdm(a[:5]):
    url = header+i
    cmd = 'wget %s -O %s' % (url, i.split('/')[-1])
    os.system(cmd)