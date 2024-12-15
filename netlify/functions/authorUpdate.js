"use strict";

const headers = require('./headersCORS');
const rabbitPromise = require('./rabbitMQ');

exports.handler = async (event, context) => {

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'OK' }) };
  }

  try {
    const id = event.path.split("/").reverse()[0];

    const channel = await rabbitPromise();
    const request = `{'method':'UPDATE','id':'${id}','body':${event.body}}`;
    await channel.sendToQueue("authors", Buffer.from(request));

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Petición de actualización enviada exitosamente' }) };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify({ error: error.message }) };
  }
};
