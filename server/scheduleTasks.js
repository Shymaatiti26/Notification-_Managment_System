// scheduleTasks.js

const schedule = require('node-schedule');
const date = new Date (2024,3,11,10,12,0);
// Schedule a task to run at 8:00 AM every day

/*

const task = schedule.scheduleJob(date, function(){
  console.log('Task executed at 8:00 AM');
  // Add your task logic here
});
*/

/*
const date = new Date (2024,4,10,11,33,0);
const task =schedule.scheduleJob(date,()=>{
  console.log('message sent from schedule');

});
*/
module.exports = task;
