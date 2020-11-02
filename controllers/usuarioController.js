//Importar los módulos requeridos
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");

//Cargar el formulario de creación de una cuenta de usuario
exports.formularioCrearCuenta = (req, res, next) =>{
    res.render("registrarse", { layout: "auth" });
}

//Procesar el formulario de creación de cuenta 
exports.crearCuenta = async (req, res, next) => {
    const { nombre, email, password } = req.body;

    // //Intentar almacenar los datos del usuario
    try {
        //Crear el usuario
        await Usuario.create({
            email,
            password,
            nombre
        });
        // res.redirect("/iniciar-sesion");
    } catch (error) {
        console.log(error);
    }
}
