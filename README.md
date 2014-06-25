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


