//
//  NSTask.swift
//  GTUploader
//
//  Created by MacBook on 15/06/2016.
//  Copyright © 2016 MacBook. All rights reserved.
//

import Foundation

func runCommand(cmd : String, args : String...) -> (output: [String], error: [String], exitCode: Int32) {
    
    var output : [String] = []
    var error : [String] = []
    
    let task = NSTask()
    task.launchPath = cmd
    task.arguments = args
    
    let outpipe = NSPipe()
    task.standardOutput = outpipe
    let errpipe = NSPipe()
    task.standardError = errpipe
    
    task.launch()
    
    let outdata = outpipe.fileHandleForReading.readDataToEndOfFile()
    if var string = String.fromCString(UnsafePointer(outdata.bytes)) {
        string = string.stringByTrimmingCharactersInSet(NSCharacterSet.newlineCharacterSet())
        output = string.componentsSeparatedByString("\n")
    }
    
    let errdata = errpipe.fileHandleForReading.readDataToEndOfFile()
    if var string = String.fromCString(UnsafePointer(errdata.bytes)) {
        string = string.stringByTrimmingCharactersInSet(NSCharacterSet.newlineCharacterSet())
        error = string.componentsSeparatedByString("\n")
    }
    
    task.waitUntilExit()
    let status = task.terminationStatus
    
    return (output, error, status)
}