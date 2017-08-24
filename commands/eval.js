exports.run = (client, message, args) => {
  const config = require("../config.json");

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
    if (message.content.startsWith(config.prefix + "eval")) {
    if(message.author.id !== config.ownerID) return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(
        {embed:{color: message.guild.me.displayColor,fields:[{name:"Eval",value:`\`\`\`js\n${clean(evaled)}\n\`\`\``},{name:"Input", value:`\`\`\`\n${args.join(" ")}\`\`\``}]}});
    } catch (err) {
      message.channel.send(
        {embed:{color: message.guild.me.displayColor, fields:[{name:"Eval - Error", value:`\`\`\`js\n${clean(err)}\n\`\`\``},{name:"Input", value:`\`\`\`${args.join(" ")}\`\`\``}]}}
      );
    }
  }
};
