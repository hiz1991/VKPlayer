import os
import sys
import hashlib
import math
import json,httplib,urllib
fil = os.path.join(os.path.expanduser("~"), "Music/iTunes/iTunes Music Library.xml")
song=""
songDict=None

from pyItunes import *

l = Library(fil)

objects=[]
for id, song in l.songs.items():
    # if song and song.rating > 80:
    songDict=song.ToDict()
    songDict.pop("skip_date", None)
    # songDict.pop("name", None)
    songDict.pop("date_modified", None)
    songDict.pop("date_added",None)
    songDict.pop("lastplayed",None)
    songDict.pop("skip_count",None)
    songDict.pop("kind",None)
    songDict.pop("disc_count",None)
    objects.append(songDict)
    # print(json.dumps(songDict))
    # print(",")
    # song = song.location
# print "]"/
connection = httplib.HTTPSConnection('api.parse.com', 443)
headers = {
         "X-Parse-Application-Id": "S3FAzGmZtzGPwZrieqcDcdzdGrN9nTEYLLIFdkAY",
         "X-Parse-REST-API-Key": "FGzJOl5njcYGHx2k6VZ5EoM1hPpOCPQ2cBW40vgo",
         "X-Parse-Revocable-Session": "1"
       }

userData=None
def SignIn(username, password):
 params = urllib.urlencode({"username":username,"password":password})
 connection.connect()
 connection.request('GET', '/1/login?%s' % params, '',headers )
 result = json.loads(connection.getresponse().read())
 userData=result
 return userData
 # return str(result["username"])
 
userData = SignIn("hiz1991@mail.ru","1991")
session=str(userData["sessionToken"])


# print(json.dumps(objects))
uploadeds = []
headers["X-Parse-Session-Token"]=session
# print headers
connection.request('POST', '/1/functions/getUploads', json.dumps({
	"sessionToken":session
     }), headers)
result = json.loads(connection.getresponse().read())
# jsonResponse =  
for item in result["result"]["response"]:
	uploadeds.append( item["track_id"])

finalObject = json.dumps([objects,uploadeds])
print finalObject