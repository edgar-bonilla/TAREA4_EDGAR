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
    
    const id = event.path.split("/").reverse()[0];
    
  
    const objectId = new ObjectId(id);

    console.log(`Eliminando autor con _id: ${objectId}`);

    const result = await client.db("bookstore").collection("authors").deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Autor no encontrado' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Autor eliminado exitosamente' })
    };
    
  } catch (error) {
    console.log("Error al eliminar el autor:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error al eliminar el autor', error: error.message })
    };
  }
};
