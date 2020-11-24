const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    
    direcciones: [String],

    servicio: {
        type: mongoose.Schema.ObjectId,
        ref: "Servicio",
      },



    tipoUsuario: String,  
    token: String,
    expira: Date,
    gravatar: String,
    activo: Boolean,
    fechaRegistro: Date
});

//Hooks hash para el password, combinación de hash y salt 
usuarioSchema.pre("save", function(next) {
    const user = this;

    //Si el password fue modificado
    if(!user.isModified("password")) {
        return next();
    }

    //Generar salt, sino da error en su generación se genera el hash también.
    bcrypt.genSalt(10, (err, salt) => {
        //Si existe error, continuar
        if(err) return next(err);

        //Si se genera el salt, generar el hash
        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) return next(err);

            /// Se almacena el hash en password
            user.password = hash;
            next();
        });
    });
});

//Hooks para agregar al usuario los campos de activo y fecha de su registro
usuarioSchema.pre("save", function(next) {
    const user = this;
    user.activo = true;
    user.fechaRegistro = Date.now();
    next();
});

//Hooks para acceder a los errores de MongoDB (unique key)
usuarioSchema.post("save", function(err, doc, next) {
    //Verificar si ocurrió un error al momento de almacenar
    if(err.name == "MongoError" && err.code == 11000) {
        next("Ya existe el usuario con las dirección de correo electrónico ingresada");
    } else {
        next(err);
    }
});

//Método que verifica el password candidato del login con el que está almacenado
//en la BD
usuarioSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    // return new Promise((resolve, reject) => {
    //     bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
    //         //Promesa incumplida
    //         if(err) return reject(err);
    //         //Promesa cumplida
    //         if(!isMatch) return reject(err);
    //         resolve(true);
    //     });
    // }).catch(console.log("Error al momento de comparar las contraseñas"));
    return bcrypt.compareSync(candidatePassword, user.password);
};

module.exports = mongoose.model("Usuarios", usuarioSchema);