const config = require("../config/config.json");
exports.run = (client) => {
    client.user.setGame(`prefix: ${config.prefix}`, "https://www.google.com/")
    console.log(`Ready in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);
}
