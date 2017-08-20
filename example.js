const Eris = require("eris");

var bot = new Eris("MzQ4NjA3Nzk2MzM1NjA3ODE3.DHproQ.GDTQYjofrJ32q77XHMYnXBEd2_c");
// Replace BOT_TOKEN with your bot account's token

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

bot.on("messageCreate", (msg) => { // When a message is created
    if(msg.content === "!ping") { // If the message content is "!ping"
        bot.createMessage(msg.channel.id, "Pong!");
        // Send a message in the same channel with "Pong!"
    } else if(msg.content === "!pong") { // Otherwise, if the message is "!pong"
        bot.createMessage(msg.channel.id, "Ping!");
        // Respond with "Ping!"
    }
});
// Souji domain below this point... things might explode any second
bot.on("messageCreate", (msg) => {
    if(msg.content === "!discrim") {
        bot.createMessage(msg.channel.id, msg.author.username + "#" + msg.author.discriminator);
    } else if(msg.content === "!testing") {
        bot.addGuildMemberRole("292404083548094466", msg.author.id, "298211920803266562", "He asked");
    }
});
// danger zone over... keep breathing... nothing exploded... yet.
bot.connect(); // Get the bot to connect to Discord
