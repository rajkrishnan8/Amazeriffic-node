var express = require('express'),
	http = require('http'),
	app = express(),
	toDos = [
		{
			description: "Get groceries", 
			tags: ["shopping", "chores"]
		},
		{
			description: "Make up some new ToDos", 
			tags: ["writing", "work"]
		},
		{
			description: "Prep for Monday's class",
			tags: ["work", "teaching"]
		},
		{
			description: "Answer emails",
			tags: ["work"]
		},
		{
			description: "Take Gracie to the park",
			tags: ["chores", "pets"]
		}, 
		{
			description: "Finish writing this book",
			tags: ["writing", "work"]
		}
	];
	
// Create our Express-powered HTTP server
// and have it listen on port 3000
app.use(express.static(__dirname + '/client'));

// tell Express to parse incoming JSON Objects
app.use(express.urlencoded());

http.createServer(app).listen(3000);

//set up our routes
app.get('/todos.json', function (req, res){
	res.json(toDos);
});

app.post('/todos', function(req, res) {
	var newToDo = req.body;

	console.log(newToDo);

	toDos.push(newToDo);

	res.json({'message' : 'You posted to the server!'});
})