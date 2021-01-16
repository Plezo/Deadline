/*
TODO:
-Figure out a way to only have one arg be passed through each func, no msg arg,
probably have each function return a string where the main module.exports func
will output it, instead of having to create a new embed per function
-Consider changing view function to group deadlines by due dates
-Consider having an "edit" function, instead of creating a new array for each subject,
we can have it so we can safely assume the subjects that NEED to be in the list and if
someone tries adding a deadline for a subject not in the list then returns "Subject not
in config" or something
-The view deadlines function will have you specify the subject you want to view,
if you do not type the specific subject, it will give you a list of all the subjects
-Consider adding a description argument for each deadline that may be optional,
it may overcomplicate things tho so maybe stick to just assignment and due
-For due date, do something like d/m|h:min where the '|' is the delimiter, if a '|' does
not exist then just make the default time 11:59:59
-Delete each message the bot sends after x amount of seconds
*/

const Discord = require('discord.js')
const fs = require('fs')

// Creates deadline with given info
function create(msg, args)
{
  if (new Date(args[2]) === "Invalid Date" || !args[3]) return;

  let jsonObj = JSON.parse(fs.readFileSync("deadlines.json"), "utf-8");
  const date = args[2];

  if (!jsonObj[date])
    jsonObj[date] = [];

  deadlineObj = 
  {
    number: jsonObj[date].length,
    assignment: args.splice(3).join(' '),
    due: date
  };
 
  jsonObj[date].push(deadlineObj);

  fs.writeFile("deadlines.json", JSON.stringify(jsonObj), err =>
  {
    if (err) console.log(err);
  });

  let embedMsg = new Discord.MessageEmbed()
  .setColor("#82CAAF")
  .setTitle("Deadline Created")
  msg.channel.send({embed: embedMsg});
}

// Removes desired deadline
function remove(msg, args)
{
  let jsonObj = JSON.parse(fs.readFileSync("deadlines.json"), "utf-8");
  const date = args[2];
  const assignmentNum = args[3];

  if (!jsonObj[date] || !jsonObj[date][assignmentNum]) return;

  jsonObj[date].splice(assignmentNum, 1);
  for (let i = assignmentNum - 1; i < jsonObj[date].length; ++i)
    jsonObj[date][i].number--;

  fs.writeFile("deadlines.json", JSON.stringify(jsonObj), err =>
  {
    if (err) console.log(err);
  });

  let embedMsg = new Discord.MessageEmbed()
  .setColor("#82CAAF")
  .setTitle("Deadline Removed")
  msg.channel.send({embed: embedMsg});
}

// Views the list of deadlines
function view(msg, args)
{
  let jsonObj = JSON.parse(fs.readFileSync("deadlines.json"), "utf-8");

  let embedMsg = new Discord.MessageEmbed()
  .setColor("#FECF6A")
  .setTitle("Deadlines:")

  let dateArr = [];
  const keys = Object.keys(jsonObj);
  
  keys.forEach((date) => { dateArr.push(date); });
  dateArr.sort((d1, d2) => { return new Date(d1) - new Date(d2); });  

  dateArr.forEach((date) =>
  {
    let deadlineStr = " ";
    jsonObj[date].forEach((obj) => { deadlineStr += obj.assignment + '\n'; });
    embedMsg.addField(date, deadlineStr);
  });
  msg.channel.send({embed: embedMsg});
}

const funcs =
{
  create: create,
  remove: remove,
  view: view
}

module.exports = 
{
  name: 'deadline',
  description: 'Deadline commands',
  execute(msg, args)
  {
    if (!funcs[args[1]]) return;
    const func = funcs[args[1]];
    func(msg, args);
  }
}
