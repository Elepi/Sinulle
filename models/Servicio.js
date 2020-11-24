  
// Importar los módulos requeridos
const mongoose = require("mongoose");
const shortid = require("shortid");

// Definición del schema
const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  }
});
// Hooks para generar la URL del servicio
servicioSchema.pre("save", function (next) {
  // Crear la URL
  const url = slug(this.nombre);
  this.url = `${url}-${shortid.generate()}`;

  next();
});

// Generar un índice para mejorar la búsqueda por el nombre del servicio
servicioSchema.index({ nombre: "text" });

module.exports = mongoose.model("Servicio", servicioSchema);