const Discord = require('discord.js')
const fs = require('fs')

module.exports =
{
  name: 'remove',
  description: 'Removes assignment given date and respective index',
  execute(msg, args)
  {
    let jsonObj = JSON.parse(fs.readFileSync("deadlines.json"), "utf-8");
    const date = args[1];
    const assignmentNum = args[2];

    if (!jsonObj[date] || !jsonObj[date][assignmentNum]) return;

    jsonObj[date].splice(assignmentNum, 1);
    for (let i = assignmentNum; i < jsonObj[date].length; ++i) jsonObj[date][i].number--;
    if (jsonObj[date].length === 0) delete jsonObj[date]
  
    fs.writeFile("deadlines.json", JSON.stringify(jsonObj), err =>
    {
      if (err) console.log(err);
    });

    let embedMsg = new Discord.MessageEmbed()
    .setColor("#82CAAF")
    .setTitle("Deadline removed")
    msg.channel.send({embed: embedMsg}).then(msg => { msg.delete({timeout: 5000})})
  }
}
