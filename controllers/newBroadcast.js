var path = require('path');
var _ = require('lodash');
require('dotenv').config()
let apiKey = process.env.API_KEY
let secret = process.env.API_SECRET


if (!apiKey || !secret) {
    console.error('=========================================================================================================');
    console.error('');
    console.error('Missing TOKBOX_API_KEY or TOKBOX_SECRET');
    console.error('Find the appropriate values for these by logging into your TokBox Dashboard at: https://tokbox.com/account/#/');
    console.error('Then add them to ', path.resolve('.env'), 'or as environment variables' );
    console.error('');
    console.error('=========================================================================================================');
    process.exit();
}

var OpenTok = require('opentok');
var opentok = new OpenTok(apiKey, secret);