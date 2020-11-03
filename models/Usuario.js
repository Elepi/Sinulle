const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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


module.exports = mongoose.model("Usuarios", usuarioSchema);