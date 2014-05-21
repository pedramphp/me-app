Me App.
==
Build Status: [![Build Status](https://travis-ci.org/pedramphp/me-app.svg?branch=master)](https://travis-ci.org/pedramphp/me-app)

Running on crystal.js

# Installation
```sh
  git clone git@github.com:pedramphp/me-app.git
  cd me-app
  sudo npm install
  npm test
  npm start
```


to update dependencies
npm update --save

TESTING:
npm test

Run application
npm start


How to do rebase with upstream
---------------------
```sh
git remote add upstream https://github.com/pedramphp/me-app(Remote > Manage Remotes > Add )
git fetch upstream 
Syncing your fork

When you already have a fork, and you are going to work on a new feature, 
git fetch upstream
git checkout master  (if you do not have this branch in your local, follow "Pull a new branch..." steps)
git merge upstream/master
```
