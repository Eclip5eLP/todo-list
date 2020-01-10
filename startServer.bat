@echo off
title ToDo-List Server
cls

if exist "%temp%\nodeServer.bat" del /f /q "%temp%\nodeServer.bat"
(
	echo @echo off
	echo title REST API
	echo cd %userprofile%\ToDoList\restApi\
	echo node server.js
) > "%temp%\nodeServer.bat"
start "REST API" "%temp%\nodeServer.bat"
npm start