const tmi = require('tmi.js');
const axios = require('axios')
const cheerio = require('cheerio')
// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  var commandName = msg;

  if( commandName.startsWith('!rating')){
    commandName = commandName.split(" ");
    ranking(target, commandName[1])
    console.log(`* Executed command`);
    
  }
  else {
    console.log(`* Unknown command ${commandName}`);
  }
}

function ranking (target, commandName) {
    axios.get('https://api.chess.com/pub/player/hikaru/stats').then((response) => {
    var x = JSON.stringify(response.data);
    var spl = x.split("chess_blitz");
    var myRe = new RegExp('[0-9][0-9][0-9][0-9]?', 'g');
    var myArray = myRe.exec(spl[1]);
    var curRank = myArray[0];
    
    
    var newRe = new RegExp('[0-9]*', 'g');    
    var wins = (spl[1].split(new RegExp('win":')));
    var newArr = newRe.exec(wins[1]);
    console.log(newArr[0]);
    client.say(target, `Chess.com Stats for for ${commandName}: Rating: ${curRank}`);
    })
}

class RegExp1 extends RegExp {
  [Symbol.split](str, limit) {
    const result = RegExp.prototype[Symbol.split].call(this, str, limit);
    return result.map(x => `(${x})`);
  }
}

                                                                  

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
