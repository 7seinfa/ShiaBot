/*var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});



bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
	var tafsir='';
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '_') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'tafsir':
				var verses = message.substring(8).split(' ')[0];
				var surahNum = parseInt(verses.split(':')[0], 10)-1;
				var verseNum = parseInt(verses.split(':')[1], 10)-1;
				
				tafsir = puya[surahNum][verseNum].text;
				logger.info(tafsir);
				while (tafsir.length) {
					msg.reply(tafsir.substr(1999));
					tafsir = tafsir.substr(1999);
				}
				/*if(tafsir.length>2000){
					var part = tafsir;
					var beginning = 0;
					for(var end = 1999; end<=tafsir.length; end+=1999){
						if(end<tafsir.length){
							part=tafsir.substring(beginning,end);
						}else{
							part=tafsir.substring(beginning);
						}
						
						bot.sendMessage({
							to: channelID,
							message: part
						});
						beginning+=1999;
					}
					part=tafsir.substring(beginning);
					bot.sendMessage({
							to: channelID,
							message: part
						});
				}else{
					bot.sendMessage({
						to: channelID,
						message: tafsir
					});
				}
            break;
            // Just add any case commands if you want to..
         }
     }
});*/
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const puya = require ("./tafsir.json")
var auth = require('./auth.json');
 
client.on("ready", () => {
  console.log("I am ready!");
});
 
client.on("message", (message) => {
  if (message.content.substring(0, 1) == '_') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'tafsir':
				var verses = message.content.substring(8).split(' ')[0];
				var surahNum = parseInt(verses.split(':')[0], 10)-1;
				var verseNum = parseInt(verses.split(':')[1], 10)-1;
				if(surahNum>=0&&surahNum<=113){
					if(verseNum<puya[surahNum].length&&verseNum>=0){
						tafsir = puya[surahNum][verseNum].text;
						if(tafsir==''){
							message.channel.send('No Tafsir Found!');
						}else{
							message.channel.send(tafsir+'\n~Tafsir End~', { split: true });
						}
					}else{
						message.channel.send('Please use the command as follows: _tafsir [surahNum]:[verseNum]\nFor example, -tafsir 55:33');
					}
				}else{
					message.channel.send('Please use the command as follows: _tafsir [surahNum]:[verseNum]\nFor example, -tafsir 55:33');
				}
            break;
            // Just add any case commands if you want to..
         }
     }
});
 
client.login(auth.token);