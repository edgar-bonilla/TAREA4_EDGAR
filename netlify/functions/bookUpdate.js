"use strict";

const headers = require('./headersCORS');
const rabbitPromise = require('./rabbitMQ');

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ message: 'OK' }) 
    };
  }

  try {
    const id = parseInt(event.path.split("/").reverse()[0]);

    const channel = await rabbitPromise();
    
    const body = JSON.parse(event.body);
    
    const request = JSON.stringify({ method: 'UPDATE', id, body });
    
    await channel.sendToQueue("bookstore", Buffer.from(request));

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ message: 'OK' }) 
    };
  } catch (error) {
    console.log("Error:", error);
    
    return { 
      statusCode: 422, 
      headers, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
