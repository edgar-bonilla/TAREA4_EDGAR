"use strict";

const headers = require('./headersCORS');
const rabbitPromise = require('./rabbitMQ');

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ message: 'OK' }) // Respuesta JSON válida
    };
  }

  try {
  
    const id = parseInt(event.path.split("/").reverse()[0]);

    const channel = await rabbitPromise();
    
    const request = JSON.stringify({ method: 'DELETE', id });
    
  
    await channel.sendToQueue("bookstore", Buffer.from(request));

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ message: 'OK' }) 
    };
  } catch (error) {
    console.log(error);
    
    return { 
      statusCode: 422, 
      headers, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
