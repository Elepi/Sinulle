// Importar los módulos requeridos
const mongoose = require("mongoose");
const Servicio = mongoose.model("Servicios");
const { validationResult } = require("express-validator");
//const multer = require("multer");
//const shortid = require("shortid");



// Mostrar el formulario de creación de servicio
exports.formularioCrearServicio= (req, res, next) => {
  res.render("crearServicio", {  layout: "main" }
  );
};



// Crear un servicio

exports.crearServicio = async (req, res, next) => {
    //Verificar que no existan errores de validación
    const errores = validationResult(req);
    const messages = [];

    //Obtener variables del body
    const { nombre } = req.body;

    //Si hay errores
    if(!errores.isEmpty()) {
        //Utilizar la funcion map para navegar dentro de un arreglo
        errores.array().map((error) => 
        messages.push({ message: error.msg, alertType: "danger" })

        );

        //Agregar los errores a nuestros mensajes flash 
        req.flash("messages", messages);

        res.redirect("/crear-servicio");
    }
    else {
         //Intentar almacenar los datos del servicio
    try {
        //Crear el Servicio
        await Servicio.create({
            
            nombre
        });
         // Mostrar un mensaje luego de registrarse existosamente
         messages.push({ message: "Servicio creado satisfactoriamente.", alertType: "success" });
         req.flash("messages", messages);
         res.redirect("/iniciar-sesion");
        } catch (error) {
            messages.push({
                message: error,
                alertType: "danger",
              });
              req.flash("messages", messages);
              res.redirect("/crear-servicio");
        }
    } 
};

