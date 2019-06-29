const Discord = require('discord.js');
const client = new Discord.Client();
//File System
const fs = require('fs');
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

//Authentication file
var auth = require('./auth.json');

//Log 'Running' when turned on
client.on('ready', () => {
  console.log('Running');
});

//Constanct variables
const salam = ['salam','Salam','Salaam','salaam','selam','Selam']; //salam variants



//Once a message is recieved
client.on('message', (message) => {

  if(message.content.split(' ')[0].includes('سلام')){ //if salam (arabic) is in first word
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
  }

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
          		var verseNum = parseInt(verses.split(':')[1], 10)-1; //after :
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
                  message.channel.send('Invalid Usage. Please use the command as follows: _quran [surahNum]:[verseNum] {-translator}\nFor example, _quran 45:32');
                }
          		}else{
                message.channel.send('Invalid Usage. Please use the command as follows: _quran [surahNum]:[verseNum] {-translator}\nFor example, _quran 45:32');
          		}
              break;

            case 'enquran': //if wants translation of quran in english
              var translation = sarwar;
              var translationName = 'Sheikh Muhammad Sarwar';
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
                    message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Sheikh Muhammad Sarwar): _enquran [surahNum]:[verseNum] {-translator}\nFor example, _enquran 45:32 -qarai\nThe available translations are Sheikh Muhammad Sarwar (-sarwar), Ali Quli Qarai (-qarai), and SV Mir Ahmed Ali (-ahmedali)');
                    translationName = '';
                    break;
                }
              }
              var verses = message.content.substring(9).split(' ')[0]; //get numbers
              var surahNum = parseInt(verses.split(':')[0], 10)-1; //get number before :, subtract one
          		var verseNum = parseInt(verses.split(':')[1], 10)-1; //after :
          		if(surahNum>=0&&surahNum<=113&&translationName!=''){ //make sure surahNum is in range of surahs, and that translation is valid
          			if(verseNum<puya[surahNum].length&&verseNum>=0){ //make sure verse num is in range of verses
          				result = translation['quran']['sura'][surahNum]['aya'][verseNum]['-text']; //get the text
          				//message.channel.send(translationName+' (Surah '+surahInfo[surahNum]['title']+': '+(verseNum+1)+'):\n'+'```'+result+'```', { split: true }); //send messages but split up if exceeding character limit
                  const quranEmbed = new Discord.RichEmbed()
                      .setColor('#00a34e')
                      .setAuthor(translationName+' - '+'Surah '+surahInfo[surahNum]['title']+' '+(surahNum+1)+':'+(verseNum+1))
                      .setDescription(result);
                  message.channel.send(quranEmbed);
                }else{
                  message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Sheikh Muhammad Sarwar): _enquran [surahNum]:[verseNum] {-translator}\nFor example, _enquran 45:32 -qarai\nThe available translations are Sheikh Muhammad Sarwar (-sarwar), Ali Quli Qarai (-qarai), and SV Mir Ahmed Ali (-ahmedali)');
          			}
          		}else{
                message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Sheikh Muhammad Sarwar): _enquran [surahNum]:[verseNum] {-translator}\nFor example, _enquran 45:32 -qarai\nThe available translations are Sheikh Muhammad Sarwar (-sarwar), Ali Quli Qarai (-qarai), and SV Mir Ahmed Ali (-ahmedali)');
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
                    message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Syed Zeeshan Haider Jawadir): _urquran [surahNum]:[verseNum] {-translator}\nFor example, _urquran 45:32 -jawadi\nThe available translations are Syed Zeeshan Haider Jawadi (-jawadi), Sheikh Muhammad Hussain Najafi (-najafi), and SV Mir Ahmed Ali (-ahmedali)');
                    translationName = '';
                    break;
                }
              }
              var verses = message.content.substring(9).split(' ')[0]; //get numbers
              var surahNum = parseInt(verses.split(':')[0], 10)-1; //get number before :, subtract one
      				var verseNum = parseInt(verses.split(':')[1], 10)-1; //after :
      				if(surahNum>=0&&surahNum<=113&&translationName!=''){ //make sure surahNum is in range of surahs, and that translation is valid
      					if(verseNum<puya[surahNum].length&&verseNum>=0){ //make sure verse num is in range of verses
      						result = translation['quran']['sura'][surahNum]['aya'][verseNum]['-text']; //get the text
      						//message.channel.send(translationName+' (Surah '+surahInfo[surahNum]['title']+': '+(verseNum+1)+'):\n'+'**```'+result+'```**', { split: true }); //send messages but split up if exceeding character limit
                  const quranEmbed = new Discord.RichEmbed()
                      .setColor('#00a34e')
                      .setAuthor(translationName+' - '+'سورة '+quran['quran']['sura'][surahNum]['-name']+'   '+arNumber((surahNum+1).toString())+': '+arNumber((verseNum+1).toString()))
                      .setDescription(result);
                  message.channel.send(quranEmbed);
                }else{
                  message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Syed Zeeshan Haider Jawadir): _urquran [surahNum]:[verseNum] {-translator}\nFor example, _urquran 45:32 -jawadi\nThe available translations are Syed Zeeshan Haider Jawadi (-jawadi), Sheikh Muhammad Hussain Najafi (-najafi), and SV Mir Ahmed Ali (-ahmedali)');
      					}
      				}else{
                message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Syed Zeeshan Haider Jawadir): _urquran [surahNum]:[verseNum] {-translator}\nFor example, _urquran 45:32 -jawadi\nThe available translations are Syed Zeeshan Haider Jawadi (-jawadi), Sheikh Muhammad Hussain Najafi (-najafi), and SV Mir Ahmed Ali (-ahmedali)');
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
                      message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Sheikh Naser Makarem Shirazi): _faquran [surahNum]:[verseNum] {-translator}\nFor example, _urquran 45:32 -ansarian\nThe available translations are Sheikh Naser Makarem Shirazi (-makarem), Sheikh Mohammad Sadeqi Tehrani (-tehrani), and Sheikh Hussain Ansarian (-ansarian)');
                      translationName = '';
                      break;
                  }
                }
                var verses = message.content.substring(9).split(' ')[0]; //get numbers
                var surahNum = parseInt(verses.split(':')[0], 10)-1; //get number before :, subtract one
        				var verseNum = parseInt(verses.split(':')[1], 10)-1; //after :
        				if(surahNum>=0&&surahNum<=113&&translationName!=''){ //make sure surahNum is in range of surahs, and that translation is valid
        					if(verseNum<puya[surahNum].length&&verseNum>=0){ //make sure verse num is in range of verses
        						result = translation['quran']['sura'][surahNum]['aya'][verseNum]['-text']; //get the text
        						//message.channel.send(translationName+' (Surah '+surahInfo[surahNum]['title']+': '+(verseNum+1)+'):\n'+'**```\n'+result+'```**', { split: true }); //send messages but split up if exceeding character limit
                    const quranEmbed = new Discord.RichEmbed()
                        .setColor('#00a34e')
                        .setAuthor(translationName+' - '+'سورة '+quran['quran']['sura'][surahNum]['-name']+'   '+arNumber((surahNum+1).toString())+': '+arNumber((verseNum+1).toString()))
                        .setDescription(result);
                    message.channel.send(quranEmbed);
                  }else{
                    message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Sheikh Naser Makarem Shirazi): _faquran [surahNum]:[verseNum] {-translator}\nFor example, _urquran 45:32 -ansarian\nThe available translations are Sheikh Naser Makarem Shirazi (-makarem), Sheikh Mohammad Sadeqi Tehrani (-tehrani), and Sheikh Hussain Ansarian (-ansarian)');
        					}
        				}else{
                  message.channel.send('Invalid Usage. Please use the command as follows (the default translation is by Sheikh Naser Makarem Shirazi): _faquran [surahNum]:[verseNum] {-translator}\nFor example, _urquran 45:32 -ansarian\nThe available translations are Sheikh Naser Makarem Shirazi (-makarem), Sheikh Mohammad Sadeqi Tehrani (-tehrani), and Sheikh Hussain Ansarian (-ansarian)');
        				}
                break;

            case 'help':case 'h': //help command
              message.channel.send('ShiaBot\'s commands are:\n_tafsir [surahNum]:[verseNum]\n_quran [surahNum]:[verseNum]\n_enquran [surahNum]:[verseNum] {-translator}\n_urquran [surahNum]:[verseNum] {-translator}\n_faquran [surahNum]:[verseNum] {-translator}\n... and it will reply to your Salam!');
              break;

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

client.login(auth.token);
