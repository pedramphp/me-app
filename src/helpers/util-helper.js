"use strict";

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



common.logger = new (common.winston.Logger)({
    transports: myLogTransports,
     exceptionHandlers: [
      new common.winston.transports.File({ filename: 'log/exceptions.log' })
    ]
});


module.exports = common;
