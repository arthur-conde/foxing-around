const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

client.login(config.token);

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  //Exit and stop if it's not there
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  if (message.content.startsWith(config.prefix + "ping")) {
    message.channel.send("pong!");
  }  else

  if (message.content.startsWith(config.prefix + "foo")) {
    message.channel.send("bar!");
  } else {
    if(message.content.startsWith(config.prefix + "prefix")) {
    if(message.author.id !== config.ownerID) return;
    // Gets the prefix from the command (eg. "!prefix +" it will take the "+" from it)
    let newPrefix = message.content.split(" ").slice(1, 2)[0];
    // change the configuration in memory
    config.prefix = newPrefix;
    message.channel.send("Okay " + message.author.username + ", prefix changed to " + "`" + newPrefix + "`");

    // Now we have to save the file.
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);
  }
}})
