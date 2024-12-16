"use strict";

const rabbitPromise = require('./rabbitMQ');
const headers = require('./headersCORS');
const url = 'https://bookstore-rabbitmq.netlify.app/.netlify/functions/';

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    const channel = await rabbitPromise();
    const queue = 'bookstore'; 


    await channel.assertQueue(queue, { durable: true });

    console.log(`Esperando mensajes en la cola ${queue}...`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const request = JSON.parse(msg.content.toString());

        switch (request.method) {
          case "DELETE":
            await fetch(`${url}publisherDeleteBatch/${request.id}`, {
              method: "DELETE",
              headers: { "Content-type": "application/json" }
            });
            break;
          case "UPDATE":
            await fetch(`${url}publisherUpdateBatch/${request.id}`, {
              method: "PUT",
              headers: { "Content-type": "application/json" },
              body: JSON.stringify(request.body)
            });
            break;
          case "INSERT":
            await fetch(`${url}publisherInsertBatch`, {
              method: "POST",
              headers: { "Content-type": "application/json" },
              body: JSON.stringify(request.body)
            });
            break;
        }

        
        channel.ack(msg);
      }
    });

    return { statusCode: 200, headers, body: 'OK' };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify(error) };
  }
};
