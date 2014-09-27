"use strict";

var _ = require('underscore');

var common = {
	winston: require('winston')
};

common.winston.setLevels({
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

common.winston.addColors({
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
	myLogTransports.push( new (common.winston.transports.Console)({
		level: 'info',
		prettyPrint: true,
		colorize: true,
		silent: false,
		timestamp: false
	}));
}

myLogTransports.push( new (common.winston.transports.File)({ filename: 'log/server.log' }) );


module.exports = {
    logger: new (common.winston.Logger)({
        transports: myLogTransports,
        exceptionHandlers: [
            new (common.winston.transports.Console)({
                level: 'info',
                prettyPrint: true,
                colorize: true,
                silent: false,
                timestamp: false
            }),
            new common.winston.transports.File({ filename: 'log/exceptions.log' })
        ]
    }),

    getLogger: function(namespace){
        var logger = this.logger;

        var log = function(type, arr){
            var config = arr[0];

            if(_.isObject(config)){
                var stack = config.stack && config.stack[0];
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
                
                }

                logger[type]('\n') ;
                
                return;
            }

            if(arr.length >= 1 && _.isString(arr[0])){
                logger[type].apply({}, arr);   
            }            
        }

        return {
            info: function(config){
                var args = [].slice.call(arguments, 0);
                log('info', args);
            },  

            error: function(config){
                var args = [].slice.call(arguments, 0);
                log('error', args);
            },
            trace: require('traceback')
        };
    }
};