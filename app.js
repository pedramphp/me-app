"use strict";


// core modules
var path = require('path'),
    http = require('http'),
    passport = require('passport');


// public modules from npm
var express = require('express'),
    appPath = require('app-module-path'),
    device = require('express-device');

process.env.PWD = process.cwd();

// Add the "src" directory to the app module search path, this is needed for app modules
appPath.addPath(path.join(process.env.PWD, 'src')); 


// application modules    
var routes  = require('routes/routes'),
    util    = require('helpers/util-helper'),
    hbs     = require('helpers/hbs-helper'),
    passportModule = require('app-modules/passport-module'),
    userHelper = require('helpers/user-helper');

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
      util.logger.info(err.stack);
      res.send(500, 'Something broke!');
    });

});

//initialize routes
routes.init(app, hbs.exposeTemplates);


if(!process.env.NODE_ENV){
    process.env.NODE_ENV = "development";
}

app.set('port', process.env.PORT || app.get('port') || 5000 );

http.createServer(app).listen(app.get('port'), function(){
    util.logger.info("Crystal.js server listening on port " + app.get('port'));
    util.logger.info(
        "Process Id: " + process.pid,
        "\nProcess version: " + process.version,
        "\nProcess platform: " + process.platform,
        "\nProcess title: " + process.title);

});

process.on('uncaughtException', function (err) {
    util.logger.error('app.js: An uncaught error occurred!');
    util.logger.error(err.stack);
});

process.on('exit', function (code) {
    util.logger.info('app.js: node js process exit - saving final data');
});

