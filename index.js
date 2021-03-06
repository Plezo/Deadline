const Discord = require('discord.js')
const fs = require('fs')

const client = new Discord.Client();
const config = JSON.parse(fs.readFileSync("config.json", "utf-8"));

const token = config.token;
const prefix = config.prefix;

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles)
{
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

/* Events */
client.on('ready', () =>
{
  console.log(`${client.user.username} is on.`);
  console.log(`ID: ${client.user.id}`);
})

client.on('message', msg =>
{
  if (msg.author.id === client.user.id) return;

  const args = msg.content.slice(prefix.length).split(' ');
  if (msg.content.startsWith(prefix))
  {
    let commandName = args[0];
    let command = client.commands.get(commandName);
    if (typeof client.commands.get(commandName) === 'undefined') { return; }
    command.execute(msg, args, client);
  }
})

/*  Check if necessary json files exist */
if (!fs.existsSync("deadlines.json"))
{
  const json = {};
  fs.writeFile("deadlines.json", JSON.stringify(json), err =>
  {
    if (err) console.log(err);
  });
}

if (!fs.existsSync("config.json"))
{
  const json = {};
  json.prefix = "dl ";
  json.token = "PUT BOT TOKEN HERE";
  fs.writeFile("config.json", JSON.stringify(json), err => 
  {
    if (err) console.log(err);
  });
}

client.login(token);
