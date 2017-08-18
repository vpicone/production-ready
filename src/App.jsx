import React, { Component } from "react";
import PropTypes from 'prop-types';
import logo from "./logo.svg";
import "./App.css";
import { TodoForm, TodoList, Footer } from "./components/todo";
import {
  addTodo,
  generateId,
  findById,
  toggleTodo,
  updateTodo,
  removeTodo,
  filterTodos
}
from "./lib/todoHelpers";
import { pipe, partial } from "./lib/utils";
import { loadTodos, createTodo, saveTodo, destroyTodo } from './lib/todoService';
class App extends Component {
  state = {
    todos: [],
    currentTodo: "",
    errorMessage: ""
  };

  static contextTypes = {
    route: PropTypes.string
  }


  componentDidMount() {
    loadTodos().then(todos => this.setState({ todos }));
  }


  handleRemove = (id, evt) => {
    evt.preventDefault();
    const updatedTodos = removeTodo(this.state.todos, id);
    this.setState({ todos: updatedTodos });
    destroyTodo(id)
      .then(() => this.showTempMessage('Todo Removed'));
  };

  handleToggle = id => {

    const getToggledTodo = pipe(findById, toggleTodo);
    const updated = getToggledTodo(id, this.state.todos);
    const getUpdatedTodos = partial(updateTodo, this.state.todos);
    const updatedTodos = getUpdatedTodos(updated);
    this.setState({ todos: updatedTodos });
    saveTodo(updated)
      .then(() => this.showTempMessage('Todo updated.'))
  };

  handleSubmit = evt => {
    evt.preventDefault();
    const newId = generateId();
    //create the newtodo
    const newTodo = {
      name: this.state.currentTodo,
      isComplete: false,
      id: newId
    };

    //get the newtodo BEFORE set state is called
    const updatedTodos = addTodo(this.state.todos, newTodo);

    this.setState({
      todos: updatedTodos,
      currentTodo: ""
    });

    createTodo(newTodo)
      .then(() => this.showTempMessage('Todo added'));

  };

  handleInputChange = evt => {
    this.setState({
      errorMessage: "",
      currentTodo: evt.target.value
    });
  };

  showTempMessage = (msg) => {
    this.setState({ message: msg });
    setTimeout(() => this.setState({ message: '' }), 2500);
  }


  handleEmptySubmit = evt => {
    evt.preventDefault();
    this.setState({
      errorMessage: "Please supply a todo name"
    });
  };

  render() {
    const submitHandler = this.state.currentTodo ?
      this.handleSubmit :
      this.handleEmptySubmit;
    const displayTodos = filterTodos(this.state.todos, this.context.route);

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React todos</h2>
        </div>
        <div className="Todo-App">
          {this.state.errorMessage &&
            <span className="error">
              {this.state.errorMessage}
            </span>}
          {this.state.message &&
            <span className="success">
              {this.state.message}
            </span>}
          <TodoForm
            handleInputChange={this.handleInputChange}
            currentTodo={this.state.currentTodo}
            handleSubmit={submitHandler}
          />
          <TodoList
            handleRemove={this.handleRemove}
            handleToggle={this.handleToggle}
            todos={displayTodos}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
