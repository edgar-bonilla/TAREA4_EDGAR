const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;  
const options = {
  serverSelectionTimeoutMS: 30000,  
};

let client;

const clientPromise = MongoClient.connect(uri, options).then(client => {
  console.log('Conectado a MongoDB');
  return client;
}).catch(err => {
  console.error('Error de conexión a MongoDB:', err);
  throw err;  
});

module.exports = clientPromise;
