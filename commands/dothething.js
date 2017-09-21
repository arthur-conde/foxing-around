const path = require("path");
const util = require("util");

exports.run = (client, message, args) => {
    let command = args.shift();
    var argObject = {};
    for (var i in args) {
        var individualArgument = args[i];
        var argumentParts = individualArgument.split("=");
        if (argumentParts.length == 2) {
            argObject[argumentParts[0].trim()] = argumentParts[1].trim();
        }
    }

    if (Object.keys(argObject).length == 0)
        argObject = null;

    try {
        var strArgs = util.inspect(args, {
            depth: null
        });
        var strObj = util.inspect(argObject, {
            depth: null
        });
        message.channel.send(`Attempting to invoke './${path.basename(__filename, ".js")}/${command}.js'.
	    Values: (client, message, "${strArgs}", "${strObj}")`);
        var commandFile = require(`./${path.basename(__filename, ".js")}/${command}.js`);
        commandFile.run(client, message, args, argObject);
    } catch (err) {
        console.error(err);
    }
};
