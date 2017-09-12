exports.run = (client, message) => {
    const lewdjiconfig = require("../lewdjiconfig.json");
    var lewdjiimg = lewdjiconfig.lewds[Math.floor(Math.random() * lewdjiconfig.lewds.length)];
    message.channel.send({
        embed: {
            color: message.guild.me.displayColor,
            description: `Look at Souji being all lewd...`,
            image: {
                url: lewdjiimg
            }
        }
    });
    message.delete(4000);
};
