const mongoose = require("mongoose");
//const bcrypt = require("bcryptjs");

const ordenSchema = new mongoose.Schema({
 cliente:
      {
        type: mongoose.Schema.ObjectId,
        ref: "Usuarios", 
    //required: true,
      },
    
      colaborador: {
        type: mongoose.Schema.ObjectId,
        ref: "Usuarios",  
    //required: true,
      },
    
      servicio: String,
   
    direccion: String,
      
      fechaSolicitud: Date,

      //hora: String,

      descripcion:{
        type: String,
        //required: true,
        trim: true,
      },

});



module.exports = mongoose.model("Ordenes", ordenSchema);