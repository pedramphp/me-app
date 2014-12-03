"use strict";

// Ensure we're in the project directory, so relative paths work as expected
// no matter where we actually lift from.
process.chdir(__dirname);

require('app-module-path').addPath(__dirname);

// core modules
var path = require('path'),
    passport = require('passport');


// public modules from npm
var express = require('express'),
    device = require('express-device');

// application modules
var routes  = require('src/routes'),
    logger    = require('src/utils').logger,
    hbs     = require('src/helpers/hbs-helper'),
    passportModule = require('src/app-modules/passport-module'),
    userHelper = require('src/helpers/user-helper');

var app = express(),
    pubDir = path.join(process.env.PWD, 'public');

// load handlebars
hbs.init(app);

app.set('title', 'My App');



app.configure(function () {

    app.use(express.static(pubDir));

    app.use(express.bodyParser());

    //initializnig passport
    passportModule.init( app );

    // initializing user helper as a middlewear
    app.use(userHelper.init());

    app.use(device.capture({
        emptyUserAgentDeviceType:   'phone',
        unknownUserAgentDeviceType: 'phone',
        botUserAgentDeviceType:     'phone'
    }));

    app.use(function(req, res, next){
        if(req.param('_device')){
            req.device.type = req.param('_device');
        }
        next && next();
    });

    device.enableViewRouting(app);

    device.enableDeviceHelpers(app);

    //parse a serialized JSON
    app.use(express.bodyParser());

    app.use(function(err, req, res, next){
      logger.info(err.stack);
      res.send(500, 'Something broke!');
    });

});

//initialize routes
routes.init(app, hbs.exposeTemplates);


if(!process.env.NODE_ENV){
    process.env.NODE_ENV = "development";
}

app.set('port', process.env.PORT || app.get('port') || 5000 );

app.listen(app.get('port'), function createServerCallback(){

    logger.info({
        stack: logger.trace(),
        msg: [
            'Crystal.js server listening on port ' + app.get('port'),
            'Process Ids: ' + process.pid,
            '\nProcess version: ' + process.version,
            '\nProcess platform: ' + process.platform,
            '\nProcess title: ' + process.title
        ]
    });

});

process.on('uncaughtException', function uncaughtException(err) {

    logger.error({
        stack: logger.trace(),
        msg: ['app.js: An uncaught error occurred!', err.stack]
    });

});

process.on('SIGINT', function processExit(code) {

    logger.info({
        stack: logger.trace(),
        msg: 'app.js: node js process exit - saving final data'
    });

});


/*
var express = require('express'),
    routes = require("src/routes"),
    hbsHelpers = require('src/utils').hbs();

var app = express();

var bodyParser = require('body-parser');

hbsHelpers.setAppView( app );

app.use(bodyParser.json()); // for parsing application/json

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('src/public/'));

//load passport middlewear for authentication
require('src/middlewears').passport(app);

//register all routers
routes( app );

if(!process.env.NODE_ENV){
    process.env.NODE_ENV = "development";
}

var server_port =  process.env.PORT || 3000;
var server_ip_address = process.env.HOST || '127.0.0.1';

if(!app.get('port')){
    app.set('port', server_port);
}

app.listen(app.get('port'), function () {
    console.log('Server listening on: '+ app.get('port'));
});
*/