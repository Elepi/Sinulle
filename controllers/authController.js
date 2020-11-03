const passport = require("passport");
const mongoose = require("mongoose");
const Usuario= mongoose.model("Usuarios");

exports.autenticarUsuario = passport.authenticate("local",
{
    successRedirect: "/administrar",
    failureRedirect: "/iniciar-sesion",
    failureFlash: true,
    badRequestMessage: ["Debes ingresar sus credenciales"],
});

