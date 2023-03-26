////////// modules
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const { updateUser } = require('./db');
const { checkUser } = require('./db');
const { getUserMessages } = require('./db'); 
const { resetUserMessages } = require('./db');
const { getusersID } = require('./notifyusers');
//////////end of modules

////////// Telegram variables
const TelegramBot = require('node-telegram-bot-api');
const token ='TELEGRAM TOKEN';                  // <============== TELEGRAM TOKEN
const bot = new TelegramBot(token,{polling:{
    interval:300,
    params:{
        timeout:10
    }
}});
////////// End of telegram variables

//////////////// OpenAI API
const { Configuration, OpenAIApi } = require("openai");
const OPENAI_API_KEY = 'OPENAI TOKEN';                 // <============== OPENAI TOKEN
const configuration = new Configuration({
    organization:'OPENAI ORGANIZATION',                 // <============== OPENAI ORGANIZATION
    apiKey: OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);
//////////////// OpenAI API

//////////////// Mongodb


//////////////// Mongodb

//////////////// global vars
const messageforuser = "User: Hi, I'm having trouble understanding how to use your chatbot. Can you help me?\n\nChatbot: Hello! Of course, I'd be happy to help. What can I assist you with?\n\nUser: I'm not sure how to start a conversation with you. Do I just say anything, or is there a specific way to ask questions?\n\nChatbot: You can ask me anything you'd like. I'm programmed to understand natural language, so feel free to phrase your questions or statements however you'd like. Just keep in mind that I'm here to assist with information or tasks related to my expertise.";
const infotext = 'What this bot can:\n\nanswer for your messages\n\ngenerate image by using /image "your text" command\n\nSpeech to text and send as request --- coming soon.';
const mentionRegex = new RegExp(`@YOURBOTHASH`, 'i'); // <==========YOURBOTHASH
const ImageReg = /^\/image/;
let usersList ={
    1:{name:"test","messages":[]},
};
const donateAdress = 'crypto eth for everyone :) 0x7F23e289A9a8120Ea1bB2cCC71d388a415B6E4A5';
const qiwiadress ='Qiwi for RUB - qiwi.com/p/79609614863 ';
const privatbankUA = 'PrivatBank for UAH - 4731185610368521';
const Revolut = 'for USD - 4731185610882851\n\nfor EUR - 4731185614196258'
const donatetext = 'Thank you for using that bot. This is a test work of the bot. The bot may not work at times, I try to restart it and work on fixing bugs.Donations can be great ways to support this project in the form of a telegram bot that uses the chatgpt neural network. ways to support me:';
const msgreceived = 'The message has been received. Please wait…\n\nThanks for using me and donates.';
//////////////// global vars

//////////////// Functions
async function createTimer(userId){
    const user ='id:' + userId + '';
    return console.time(user);
}
async function StopTimer(userId){
    const user ='id:' + userId + '';
    return console.timeEnd(user);
}
function logInfo() {
    console.log('\n\n////////// START LOG INFO ////////////////');
    console.log(arguments);
    console.log('////////// END LOG INFO /////////////////');
}
//////////////// Functions


//////////////// Main code
////сделать задержку ввода
//// Диалоговая память --- DONE
////добавить mongodb --- DONE
////время работы кода --- DONE
//// Обработка войсов в текст
//// текст в изображение --- DONE
//// Обновить таймер по возможности
////  добавить команду cleardialogue
//// добавить отравку сообщения что запрос принят --- DONE
//// добавить кнопку отключения сообщения об отправке
//// изменять сообщения от бота вместо того чтобы отправлять новое --- DONE
//// добавить каждые 7 сообщений оповещение о донате --- BAD IDEA
//// предложить выбирать язык
//// Добавить другие нейронные сети к боту
//// добавить функции
//// изменить обнуление на обновление до последних 5 сообщений --- DONE
//// сделать чтоб в группе можно было реплаить сообщения

bot.setMyCommands([
    {command: '/start', description: 'start bot'},
    {command: '/info', description: 'info about bot'},
    {command: '/image', description: 'create image by description. /image "description". Just write without "". it may not work correctly.'},
    {command: '/donate', description: 'Support our project'}
]);
 try {
bot.on('message',async (msg)=>{
    const prompt = msg.text;
    const chatId = msg.chat.id;
    // console.time('code time' + msg.chat.id);
    //// проверка это лс или группа если группа то сообщения только через @
    if(prompt && msg.chat.type ==='private'){
        if(prompt === '/start'){

            ///// /start
            bot.sendMessage(chatId, messageforuser);
            checkUser(chatId,msg.chat.first_name,msg.chat.last_name,msg.chat.username,msg.chat.type);
            logInfo(msg.chat,msg.text,messageforuser,usersList);
            // const sentMessage = await bot.sendMessage(chatId,"choose language :",{reply_markup: {
            //     inline_keyboard: [
            //       [{ text: 'ENG🇬🇧', callback_data: 'button1' }],
            //       [{ text: 'RUS🇷🇺', callback_data: 'button2' }],
            //       [{ text: 'ESP🇪🇸', callback_data: 'button3' }],
            //       [{ text: 'UA🇺🇦', callback_data: 'button4' }],
            //     ],
            //   }});
            if(chatId === 412636373){
                const messages = ["Dear ChatGPT Rabbit users,\n\nWe would like to bring to your attention that our project may be discontinued soon due to lack of funding, and the free period of API usage is coming to an end. If you value our project and wish to help its further development, we would be grateful for any support.\n\nYou can make a donation at this link https://t.me/GPTJokes1/10.\n\nThank you in advance for your support, and we hope that your experience using our bot has been helpful to you. If you have any questions or comments, please do not hesitate to contact us.\n\nBest regards,\nChatGPT Rabbit team\n\n\n\nУважаемые пользователи проекта ChatGPT Rabbit!\n\nХотим обратить ваше внимание на то, что наш проект может быть прекращен из-за отсутствия финансирования, и бесплатный период использования API скоро закончится. Если вы цените наш проект и желаете помочь в его развитии, мы будем признательны за любую поддержку.\n\nВы можете сделать пожертвование по этой ссылке https://t.me/GPTJokes1/10.\n\nЗаранее благодарим за вашу поддержку, и мы надеемся, что использование нашего бота ChatGPT Rabbit было полезно для вас. Если у вас есть вопросы или замечания, пожалуйста, не стесняйтесь обратиться к нам.\n\nС уважением,\nкоманда проекта ChatGPT Rabbit"];
                const lebowski = ["Where's the Money, Lebowski?"];
                const ids = await getusersID();
                const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

                    async function sendMessages(chatId, messages) {
                    let sentMessagesCount = 0;

                    for (let i = 0; i < messages.length; i++) {
                        const message = lebowski[i];

                        // отправляем сообщения по частям, ограничивая их количество сообщений для отправки в указанный интервал времени
                        if (sentMessagesCount === 30) { // интервал 30 сообщений в минуту
                        await delay(60 * 1000); // 1 минута задержки между отправкой сообщений
                        sentMessagesCount = 0;
                        }

                        await bot.sendMessage(chatId, message);;
                        sentMessagesCount++;
                    }
                    }

                    async function sendNotification(usersIds, messages) {
                    for (let i = 0; i < usersIds.length; i++) {
                        const userId = usersIds[i];
                        try {
                        console.log(`Сообщение для ${userId} отправлено`);
                        await sendMessages(userId, messages);
                        } catch (error) {
                        console.error(`Ошибка отправки сообщения для ${userId}: ${error}`);
                        }
                    }
                    }

                    await sendNotification();

            }
            bot.on('callback_query', async (query) => {
                const buttonId = query.data;
              
                if (buttonId === 'button1') {
                    createTimer(msg.chat.id);
                    checkUser(chatId,msg.chat.first_name,msg.chat.last_name,msg.chat.username,msg.chat.type);
                    const lang = 'hello';
                    await updateUser(chatId,lang,'user');
                    const usermessages = await getUserMessages(chatId);
                    await bot.editMessageText(msgreceived, {
                        chat_id: chatId,
                        message_id: sentMessage.message_id
                      });
                    const completion = await openai.createChatCompletion({
                        model: "gpt-3.5-turbo",
                        messages: usermessages,
                        max_tokens: 1000,
                      });
                    const answer = completion.data.choices[0].message.content;
                    await bot.editMessageText(answer, {
                        chat_id: chatId,
                        message_id: sentMessage.message_id
                      });
                    await updateUser(chatId,answer,'assistant');
                } else if (buttonId === 'button2') {
                    createTimer(msg.chat.id);
                    checkUser(chatId,msg.chat.first_name,msg.chat.last_name,msg.chat.username,msg.chat.type);
                    const lang = 'Привет';
                    await updateUser(chatId,lang,'user');
                    const usermessages = await getUserMessages(chatId);
                    await bot.editMessageText(msgreceived, {
                        chat_id: chatId,
                        message_id: sentMessage.message_id
                      });
                    const completion = await openai.createChatCompletion({
                        model: "gpt-3.5-turbo",
                        messages: usermessages,
                        max_tokens: 1000,
                      });
                    const answer = completion.data.choices[0].message.content;
                    await bot.editMessageText(answer, {
                        chat_id: chatId,
                        message_id: sentMessage.message_id
                      });
                    await updateUser(chatId,answer,'assistant');
                }else if (buttonId === 'button3') {
                    createTimer(msg.chat.id);
                    checkUser(chatId,msg.chat.first_name,msg.chat.last_name,msg.chat.username,msg.chat.type);
                    const lang = 'Hola';
                    await updateUser(chatId,lang,'user');
                    const usermessages = await getUserMessages(chatId);
                    await bot.editMessageText(msgreceived, {
                        chat_id: chatId,
                        message_id: sentMessage.message_id
                      });
                    const completion = await openai.createChatCompletion({
                        model: "gpt-3.5-turbo",
                        messages: usermessages,
                        max_tokens: 1000,
                      });
                    const answer = completion.data.choices[0].message.content;
                    await bot.editMessageText(answer, {
                        chat_id: chatId,
                        message_id: sentMessage.message_id
                      });
                    await updateUser(chatId,answer,'assistant');
                }else if (buttonId === 'button4') {
                    createTimer(msg.chat.id);
                    checkUser(chatId,msg.chat.first_name,msg.chat.last_name,msg.chat.username,msg.chat.type);
                    const lang = 'Привіт';
                    await updateUser(chatId,lang,'user');
                    const usermessages = await getUserMessages(chatId);
                    await bot.editMessageText(msgreceived, {
                        chat_id: chatId,
                        message_id: sentMessage.message_id
                      });
                    const completion = await openai.createChatCompletion({
                        model: "gpt-3.5-turbo",
                        messages: usermessages,
                        max_tokens: 1000,
                      });
                    const answer = completion.data.choices[0].message.content;
                    await bot.editMessageText(answer, {
                        chat_id: chatId,
                        message_id: sentMessage.message_id
                      });
                    await updateUser(chatId,answer,'assistant');
                }
              });
            ///// /start
        }else if(prompt === '/info') {

            ///// /info
            bot.sendMessage(chatId, infotext);
            checkUser(chatId,msg.chat.first_name,msg.chat.last_name,msg.chat.username,msg.chat.type);
            logInfo(msg.chat,msg.text,infotext,usersList);

            ///// /info
        }else if(prompt === '/donate') {

            ///// /donate
            bot.sendMessage(chatId,donatetext);
            bot.sendMessage(chatId,donateAdress);
            bot.sendMessage(chatId,qiwiadress);
            bot.sendMessage(chatId,privatbankUA);
            bot.sendMessage(chatId,Revolut);
            checkUser(chatId,msg.chat.first_name,msg.chat.last_name,msg.chat.username,msg.chat.type);
            logInfo(msg.chat,msg.text,infotext,usersList);

            ///// /donate
        }else if(prompt && ImageReg.test(prompt)) {       ///// /image  
            try { 
                createTimer(msg.chat.id);
                const withoutImg = msg.text.replace(/\/image/g, "").trim();
                console.log(withoutImg);
                checkUser(chatId,msg.chat.first_name,msg.chat.last_name,msg.chat.username,msg.chat.type);
                bot.sendMessage(chatId,msgreceived);
                await updateUser(chatId,withoutImg,'user');
                const response = await openai.createImage({
                    prompt: withoutImg,
                    n: 1,
                    size: "512x512",
                  });
                const image_url = response.data.data[0].url;            
                bot.sendMessage(chatId,image_url);    
            } catch (error) {
                bot.sendMessage(chatId,'Bad request. Wait and try again'); 
                await resetUserMessages(chatId);
                console.log(await getUserMessages(chatId));
            }
        }else{                                  //// private message block   
            try{                    
                createTimer(msg.chat.id);
                checkUser(chatId,msg.chat.first_name,msg.chat.last_name,msg.chat.username,msg.chat.type);
                await updateUser(chatId,prompt,'user');
                const usermessages = await getUserMessages(chatId);
                const sentMessage = await bot.sendMessage(chatId,msgreceived);
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: usermessages,
                    max_tokens: 1000,
                  });
                const answer = completion.data.choices[0].message.content;
                await updateUser(chatId,answer,'assistant');
                await bot.editMessageText(answer, {
                    chat_id: chatId,
                    message_id: sentMessage.message_id
                  });
                ///// log info
             
                logInfo(completion.headers.date,chatId,msg.chat.first_name,completion.data.choices[0].message);                
                ///// log info
                ///// answer to chat
                
                ///// answer to chat
                StopTimer(msg.chat.id);
            }catch(error){
                console.log('An error occurred:',chatId,msg.chat.first_name);
                bot.sendMessage(chatId,'Some error.Your message history has been updated to the last 5 messages. You may continue your conversation with ChatGPT.');
                resetUserMessages(chatId);
                console.log(await getUserMessages(chatId));
            }                        //// private message block
        }
    }else if(msg.chat.type === 'group' || msg.chat.type === 'supergroup'){
        if (mentionRegex.test(msg.text)){

            if(msg.chat.title ==='для теста ботов'){
                const messagetext = msg.text.replace(mentionRegex, '').trim();
                createTimer(msg.chat.id);
                await checkUser(chatId,msg.chat.title,undefined,undefined,msg.chat.type);
                await updateUser(chatId,messagetext,'user');
                const usermessages = await getUserMessages(chatId);
                console.log(usermessages);
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages:usermessages,
                    max_tokens: 1000,
                  });
                const answer = completion.data.choices[0].message.content;
                bot.sendMessage(chatId,answer);
                await updateUser(chatId,answer,'assistant');
                console.log(await getUserMessages(chatId));
                
                logInfo(completion.headers.date,chatId,completion.data.choices[0].message); 
                StopTimer(chatId);
            }else{
                try{
                    const messagetext = msg.text.replace(mentionRegex, '').trim();
                    if(ImageReg.test(messagetext)){
                        createTimer(msg.chat.id);
                        const withoutImg = messagetext.replace(/\/image/g, "").trim();
                        await checkUser(chatId,msg.chat.title,undefined,undefined,msg.chat.type);
                        await updateUser(chatId,withoutImg,'user');
                        bot.sendMessage(chatId,'The message has been received. Please wait… images sometimes could not sends');
                        const response = await openai.createImage({
                            prompt: withoutImg,
                            n: 1,
                            size: "512x512",
                          });
                          const image_url = response.data.data[0].url;            
                          bot.sendMessage(chatId,image_url);
                        StopTimer(msg.chat.id);
                    }else{                       
                        createTimer(msg.chat.id);
                        await checkUser(chatId,msg.chat.title,undefined,undefined,msg.chat.type);
                        await updateUser(chatId,messagetext,'user');
                        const usermessages = await getUserMessages(chatId);
                        const sentMessage = await bot.sendMessage(chatId,msgreceived);

                        const completion = await openai.createChatCompletion({
                            model: "gpt-3.5-turbo",
                            messages:usermessages,
                            max_tokens: 1000,
                          });
                        const answer = completion.data.choices[0].message.content;
                        await updateUser(chatId,answer,'assistant');
                        await bot.editMessageText(answer, {
                            chat_id: chatId,
                            message_id: sentMessage.message_id
                          });
                        ///// log info
                        logInfo(completion.headers.date,msg.chat.title,completion.data.choices[0].message); 
                        
                        ///// log info
                        ///// answer to chat
                        
                        StopTimer(msg.chat.id);
                        //answer to chat
                    }

                }catch(error){
                    console.log('An error occurred:',chatId,msg.chat.first_name);
                    console.log(await getUserMessages(chatId));
                    bot.sendMessage(chatId,'Some error.Your message history has been updated to the last 5 messages. You may continue your conversation with ChatGPT.');
                    resetUserMessages(chatId); 
                    ///const usererror ='userID_' + msg.chat.id + '.txt';
                } 
            }
        }
    }else{
        checkUser(chatId,msg.chat.first_name,msg.chat.last_name,msg.chat.username,msg.chat.type);
        bot.sendMessage(chatId,'I cant work with audio or image. It wiil be soon.');
        console.log(msg);
    }
    /* console.log(msg.text); */
});
} catch (error) {
    console.log('telegram api error');
    
}
//////////////// Main code
