'use strict';

var pkg = require('./package'),
    nipple = require('nipple');


module.exports = {

    name: pkg.name,

    version: pkg.version,

    register: function (plugin, options, next) {

        plugin.dependency('chivebot', function (plugin, next) {

            plugin.plugins.chivebot.registerCommand('price', function (raw, args, cb) {
                nipple.request('GET', 'http://finance.google.com/finance/info?client=ig&q=' + args[0], {}, function (err, res) {
                    if (err) {
                        return cb(err);
                    }

                    nipple.read(res, function (err, body) {
                        if (err) {
                            return cb(err);
                        }    

                        if (!body.length) {
                            return cb(null, 'I couldn\'t find the symbol \'' + args[0] + '\'.');    
                        }

                        body = JSON.parse(body.slice(3));

                        return cb(null, 'The price of ' + body[0].t + ' is $' + body[0].l_cur +  '.');
                    });
                });
            });

            next();

        });

        next();

    }

};