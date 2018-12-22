import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';

export const Tasks= new Mongo.Collection('tasks');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('tasks', function tasksPublication() {
        return Tasks.find({
            $or: [
              { private: { $ne: true } },
              { owner: this.userId },
            ],
          });
    });
  }

Meteor.methods({
    
    'tasks.insert'(text) {
      check(text, String);   //check the given text is string
      console.log('insert');
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }
   
      Tasks.insert({
        text,
        createdAt: new Date(),
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username,
      });
    },
    'tasks.remove'(taskId) {
      check(taskId, String);
      const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
        // If the task is private, make sure only the owner can check it off
        throw new Meteor.Error('not-authorized');
        }
   
      Tasks.remove(taskId);
    },
    'tasks.setChecked'(taskId, setChecked) {
        const task = Tasks.findOne(taskId);
        if (task.private && task.owner !== this.userId) {
        // If the task is private, make sure only the owner can check it off
        throw new Meteor.Error('not-authorized');
        }
      check(taskId, String);
      check(setChecked, Boolean);
        console.log('task checked');
      Tasks.update(taskId, { $set: { checked: setChecked } });
    },
    'tasks.setPrivate'(taskId, setToPrivate) {
        check(taskId, String);
        check(setToPrivate, Boolean);
     
        const task = Tasks.findOne(taskId);
     
        // Make sure only the task owner can make a task private
        if (task.owner !== this.userId) {
          throw new Meteor.Error('not-authorized');
        }
     
        Tasks.update(taskId, { $set: { private: setToPrivate } });
      },
  });