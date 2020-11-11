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
    const messages = [];

    //Obtener variables del body
    const { nombre, email, password } = req.body;

    //Si hay errores
    if(!errores.isEmpty()) {
        //Utilizar la funcion map para navegar dentro de un arreglo
        errores.array().map((error) => 
        messages.push({ message: error.msg, alertType: "danger" })

        );

        //Agregar los errores a nuestros mensajes flash 
        req.flash("messages", messages);

        res.redirect("/crear-cuenta");
    }
    else {
         //Intentar almacenar los datos del usuario
    try {
        //Crear el usuario
        await Usuario.create({
            email,
            password,
            nombre
        });
         // Mostrar un mensaje luego de registrarse existosamente
         messages.messages.push({ message: "Usuario creado satisfactoriamente.", alertType: "success" });
         req.flash("error", messages);
         res.redirect("/iniciar-sesion");
        } catch (error) {
        console.log(error);
        }
    } 
};

//Renderizar la vista de formulario de inicio de sesión
exports.formularioIniciarSesion = (req, res, next) => {
    res.render("iniciarSesion", { 
        layout: "main",
        messages: req.flash(),
        });
};
