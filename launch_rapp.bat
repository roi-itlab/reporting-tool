setlocal

set pathGitShell=%PROGRAMFILES%\Git\bin\sh.exe
set pathMongoDB=D:\Programs\MongoDB
set pathRS=D:\Work\Emergn\reporting-service
set pathRT=D:\Work\Emergn\reporting-tool

start mongod --dbpath %pathMongoDB%
start "" "%pathGitShell%" --login -i -c "cd '%pathRS%'; node app.js"
start "" "%pathGitShell%" --login -i -c "cd '%pathRT%'; npm run dev"
timeout 10
start "" http://127.0.0.1:8080