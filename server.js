var express = require('express'),
	http = require('http'),
	mongoose = require('mongoose'),
	app = express(),
	toDos = [];
	
// Create our Express-powered HTTP server
// and have it listen on port 3000
app.use(express.static(__dirname + '/client'));
// tell Express to parse incoming JSON Objects
app.use(express.urlencoded());

var ToDoSchema = mongoose.Schema({
	description: String,
	tags: [ String ]
});

var ToDo = mongoose.model('ToDo', ToDoSchema);


var initServer = function () {
	http.createServer(app).listen(3000);

	//set up our routes
	app.get('/todos.json', function (req, res){
		ToDo.find({}, function (err, toDos) {
			res.json(toDos);
		});
	});

	app.post('/todos', function(req, res) {
		console.log("POST req: " + req.body);
		var newToDo = new ToDo({'description' : req.body.description, 'tags' : req.body.tags});
		newToDo.save(function (err, result) {
			if (err != null) {
				console.log(err);
				res.send('ERROR');
			} else {
				ToDo.find({}, function (err, result) {
					if (err != null) {
						res.send('ERROR');
					}
					res.json(result);
				});
			}
		});
		req.body;
	});



}

// connect to mongoose
mongoose.connect('mongodb://localhost/amazeriffic', function(err) {
	if(err) {
		console.log('Connection to MongoDB encountered error');
	} else {
		console.log('Connected to MongoDB');
		initServer();
	}
});