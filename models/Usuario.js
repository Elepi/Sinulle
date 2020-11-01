const mongoose = require("mongoose");


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

module.exports = mongoose.model("Usuarios", usuarioSchema);