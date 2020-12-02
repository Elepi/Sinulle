const mongoose = require("mongoose");
const Orden = mongoose.model("Ordenes");
const { validationResult } = require("express-validator");

exports.formularioCrearOrden =  (req, res, next) => {
    const usuario = req.user.nombre;
   const direcciones= req.user.direcciones;
    res.render("ordenServicio", {
      
        usuario,
   direcciones,
      
    });
}

exports.crearOrden = async (req, res, next) => {
    // Verificar que no existen errores de validación
    const errores = validationResult(req);
    const messages = [];
  
    // Si hay errores
    if (!errores.isEmpty()) {
      errores.array().map((error) => {
        messages.push({ message: error.msg, alertType: "danger" });
      });
  
      // Enviar los errores a través de flash messages
      req.flash("messages", messages);
  
      res.redirect("/crear-orden");
    } else {
      // Almacenar los valores del producto
      try {
        const {direccion, servicio, descripcion, fechaSolicitud} = req.body;
  
        await Orden.create({
            direccion,
         servicio, 
         descripcion,
         fechaSolicitud,
          cliente: req.user._id,
          colaborador: req.user._id,
        });
  
        messages.push({
          message: "¡Enviado  correctamente!",
          alertType: "success",
        });
        req.flash("messages", messages);
  
        res.redirect("/crear-orden");
      } catch (error) {
        console.log(error);
        messages.push({
          message: error,
          alertType: "danger",
        });
        req.flash("messages", messages);
        res.redirect("/crear-orden");
      }
    }
  };

