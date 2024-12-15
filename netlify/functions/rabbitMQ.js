
const amqp = require('amqplib');


const rabbitPromise = async () => {
  const connection = await amqp.connect(process.env.CLOUDAMQP_URL); 
  const channel = await connection.createChannel();
  return channel; 
};

module.exports = rabbitPromise;
