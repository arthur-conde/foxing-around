const util = require("../foxxo.util.js");
exports.run = (client, message, args) => {
    for (i = 0; i < parseInt(args[0]); i++) message.channel.send("message " + (i + 1)),
        message.delete(1);
}
