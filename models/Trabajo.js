const mongoose = require("mongoose");
//const bcrypt = require("bcryptjs");

const trabajoSchema = new mongoose.Schema({

    
      colaborador: {
        type: mongoose.Schema.ObjectId,
        ref: "Usuarios",  
    //required: true,
      },
    
    fechaCreación: Date,
    imagenes: [String],


    });

    trabajoSchema.pre("save", function(next){
      this.fechaCreación = Date.now();

      next();

    });
    
      module.exports = mongoose.model("Trabajos", trabajoSchema);