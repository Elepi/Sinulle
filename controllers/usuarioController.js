//Importar los módulos requeridos
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");
const { validationResult } = require("express-validator");

//Cargar el formulario de creación de una cuenta de usuario
exports.formularioCrearCuenta = (req, res, next) =>{
    res.render("registrarse", { layout: "main" });
}

//Procesar el formulario de creación de cuenta 
exports.crearCuenta = async (req, res, next) => {
    //Verificar que no existan errores de validación
    const errores = validationResult(req);
    const erroresArray = [];
    //Si hay errores
    if(!errores.isEmpty()) {
        //Utilizar la funcion map para navegar dentro de un arreglo
        errores.array().map(error => erroresArray.push(error.msg));

        console.log(erroresArray);

        //\Agregar los errores a nuestros mensajes flash 
        req.flash("error", erroresArray);

        res.render("registrarse", {
            layout: "auth",
            messages: req.flash()
        });
    }

    //Crear el usuario
    const { nombre, email, password } = req.body;

    // //Intentar almacenar los datos del usuario
    try {
        //Crear el usuario
        await Usuario.create({
            email,
            password,
            nombre
        });
        res.redirect("/iniciar-sesion");
    } catch (error) {
        console.log(error);
    }
}

//Renderizar la vista de formulario de inicio de sesión
exports.formularioIniciarSesion = (req, res, next) => {
    res.render("iniciarSesion", { layout: "main" });
}
