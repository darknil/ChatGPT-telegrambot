//modules
const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017/mydatabase';
//modules
async function getusersID(command){
    const client = new MongoClient(url, { useUnifiedTopology: true });
    if(command){
        try {
            
            const database = client.db('mydatabase');
            const users = database.collection('users');
            const usersarr = await users.find().toArray();
            const ids = usersarr.map((user) => {
                const keys = Object.keys(user);
                const index = keys.findIndex(key => /^[0-9]+$/.test(key));
                return index !== -1 ? keys[index] : keys[1];
              });
            return ids;
        } catch (error) {
             console.log('error');
        }finally{
            await client.close();
        }
    }
}
getusersID(true);

module.exports = {
    getusersID
  };