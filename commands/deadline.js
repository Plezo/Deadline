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
-Test all ways of breaking it
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
  if (!args[3] || !args[4]) return;

  let jsonObj = JSON.parse(fs.readFileSync("deadlines.json"), "utf-8");
  const subject = args[2];

  if (!jsonObj[subject])
    jsonObj[subject] = [];

  deadlineObj = 
  {
    number: jsonObj[subject].length + 1,
    assignment: args[3],
    due: args[4]
  };
 
  jsonObj[subject].push(deadlineObj);

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
  const subject = args[2];
  const assignmentNum = args[3];

  if (!jsonObj[subject] || !jsonObj[subject][assignmentNum - 1]) return;

  jsonObj[subject].splice(assignmentNum - 1, 1);
  for (let i = assignmentNum - 1; i < jsonObj[subject].length; ++i)
    jsonObj[subject][i].number--;

  fs.writeFile("deadlines.json", JSON.stringify(jsonObj), err =>
  {
    if (err) console.log(err);
  });

  let embedMsg = new Discord.MessageEmbed()
  .setColor("#82CAAF")
  .setTitle("Deadline Removed")
  msg.channel.send({embed: embedMsg});
}

// Views a list of deadlines given subject
// If no subject is passed, output all the subjects
function view(msg, args)
{
  let jsonObj = JSON.parse(fs.readFileSync("deadlines.json"), "utf-8");
  const subject = args[2];

  let embedMsg = new Discord.MessageEmbed()
  .setColor("#FECF6A");

  if (!subject)
  {
    let keys = Object.keys(jsonObj);
    embedMsg.setTitle("Subjects")
    keys.forEach((subj) => {embedMsg.addField(subj, `${jsonObj[subj].length} deadline(s)`)});
  }
  else if (!jsonObj[subject]) return;
  else
  {
    embedMsg.setTitle(subject);
    jsonObj[subject].forEach((obj) =>
    {
      embedMsg.addField(`${obj.number}: ${obj.assignment}`, `Due: ${obj.due}`);
    });  
  }
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
    const func = funcs[args[1]];
    func(msg, args);
  }
}
