"use strict";

// Ensure we're in the project directory, so relative paths work as expected
// no matter where we actually lift from.
process.chdir(__dirname);

require('app-module-path').addPath(__dirname);

// public modules from npm
var express = require('express'),
    device = require('express-device'),
    bodyParser = require('body-parser');

// application modules
var routes  = require('src/routes'),
    logger    = require('src/utils').logger,
    hbsHelpers = require('src/utils').hbs(),
    middlewears = require('src/middlewears');

var app = express();

app.set('title', 'My App');

//register application with view
hbsHelpers.setAppView( app );

app.use(bodyParser.json()); // for parsing application/json

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static(__dirname + '/public'));

//load passport middlewear for authentication
middlewears.passport(app);

// initializing user helper as a middlewear
app.use(middlewears.userHelper.init);

// device detection middlewears.
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


if (app.get('env') === 'development') { 
    app.use(function (req, res, next) {
      console.log('Time:', Date.now());
      next();
    });
}


//initialize routes
routes(app);


if(!process.env.NODE_ENV){
    process.env.NODE_ENV = "development";
}

app.set('port', process.env.PORT || app.get('port') || 5000 );


//Start the server, Listen to port: 5000
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