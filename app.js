"use strict";


// core modules
var path = require('path'),
    http = require('http');

// public modules from npm
var express = require('express'),
    appPath = require('app-module-path');



// Add the "src" directory to the app module search path, this is needed for app modules
appPath.addPath(path.join(__dirname, 'src')); 


// application modules    
var routes  = require('routes/routes'),
    util    = require('helpers/util-helper'),
    hbs     = require('helpers/hbs-helper');


var app = express(),
    pubDir = path.join(__dirname, 'public');


// load handlebars
hbs.init(app);

app.use(express.bodyParser());

app.use(app.router);

app.configure(function () {
    app.use(express.static(pubDir));
});


//initialize routes
routes.init(app, hbs.exposeTemplates);


if(!process.env.NODE_ENV){
    process.env.NODE_ENV = "development";
}

if(!app.get('port')){
	app.set('port', process.env.PORT || 5000   );
}

http.createServer(app).listen(app.get('port'), function(){
    console.log("Crystal.js server listening on port " + app.get('port'));
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