const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const config = require("./config.json");

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        // super-secret recipe to call events with all their proper arguments *after* the `client` var.
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});

client.on("message", message => {
    if (message.author.bot) return; // Ignores any messages written by a bot
    if (message.content.indexOf(config.prefix) !== 0) return; // Ignores any messagess missing the prefix
    if (config.ignoredUsers.includes(`${message.author.id}`)) {
        console.log(`!!! unauthorized command invoke by ignored user ${message.author.tag} | ${message.author.id} on  ==> "${message}"`);
        return;
    }
    // This is the best way to define args. Trust me.
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g); // Removes the prefix then splits the message content by space
    const command = args.shift().toLowerCase(); // Takes the first item in the message

    // The list of if/else is replaced with those simple 2 lines:
    try {
        let commandFile = require(`./commands/${command}.js`); // Looks for a file named as the command being executed
        commandFile.run(client, message, args); // Calls the run function in the command file, passing the client, the message, and all other arguments
    } catch (err) {
        console.error(err); // If no command is found, log the error
    }
});

client.login(config.token);
