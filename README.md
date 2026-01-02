<img class="proj_thumb" src="https://xuquanfeng.github.io/figs/tianmu.png" alt="" height="200px">

# 数据网站使用说明
●平场和暗场数据：点击查询按钮后，可直接下载所有打包数据 All_data.zip。

●科学数据（通过观测日期检索）：选择观测日期点击查询按钮后，可直接下载当天所有数据 All_data.zip。

●科学数据（通过Ra，Dec检索）：由于数据文件较多，输入Ra，Dec，点击查询按钮，将返回每个含有该赤经赤纬的fits图像的路径，（result.json文件）。可以利用批量下载代码down_json.py去读取同目录下的result.json文即可将相应数据文件下载到本地。

●ccd 手册 http://202.127.29.3/~shen/TIANMU/doc/ccd231-c6.pdf 

数据网站访问地址(需要在上海天文台内网或者VPN下访问)：http://202.127.24.18:3300/

所有数据文件直接访问：http://202.127.24.18:3400/ 


# “南极天目”时域天文望远镜阵原型机ATMA00
|  |  |
| :---: | :-----------: |
| Location | -69d22m31.25s，76d22m31.95s |
| Diameter | 20cm |
| Pointing | az= $359.61\degree$ alt= $45.72\degree$ |
| Camera | QHY15-M |
| FoV |  $9.23\degree\times9.19\degree$|
| Pixels | 3108*3086 |
| Pixel size| 12 $\mu m$|
|Pixel scale|10.871 arcsec/pixel|
| Mode | DRIFTSCAN |

## 数据简介
请注意QHY15-M读出时间约为12秒，并且相机没有快门，因此实际曝光时间不等于头文件中的EXPOSURE字段。

### LIGHT        
亮场观测时间范围，蓝色为具备观测结果的日期：![](https://raw.githubusercontent.com/Rh-YE/Image/main/202407242341082.png)
亮场的原始数据可以根据我们提供的数据接口（按日期索引或坐标索引）进行下载。

### DARK
暗场分为多个曝光时间，1s,5s,10s,50s,110s,180s。暗场是在送去南极之前拍摄的。
### FLAT
我们发现个别平场文件过曝，使用平场之前，请先识别并去除这部分文件。

平场分为两个曝光时间，0s和1s。平场是在送去南极之前拍摄的。


## 数据整理细节
首先我们仅提供了ATMA00送至南极后且为EXPMODE="DRIFTSCAN"的LIGHT文件，以及相应的校准场，其他数据均未提供。

望远镜实际指向是使用Pixinsight软件中的ImageSolver脚本，利用GaiaDR3星表，输入视场中的某一天体坐标、望远镜的视场大小和像元大小来解算的。

根据坐标返回所有拍摄该天体的位置是提前计算所有文件的视场内的四个角的赤经赤纬，然后根据用户输入的赤经赤纬进行匹配的。

## 作者
中国科学院上海天文台 徐权峰 沈世银 叶人豪
