const rabbitPromise = require('./rabbitMQ');
const headers = require('./headersCORS');

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'OK' }) };
  }

  try {
    const channel = await rabbitPromise();
    const request = `{'method':'INSERT','body':${event.body}}`; 
    await channel.sendToQueue("publishers", Buffer.from(request), { persistent: true }); 

    console.log("Mensaje enviado a RabbitMQ");

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Publisher insertado exitosamente' }) };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify({ error: error.message }) };
  }
};
