#!/usr/bin/python


from Tkinter import *
from ttk import *
import Tkinter as tk
# from tkintertable.Tables import TableCanvas
# from tkintertable.TableModels import TableModel

class Example(tk.Frame):
    def __init__(self, root):

        tk.Frame.__init__(self, root)
        self.canvas = tk.Canvas(root, borderwidth=0, background="#ffffff")
        self.frame = tk.Frame(self.canvas, background="#ffffff")
        self.vsb = tk.Scrollbar(root, orient="vertical", command=self.canvas.yview)
        self.canvas.configure(yscrollcommand=self.vsb.set)

        self.vsb.pack(side="right", fill="y")
        self.canvas.pack(side="left", fill="both", expand=True)
        self.canvas.create_window((4,4), window=self.frame, anchor="nw", 
                                  tags="self.frame")

        self.frame.bind("<Configure>", self.onFrameConfigure)

        self.populate()

    def populate(self):
        '''Put in some fake data'''
        for row in range(100):
            # tk.Label(self.frame, text="%s" % row, width=3, borderwidth="1", 
            #          relief="solid").grid(row=row, column=0)
            # t="this is the second column for row %s" %row
            # tk.Label(self.frame, text=t).grid(row=row, column=1)
            tk.Checkbutton(self.frame, text = "Music", \
                 onvalue = 1, offvalue = 0, height=1, \
                 width = 20).grid(row=row, column=1)

    def onFrameConfigure(self, event):
        '''Reset the scroll region to encompass the inner frame'''
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))

if __name__ == "__main__":
    root=tk.Tk()
    Example(root).pack(side="top", fill="both", expand=True)
    root.mainloop()


# master = Tk()
# fr = Frame(master)

# # scrollbar = Scrollbar(fr)
# data = [{"Title":"Me", "Artist":"Fucking Rihanna", "url":"http"},\
# 		{"Title":"Me", "Artist":"Fucking Rihanna", "url":"http"},\
# 		{"Title":"Me", "Artist":"Fucking Rihanna", "url":"http"}\
# 		]

# for i in range(0,100):
# 	print i
# 	c1 = Checkbutton(fr, text = "Music", \
#                  onvalue = 1, offvalue = 0, height=1, \
#                  width = 20)
# 	c1.pack()
# # CheckVar1 = IntVar()
# # CheckVar2 = IntVar()
# # C1 = Checkbutton(fr, text = "Music", variable = CheckVar1, \
# #                  onvalue = 1, offvalue = 0, height=5, \
# #                  width = 20)
# # C2 = Checkbutton(fr, text = "Video", variable = CheckVar2, \
# #                  onvalue = 1, offvalue = 0, height=5, \
# #                  width = 20)
# # C1.pack()
# # C2.pack()

# fr.pack()
# # listbox = Listbox(master, yscrollcommand=scrollbar.set)
# # for i in range(1000):
# #     listbox.insert(END, str(i))
# # listbox.pack(side=LEFT, fill=BOTH)


# # scrollbar.pack(side=RIGHT, fill=Y)

# # scrollbar.config(command=fr.yview)

# mainloop()
