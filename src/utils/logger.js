"use strict";

var _ = require('underscore');

var winston = require('winston');

winston.setLevels({
    trace: 0,
    input: 1,
    verbose: 2,
    prompt: 3,
    debug: 4,
    info: 5,
    data: 6,
    help: 7,
    warn: 8,
    error: 9
});

winston.addColors({
    trace: 'magenta',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    debug: 'blue',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    error: 'red'
});

var myLogTransports = [];

if (process.env.NODE_ENV !=='production') {
	myLogTransports.push( new (winston.transports.Console)({
		level: 'info',
		prettyPrint: true,
		colorize: true,
		silent: false,
		timestamp: false
	}));
}

myLogTransports.push(
	new (winston.transports.File)({
		filename: 'log/server.log'
	})
);

var logger =  new (winston.Logger)({
    transports: myLogTransports,
    exceptionHandlers: [
        new (winston.transports.Console)({
            level: 'info',
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: false
        }),
        new winston.transports.File({
            filename: 'log/exceptions.log'
        })
    ]
});

var log = function(type, arr){
    var config = arr[0];
    var stack;

    if(_.isObject(config)){
        stack = config.stack && config.stack[0];
        if(stack){
            logger[type]('**********************************************************');
            logger[type](
                '* File: ',
                stack.file,
                ' - Method: ' ,
                stack.name || 'anonymous function',
                ' - Line No: ',
                stack.line,
                ' - Col No: ',
                stack.col);
        }

        if(_.isString(config.msg)){

            logger[type](config.msg);

        }else if(_.isArray(config.msg)){

            logger[type].apply(null, config.msg);

        }else{
            logger[type](config);
        }

        return;
    }

    if(arr.length >= 1 && _.isString(arr[0])){
        logger[type].apply({}, arr);
    }
};

module.exports = function(callingModule){

    var logModule = function(){
        if(!callingModule){ 
            return; 
        } 
        var parts = callingModule.filename.split('/');
        var fileName = parts[parts.length - 2] + '/' + parts.pop();
        logger.info("File Name:", fileName);
    };

    return {
        info: function(config){
            var args = [].slice.call(arguments, 0);
            logModule();
            log('info', args);
        },

        error: function(config){
            var args = [].slice.call(arguments, 0);
            logModule();
            log('error', args);
        },

        warn: function(config){
            var args = [].slice.call(arguments, 0);
            logModule();
            log('warn', args);
        }
    };
};