const Discord = require('discord.js');
const client = new Discord.Client();
//File System
const fs = require('fs');
//http requests
var http = require('http');

//json files
//general Surah info
const surahInfo = require ('./surahinfo.json');
//tafsir & quran
const puya = require ('./tafsir.json');
const quran = require ('./quran.json');
//translations (english)
const sarwar = require ('./sarwar.json');
const ahmedAliEn = require ('./en.ali.json');
const qarai = require ('./qarai.json');
//translations (urdu)
const jawadi = require ('./jawadi.json');
const ahmedAliUr = require ('./ur.ali.json');
const najafi = require ('./najafi.json');
//translations (farsi)
const makarem = require ('./makarem.json');
const tehrani = require ('./tehrani.json');
const ansarian = require ('./ansarian.json');

//kafi
//usul
const usul = [require ('./Kafi/Usul/1.json'),require ('./Kafi/Usul/2.json'),require ('./Kafi/Usul/3.json'),require ('./Kafi/Usul/4.json'),require ('./Kafi/Usul/5.json'),require ('./Kafi/Usul/6.json'),require ('./Kafi/Usul/7.json'),require ('./Kafi/Usul/8.json'),require ('./Kafi/Usul/book-info.json')];
//furu
const furu = [require ('./Kafi/Furu/1.json'),require ('./Kafi/Furu/2.json'),require ('./Kafi/Furu/3.json'),require ('./Kafi/Furu/4.json'),require ('./Kafi/Furu/5.json'),require ('./Kafi/Furu/6.json'),require ('./Kafi/Furu/7.json'),require ('./Kafi/Furu/8.json'),require ('./Kafi/Furu/9.json'),require ('./Kafi/Furu/10.json'),require ('./Kafi/Furu/11.json'),require ('./Kafi/Furu/12.json'),require ('./Kafi/Furu/13.json'),require ('./Kafi/Furu/14.json'),require ('./Kafi/Furu/15.json'),require ('./Kafi/Furu/16.json'),require ('./Kafi/Furu/17.json'),require ('./Kafi/Furu/18.json'),require ('./Kafi/Furu/19.json'),require ('./Kafi/Furu/20.json'),require ('./Kafi/Furu/21.json'),require ('./Kafi/Furu/22.json'),require ('./Kafi/Furu/23.json'),require ('./Kafi/Furu/24.json'),require ('./Kafi/Furu/25.json'),require ('./Kafi/Furu/26.json'),require ('./Kafi/Furu/book-info.json')];
//rawdat
const rawdat = [require ('./Kafi/Rawdat/1.json'),require ('./Kafi/Rawdat/book-info.json')];

//Authentication file
var auth = require('./auth.json');

//Log 'Running' when turned on
client.on('ready', () => {
  console.log('Running');
	
client.user.setActivity("_help | ShiaBot", {
  type: "PLAYING"
});
});

//Constant variables
const salam = ['salam','Salam','Salaam','salaam','selam','Selam']; //salam variants

//timezone stuff
var moment = require('moment-timezone');

//mongoDB stuff
const mongo = require('mongoose');
const url = "mongodb+srv://7seinfa:Hussein.F.A@shiabot-bxodr.mongodb.net/test?retryWrites=true&w=majority"
mongo.connect(url, {useNewUrlParser: true, dbName: 'ShiaBot', useFindAndModify: false});
var db = mongo.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
var timezoneSchema = new mongo.Schema({
  id: String,
  offset: String
}, {collection: 'timezones'});
var TimezoneModel = mongo.model('Timezones', timezoneSchema);
/*mongo.connect(url, {useNewUrlParser: true}, (err, db) => {
        if(err) {
           console.log(err);
           process.exit(0);
        }
        console.log('database connected!');
        var dbo = db.db('ShiaBot');
        dbo.createCollection('timezones', (err, result) => {
            if(err) {
               console.log(err);
               process.exit(0);
            }
            console.log('collection created!');
            db.close();
        });
});*/


//Once a message is recieved
client.on('message', (message) => {

  /*if(message.content.split(' ')[0].includes('سلام')){ //if salam (arabic) is in first word
    message.channel.send('وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ'); //reply
  }
  for(var i = 0; i<salam.length; i++){
    if (message.content.split(' ')[0].includes(salam[i])){ //if salam is in first word
      message.channel.send('Wa Alaikum AsSalam Wa Rahmatullahi Wa Barakatu'); //reply
      break; //end for loop
    }else if(message.content.split(' ')[1]!=null){
      if(message.content.split(' ')[1].includes(salam[i])){ //if salam is in second word
        console.log(message.content.split(' ')[1]);
        message.channel.send('Wa Alaikum AsSalam Wa Rahmatullahi Wa Barakatu'); //reply
        break; //end for loop
      }
    }
  }*/

  if (message.content.substring(0, 1) == '_') { //check if the message begins with _
        var cmd = message.content.substring(1).split(' ')[0]; //Take out underscore and split the command and take the first word
        switch(cmd) { //check what command is
            case 'tafsir': //if it is tafsir
      				var verses = message.content.substring(8).split(' ')[0]; //get numbers
      				var surahNum = parseInt(verses.split(':')[0], 10)-1; //get number before :, subtract one
      				var verseNum = parseInt(verses.split(':')[1], 10)-1; //after :
      				if(surahNum>=0&&surahNum<=113){ //make sure surahNum is in range of surahs
      					if(verseNum<puya[surahNum].length&&verseNum>=0){ //make sure verse num is in range of verses
      						tafsir = puya[surahNum][verseNum].text; //get the text
      						if(tafsir==''||!tafsir.includes('\n')){ //if nothing is written, if it doesn't contain an end line, it also is empty because of the way the tafsir json is set up
      							//message.channel.send(tafsir+'\nNo Tafsir Found!'+'\n~Tafsir End~');
                    const quranEmbed = new Discord.RichEmbed()
                        .setColor('#00a34e')
                        .setAuthor(tafsir)
                        .setDescription('No Tafsir Found!');
                    message.channel.send(quranEmbed);
      						}else{
                    const author = tafsir.split('\n',1);
                    if(tafsir.substring(author[0].length).length<=2000){
                      const quranEmbed = new Discord.RichEmbed()
                          .setColor('#00a34e')
                          .setAuthor(author[0])
                          .setDescription(tafsir.substring(author[0].length));
        							message.channel.send({ embed: quranEmbed}); //send messages but split up if exceeding character limit
                    }else{
                      var cutTafsir = tafsir.substring(author[0].length);
                      var cutTafsirList = splitNChars(cutTafsir,2000);
                      cutTafsirList.push('~Tafsir End~');
                      console.log(cutTafsirList);
                      for(var i = 0; i<cutTafsirList.length; i++){
                        const quranEmbed = new Discord.RichEmbed()
                            .setColor('#00a34e')
                            .setAuthor(author[0] + ' - Part ' + (i+1))
                            .setDescription(cutTafsirList[i]);
          							message.channel.send({ embed: quranEmbed});
                      }
                    }
      						}
      					}else{
      						message.channel.send('Invalid Usage. Please use the command as follows: _tafsir [surahNum]:[verseNum]\nFor example, _tafsir 55:33'); //if something is wrong
      					}
      				}else{
      					message.channel.send('Invalid Usage. Please use the command as follows: _tafsir [surahNum]:[verseNum]\nFor example, _tafsir 55:33'); //if something is wrong
      				}
              break;

            case 'quran': //if wants translation of quran in arabic
              var verses = message.content.substring(7).split(' ')[0]; //get numbers
              var surahNum = parseInt(verses.split(':')[0], 10)-1; //get number before :, subtract one
              var verseNumString = verses.split(':')[1];
              if(verseNumString==null){
                verseNumString='1:8';
              }
              var verseNum = parseInt(verses.split(':')[1], 10)-1; //after :
              if(!verseNumString.includes('-')){ //if not range
            		if(surahNum>=0&&surahNum<=113&&translationName!=''){ //make sure surahNum is in range of surahs, and that translation is valid
            			if(verseNum<puya[surahNum].length&&verseNum>=0){ //make sure verse num is in range of verses
            				result = quran['quran']['sura'][surahNum]['aya'][verseNum]['-text']; //get the text
            				//message.channel.send(' (سورة '+quran['quran']['sura'][surahNum]['-name']+': '+(verseNum+1)+'):\n'+'```\n'+result+'```', { split: true }); //send messages but split up if exceeding character limit
                    const quranEmbed = new Discord.RichEmbed()
                        .setColor('#00a34e')
                        .setAuthor('سورة '+quran['quran']['sura'][surahNum]['-name']+'   '+arNumber((surahNum+1).toString())+': '+arNumber((verseNum+1).toString()))
                        .setDescription(result);
                    message.channel.send(quranEmbed);
                  }else{
                    message.channel.send('Invalid Usage. Please use the command as follows:\n_quran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _quran 45:32 or _quran 45:31-33');
                  }
            		}else{
                  message.channel.send('Invalid Usage. Please use the command as follows:\n_quran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _quran 45:32 or _quran 45:31-33');
            		}
              }else{ //if range
                var v1 = parseInt(verseNumString.split('-')[0], 10)-1;
                var v2 = parseInt(verseNumString.split('-')[1], 10)-1;
                for(v1; v1<=v2; v1++){
                  if(surahNum>=0&&surahNum<=113&&translationName!=''){ //make sure surahNum is in range of surahs, and that translation is valid
				if(v2-v1>=10){
					v2=v1+9;
				}
              			if(v1<puya[surahNum].length&&v1>=0&&v2<puya[surahNum].length){ //make sure verse nums is in range of verses
              				result = quran['quran']['sura'][surahNum]['aya'][v1]['-text']; //get the text
              				//message.channel.send(' (سورة '+quran['quran']['sura'][surahNum]['-name']+': '+(verseNum+1)+'):\n'+'```\n'+result+'```', { split: true }); //send messages but split up if exceeding character limit
                      const quranEmbed = new Discord.RichEmbed()
                          .setColor('#00a34e')
                          .setAuthor('سورة '+quran['quran']['sura'][surahNum]['-name']+'   '+arNumber((surahNum+1).toString())+': '+arNumber((v1+1).toString()))
                          .setDescription(result);
                      message.channel.send(quranEmbed);
                    }else{
                      message.channel.send('Invalid Range. Please use the command as follows:\n_quran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _quran 45:32 or _quran 45:31-33');
                      v1=v2+1; //end loop
                    }
              		}else{
                    message.channel.send('Invalid Range. Please use the command as follows:\n_quran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _quran 45:32 or _quran 45:31-33');
                    v1=v2+1; //end loop
                  }
                }
              }
              break;

            case 'enquran': //if wants translation of quran in english
              var translation = qarai;
              var translationName = 'Ali Quli Qarai';
              if(message.content.substring(10).split(' ')[1]!=null){ //if there are tags after the surah and verse
                switch (message.content.substring(10).split(' ')[1].toLowerCase()){ //make it lower case, and set translation to that json file
                  case '-sarwar':
                    translation = sarwar;
                    translationName = 'Sheikh Muhammad Sarwar';
                    break;
                  case '-qarai':
                    translation = qarai;
                    translationName = 'Ali Quli Qarai';
                    break;
                  case '-ahmedali':
                    translation = ahmedAliEn;
                    translationName = 'SV Mir Ahmed Ali';
                    break;
                  default: //else
                    translationName = '';
                    break;
                }
              }
              var verses = message.content.substring(9).split(' ')[0]; //get numbers
              var surahNum = parseInt(verses.split(':')[0], 10)-1; //get number before :, subtract one
              var verseNumString = verses.split(':')[1];
              if(verseNumString==null){
                verseNumString='1:8';
              }
          		var verseNum = parseInt(verses.split(':')[1], 10)-1; //after :
              if(!verseNumString.includes('-')){ //if not range
            		if(surahNum>=0&&surahNum<=113&&translationName!=''&&translationName!=''){ //make sure surahNum is in range of surahs, and that translation is valid
            			if(verseNum<puya[surahNum].length&&verseNum>=0){ //make sure verse num is in range of verses
            				result = translation['quran']['sura'][surahNum]['aya'][verseNum]['-text']; //get the text
            				//message.channel.send(translationName+' (Surah '+surahInfo[surahNum]['title']+': '+(verseNum+1)+'):\n'+'```'+result+'```', { split: true }); //send messages but split up if exceeding character limit
                    const quranEmbed = new Discord.RichEmbed()
                        .setColor('#00a34e')
                        .setAuthor(translationName+' - '+'Surah '+surahInfo[surahNum]['title']+' '+(surahNum+1)+':'+(verseNum+1))
                        .setDescription(result);
                    message.channel.send(quranEmbed);
                  }else{
                    message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Sheikh Muhammad Sarwar): \n_enquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _enquran 45:32 -qarai or _enquran 45:31-33 -qarai\n\nThe available translations are: \nSheikh Muhammad Sarwar (-sarwar), \nAli Quli Qarai (-qarai), \nand SV Mir Ahmed Ali (-ahmedali)');
            			}
            		}else{
                  message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Sheikh Muhammad Sarwar): \n_enquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _enquran 45:32 -qarai or _enquran 45:31-33 -qarai\n\nThe available translations are: \nSheikh Muhammad Sarwar (-sarwar), \nAli Quli Qarai (-qarai), \nand SV Mir Ahmed Ali (-ahmedali)');
            		}
              }else{
                var v1 = parseInt(verseNumString.split('-')[0], 10)-1;
                var v2 = parseInt(verseNumString.split('-')[1], 10)-1;
                for(v1; v1<=v2; v1++){
				if(v2-v1>=10){
					v2=v1+9;
				}
                  if(surahNum>=0&&surahNum<=113&&translationName!=''&&translationName!=''){ //make sure surahNum is in range of surahs, and that translation is valid
              			if(v1<puya[surahNum].length&&v1>=0&&v2<puya[surahNum].length){ //make sure verse num is in range of verses
              				result = translation['quran']['sura'][surahNum]['aya'][v1]['-text']; //get the text
              				//message.channel.send(translationName+' (Surah '+surahInfo[surahNum]['title']+': '+(verseNum+1)+'):\n'+'```'+result+'```', { split: true }); //send messages but split up if exceeding character limit
                      const quranEmbed = new Discord.RichEmbed()
                          .setColor('#00a34e')
                          .setAuthor(translationName+' - '+'Surah '+surahInfo[surahNum]['title']+' '+(surahNum+1)+':'+(v1+1))
                          .setDescription(result);
                      message.channel.send(quranEmbed);
                    }else{
                      message.channel.send('Invalid Range. Please use the command as follows (the default translation is by Sheikh Muhammad Sarwar): \n_enquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _enquran 45:32 -qarai or _enquran 45:31-33 -qarai\n\nThe available translations are: \nSheikh Muhammad Sarwar (-sarwar), \nAli Quli Qarai (-qarai), \nand SV Mir Ahmed Ali (-ahmedali)');
                      v1=v2+1;
                    }
              		}else{
                    message.channel.send('Invalid Range. Please use the command as follows (the default translation is by Sheikh Muhammad Sarwar): \n_enquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _enquran 45:32 -qarai or _enquran 45:31-33 -qarai\n\nThe available translations are: \nSheikh Muhammad Sarwar (-sarwar), \nAli Quli Qarai (-qarai), \nand SV Mir Ahmed Ali (-ahmedali)');
                    v1=v2+1;
                  }
                }
              }
              break;

            case 'urquran': //if wants translation of quran in urdu
              var translation = jawadi;
              var translationName = 'سید ذیشان نقوی';
              if(message.content.substring(10).split(' ')[1]!=null){ //if there are tags after the surah and verse
                switch (message.content.substring(10).split(' ')[1].toLowerCase()){ //make it lower case, and set translation to that json file
                  case '-jawadi':
                    translation = jawadi;
                    translationName = 'سید ذیشان نقوی';
                    break;
                  case '-najafi':
                    translation = najafi;
                    translationName = 'شيخ محمد حسين نجفي';
                    break;
                  case '-ahmedali':
                    translation = ahmedAliUr;
                    translationName = 'مير أحمد علي';
                    break;
                  default: //else
                    translationName = '';
                    break;
                }
              }
              var verses = message.content.substring(9).split(' ')[0]; //get numbers
              var surahNum = parseInt(verses.split(':')[0], 10)-1; //get number before :, subtract one
              var verseNumString = verses.split(':')[1];
              if(verseNumString==null){
                verseNumString='1:8';
              }
          		var verseNum = parseInt(verses.split(':')[1], 10)-1; //after :
              if(!verseNumString.includes('-')){ //if not range
            		if(surahNum>=0&&surahNum<=113&&translationName!=''&&translationName!=''){ //make sure surahNum is in range of surahs, and that translation is valid
            			if(verseNum<puya[surahNum].length&&verseNum>=0){ //make sure verse num is in range of verses
            				result = translation['quran']['sura'][surahNum]['aya'][verseNum]['-text']; //get the text
            				//message.channel.send(translationName+' (Surah '+surahInfo[surahNum]['title']+': '+(verseNum+1)+'):\n'+'```'+result+'```', { split: true }); //send messages but split up if exceeding character limit
                    const quranEmbed = new Discord.RichEmbed()
                      .setColor('#00a34e')
                      .setAuthor(translationName+' - '+'سورة '+quran['quran']['sura'][surahNum]['-name']+'   '+arNumber((surahNum+1).toString())+': '+arNumber((verseNum+1).toString()))
                      .setDescription(result);
                    message.channel.send(quranEmbed);
                  }else{
                    message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Syed Zeeshan Haider Jawadir): _urquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _urquran 45:32 -jawadi or _urquran 45:31-33 -jawadi\n\nThe available translations are: \nSyed Zeeshan Haider Jawadi (-jawadi), \nSheikh Muhammad Hussain Najafi (-najafi), \nand SV Mir Ahmed Ali (-ahmedali)');
        					}
        				}else{
                  message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Syed Zeeshan Haider Jawadir): _urquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _urquran 45:32 -jawadi or _urquran 45:31-33 -jawadi\n\nThe available translations are: \nSyed Zeeshan Haider Jawadi (-jawadi), \nSheikh Muhammad Hussain Najafi (-najafi), \nand SV Mir Ahmed Ali (-ahmedali)');
        				}
              }else{
                var v1 = parseInt(verseNumString.split('-')[0], 10)-1;
                var v2 = parseInt(verseNumString.split('-')[1], 10)-1;
                for(v1; v1<=v2; v1++){
				if(v2-v1>=10){
					v2=v1+9;
				}
                  if(surahNum>=0&&surahNum<=113&&translationName!=''&&translationName!=''){ //make sure surahNum is in range of surahs, and that translation is valid
                    if(v1<puya[surahNum].length&&v1>=0&&v2<puya[surahNum].length){ //make sure verse num is in range of verses
                      result = translation['quran']['sura'][surahNum]['aya'][v1]['-text']; //get the text
                      //message.channel.send(translationName+' (Surah '+surahInfo[surahNum]['title']+': '+(verseNum+1)+'):\n'+'```'+result+'```', { split: true }); //send messages but split up if exceeding character limit
                      const quranEmbed = new Discord.RichEmbed()
                        .setColor('#00a34e')
                        .setAuthor(translationName+' - '+'سورة '+quran['quran']['sura'][surahNum]['-name']+'   '+arNumber((surahNum+1).toString())+': '+arNumber((v1+1).toString()))
                        .setDescription(result);
                      message.channel.send(quranEmbed);
                    }else{
                      message.channel.send('Invalid Range. Please use the command as follows (the default translation is by Syed Zeeshan Haider Jawadir): _urquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _urquran 45:32 -jawadi or _urquran 45:31-33 -jawadi\n\nThe available translations are: \nSyed Zeeshan Haider Jawadi (-jawadi), \nSheikh Muhammad Hussain Najafi (-najafi), \nand SV Mir Ahmed Ali (-ahmedali)');
                      v1=v2+1;
                    }
                  }else{
                    message.channel.send('Invalid Range. Please use the command as follows (the default translation is by Syed Zeeshan Haider Jawadir): _urquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _urquran 45:32 -jawadi or _urquran 45:31-33 -jawadi\n\nThe available translations are: \nSyed Zeeshan Haider Jawadi (-jawadi), \nSheikh Muhammad Hussain Najafi (-najafi), \nand SV Mir Ahmed Ali (-ahmedali)');
                    v1=v2+1;
                  }
                }
              }
              break;

              case 'faquran': //if wants translation of quran in farsi
                var translation = makarem;
                var translationName = 'شيخ ناصر مكارم شيرازي';
                if(message.content.substring(10).split(' ')[1]!=null){ //if there are tags after the surah and verse
                  switch (message.content.substring(10).split(' ')[1].toLowerCase()){ //make it lower case, and set translation to that json file
                    case '-makarem':
                      translation = makarem;
                      translationName = 'شيخ ناصر مكارم شيرازي';
                      break;
                    case '-tehrani':
                      translation = tehrani;
                      translationName = 'شيخ محمد صادقي طهرني';
                      break;
                    case '-ansarian':
                      translation = ansarian;
                      translationName = 'شيخ حسين انصاريان';
                      break;
                    default: //else
                      translationName = '';
                      break;
                  }
                }
                var verses = message.content.substring(9).split(' ')[0]; //get numbers
                var surahNum = parseInt(verses.split(':')[0], 10)-1; //get number before :, subtract one
                var verseNumString = verses.split(':')[1];
                if(verseNumString==null){
                  verseNumString='1:8';
                }
            		var verseNum = parseInt(verses.split(':')[1], 10)-1; //after :
                if(!verseNumString.includes('-')){ //if not range
              		if(surahNum>=0&&surahNum<=113&&translationName!=''&&translationName!=''){ //make sure surahNum is in range of surahs, and that translation is valid
              			if(verseNum<puya[surahNum].length&&verseNum>=0){ //make sure verse num is in range of verses
              				result = translation['quran']['sura'][surahNum]['aya'][verseNum]['-text']; //get the text
              				//message.channel.send(translationName+' (Surah '+surahInfo[surahNum]['title']+': '+(verseNum+1)+'):\n'+'```'+result+'```', { split: true }); //send messages but split up if exceeding character limit
                      const quranEmbed = new Discord.RichEmbed()
                        .setColor('#00a34e')
                        .setAuthor(translationName+' - '+'سورة '+quran['quran']['sura'][surahNum]['-name']+'   '+arNumber((surahNum+1).toString())+': '+arNumber((verseNum+1).toString()))
                        .setDescription(result);
                      message.channel.send(quranEmbed);
                  }else{
                    message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Sheikh Naser Makarem Shirazi): _faquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _urquran 45:32 -ansarian or _urquran 45:31-33 -ansarian\n\nThe available translations are: \nSheikh Naser Makarem Shirazi (-makarem), \nSheikh Mohammad Sadeqi Tehrani (-tehrani), \nand Sheikh Hussain Ansarian (-ansarian)');
        					}
        				}else{
                  message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Sheikh Naser Makarem Shirazi): _faquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _urquran 45:32 -ansarian or _urquran 45:31-33 -ansarian\n\nThe available translations are: \nSheikh Naser Makarem Shirazi (-makarem), \nSheikh Mohammad Sadeqi Tehrani (-tehrani), \nand Sheikh Hussain Ansarian (-ansarian)');
        				}
              }else{
                var v1 = parseInt(verseNumString.split('-')[0], 10)-1;
                var v2 = parseInt(verseNumString.split('-')[1], 10)-1;
                for(v1; v1<=v2; v1++){
				if(v2-v1>=10){
					v2=v1+9;
				}
                  if(surahNum>=0&&surahNum<=113&&translationName!=''&&translationName!=''){ //make sure surahNum is in range of surahs, and that translation is valid
                    if(v1<puya[surahNum].length&&v1>=0&&v2<puya[surahNum].length){ //make sure verse num is in range of verses
                      result = translation['quran']['sura'][surahNum]['aya'][v1]['-text']; //get the text
                      //message.channel.send(translationName+' (Surah '+surahInfo[surahNum]['title']+': '+(verseNum+1)+'):\n'+'```'+result+'```', { split: true }); //send messages but split up if exceeding character limit
                      const quranEmbed = new Discord.RichEmbed()
                        .setColor('#00a34e')
                        .setAuthor(translationName+' - '+'سورة '+quran['quran']['sura'][surahNum]['-name']+'   '+arNumber((surahNum+1).toString())+': '+arNumber((v1+1).toString()))
                        .setDescription(result);
                      message.channel.send(quranEmbed);
                    }else{
                      message.channel.send('Invalid Range. Please use the command as follows (the default translation is by Sheikh Naser Makarem Shirazi): _faquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _urquran 45:32 -ansarian or _urquran 45:31-33 -ansarian\n\nThe available translations are: \nSheikh Naser Makarem Shirazi (-makarem), \nSheikh Mohammad Sadeqi Tehrani (-tehrani), \nand Sheikh Hussain Ansarian (-ansarian)');
                      v1=v2+1;
                    }
                  }else{
                    message.channel.send('Invalid Range. Please use the command as follows (the default translation is by Sheikh Naser Makarem Shirazi): _faquran [surahNum]:[verseNum]-{endVerse} {-translator}\n\nFor example, _urquran 45:32 -ansarian or _urquran 45:31-33 -ansarian\n\nThe available translations are: \nSheikh Naser Makarem Shirazi (-makarem), \nSheikh Mohammad Sadeqi Tehrani (-tehrani), \nand Sheikh Hussain Ansarian (-ansarian)');
                    v1=v2+1;
                  }
                }
              }
              break;


            case 'hadith':
              try{
                var series = message.content.split(' ')[1].toLowerCase();
                switch(series){
                  case 'kafi':
                    var volume = message.content.split(' ')[2].toLowerCase();
                    switch(volume){
                      case 'usul':
                        var verses = message.content.split(' ')[3];
                        var book = verses.split(':')[0];
                        var chapter = verses.split(':')[1];
                        var hadith = verses.split(':')[2];
                        var language = message.content.split(' ')[4];
                        if(language!=null){
                          language = message.content.split(' ')[4].toLowerCase();
                          if(language=='-english'){
                            result = usul[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['english'].replace(/<br>/g, '\n');
                            if(result.length>=2000){
                              result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Usul/'+book+'/'+chapter+'/'+hadith;
                            }
                            const quranEmbed = new Discord.RichEmbed()
                              .setColor('#00a34e')
                              .setAuthor(usul[8]['name']+' - '+usul[8]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+usul[8]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                              .setDescription(result);
                            message.channel.send(quranEmbed);
                          }else if(language=='-arabic'){
                            result = usul[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['arabic'].replace(/<br>/g, '\n');
                            if(result.length>=2000){
                              result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Usul/'+book+'/'+chapter+'/'+hadith;
                            }
                            const quranEmbed = new Discord.RichEmbed()
                              .setColor('#00a34e')
                              .setAuthor(usul[8]['name']+' - '+usul[8]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+usul[8]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                              .setDescription(result);
                            message.channel.send(quranEmbed);
                          }else{
                            result = usul[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['english'].replace(/<br>/g, '\n');
                            if(result.length>=2000){
                              result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Usul/'+book+'/'+chapter+'/'+hadith;
                            }
                            const quranEmbed = new Discord.RichEmbed()
                              .setColor('#00a34e')
                              .setAuthor(usul[8]['name']+' - '+usul[8]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+usul[8]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                              .setDescription(result);
                            message.channel.send(quranEmbed);
                          }
                        }else{
                          result = usul[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['english'].replace(/<br>/g, '\n');
                          if(result.length>=2000){
                            result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Usul/'+book+'/'+chapter+'/'+hadith;
                          }
                          const quranEmbed = new Discord.RichEmbed()
                            .setColor('#00a34e')
                            .setAuthor(usul[8]['name']+' - '+usul[8]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+usul[8]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                            .setDescription(result);
                          message.channel.send(quranEmbed);
                        }
                        break;

                      case 'furu':
                        var verses = message.content.split(' ')[3];
                        var book = verses.split(':')[0];
                        var chapter = verses.split(':')[1];
                        var hadith = verses.split(':')[2];
                        var language = message.content.split(' ')[4];
                        if(language!=null){
                          language = message.content.split(' ')[4].toLowerCase();
                          if(language=='-english'){
                            result = furu[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['english'].replace(/<br>/g, '\n');
                            if(result.length>=2000){
                              result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Furu/'+book+'/'+chapter+'/'+hadith;
                            }
                            const quranEmbed = new Discord.RichEmbed()
                              .setColor('#00a34e')
                              .setAuthor(furu[26]['name']+' - '+furu[26]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+furu[26]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                              .setDescription(result);
                            message.channel.send(quranEmbed);
                          }else if(language=='-arabic'){
                            result = furu[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['arabic'].replace(/<br>/g, '\n');
                            if(result.length>=2000){
                              result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Furu/'+book+'/'+chapter+'/'+hadith;
                            }
                            const quranEmbed = new Discord.RichEmbed()
                              .setColor('#00a34e')
                              .setAuthor(furu[26]['name']+' - '+furu[26]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+furu[26]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                              .setDescription(result);
                            message.channel.send(quranEmbed);
                          }else{
                            result = furu[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['english'].replace(/<br>/g, '\n');
                            if(result.length>=2000){
                              result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Furu/'+book+'/'+chapter+'/'+hadith;
                            }
                            const quranEmbed = new Discord.RichEmbed()
                              .setColor('#00a34e')
                              .setAuthor(furu[26]['name']+' - '+furu[26]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+furu[26]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                              .setDescription(result);
                            message.channel.send(quranEmbed);
                          }
                        }else{
                          result = furu[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['english'].replace(/<br>/g, '\n');
                          if(result.length>=2000){
                            result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Furu/'+book+'/'+chapter+'/'+hadith;
                          }
                          const quranEmbed = new Discord.RichEmbed()
                            .setColor('#00a34e')
                            .setAuthor(furu[26]['name']+' - '+furu[26]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+furu[26]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                            .setDescription(result);
                          message.channel.send(quranEmbed);
                        }
                        break;

                      case 'rawdat':
                        var verses = message.content.split(' ')[3];
                        var book = verses.split(':')[0];
                        var chapter = verses.split(':')[1];
                        var hadith = verses.split(':')[2];
                        var language = message.content.split(' ')[4];
                        if(language!=null){
                          language = message.content.split(' ')[4].toLowerCase();
                          if(language=='-english'){
                            result = rawdat[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['english'].replace(/<br>/g, '\n');
                            if(result.length>=2000){
                              result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Rawdat/'+book+'/'+chapter+'/'+hadith;
                            }
                            const quranEmbed = new Discord.RichEmbed()
                              .setColor('#00a34e')
                              .setAuthor(rawdat[1]['name']+' - '+rawdat[1]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+rawdat[1]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                              .setDescription(result);
                            message.channel.send(quranEmbed);
                          }else if(language=='-arabic'){
                            result = rawdat[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['arabic'].replace(/<br>/g, '\n');
                            if(result.length>=2000){
                              result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Rawdat/'+book+'/'+chapter+'/'+hadith;
                            }
                            const quranEmbed = new Discord.RichEmbed()
                              .setColor('#00a34e')
                              .setAuthor(rawdat[1]['name']+' - '+rawdat[1]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+rawdat[1]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                              .setDescription(result);
                            message.channel.send(quranEmbed);
                          }else{
                            result = rawdat[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['english'].replace(/<br>/g, '\n');
                            if(result.length>=2000){
                              result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Rawdat/'+book+'/'+chapter+'/'+hadith;
                            }
                            const quranEmbed = new Discord.RichEmbed()
                              .setColor('#00a34e')
                              .setAuthor(rawdat[1]['name']+' - '+rawdat[1]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+rawdat[1]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                              .setDescription(result);
                            message.channel.send(quranEmbed);
                          }
                        }else{
                          result = rawdat[parseInt(book)-1]['chapters'][0][parseInt(chapter)-1][parseInt(hadith)-1]['english'].replace(/<br>/g, '\n');
                          if(result.length>=2000){
                            result = result.substring(0,1500) + '...\n Read the rest of the Hadith at: http://thaqalayn.co/index.php/ahadith?Al-Kafi/Rawdat/'+book+'/'+chapter+'/'+hadith;
                          }
                          const quranEmbed = new Discord.RichEmbed()
                            .setColor('#00a34e')
                            .setAuthor(rawdat[1]['name']+' - '+rawdat[1]['books'][parseInt(book)-1]['title'].replace(/<br>/g, ' - ')+' - '+rawdat[1]['books'][parseInt(book)-1]['chapters'][parseInt(chapter)-1]+' - Hadith '+hadith)
                            .setDescription(result);
                          message.channel.send(quranEmbed);
                        }
                        break;

                      default:
                        message.channel.send('Hadith not found! Please use the command as follows: _hadith [bookSeriesName] [volume] [bookNum]:[chapterNum]:[hadithNum] [-language]\n\n The currently available book series are: kafi\nThe currently available volumes are: For kafi; usul, furu, rawdat\nThe currently available languages are: english, arabic\nYou can find ahadith numbers here: http://thaqalayn.co/index.php/ahadith');
                        break;
                    }
                    break;

                  default:
                    message.channel.send('Hadith not found! Please use the command as follows: _hadith [bookSeriesName] [volume] [bookNum]:[chapterNum]:[hadithNum] [-language]\n\n The currently available book series are: kafi\nThe currently available volumes are: For kafi; usul, furu, rawdat\nThe currently available languages are: english, arabic\nYou can find ahadith numbers here: http://thaqalayn.co/index.php/ahadith');
                    break;
                }
              }catch(error){
                console.log(error);
                message.channel.send('Hadith not found! Please use the command as follows: _hadith [bookSeriesName] [volume] [bookNum]:[chapterNum]:[hadithNum] [-language]\n\n The currently available book series are: kafi\nThe currently available volumes are: For kafi; usul, furu, rawdat\nThe currently available languages are: english, arabic\nYou can find ahadith numbers here: http://thaqalayn.co/index.php/ahadith');
              }
              break;

            /*case 'kafi':
              var verses = message.content.substring(6).split(' ')[0];
              if(verses.split(':').length==3){
                var book = verses.split(':')[0];
                var chapter = verses.split(':')[1];
                var hadith = verses.split(':')[2];
                var link = 'http://fourshiabooks.com/server/get_hadith.php?book=al-kafi&content_id='+book+'&chapter='+chapter+'&number='+hadith;
                const https = require('https');
                http.get(link, (resp) => {
                  let data = '';

                  // A chunk of data has been recieved.
                  resp.on('data', (chunk) => {
                    data += chunk;
                  });

                  // The whole response has been received. Print out the result.
                  resp.on('end', () => {
                    if(JSON.parse(data)[0]!=null){
                      var narrator = JSON.parse(data)[0].narrator.replace(/\n|\r/g,' ');
                      if(narrator.length>100){
                        narrator = narrator.substring(0,100)+'...';
                        console.log(title);
                      }
                      var text = JSON.parse(data)[0].text.replace(/<br\/>/g,' ');
                      if(text.length>1000){
                        text = text.substring(0,500)+'...';
                      }
                      var url = 'http://www.fourshiabooks.com/hadith/al-kafi/'+book+'/'+chapter+'/'+hadith;
                      var title = 'Al-Kafi Book '+book+', Chapter '+chapter+', Hadith '+hadith;
                      const hadithEmbed = new Discord.RichEmbed()
                        .setColor('#00a34e')
                        .setTitle(narrator)
                        .setURL(url)
                        .setAuthor(title)
                        .setDescription(text);
                      message.channel.send(hadithEmbed);
                    }else{
                      message.channel.send('Hadith not found! Please use the command as follows: _kafi [bookNum]:[chapterNum]:[hadithNum]  or  _kafi [hadithNum]\n\nFor example, _kafi 2:2:5  or  _kafi 48');
                    }
                  });

                }).on("error", (err) => {
                  console.log("Error: " + err.message);
                });
              }else if(parseInt(verses)!=null&&!verses.includes(':')){
                var hadith = parseInt(verses);
                var link = 'http://fourshiabooks.com/server/get_hadith.php?book=al-kafi&hadith='+hadith;
                http.get(link, (resp) => {
                  let data = '';

                  // A chunk of data has been recieved.
                  resp.on('data', (chunk) => {
                    data += chunk;
                  });

                  // The whole response has been received. Print out the result.
                  resp.on('end', () => {
                    if(JSON.parse(data)[0]!=null){
                      var book = JSON.parse(data)[0].content_id;
                      var chapter = JSON.parse(data)[0].chapter;
                      var hadith = JSON.parse(data)[0].number;
                      var narrator = JSON.parse(data)[0].narrator.replace(/\n|\r/g,' ');
                      if(narrator.length>100){
                        narrator = narrator.substring(0,100)+'...';
                        console.log(title);
                      }
                      var text = JSON.parse(data)[0].text.replace(/<br\/>/g,' ');
                      if(text.length>1000){
                        text = text.substring(0,500)+'...';
                      }
                      var url = 'http://www.fourshiabooks.com/hadith/al-kafi/'+book+'/'+chapter+'/'+hadith;
                      var title = 'Al-Kafi Book '+book+', Chapter '+chapter+', Hadith '+hadith;
                      const hadithEmbed = new Discord.RichEmbed()
                        .setColor('#00a34e')
                        .setTitle(narrator)
                        .setURL(url)
                        .setAuthor(title)
                        .setDescription(text);
                      message.channel.send(hadithEmbed);
                    }else{
                      message.channel.send('Hadith not found! Please use the command as follows: _kafi [bookNum]:[chapterNum]:[hadithNum]  or  _kafi [hadithNum]\n\nFor example, _kafi 2:2:5  or  _kafi 48');
                    }
                  });

                }).on("error", (err) => {
                  console.log("Error: " + err.message);
                });
              }else{
                message.channel.send('Hadith not found! Please use the command as follows: _kafi [bookNum]:[chapterNum]:[hadithNum]  or  _kafi [hadithNum]\n\nFor example, _kafi 2:2:5  or  _kafi 48');
              }
              break;

            case 'iam':
              var timezone=message.content.substring(5).split(' ')[0];
              if(timezone.substring(0,3)=='UTC'&&(timezone[3]=='+'||timezone[3]=='-')){
                var offset=timezone.substring(3);
                if(/^\d*$/.test(offset.substring(1))){
                  var offsetOLD=offset;
                  if(offset[0]=='+'){
                    offset='-'+offset.substring(1);
                  }else if(offset[0]=='-'){
                    offset='+'+offset.substring(1);
                  }
                  var userid = message.member.id;
                  var userTimezone = new TimezoneModel({id:userid,offset:offset});
                  console.log(userTimezone);
                  saveTimezone(userid,offset,userTimezone);
                  message.channel.send("Your timezone has been set to UTC"+offsetOLD+"!");
                }else{
                  message.channel.send("Incorrect usage! Please use _iam UTC[plus or minus your offset]\nFor example, _iam UTC-4");
                }
              }else{
                message.channel.send("Incorrect usage! Please use _iam UTC[plus or minus your offset]\nFor example, _iam UTC-4");
              }
              break;

            case 'time':
              if(message.mentions.users.first()!=null){
                var userid = message.mentions.users.first().id;
                var usertag = message.mentions.users.first().tag;
                var offset = findTimezone(userid, message, usertag);
                /*if(offset!=''){
                  message.channel.send(usertag+'\'s time is '+moment().tz('Etc/GMT'+offset).format('h:mm A')+' and the date is '+moment().tz('Etc/GMT'+offset).format('MMM Do YYYY'));
                }else{
                  message.channel.send("Time not found! Please use _time @[person tag]");
                }
              }else{
                message.channel.send("Time not found! Please use _time @[person tag]");
              }
              break;*/

            case 'help':case 'h': //help command
              message.channel.send('ShiaBot\'s commands are:\n_tafsir [surahNum]:[verseNum]\n_quran [surahNum]:[verseNum]-{endVerse}\n_enquran [surahNum]:[verseNum]-{endVerse} {-translator}\n_urquran [surahNum]:[verseNum]-{endVerse} {-translator}\n_faquran [surahNum]:[verseNum]-{endVerse} {-translator}\n_hadith [bookSeriesName] [volume] [bookNum]:[chapterNum]:[hadithNum] [-language]');
              break;

              /*mongo.connect(url, {useNewUrlParser: true}, (err, db) => {
                if(err) {
                    console.log(err);
                    process.exit(0);
                }
                let data = {
                  "id": userid,
                  "offset": offset
                };
                var dbo = db.db('ShiaBot');
                console.log('database connected!');
                var collection = dbo.collection('timezones');
                collection.find({userid: userid}).toArray((err, results) => {
                  if(err) {
                      console.log(err);
                      process.exit(0);
                  }
                  offset=results[0].offset;
                  console.log(results[0].offset);
                  db.close();
                });
              });
              message.channel.send(usertag+'\'s time is '+moment().tz('Etc/GMT'+offset).format('h:mm A')+' and the date is '+moment().tz('Etc/GMT'+offset).format('MMM Do YYYY'));
              */break;

            /*case 'destroy': //just testing
              if(meesage.content[83297469]=''){}//throw error to end*/
         }
     }
});

function arNumber(engNum){
  var arNum = "";
  for (var i = 0; i<engNum.length; i++){
    var enList = ["0","1","2","3","4","5","6","7","8","9"];
    var arList = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
    for(var x = 0; x<enList.length; x++){
      if(engNum[i]==enList[x]){
        arNum+=arList[x];
        break;
      }
    }
  }
  return arNum;
}

function splitNChars(txt, num) {
  var result = [];
  for (var i = 0; i < txt.length; i += num) {
    result.push(txt.substr(i, num));
  }
  return result;
}

async function saveTimezone(userid, offset, userTimezone){
  if(await TimezoneModel.exists({ id: userid })){
    await TimezoneModel.findOneAndUpdate({id:userid},{offset:offset});
  }else{
    await userTimezone.save(function (err, fluffy) {
      if (err) return console.error(err);
    });
  }
}

async function findTimezone(userid, message, usertag){
  console.log('1');
  if(await TimezoneModel.exists({ id: userid })){
    console.log('2');
    var offset;
    await TimezoneModel.findOne(({id:userid}), function(err, results) {
      console.log('3');
      if(err) {
          console.log(err);
      }
      offset=results.offset;
      console.log('4');
      message.channel.send(usertag+'\'s time is '+moment().tz('Etc/GMT'+offset).format('h:mm A')+' and the date is '+moment().tz('Etc/GMT'+offset).format('MMM Do YYYY'));
      console.log(offset);
    });
  }else{
    offset = '';
    message.channel.send("Time not found! Please use _time @[person tag]");
  }
}

client.login(auth.token);
