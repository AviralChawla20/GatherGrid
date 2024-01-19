@echo off

start cmd /k "cd src && node team.js"
start cmd /k "cd src && node server.js"
start cmd /k "npm start"


exit
