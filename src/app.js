"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var DocumentModel_1 = require("./DocumentModel");
var footer_1 = require("./footer");
var DocumentListItem_1 = require("./DocumentListItem");
var constants_1 = require("./constants");
var EADocumentsApp = (function (_super) {
    __extends(EADocumentsApp, _super);
    function EADocumentsApp(props) {
        _super.call(this, props);
        this.state = {
            nowShowing: constants_1.ALL_TODOS,
            editing: null
        };
    }
    EADocumentsApp.prototype.componentDidMount = function () {
        var setState = this.setState;
        var router = Router({
            '/': setState.bind(this, { nowShowing: constants_1.ALL_TODOS }),
            '/active': setState.bind(this, { nowShowing: constants_1.ACTIVE_TODOS }),
            '/completed': setState.bind(this, { nowShowing: constants_1.COMPLETED_TODOS })
        });
        router.init('/');
    };
    EADocumentsApp.prototype.handleNewTodoKeyDown = function (event) {
        if (event.keyCode !== constants_1.ENTER_KEY) {
            return;
        }
        event.preventDefault();
        var val = React.findDOMNode(this.refs["newField"]).value.trim();
        if (val) {
            this.props.model.addTodo(val);
            React.findDOMNode(this.refs["newField"]).value = '';
        }
    };
    EADocumentsApp.prototype.toggleAll = function (event) {
        var target = event.target;
        var checked = target.checked;
        this.props.model.toggleAll(checked);
    };
    EADocumentsApp.prototype.toggle = function (todoToToggle) {
        this.props.model.toggle(todoToToggle);
    };
    EADocumentsApp.prototype.destroy = function (todo) {
        this.props.model.destroy(todo);
    };
    EADocumentsApp.prototype.edit = function (todo) {
        this.setState({ editing: todo.id });
    };
    EADocumentsApp.prototype.save = function (todoToSave, text) {
        this.props.model.save(todoToSave, text);
        this.setState({ editing: null });
    };
    EADocumentsApp.prototype.cancel = function () {
        this.setState({ editing: null });
    };
    EADocumentsApp.prototype.clearCompleted = function () {
        this.props.model.clearCompleted();
    };
    EADocumentsApp.prototype.render = function () {
        var _this = this;
        var footer;
        var main;
        var todos = this.props.model.todos;
        var shownTodos = todos.filter(function (todo) {
            switch (_this.state.nowShowing) {
                case constants_1.ACTIVE_TODOS:
                    return !todo.completed;
                case constants_1.COMPLETED_TODOS:
                    return todo.completed;
                default:
                    return true;
            }
        });
        var todoItems = shownTodos.map(function (todo) {
            return (React.createElement(DocumentListItem_1.DocumentListItem, {key: todo.id, todo: todo, onToggle: _this.toggle.bind(_this, todo), onDestroy: _this.destroy.bind(_this, todo), onEdit: _this.edit.bind(_this, todo), editing: _this.state.editing === todo.id, onSave: _this.save.bind(_this, todo), onCancel: function (e) { return _this.cancel(); }}));
        });
        var activeTodoCount = todos.reduce(function (accum, todo) {
            return todo.completed ? accum : accum + 1;
        }, 0);
        var completedCount = todos.length - activeTodoCount;
        if (activeTodoCount || completedCount) {
            footer =
                React.createElement(footer_1.TodoFooter, {count: activeTodoCount, completedCount: completedCount, nowShowing: this.state.nowShowing, onClearCompleted: function (e) { return _this.clearCompleted(); }});
        }
        if (todos.length) {
            main = (React.createElement("section", {className: "main"}, 
                React.createElement("input", {className: "toggle-all", type: "checkbox", onChange: function (e) { return _this.toggleAll(e); }, checked: activeTodoCount === 0}), 
                React.createElement("ul", {className: "todo-list"}, todoItems)));
        }
        return (React.createElement("div", null, 
            React.createElement("header", {className: "header"}, 
                React.createElement("h1", null, "todos"), 
                React.createElement("input", {ref: "newField", className: "new-todo", placeholder: "What needs to be done?", onKeyDown: function (e) { return _this.handleNewTodoKeyDown(e); }, autoFocus: true})), 
            main, 
            footer));
    };
    return EADocumentsApp;
}(React.Component));
var model = new DocumentModel_1.DocumentModel('react-documents');
function render() {
    React.render(React.createElement(EADocumentsApp, {model: model}), document.getElementsByClassName('widget')[0]);
}
model.subscribe(render);
render();
