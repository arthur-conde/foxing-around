exports.run = (client, message) => {
    const ranlionconfig = require("../ranlionconfig.json");
    var lionimg = ranlionconfig.lions[Math.floor(Math.random() * ranlionconfig.lions.length)];
    message.channel.send({
        embed: {
            color: message.guild.me.displayColor,
            description: `Here is the lion you asked for, <@${message.member.id}>:`,
            image: {
                url: lionimg
            }
        }
    });
    message.delete(4000);
};
