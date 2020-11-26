  
// Importar los módulos requeridos
const mongoose = require("mongoose");
//const shortid = require("shortid");

// Definición del schema
const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    imagen: String,
  }
});
//Hooks 



// Generar un índice para mejorar la búsqueda por el nombre del servicio
//servicioSchema.index({ nombre: "text" });

module.exports = mongoose.model("Servicios", servicioSchema);