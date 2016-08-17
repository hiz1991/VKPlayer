import os
import boto
import boto.s3
import sys
from boto.s3.key import Key
import hashlib
import math
import json,httplib,urllib
fil = os.path.join(os.path.expanduser("~"), "Music/iTunes/iTunes Music Library.xml")
song=""
songDict=None

from pyItunes import *

l = Library(fil)

# for id, song in l.songs.items()[6]:
id,song  = l.songs.items()[20]
if(len(sys.argv)>1):
	id,song  = l.songs.items()[int(sys.argv[1])]

# print song.ToDict()
# exit(0)
# if song and song.rating > 80:
songDict=song.ToDict()
# print(song.location)
song = song.location

filename, file_extension = os.path.splitext(song)
# playlists=l.getPlaylistNames()

# for song in l.getPlaylist(playlists[0]).tracks:
    # print("[%d] %s - %s" % (song.number, song.artist, song.name))

AWS_ACCESS_KEY_ID = 'AKIAJODVCH7TKGNKLITA'
AWS_SECRET_ACCESS_KEY = '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'

bucket_name = "gtplayer-buck"
conn = boto.connect_s3(AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY)


def md5(fname):
    hash_md5 = hashlib.md5()
    with open(fname, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

bucket = conn.create_bucket(bucket_name,
    location=boto.s3.connection.Location.DEFAULT)

testfile = os.path.join("/",song)#"/Users/macbook/Desktop/Nexus_5_HD_Wallpapers-11.jpg"
# print 'Uploading %s to Amazon S3 bucket %s' % \
#    (testfile, bucket_name)

def percent_cb(complete, total):
	# print(dir(complete))
	print(complete.real, total.real)
	sys.stdout.write(str( math.floor( (complete.real/float(total.real))*100 ) ))
	sys.stdout.flush()


k = Key(bucket)
k.key=md5(testfile)+file_extension
# print(md5(testfile) )
# print(dir(k))
k.set_contents_from_filename(testfile,
    cb=percent_cb, num_cb=10)
url=k.generate_url(expires_in=0, query_auth=False)
print(url)
songDict["url"] = url
songDict["title"]  =songDict["name"]

track_id = songDict["track_id"]
songDict.pop("skip_date", None)
songDict.pop("name", None)
songDict.pop("date_modified", None)
songDict.pop("date_added",None)
songDict.pop("lastplayed",None)
songDict.pop("skip_count",None)
songDict.pop("kind",None)
songDict.pop("disc_count",None)

print(songDict)


connection = httplib.HTTPSConnection('api.parse.com', 443)
headers = {
         "X-Parse-Application-Id": "S3FAzGmZtzGPwZrieqcDcdzdGrN9nTEYLLIFdkAY",
         "X-Parse-REST-API-Key": "FGzJOl5njcYGHx2k6VZ5EoM1hPpOCPQ2cBW40vgo",
         "X-Parse-Revocable-Session": "1"
       }
user=None

def SignIn(username, password):
  params = urllib.urlencode({"username":username,"password":password})
  connection.connect()
  connection.request('GET', '/1/login?%s' % params, '',headers )
  result = json.loads(connection.getresponse().read())
  print result
  return str(result["username"])
  


user = SignIn("hiz1991@mail.ru","1991")

print user

connection.request('POST', '/1/classes/Uploads', json.dumps({
       "data": json.dumps(songDict,ensure_ascii=False),
       "username": user,
       "trackID":str(track_id)
     }),headers )
result = json.loads(connection.getresponse().read())
print result

