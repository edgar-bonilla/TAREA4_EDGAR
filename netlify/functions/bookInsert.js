"use strict";

const headers = require('./headersCORS');
const rabbitPromise = require('./rabbitMQ');

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'OK' }) }; // Respuesta válida en JSON
  }

  try {
    const channel = await rabbitPromise();
    const request = `{'method':'INSERT','body':${event.body}}`;
    await channel.sendToQueue("bookstore", Buffer.from(request));

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'OK' }) }; // Respuesta válida en JSON
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify({ error: error.message }) }; // Respuesta de error válida en JSON
  }
};
