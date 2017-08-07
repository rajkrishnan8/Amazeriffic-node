var express = require('express'),
	bodyParser = require('body-parser'),
	http = require('http'),
	mongoose = require('mongoose'),
	ToDosController = require('./controllers/todos_controller.js'),
	app = express(),
	vcapServices,
	mongoUrl,
	port = process.env.PORT || 3000;
	
// Create our Express-powered HTTP server
// and have it listen on port 3000
app.use(express.static(__dirname + '/client'));
// tell Express to parse incoming JSON Objects
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var initServer = function () {
	console.log('Starting Listener...');
	http.createServer(app).listen(port);
	console.log('Listening...');

	//set up our routes
	app.get('/todos.json', ToDosController.index);
	app.get('/todos/:id', ToDosController.show);
	app.post('/todos', ToDosController.create);
}	

if(process.env.VCAP_SERVICES){
	vcapServices = JSON.parse(process.env.VCAP_SERVICES);
	mongoUrl = vcapServices['mlab'][0].credentials.uri;
}
else{
  mongoUrl = 'mongodb://localhost/amazeriffic';
}

// connect to mongoose
mongoose.connect(mongoUrl , function(err) {
	if(err) {
		console.log('Connection to MongoDB encountered error');
	} else {
		console.log('Connected to MongoDB');
		initServer();
	}
});