const path = require("path");
const util = require("util");

exports.run = (client, message, args) => {
	let command = args.shift();
	var argObject = {};
	for(var i in args) {
		var individualArgument = args[i];
		var argumentParts = individualArgument.split("=");
		if (argumentParts.length == 2)
		{
			argObject[argumentParts[0].trim()] = argumentParts[1].trim();
		}
	}
	
	if (Object.keys(argObject).length == 0)
		argObject = null;
	
	try {
		// let commandFile = require(`./${path.basename(__filename)}/${command}.js`); 
		// commandFile.run(client, message, args, argObj);
		message.channel.send(`Attempting to invoke './${path.basename(__filename)}/${command}.js'.
	Values: (client, message, "{util.inspect(args, {depth: null})}", "{util.inspect(argObj, {depth: null})}")`);
    } catch (err) {
        // commented for now as to not spam console when other bots are called
        //console.error(err); // If no command is found, log the error
    }
};
