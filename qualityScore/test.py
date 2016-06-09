from PIL import Image
import os
import json
import urllib

with open("/Users/macbook/Desktop/download.json") as json_file:
    json_data = json.load(json_file)
    # print(json_data)

for item in json_data:
	print(json_data[item]["image"][4]["#text"])
	url = json_data[item]["image"][4]["#text"]
	urllib.urlretrieve(url, "image")
	print


lowq = "/Users/macbook/Desktop/thumb_IMG_1058_1024.jpg"
hiq ="/Users/macbook/Desktop/03139_amadablamwatchesoverthepathtopheriche_2560x1600.jpg"
file = "/Users/macbook/Desktop/image"
with Image.open(file) as im: 
    print(im.size)
    # print(dir(im))
    # print(im)
    print os.stat(file).st_size
    print(float(os.stat(file).st_size)/float(im.width*im.width))