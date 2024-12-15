"use strict";

const clientPromise = require('./mongoDB');
const headers = require('./headersCORS');
const { ObjectId } = require('mongodb'); 

exports.handler = async (event, context) => {
  
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ message: 'CORS OK' }) };
  }

  try {
    const client = await clientPromise;
    const data = JSON.parse(event.body);  

    if (!data._id) {
      data._id = new ObjectId();
    } else {
      data._id = new ObjectId(data._id); 
    }

    console.log("Datos a insertar:", data);

    const result = await client.db("bookstore").collection("authors").insertOne(data);
    
    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ 
        message: 'Autor insertado exitosamente', 
        insertedId: result.insertedId 
      }) 
    };

  } catch (error) {
    console.log("Error en la inserción del autor:", error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ 
        message: 'Error al insertar el autor', 
        error: error.message 
      }) 
    };
  }
};
