const passport = require("passport");
const mongoose = require("mongoose");
const Usuario= mongoose.model("Usuarios");

//Autenticar
exports.autenticarUsuario = passport.authenticate("local",
{
    successRedirect: "/administrar",
    failureRedirect: "/iniciar-sesion",
    failureFlash: true,
    badRequestMessage: ["Debes ingresar sus credenciales"],
});

//Cerrar la sesion del usuario
exports.cerrarSesion = (req, res, next) => {
    //Cerrar la sesion 
    req.logout();

    req.flash("succes", ["Has cerrado correctamente tu sesón",]);

    return res.redirect("/iniciar-sesion");
}

//Mostrar el formulario de restablecer contraseña;
exports.formularioRestablecerPassword = (req, res, next) => {
    res.send("Formulario de restablecer contraseña");
}
