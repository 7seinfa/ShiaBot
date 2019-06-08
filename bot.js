const Discord = require("discord.js");
const client = new Discord.Client();
//File System
const fs = require("fs");
//Tafsir file
const puya = require ("./tafsir.json")
//Authentication file
var auth = require('./auth.json');
 
//Log "Running" when turned on
client.on("ready", () => {
  console.log("Running");
});
 
//Once a message is recieved
client.on("message", (message) => {
  if (message.content.split(' ')[0]=="Salam"||message.content.split(' ')[0]=="salam"||message.content.split(' ')[0]=="Salaam"||message.content.split(' ')[0]=="salaam"){
        message.channel.send('Wa Alaikum AsSalam Was Rahmatullahi Was Barakatu');
  }
  if (message.content.substring(0, 1) == '_') { //check if the message begins with _
        var args = message.content.substring(1).split(' '); //Take out underscore and split the command
        var cmd = args[0]; //take the second word
       
        args = args.splice(1); 
        switch(cmd) { //check what command is
            case 'tafsir': //if it is tafsir
				var verses = message.content.substring(8).split(' ')[0]; //get numbers
				var surahNum = parseInt(verses.split(':')[0], 10)-1; //get number before :, subtract one
				var verseNum = parseInt(verses.split(':')[1], 10)-1; //after :
				if(surahNum>=0&&surahNum<=113){ //make sure surahNum is in range of surahs
					if(verseNum<puya[surahNum].length&&verseNum>=0){ //make sure verse num is in range of verses
						tafsir = puya[surahNum][verseNum].text; //get the text
						if(tafsir==''){ //if nothing is written
							message.channel.send('No Tafsir Found!');
						}else{
							message.channel.send(tafsir+'\n~Tafsir End~', { split: true }); //send messages but split up if exceeding character limit
						}
					}else{
						message.channel.send('Please use the command as follows: _tafsir [surahNum]:[verseNum]\nFor example, _tafsir 55:33');
					}
				}else{
					message.channel.send('Please use the command as follows: _tafsir [surahNum]:[verseNum]\nFor example, _tafsir 55:33');
				}
            break;
         }
     }
});
 
client.login(auth.token);
