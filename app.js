const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')
const http = require('http');
const https = require('https');
const fs = require('fs');

/*// Connect to MongoDB Atlas
var uri = "mongodb+srv://hyk:Srhongyangkai1994@yangkai-hong-mdsnm.mongodb.net/wikipedia";
mongoose.connect(uri,function () {
	  console.log('mongodb connected')
});*/
//Connect to local Database
mongoose.connect(config.database);

//On connection
mongoose.connection.on('connected',() => {
	console.log('Connected to database '+config.database);
})

//On Error
mongoose.connection.on('error',(err) => {
    console.log('Database error: '+err);
})

const app = express();

const users = require('./routes/users');
const overall = require('./routes/overall');
const article = require('./routes/article');
const author = require('./routes/author');

// Port Number
const port = 3000;
const httpPort = 80;
const httpsPort = 443;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Server Routes
app.use('/users',users);
app.use('/overall',overall);
app.use('/article',article);
app.use('/author',author);

/*app.get('*',(req,res)=>{
	res.sendFile(path.join(__dirname,'public/index.html'))
})*/

// Set Static Folder (Client side folder)
app.use(express.static(path.join(__dirname, 'public')));

// Start Server
/*app.listen(httpsPort, () => {
	console.log('Server started on port '+port);
});*/

var options = {
	key:fs.readFileSync('./private.key'),
	cert:fs.readFileSync('./certificate.crt')
}

https.createServer(options,app).listen(443,function(){
	console.log('Https server listening');
});

http.createServer(function(req,res){
	res.writeHead(301,{"Location":"https://"+req.headers['host']+req.url});
	res.end();
}).listen(80);
	
module.exports = app;
