"use strict"

const clientPromise = require('./mongoDB');
const headers = require('./headersCORS');
const { ObjectId } = require('mongodb'); 

exports.handler = async (event, context) => {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'CORS OK' }) };
    }
  
    try {
      const client = await clientPromise;
      const id = new ObjectId(event.path.split("/").reverse()[0]); 
      const data = JSON.parse(event.body); 
  
      delete data._id;
  
      console.log("Datos recibidos para actualizar publisher:", data);
  
      const result = await client.db("bookstore").collection("publishers").updateOne(
        { _id: id }, 
        { $set: data }
      );
  
      if (result.modifiedCount === 0) {
        return { 
          statusCode: 404, 
          headers, 
          body: JSON.stringify({ message: 'No se encontró el publisher con ese ID.' }) 
        };
      }
  
      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify({ message: 'Publisher actualizado exitosamente', modifiedCount: result.modifiedCount }) 
      };
  
    } catch (error) {
      console.log("Error en la actualización del publisher:", error);
      return { 
        statusCode: 500, 
        headers, 
        body: JSON.stringify({ message: 'Error al actualizar el publisher', error: error.message }) 
      };
    }
  };
  
