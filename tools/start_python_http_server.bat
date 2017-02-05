@echo off
adb reverse tcp:12345 tcp:12345
cd ../src
echo running server on port 12345...
python -m SimpleHTTPServer 12345
pause
