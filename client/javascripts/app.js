var organizedByTags = function (toDoObjects) {
	var result = {};
	result.tags = [];
	result.list = [];

	result.addToDo = function(description, tags){
		tags.forEach(function(tag) {
			var ind = result.tags.indexOf(tag);
			if(ind < 0) {
				ind = result.tags.length;
				result.tags.push(tag);
				result.list.push({name: tag, toDos: []});
			}

			result.list[ind].toDos.push(description);
		});
	}


	toDoObjects.forEach(function(todo){
		result.addToDo(todo.description, todo.tags);
	});

	return result;

};

var main = function () {
	"use strict";

	var toDoObjects,
		organizedByTag,
		toDos,
		tabs = [];

	var updateToDos = function (toDoObj) {
		toDoObjects = toDoObj;
		organizedByTag = organizedByTags(toDoObjects);
		toDos = toDoObjects.map(function(todoObj){return todoObj.description;});
	}
	
	var initToDos = function () {
			// set up tabs list 
			// Newest
			tabs.push( {
				'name' : 'Newest',
				'content' : function (callback) {
					$.getJSON('todos.json', function(todos){
						updateToDos(todos);
						var $content;
						$content = $("<ul>");
						for(var i = toDos.length-1; i>=0; i--){
							$content.append($("<li>").text(toDos[i]));
						}
						callback($content);
					});
				}
			});

			// Oldest
			tabs.push( {
				'name' : 'Oldest',
				'content' : function (callback) {
					$.getJSON('todos.json', function(todos){
						updateToDos(todos);
						var $content;
						$content = $("<ul>");
						toDos.forEach(function(todo){
							$content.append($("<li>").text(todo));
						});
						callback($content);
					});
				}
			});

			// Tags
			tabs.push( {
				'name' : 'Tags',
				'content' : function (callback) {
					$.getJSON('todos.json', function(todos){
						updateToDos(todos);
						var $content;

						$content = $('<div>');
						organizedByTag.list.forEach(function (tag) {
							var $tag = $('<h3>').text(tag.name),
								$todoList = $('<ul>');

							tag.toDos.forEach(function (toDo) {
								$todoList.append($('<li>').text(toDo));
							});

							$content.append($tag.append($todoList));
						});
						callback($content);
					});
				}
			});

			// Add
			tabs.push( {
				'name' : 'Add',
				'content' : function (callback) {
					var $content;
					var $input = $("<input>").addClass("todo"),
						$inputLabel = $("<p>").text("Description:"),
						$tagInput = $("<input>").addClass("tags"),
						$tagLabel = $("<p>").text("Tags:"),
						$button = $("<button>").text("+");

					$button.on("click", function(){
						var description = $("input.todo").val(),
							tags = $("input.tags").val().split(','),
							newToDo = {'description' : description, 'tags' : tags};
						
						// here we'll do a quick post to our todos route
						$.post('todos', newToDo, function (response) {
							$input.val('');
							$tagInput.val('');

							$('.tabs a:first-child span').trigger('click');
						});
					});

					$content = $("<div>").append($inputLabel)
										 .append($input)
										 .append($tagLabel)
										 .append($tagInput)
										 .append($button);

					callback($content);
				}
			});

			// add tabs to the UI
			tabs.forEach(function (tab) {
				var $aElement = $('<a>').attr('href', ''),
					$spanElement = $('<span>').text(tab.name);

				$aElement.append($spanElement);
				$spanElement.on('click', function(){
					var $content;

					$('.tabs a span').removeClass('active');
					$spanElement.addClass('active');
					$('main .content').empty();

					// get the content from the 'content' function defined in the tab
					tab.content(function ($content) {
						$('main .content').append($content);
					});

					return false;
				});

				$('main .tabs').append($aElement);

			});

			$('.tabs a:first-child span').trigger('click');
	}

	$.getJSON('todos.json', function(todos){
		updateToDos(todos);
		initToDos();
	});
};

$(document).ready(main);