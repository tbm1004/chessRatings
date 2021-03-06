const tmi = require("tmi.js");
const axios = require("axios");
// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [process.env.CHANNEL_NAME]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  var commandName = msg;

  if (commandName.startsWith("!stats")) {
    commandName = commandName.split(" ");
    ranking(target, commandName[1]);
    console.log(`* Executed command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

function ranking(target, commandName) {
  var stop;
  var url = "https://api.chess.com/pub/player/" + commandName + "/stats";
  console.log(url);
  axios.get(url)
    .catch(function(error) {
      if (error.response) {
        console.log("Bad username");
        stop = true;
      }
    })
    .then(response => {
      if (!stop) {
        var x = JSON.stringify(response.data);

        var spl = x.split("chess_blitz");

        //regex for current rating
        var myRe = new RegExp("[0-9][0-9][0-9][0-9]?", "g");
        var myArray = myRe.exec(spl[1]);
        var curRank = myArray[0];
        
        //regex for best rating
        var myRe = new RegExp('best":{"rating":[0-9]*', "g");
        var myArray = myRe.exec(spl[1]);
        var curRank = myArray[0].split(":");
        
        
        //regex and formatting for wins/losses/ties
        var statRe = new RegExp('"win".+?(?=}})', "g");
        var statArray = statRe.exec(spl[1]);
        var g = statArray[0];
        var find = '"';
        var repl = ",";
        var re = new RegExp(find, "g");
        var str = g.replace(re, "");
        re = new RegExp(repl, "g");
        str = str.replace(re, ", ");
        
        var newTar = target.replace(/#/g, "@");
        console.log(newTar);
        var out = `${newTar} Blitz stats for ${commandName}: rating: ${curRank}, ${str}`
        client.say(
          target,
          out
        );
      }
    });
}

class RegExp1 extends RegExp {
  [Symbol.split](str, limit) {
    const result = RegExp.prototype[Symbol.split].call(this, str, limit);
    return result.map(x => `(${x})`);
  }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
