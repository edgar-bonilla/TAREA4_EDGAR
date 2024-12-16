"use strict";

const clientPromise = require('./mongoDB');
const headers = require('./headersCORS');

exports.handler = async (event, context) => {


  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'CORS OK' }) };
  }

  try {
   
    const client = await clientPromise;

   
    const newPublisher = JSON.parse(event.body);  
    console.log("Datos recibidos para crear publisher:", newPublisher);

    if (!newPublisher.name || !newPublisher.address) {
      return { 
        statusCode: 400, 
        headers, 
        body: JSON.stringify({ message: 'Datos incompletos: name y address son obligatorios' }) 
      };
    }

  
    const result = await client.db("bookstore").collection("publishers").insertOne(newPublisher);

    return { 
      statusCode: 201, 
      headers, 
      body: JSON.stringify({ message: 'Publisher creado exitosamente', _id: result.insertedId }) 
    };

  } catch (error) {
    console.log("Error al crear el publisher:", error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ message: 'Error al crear el publisher', error: error.message }) 
    };
  }
};
