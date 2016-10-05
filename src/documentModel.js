"use strict";
var utils_1 = require("./utils");
var DocumentModel = (function () {
    function DocumentModel(key) {
        this.key = key;
        this.todos = utils_1.Utils.store(key);
        this.onChanges = [];
    }
    DocumentModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };
    DocumentModel.prototype.inform = function () {
        utils_1.Utils.store(this.key, this.todos);
        this.onChanges.forEach(function (cb) { cb(); });
    };
    DocumentModel.prototype.addTodo = function (title) {
        this.todos = this.todos.concat({
            id: utils_1.Utils.uuid(),
            title: title,
            completed: false
        });
        this.inform();
    };
    DocumentModel.prototype.toggleAll = function (checked) {
        this.todos = this.todos.map(function (todo) {
            return utils_1.Utils.extend({}, todo, { completed: checked });
        });
        this.inform();
    };
    DocumentModel.prototype.toggle = function (todoToToggle) {
        this.todos = this.todos.map(function (todo) {
            return todo !== todoToToggle ?
                todo :
                utils_1.Utils.extend({}, todo, { completed: !todo.completed });
        });
        this.inform();
    };
    DocumentModel.prototype.destroy = function (todo) {
        this.todos = this.todos.filter(function (candidate) {
            return candidate !== todo;
        });
        this.inform();
    };
    DocumentModel.prototype.save = function (todoToSave, text) {
        this.todos = this.todos.map(function (todo) {
            return todo !== todoToSave ? todo : utils_1.Utils.extend({}, todo, { title: text });
        });
        this.inform();
    };
    DocumentModel.prototype.clearCompleted = function () {
        this.todos = this.todos.filter(function (todo) {
            return !todo.completed;
        });
        this.inform();
    };
    return DocumentModel;
}());
exports.DocumentModel = DocumentModel;
