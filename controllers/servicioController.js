// Importar los módulos requeridos
const mongoose = require("mongoose");
const Servicio = mongoose.model("Servicio");
const { validationResult } = require("express-validator");
const multer = require("multer");



// Mostrar el formulario de creación de Servicio
exports.formularioCrearServicio = (req, res, next) => {
  res.render("crearServicio", {  layout: "main" }
  );
};

// Crear un Servicio
exports.crearServicio = async (req, res, next) => {
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

    res.redirect("/crear-servicio");
  } else {
    // Almacenar los valores del servicio
    try {
      const { nombre } = req.body;
      const { imagen } = req.body;

      await Servicio.create({
        nombre,
      
        imagen,
        
      });

      messages.push({
        message: "¡Servicio agregado correctamente!",
        alertType: "success",
      });
      req.flash("messages", messages);

      res.redirect("/crear-servicio");
    } catch (error) {
      console.log(error);
      messages.push({
        message: error,
        alertType: "danger",
      });
      req.flash("messages", messages);
      res.redirect("/crear-servicio");
    }
  }
};






