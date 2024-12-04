Hi, it's best if you use vscode to run this project 

REQUIREMENTS: you must have Node.js installed to run the react-app 

1. git clone the repo

2. open two terminals and for one of them cd into the repo and then cd into app, for the other terminal also cd into the repo and then cd into server

3. For the terminal that is cd'd into server, make sure you pip install the listed ones below and once done run the command "python api.py, if theres an error it's most   likely because you're missing a package listed below.

4. For the terminal that is cd'd into app, run npm i (this should automatically install all required packages) and then run the command "npm start".

5. If everything is working, the terminal that's cd'd into server should print "Server is running on port 5000" and the other terminal should open 
   a localhost:3000 website on your browser. FYI: both terminals must be running for the entire website to work, the backend server needs to be and the frontend app needs 
   to be on.


pip installs for backend server terminal: pip install flask, pip install flask-cors, pip install flask socket-io, pip install osmnx, pip install scikit-learn

npm installs for frontend app: simply run npm i 