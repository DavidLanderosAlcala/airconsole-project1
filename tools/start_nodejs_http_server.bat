@echo off
adb reverse tcp:12345 tcp:12345
echo running server on port 12345...
node SimpleHTTPServer.js
pause
