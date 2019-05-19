'use strict'

// const hbs = require('express-handlebars');
const path = require('path');

const bodyParser = require('body-parser');
const config = require('./config');

const express = require('express');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Routers
const routes = require('./server/routes');

// Using middleware
app.use(express.static(path.join(__dirname, 'dist/travel-helpdesk')));
app.use('/', routes);

const trainnlp = require('./server/nlp/bot-nlp');

// Catch all the other routes requests
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist/travel-helpdesk/index.html'));
})

app.listen(config.app.port, function() {
	console.log('Server running on port ' + config.app.port);
})