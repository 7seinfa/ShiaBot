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

//Constanct variables
const salam = ["salam","Salam","Salaam","salaam","selam","Selam"]; //salam variants



//Once a message is recieved
client.on("message", (message) => {
  for(var i = 0; i<salam.length; i++){
    if (message.content.split(' ')[0].includes(salam[i])){ //if salam is in first word
      message.channel.send('Wa Alaikum AsSalam Wa Rahmatullahi Wa Barakatu'); //reply
      //break; //end for loop
    }else if(message.content.split(' ').lenth>0){
      if(message.content.split(' ')[1].includes(salam[i])){ //if salam is in second word
        console.log(message.content.split(' ')[1]);
        message.channel.send('Wa Alaikum AsSalam Wa Rahmatullahi Wa Barakatu'); //reply
        break; //end for loop
      }
    }
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
						if(tafsir==''||!tafsir.contains("\n")){ //if nothing is written, if it doesn't contain an end line, it also is empty because of the way the tafsir json is set up
							message.channel.send(tafsir+'\nNo Tafsir Found!'+'\n~Tafsir End~');
						}else{
							message.channel.send(tafsir+'\n~Tafsir End~', { split: true }); //send messages but split up if exceeding character limit
						}
					}else{
						message.channel.send('Please use the command as follows: _tafsir [surahNum]:[verseNum]\nFor example, _tafsir 55:33'); //if something is wrong
					}
				}else{
					message.channel.send('Please use the command as follows: _tafsir [surahNum]:[verseNum]\nFor example, _tafsir 55:33'); //if something is wrong
				}
            break;
         }
     }
});

client.login(auth.token);
