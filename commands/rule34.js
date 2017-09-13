const config = require("../config.json");
const util = require("../foxxo.util.js");
const fs = require("fs")
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const parseString = require('xml2js').parseString;
const u = require('util');
exports.run = (client, message, [tags]) => {
    if (!config.owner.includes(`${message.author.id}`)) {
        return;
    }
    url = `https://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=1&tags=${tags}`

    function reqListener() {
        content = this.responseText;
        var xml = content;
        parseString(xml, function(err, result) {
            console.log(u.inspect(result, false, null));
            if (result.posts.$.count == 0) {
                message.channel.send(`no result`)
                return;
            }
            var url = result.posts.post[0].$.file_url
            message.channel.send(`\`${url}\``)
            message.delete();
        })
    }
    var con = new XMLHttpRequest();
    con.addEventListener("load", reqListener)
    con.open("GET", url);
    con.send();
};
