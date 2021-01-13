const Discord = require('discord.js')
const fs = require('fs')

const config = JSON.parse(fs.readFileSync("./config.json"), "utf-8");
const prefix = config.prefix;

module.exports = 
{
  name: 'help',
  description: 'Lists commands',
  execute(msg)
  {
    let embedMsg = new Discord.MessageEmbed()
    .setColor('#8904B1')
    .setTitle('Commands: ')
    .addField(`${prefix}help`, 'Opens this menu.');

    msg.channel.send({embed: embedMsg});
  }
}
