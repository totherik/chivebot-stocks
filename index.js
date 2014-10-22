'use strict';

var Url = require('url');
var Wreck = require('wreck');
var Package = require('./package');


var URL = 'http://finance.google.com/finance/info';

exports.register = function (plugin, options, next) {

    plugin.dependency('chivebot', function (plugin, next) {

        plugin.plugins.chivebot.registerCommand('price', function (raw, args, cb) {
            var symbol, url;

            symbol = args._[2];
            url = Url.parse(URL);
            url.query = {
                client: 'i',
                q: symbol
            };

            Wreck.get(url.format(), {}, function (err, res, payload) {
                var json, data;

                if (err) {
                    cb(err);
                    return
                }

                if (!payload.length) {
                    cb(null, 'I couldn\'t find the symbol \'' + symbol + '\'.');
                    return;
                }

                try {

                    // Remove leading comment: '// '
                    payload = payload.slice(3);
                    json = JSON.parse(payload);
                    data = json[0];

                    cb(null, 'The price of ' + data.t + ' is $' + data.l_cur +  '.');

                } catch (err) {
                    cb(err);
                }
            });
        });

        next();
    });

    next();
};


exports.register.attributes = {
    pkg: Package
};