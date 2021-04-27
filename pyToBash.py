import subprocess
import sys

#The following function connects the python to bash by sub process module. 
# Image_file = Parameter which receives the firmware file.
def main(Image_file):
    if len(Image_file)>1:
        bashCommand = "./emba.sh -l ./log -f "+ Image_file[1]
        output = subprocess.Popen(bashCommand.split())
    else:
        print("Image File Unavaliabe")
main(sys.argv)

#The following function connects the python to bash by os module
#import os
#stream = os.popen("./emba.sh -l ./logFRT -f ./DIR300B5_FW214WWB01.bin")
#output = stream.read()
#output
