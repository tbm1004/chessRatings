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

  // Remove whitespace from chat message
  const commandName = msg.trim();

  if( commandName.startsWith('!rating')){
    client.say(target, `Rating for ${commandName}'`);
    console.log(`* Executed command`);
    httpCon();
  }
  else {
    console.log(`* Unknown command ${commandName}`);
  }
}

function httpCon () {
    axios.get('https://api.chess.com/pub/player/hikaru/stats').then((response) => {
  
    var config = JSON.parse('{"filter":"/d"}');
    var result = response.get.match(new RegExp(config.filter));
    console.log(result);
    })
}
                                                                    

                                                                  
                           
function checkRating () {
  
}
// Function called when the "dice" command is issued
function rollDice () {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
