"use strict";

const amqp = require('amqplib');

module.exports = async () => {
  try {
    const conn = await amqp.connect(process.env.CLOUDAMQP_URL);
    const channel = await conn.createChannel();
    console.log("Conectado exitosamente a RabbitMQ");
    return channel;
  } catch (error) {
    console.error("Error de conexión con RabbitMQ:", error);
    throw error;
  }
};
