"use strict";

const headers = require('./headersCORS');
const rabbitPromise = require('./rabbitMQ');

exports.handler = async (event, context) => {

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'OK' }) }; 
  }

  try {
    const channel = await rabbitPromise();
    const request = {
      method: "INSERT",
      body: JSON.parse(event.body)
    };

    console.log("Enviando mensaje a RabbitMQ:", request); 

    await channel.sendToQueue("bookstore", Buffer.from(JSON.stringify(request)));

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ message: 'Mensaje enviado a RabbitMQ con éxito' }) 
    };
  } catch (error) {
    console.log("Error al enviar mensaje a RabbitMQ:", error);
    return { 
      statusCode: 422, 
      headers, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
