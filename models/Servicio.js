  
// Importar los módulos requeridos
const mongoose = require("mongoose");
const multer = require("multer");
const slug = require("slug");
const shortid = require("shortid");
// Definición del schema
const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
   
  },

  imagen: {
    type: String,
    required: true,
    
  },
  url: {
    type: String,
    lowercase: true,
  },
  precio: Number,
});
// Hooks para generar la URL del servicio
servicioSchema.pre("save", function (next) {
  // Crear la URL
  const url = slug(this.nombre);
  this.url = `${url}-${shortid.generate()}`;
  next();
});



module.exports = mongoose.model("Servicio", servicioSchema);