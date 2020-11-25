  
// Importar los módulos requeridos
const mongoose = require("mongoose");
//const shortid = require("shortid");

// Definición del schema
const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  }
});
//Hooks para agregar al usuario los campos de activo y fecha de su registro
servicioSchema.pre("save", function (next) {
    const user = this;
    user.activo = true;
    user.fechaRegistro = Date.now();
    next();
});



//Hooks para acceder a los errores de MongoDB (unique key)
servicioSchema.post("save", function(err, doc, next) {
    //Verificar si ocurrió un error al momento de almacenar
    if(err.name == "MongoError" && err.code == 11000) {
        next("Ya existe el usuario con las dirección de correo electrónico ingresada");
    } else {
        next(err);
    }
});





// Generar un índice para mejorar la búsqueda por el nombre del servicio
servicioSchema.index({ nombre: "text" });

module.exports = mongoose.model("Servicio", servicioSchema);