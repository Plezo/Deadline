const Discord = require('discord.js')
const fs = require('fs')

module.exports =
{
  name: 'view',
  description: 'Shows list of deadlines grouped by date',
  execute(msg, args)
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
      jsonObj[date].forEach((obj) => 
      { 
        deadlineStr += obj.number + '. ' + obj.assignment + '\n'; 
      });
      embedMsg.addField(date, deadlineStr);
    });
    msg.channel.send({embed: embedMsg});
  }
}
