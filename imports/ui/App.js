import React, { Component } from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import Task from './Task.js';
import {Tasks} from '../api/tasks.js'; 
import ReactDOM from 'react-dom'
import AccountsUIWrapper from './AccountsUIWrapper.js';
import {Meteor} from 'meteor/meteor';
class App extends Component {
//   getTasks() {
//     return [
//       { _id: 1, text: 'This is task 1' },
//       { _id: 2, text: 'This is task 2' },
//       { _id: 3, text: 'This is task 3' },
//     ];
//   }
constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  }
handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    // Tasks.insert({
    //   text,
    //   createdAt: new Date(), // current time
    //   owner: Meteor.userId(),           // _id of logged in user
    //   username: Meteor.user().username,  // username of logged in user
    // });
    Meteor.call('tasks.insert',text);

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>
          <AccountsUIWrapper />
          {this.props.currentUser ?
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form>
          :""}
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(()=>{
    return{
        tasks : Tasks.find({},{ sort: { createdAt: -1 } }).fetch(),
        currentUser: Meteor.user(),
    }
})(App)