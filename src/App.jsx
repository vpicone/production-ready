import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { TodoForm, TodoList } from "./components/todo";
import {
  addTodo,
  generateId,
  findById,
  toggleTodo,
  updateTodo,
  removeTodo
} from "./lib/todoHelpers";
import { pipe, partial } from "./lib/utils";

class App extends Component {
  state = {
    todos: [
      { id: 1, name: "Learn JSX", isComplete: false },
      { id: 2, name: "Build Awesome App", isComplete: false },
      { id: 3, name: "Ship It!", isComplete: false }
    ],
    currentTodo: "",
    errorMessage: ""
  };

  handleRemove = (id, evt) => {
    evt.preventDefault();
    const updatedTodos = removeTodo(this.state.todos, id);
    this.setState({ todos: updatedTodos });
  };

  handleToggle = id => {
    const getUpdatedTodos = pipe(
      findById,
      toggleTodo,
      partial(updateTodo, this.state.todos)
    );
    const updatedTodos = getUpdatedTodos(id, this.state.todos); //this.state.todos needed for findbyid call
    this.setState({ todos: updatedTodos });
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
  };

  handleInputChange = evt => {
    this.setState({
      errorMessage: "",
      currentTodo: evt.target.value
    });
  };

  handleEmptySubmit = evt => {
    evt.preventDefault();
    this.setState({
      errorMessage: "Please supply a todo name"
    });
  };

  render() {
    const submitHandler = this.state.currentTodo
      ? this.handleSubmit
      : this.handleEmptySubmit;

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
          <TodoForm
            handleInputChange={this.handleInputChange}
            currentTodo={this.state.currentTodo}
            handleSubmit={submitHandler}
          />
          <TodoList
            handleRemove={this.handleRemove}
            handleToggle={this.handleToggle}
            todos={this.state.todos}
          />
        </div>
      </div>
    );
  }
}

export default App;
