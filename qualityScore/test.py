from PIL import Image
from PIL import ImageStat
import math
import os
import json
import urllib

# with open("/Users/macbook/Desktop/download.json") as json_file:
#     json_data = json.load(json_file)
#     # print(json_data)

# for item in json_data:
# 	print(json_data[item]["image"][4]["#text"])
# 	url = json_data[item]["image"][4]["#text"]
# 	urllib.urlretrieve(url, "image")
# 	print
#     

def brightness(im_file):
   im = Image.open(im_file)
   stat = ImageStat.Stat(im)
   # print dir(stat)
   # print stat.stddev
   r,g,b = stat.mean
   rsat,gsat,bsat = stat.stddev
   return math.sqrt(0.241*(r**2) + 0.691*(g**2) + 0.068*(b**2)), math.sqrt(0.241*(rsat**2) + 0.691*(gsat**2) + 0.068*(bsat**2))


lowq = "lowq.jpg"#/Users/macbook/Desktop/thumb_IMG_1058_1024.jpg"
hiq ="hiq.jpg"#"/Users/macbook/Desktop/03139_amadablamwatchesoverthepathtopheriche_2560x1600.jpg"
lowsat = "hiq-lowsat.jpg"
lowestsat = "lowestsat.jpg"
highestsat = "highestsat.jpg"
lowsat2 = "/Users/macbook/Desktop/204304_164961820228156_100001430183965_394218_6657504_o.jpg"
file = lowq#"/Users/macbook/Desktop/image"
# with Image.open(file) as im: 
#     print(im.size)
#     # print(im[3][4])
#     # print(im)
#     print os.stat(file).st_size
#     print(float(os.stat(file).st_size)/float(im.width*im.width))
print(brightness(lowestsat))
print(brightness(lowsat))
print(brightness(lowsat2))
print(brightness(hiq))
print(brightness(highestsat))