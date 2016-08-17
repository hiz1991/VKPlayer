//
//  LoadList.swift
//  FileViewer
//
//  Created by MacBook on 16/06/2016.
//  Copyright © 2016 razeware. All rights reserved.
//

import Foundation

func loadData()->[AnyObject]{
    var dictArray:[NSDictionary]=[]
    var jsonSongs:AnyObject?
    let (output, error, status) = runCommand("/usr/bin/python", args: getPath()+"gui.py")
    print("program exited with status \(status)")
    if output.count > 0 {
        print("program output:")
        //            print(output)
    }
    if error.count > 0 {
        print("error output:")
        print(error)
    }
    //        let readd:NSData = String(system("python /Users/macbook/Desktop/gui.py")) as NSData
    do {
        let json = try NSJSONSerialization.JSONObjectWithData(output[0].dataUsingEncoding(NSUTF8StringEncoding)!, options: .AllowFragments)
        
        jsonSongs = json as? [AnyObject]
        if let blogs = jsonSongs![0] as? [[String: AnyObject]] {
            for blog in blogs {
                //                    print(blog)
                let dict = NSDictionary(dictionary: blog)
                dictArray.append(dict)
                //                    print(dict)
                print(dict.valueForKey("artist")!)
                print(dict.valueForKey("name")!)
//                
//                if let name = dict["name"] as? String {
//                    //                        names.append(name)
//                    print(name)
//                }
            }
        }
    } catch {
        print("error serializing JSON: \(error)")
    }
    
    return [dictArray,jsonSongs![1]]
}

extension NSDictionary {
    
    static func fromDictionary<Key: Hashable, Value:AnyObject where Key: NSCopying>(dictionary:Dictionary<Key, Value>) -> NSDictionary {
        
        let mutableDict : NSMutableDictionary = NSMutableDictionary()
        
        for key in dictionary.keys {
            if let value = dictionary[key] {
                mutableDict[key] = value
            } else {
                mutableDict[key] = NSNull()
            }
        }
        return mutableDict
    }
    
    static func fromDictionary<Key: Hashable, Value:AnyObject where Key: NSCopying>(dict: Dictionary<Key, Optional<Value>>) -> NSDictionary {
        
        let mutableDict : NSMutableDictionary = NSMutableDictionary()
        
        for key in dict.keys {
            if let maybeValue = dict[key] {
                if let value = maybeValue {
                    mutableDict[key] = value
                } else {
                    mutableDict[key] = NSNull()
                }
            }
        }
        return mutableDict
    }
}

func getPath()->String{
    let fileManager = NSFileManager.defaultManager()
    
    // Get current directory path
    
    let path = fileManager.currentDirectoryPath
//    print(path)
    let documentsURL = NSURL(fileURLWithPath: path,
        isDirectory: true
    )
    
    let getter = documentsURL.URLByAppendingPathComponent("GTPUploader.app/Contents/Resources/")
    
    print(getter.path!)
    return getter.path!+"/"
}