//modules
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017/mydatabase';
//modules

//  Функция для проверки наличия пользователя по его идентификатору

async function checkUser(userId,first_name,last_name,username,type) {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    last_name = last_name || undefined;
    username = username || undefined;
    await client.connect();
    const database = client.db('mydatabase');
    const users = database.collection('users');
    const query = {};
    query[userId.toString()] = {
      $exists: true
    };
    const result = await users.findOne(query);
    if (result && result.hasOwnProperty(userId.toString())) {
      console.log('User exists:', result);
    } else {
      console.log('User not found');
      await addUser(userId,first_name,last_name,username,type,client);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

//  Функция для добавления нового пользователя в базу данных
async function addUser(userId,first_name,last_name,username,type,client) {
  try {
    const database = client.db('mydatabase');
    const users = database.collection('users');
    const Idnumber = userId;
    if(type === "private"){
      const newObject = {
        [Idnumber]: {
          "first_name": first_name,
          "last_name": last_name,
          "username": username,
          "type":type,
          "messages": []
        }
      };
      
      await users.insertOne(newObject);
      console.log("Объект успешно добавлен");
    }else{
      const newObject = {
        [Idnumber]: {
          "title": first_name,
          "type":type,
          "messages": []
        }
      };
      
      await users.insertOne(newObject);
      console.log("Объект успешно добавлен");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

// Функция для обновления полей у пользователя в базе данных

async function updateUser(userId, message, role) {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('mydatabase');
    const users = database.collection('users');
    const query = {};
    query[userId.toString()] = {
      $exists: true
    };
    const result = await users.findOne(query);
    if (result && role === "user" && result[userId] && result[userId].messages) {
      const newMessage = { role: 'user', content: message };
      const updatedMessages = [...result[userId].messages, newMessage].slice(-15);
      await users.updateOne(
        { _id: result._id },
        { $set: { [`${userId}.messages`]: updatedMessages } }
      );
      console.log(`Сообщение '${message}' успешно добавлено пользователю ${userId}`);
    } else {
      const newMessage = { role: 'assistant', content: message }; 
      await users.updateOne(
        query,
        { $push: { [`${userId}.messages`]: newMessage } }
      );
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

// Функция получения массива пользователя

async function getUserMessages(userId) {
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db('mydatabase');
    const users = database.collection('users');
    const query = {};
    query[userId.toString()] = {
      $exists: true
    };
    const result = await users.findOne(query);
    if (result && result[userId] && result[userId].messages) {
      return result[userId].messages;
    } else {
      console.log('Сообщения пользователя не найдены');
      return [{"role": "system", "content": "You are a helpful assistant."}];
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

// Функция обнуления массива сообщений

async function resetUserMessages(userId){
  const client = new MongoClient(url, { useUnifiedTopology: true });
  try{
    await client.connect();
    const database = client.db('mydatabase');
    const users = database.collection('users');
    const query = {};
    query[userId.toString()] = {
      $exists: true
    };
    const result = await users.findOne(query);
    if (result && result[userId] && result[userId].messages){
      const messages = result[userId].messages;
        const updatedMessages = messages.slice(Math.max(messages.length - 5, 0));
        /*
        о да, а ну давай этот массив сюда
        боже как я люблю массивы, нахуя человечество придумало какие то Stack
        когда есть прекрасные сквадратные скобочки [[[[[]]]]]
        */
      await users.updateOne(
        query,
        { $set: { [`${userId}.messages`]: updatedMessages } }
      );
      console.log(`Последние 5 сообщений пользователя ${userId} успешно сохранены`);
    }else{
      console.log('Сообщения пользователя не найдены');
    }
  }catch(err){

  }finally{
    await client.close();
  }
}
module.exports = {
  checkUser,
  addUser,
  updateUser,
  getUserMessages,
  resetUserMessages
};