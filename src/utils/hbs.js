"use strict";

module.exports = function(){

  var blocks = [];
  var moment = require('moment');

  return {
    methods: {
      extend: function (name, context){
        var block = blocks[name];
        if (!block) {
          block = blocks[name] = [];
        }

        block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
      },

      block: function (name){
        var val = (blocks[name] || []).join('\n');

        // clear the block
        blocks[name] = [];
        return val;
      },

      ifStringEqual: function(firstText, secondText, block){

        if(firstText === secondText) {
          return block.fn(this);
        }
      },

      fromNow: function(timestamp){
        return moment(timestamp).fromNow();
      },

      fromNowShort: function(timestamp){
        return moment(timestamp).fromNow(true);
      },

      timeHourMin: function(timestamp){
        return moment(timestamp).format("h:mm a");
      },

      ifCond: function (v1, operator, v2, options) {

        switch (operator) {
          case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
            return options.inverse(this);
          }
        },

        foreach: function(arr, options) {
          if(options.inverse && !arr.length)
            return options.inverse(this);

            return arr.map(function(item,index) {
              item.$index = index;
              item.$first = index === 0;
              item.$last  = index === arr.length-1;
              return options.fn(item);
            }).join('');
          },

        foreachSlice: function(arr, action, quantity, options) {
          if(options.inverse && !arr.length)
            return options.inverse(this);

            if( action === "last" && quantity){
              arr = arr.slice(-1 * quantity);
            }

            return arr.map(function(item,index) {
              item.$index = index;
              item.$first = index === 0;
              item.$last  = index === arr.length-1;
              return options.fn(item);
            }).join('');
          },

          json: function(context) {
            return JSON.stringify(context);
          },

          i18n: function (context, options) {
            var language = void 0;

            if (typeof context !== "string") {
              throw "Key must be of type 'string'";
            }
            language = (typeof options.hash.language === "string" ? options.hash.language : this.language);
            if (typeof language === "undefined") {
              throw "The 'language' parameter is not defined";
            }
            if (typeof this[language] === "undefined") {
              throw "No strings found for language '" + language + "'";
            }
            if (typeof this[language][context] === "undefined") {
              throw "No string for key '" + context + "' for language '" + language + "'";
            }
            return this[language][context];
          }
        },

        // Middleware to expose the app's shared templates to the cliet-side of the app
        // for pages which need them.
        exposeTemplateToClient: function(req, res, next) {
          // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
          // templates which will be shared with the client-side of the app.
          req.hbs.getTemplates('shared/templates/', {
            cache      : req.app.enabled('view cache'),
            precompiled: true
          }).then(function (templates) {
            // RegExp to remove the ".handlebars" extension from the template names.
            var extRegex = new RegExp(req.hbs.extname + '$');

            // Creates an array of templates which are exposed via
            // `res.locals.templates`.
            templates = Object.keys(templates).map(function (name) {
              return {
                name    : name.replace(extRegex, ''),
                template: templates[name]
              };
            });

            // Exposes the templates during view rendering.
            if (templates.length) {
              res.locals.templates = templates;
            }

            setImmediate(next);
          })
          .catch(next);
        },

        setAppView: function(app){

          var exphbs  = require('express-handlebars');

          var VIEW_EXT_NAME = ".hbs";

          app.set('views', process.cwd() + '/src/views');

          // Create `ExpressHandlebars` instance with a default layout.
          var hbs = exphbs.create({
            defaultLayout: 'main',
            helpers      : this.methods,

            // Uses multiple partials dirs, templates in "shared/templates/" are shared
            // with the client-side of the app (see below).
            partialsDir: [
              'shared/templates/',
              app.get('views') + '/partials/'
            ],

            layoutsDir: app.get('views') + '/layouts',
            extname: VIEW_EXT_NAME
          });

          // Register `hbs` as our view engine using its bound `engine()` function.
          app.engine(VIEW_EXT_NAME, hbs.engine);

          app.set('view engine', VIEW_EXT_NAME);

          //add app and hbs in the req object.
          app.use(function(req, res, next) {
            req.app = app;
            req.hbs = hbs;
            next && next();
          });

          return hbs;
        }
    }; // return
};