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
    const id = event.path.split('/').pop(); 

    if (!ObjectId.isValid(id)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'ID de autor no válido' })
      };
    }

    const data = JSON.parse(event.body); 
    console.log("Datos recibidos para actualizar:", data);

    // Realizar la actualización
    const result = await client.db("bookstore").collection("authors").updateOne(
      { _id: new ObjectId(id) }, 
      { $set: data }
    );

    if (result.modifiedCount === 0) {
      return { 
        statusCode: 404, 
        headers, 
        body: JSON.stringify({ message: 'No se encontró el autor con ese ID.' }) 
      };
    }

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ message: 'Autor actualizado exitosamente', modifiedCount: result.modifiedCount }) 
    };

  } catch (error) {
    console.log("Error en la actualización del autor:", error);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ message: 'Error al actualizar el autor', error: error.message }) 
    };
  }
};
    