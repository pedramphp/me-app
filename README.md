Me App ( Digital Clone )
==
Build Status: [![Build Status](https://travis-ci.org/pedramphp/me-app.svg?branch=master)](https://travis-ci.org/pedramphp/me-app)

Running on crystal.js


# Installation

Install MongoDB.

http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/

```sh
sudo mongod
```

```sh
  git clone git@github.com:pedramphp/me-app.git
  cd me-app
  sudo npm install
  npm test
  npm start
```

#Continuis Deployment.

```
heroku login
// enter your heorku user and password.

travis login --pro
// enter your github user name and passowrd

//run this in the root folder of your project, it will generate the apikey for deployment.
travis encrypt $(heroku auth:token) --add deploy.api_key
```


#TODO

Make sure to use https://github.com/stoyan/cssshrink for shrinking css

LOGS
-----------------------
Run the following command to see the error logs.

```sh
// you need to download unserscore-cli once.
sudo npm install underscore-cli -g


cat exceptions.log | underscore print --color
```

QA URL
----------------------
http://me-app-qa.herokuapp.com/

CI URL
---------------------
https://travis-ci.org/pedramphp/me-app

DATABASE
------------------
Integrating Passport.js with Crystal.js


```sh
//removing all data from a collection
db.users.remove({})

// show all users.
db.users.find().pretty();
```


UI Components
-----------------------
```sh
http://localhost:5000/comps
```

OVERRIDE DEVICE
-----------------

Phone:  [http://localhost:5000?_device=phone](http://localhost:5000?_device=phone)

Tablet: [http://localhost:5000?_device=tablet](http://localhost:5000?_device=tablet)

Desktop: [http://localhost:5000?_device=desktop](http://localhost:5000?_device=desktop)

to update dependencies
```sh
npm update --save
```

TESTING:
```sh
npm test
```
Run application
```sh
npm start
```

How to do rebase with upstream
---------------------
```sh
git remote add upstream https://github.com/pedramphp/me-app(Remote > Manage Remotes > Add )
git fetch upstream
//Syncing your fork

//When you already have a fork, and you are going to work on a new feature,
git fetch upstream
git checkout master  (if you do not have this branch in your local, follow "Pull a new branch..." steps)
git merge upstream/master
```

Remove a Branch Locally and from Repo
---------------------
remove locally
```sh
git branch -D <branchName>
```

remove from the origin
```sh
git push origin --delete <branchName>
```

How to create seperate npm registry and switch between them
---------------------
```sh
npm install npmrc -g
npmrc -c cubejs // create a new npmrc
npm config set registry http://registry.npmjs.dev.ebay.com //set the registry for cubejs.
npm config get registry // returns http://registry.npmjs.dev.ebay.com/

npmrc default // switching to default npmrc
npm config get registry // returns https://registry.npmjs.org/
```

Browser refresh
-----------------

```sh
npm install browser-refresh -g
browser-refresh server.js
```

Useful Node Modules.
-----------------
```sh
npm install optimizer --save
npm install serve-static --save
npm install change-case --save

npm install npm --global
npm install marko --save
npm install express --save
npm install browser-refresh-taglib --save
npm install browser-refresh -g
npm install optimizer --save
npm install serve-static --save
npm install marko-widgets
npm install marko -g

markoc . --clean
browser-refresh server.js

npm link //add a folder to a link

```
