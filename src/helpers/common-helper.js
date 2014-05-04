"use strict";

var common = {
	winston: require('winston')
};

common.logger = new (common.winston.Logger)({
    transports: [
      new (common.winston.transports.Console)(),
      new (common.winston.transports.File)({ filename: 'server.log' })
    ]
  });


common.winston.handleExceptions(new common.winston.transports.File({ filename: 'exceptions.log' }))

module.exports = common;