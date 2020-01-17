@echo off
title ToDo-List Server
cls

set sd=%cd%
if exist "%temp%\nodeServer.bat" del /f /q "%temp%\nodeServer.bat"
(
	echo @echo off
	echo title REST API
	echo cd %cd%\restApi\
	echo echo ^/----------------^\
	echo echo ^| Server Running ^|
	echo echo ^\----------------^/
	echo node server.js ^>^> %sd%\restApi\server.log
	echo echo.
	echo echo An Error occured
	echo echo Please check the log for more information
	echo pause ^> nul
	echo exit
) > "%temp%\nodeServer.bat"
start  "MongoDB Server" mongod
start "REST API" "%temp%\nodeServer.bat"
npm start