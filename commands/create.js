const Discord = require('discord.js')
const fs = require('fs')

module.exports =
{
  name: 'create',
  description: 'Creates deadline given date and assignment respectively',
  execute(msg, args)
  {
    if (new Date(args[1]) === "Invalid Date" || !args[2]) return;
    
    let jsonObj = JSON.parse(fs.readFileSync("deadlines.json"), "utf-8");
    const date = args[1];
  
    if (!jsonObj[date]) jsonObj[date] = [];

    deadlineObj = 
    {
      number: jsonObj[date].length,
      assignment: args.splice(2).join(' '),
      due: date
    }
    jsonObj[date].push(deadlineObj);

    fs.writeFile("deadlines.json", JSON.stringify(jsonObj), err =>
    {
      if (err) console.log(err);
    });

    let embedMsg = new Discord.MessageEmbed()
    .setColor("#82CAAF")
    .setTitle("Deadline Created")
    msg.channel.send({embed: embedMsg}).then(msg => { msg.delete({timeout: 5000})})
  }
}
