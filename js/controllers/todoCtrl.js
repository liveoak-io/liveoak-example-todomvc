/*global todomvc, angular */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, todoStorage, filterFilter) {
    $scope.todos = [];
    var updateTodos = function() {
        todoStorage.query(function(todos) {
            $scope.todos = todos;
        });
    }
    updateTodos();

	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('todos', function (newValue, oldValue) {
		$scope.remainingCount = filterFilter($scope.todos, { completed: false }).length;
		$scope.completedCount = $scope.todos.length - $scope.remainingCount;
	}, true);

	if ($location.path() === '') {
		$location.path('/');
	}

	$scope.location = $location;

	$scope.$watch('location.path()', function (path) {
		$scope.statusFilter = (path === '/active') ?
			{ completed: false } : (path === '/completed') ?
			{ completed: true } : null;
	});

	$scope.addTodo = function () {
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}

        todoStorage.save({
            title: newTodo,
            completed: false
        }, updateTodos);

        $scope.newTodo = '';
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
	};

	$scope.doneEditing = function (todo) {
        if (!$scope.editedTodo) {
            return;
        }

		$scope.editedTodo = null;
		todo.title = todo.title.trim();
		if (!todo.title) {
            todoStorage.remove(todo, updateTodos);
		} else {
            todoStorage.update(todo, updateTodos);
        }
	};

	$scope.revertEditing = function (todo) {
        updateTodos();
	};

	$scope.removeTodo = function (todo) {
        todoStorage.remove(todo, updateTodos);
	};

    $scope.updateTodo = function (todo) {
        todoStorage.update(todo, updateTodos);
    };

	$scope.clearCompletedTodos = function () {
        var completed = filterFilter($scope.todos, { completed: true });
        var tasks = completed.length;
        for (var i = 0; i < completed.length; i++) {
            todoStorage.remove(completed[i], function() {
                tasks--;
                if (tasks == 0) {
                    updateTodos();
                }
            })
        }
	};

	$scope.markAll = function (completed) {
        var tasks = $scope.todos.length;
		for (var i = 0; i < $scope.todos.length; i++) {
            $scope.todos[i].completed = completed;
            todoStorage.update($scope.todos[i], function() {
                tasks--;
                if (tasks == 0) {
                    updateTodos();
                }
            });
        }

    };
});
