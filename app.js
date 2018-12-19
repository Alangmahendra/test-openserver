let express = require('express')
let bodyParser = require('body-parser')
let Opentok = require('opentok')
let app = express()
let cors = require('cors')
require('dotenv').config()
let broadcast = require('./routers/broadcast')

// let opentok;
// let apiKey = process.env.API_KEY
// let apiSecret = process.env.API_SECRET


const port = process.env.PORT || 3000

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
extended: true
}));
app.use(cors())

// function init(){
// }
        app.listen(port,function () {
            console.log(`Your App Runing On ${port}`)
        })
app.use('/',broadcast)
