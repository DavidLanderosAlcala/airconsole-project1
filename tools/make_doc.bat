@echo off
echo deleting doc folder
del /f /s /q ..\doc 1>nul
echo generating new doc...
jsdoc -r ..\ -d ..\doc
echo done
pause
