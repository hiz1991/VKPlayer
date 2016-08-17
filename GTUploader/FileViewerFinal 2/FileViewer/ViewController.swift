/*
 * Copyright (c) 2015 Razeware LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import Cocoa
import Foundation

class ViewController: NSViewController {
    
    @IBOutlet weak var progressBar: NSProgressIndicator!
    @IBOutlet weak var activity: NSProgressIndicator!
    @IBOutlet weak var statusLabel:NSTextField!
    @IBOutlet weak var tableView: NSTableView!
    @IBOutlet weak var uploadButton: NSButtonCell!
    @IBAction func uploadAction(sender: AnyObject) {
        if(selectedIndexes.count==0){
            statusLabel.stringValue = "No file selected"
        }else{
            
            progressBar.doubleValue=0
            for index in 0...selectedIndexes.count-1{
                activity.startAnimation(self)
                let (output, error, status) = runCommand("/usr/bin/python", args: getPath()+"testPython.py", String(selectedIndexes[index]))
                print("program exited with status \(status)")
                //            if output.count > 0 {
                print("program output:")
                print(output)
                activity.stopAnimation(self)
                progressBar.doubleValue = (Double(index)/(Double(selectedIndexes.count-1)))*100
                //                directoryItems=[]
                //                reloadFileList()
                
                //            }
                if error.count > 0 {
                    print("error output:")
                    print(error)
                }
            }
            var data:[AnyObject] = loadData()
            directoryItems=data[0] as! [NSDictionary]
            loadeds = data[1] as! [Int]
            reloadFileList()
            progressBar.doubleValue=0
            
        }
    }
    
//    @IBOutlet weak var checkButton: NSButton!
//    @IBOutlet weak var actionButton: NSButtonCell!
    let sizeFormatter = NSByteCountFormatter()
    var directory:Directory?
    var loadeds:[Int]=[]
    var selectedIndexes:[Int]=[]
    var directoryItems:[NSDictionary]=[]
    var firstLaunch=true
    
    var sortOrder = Directory.FileOrder.Name
    var sortAscending = true
    
    override func viewDidLoad() {
        super.viewDidLoad()
//        getPath()
//        exit(0)
        print(loadData())
        var data:[AnyObject] = loadData()
        directoryItems=data[0] as! [NSDictionary]
        loadeds = data[1] as! [Int]
        if(!firstLaunch){
           firstLaunch=false
           reloadFileList()
        }
        statusLabel.stringValue = ""
        tableView.setDelegate(self)
        tableView.setDataSource(self)
        tableView.target = self
        tableView.doubleAction = #selector(ViewController.tableViewDoubleClick(_:))
        //1.
        let descriptorName = NSSortDescriptor(key: Directory.FileOrder.Name.rawValue, ascending: true)
        let descriptorDate = NSSortDescriptor(key: Directory.FileOrder.Date.rawValue, ascending: true)
        let descriptorSize = NSSortDescriptor(key: Directory.FileOrder.Size.rawValue, ascending: true)
        //2.
        tableView.tableColumns[0].sortDescriptorPrototype = descriptorName;
        tableView.tableColumns[1].sortDescriptorPrototype = descriptorDate;
        tableView.tableColumns[2].sortDescriptorPrototype = descriptorSize;
        
        
    }
    
    override var representedObject: AnyObject? {
        didSet {
            if let url = representedObject as? NSURL {
                directory = Directory(folderURL: url)
                reloadFileList()
                
            }
        }
    }
    func tableViewDoubleClick( sender:AnyObject ) {
        
        //1.
        //    tableView.selectedRow >= 0 ,
        let item = directoryItems[tableView.selectedRow]
    }
    
    func updateStatus() {
        
        let text:String
        // 1
        let itemsSelected = tableView.selectedRowIndexes.count
        print(tableView.selectedRowIndexes.toArray())
        selectedIndexes = tableView.selectedRowIndexes.toArray()
        
        // 2
        if ( directoryItems.count < 1 ) {
            text = ""
        }
        else if( itemsSelected == 0 ) {
            text =   "\(directoryItems.count) items"
        }
        else
        {
            text = "\(itemsSelected) of \(directoryItems.count) selected"
        }
        // 3
        statusLabel.stringValue = text
    }
    
    func reloadFileList() {
        //    directoryItems = directory?.contentsOrderedBy(sortOrder, ascending: sortAscending)
        tableView.reloadData()
    }
}

extension ViewController : NSTableViewDataSource {
    func numberOfRowsInTableView(tableView: NSTableView) -> Int {
        return directoryItems.count ?? 0
    }
    
    func tableView(tableView: NSTableView, sortDescriptorsDidChange oldDescriptors: [NSSortDescriptor]) {
        //1
        guard let sortDescriptor = tableView.sortDescriptors.first else {
            return
        }
        if let order = Directory.FileOrder(rawValue: sortDescriptor.key! ) {
            //2.
            sortOrder = order
            sortAscending = sortDescriptor.ascending
            reloadFileList()
        }
    }
    
}

extension NSIndexSet {
    func toArray() -> [Int] {
        var indexes:[Int] = [];
        self.enumerateIndexesUsingBlock { (index:Int, _) in
            indexes.append(index);
        }
        return indexes;
    }
}

extension ViewController : NSTableViewDelegate {
    
    func tableViewSelectionDidChange(notification: NSNotification) {
        updateStatus()
    }
    
    func tableView(tableView: NSTableView, viewForTableColumn tableColumn: NSTableColumn?, row: Int) -> NSView? {
        
        var image:NSImage?
        var text:String=""
        var cellIdentifier:String=""
        var shouldBeDisabled = false
        // 1
        let item = directoryItems[row]
        //    else {
        //      return nil
        //    }
        
        // 2
        if tableColumn == tableView.tableColumns[0] {
            //      image = item.icon
            text = item["name"] as! String
            cellIdentifier = "NameCellID"
        }
        else if tableColumn == tableView.tableColumns[1] {
            if let stringArray = item["artist"] as? NSNull {
                // obj is a string array. Do something with stringArray
                text="None"
            }
            else {
                if item["artist"] != nil {
                    text=item["artist"] as! String
                }
                else {
                    text="None"
                }
            }
            cellIdentifier = "DateCellID"
        }
        else if tableColumn == tableView.tableColumns[2] {
            let trackID = item["track_id"] as! Int
            text="No"
            for i in loadeds {
                if i==trackID{
                    text = "Yes"
                    shouldBeDisabled = true
                }
                
            }
            
            
            cellIdentifier = "SizeCellID"
        }
        else if tableColumn == tableView.tableColumns[3] {
//            
//            cell!.checkButton?.setImage(UIImage(named: "boxChecked"),forState:UIControlState.Normal)
            cellIdentifier = "CheckCellID"
        }
        
        
        // 3
        if let cell = tableView.makeViewWithIdentifier(cellIdentifier, owner: nil ) as? NSTableCellView {
            cell.textField?.stringValue = text
            cell.imageView?.image = image ?? nil
            if tableColumn == tableView.tableColumns[3] {
                
//                cell.checkButton?
            }
//            if(shouldBeDisabled){
//                cell.hidden=true
//            }
            return cell
        }
        return nil
    }
}