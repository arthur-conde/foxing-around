var bot = new Eris("MzQ4NjA3Nzk2MzM1NjA3ODE3.DHpbAg.YG-n5gjkU4mxUrAKlvm85tROGRI");
bot.on("ready", () => {
    console.log("Ready!");
});
bot.on("messageCreate", (msg) => {
    if(msg.content === "!ping") {
        bot.createMessage(msg.channel.id, "Pong!");
    }
});
bot.connect();
