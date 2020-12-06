// Importar los módulos requeridos
const mongoose = require("mongoose");
const Servicio = mongoose.model("Servicio");
const { validationResult } = require("express-validator");
const multer = require("multer");



// Mostrar el formulario de creación de Servicio
exports.formularioCrearServicio = (req, res, next) => {
    //Obtener el rol del usuario loggeado
    var logincliente = false;
    var logincolaborador = false;
    var loginadmin = false;
    var notlogin = false;
    var rol, nombre; 
    if(req.isAuthenticated()) {
      rol = req.user.tipoUsuario;
      nombre = req.user.nombre;
      if(rol == "cliente") {
        logincliente = true;
      }
    }
    if(req.isAuthenticated()) {
      rol = req.user.tipoUsuario;
      nombre = req.user.nombre;
      if(rol == "colaborador") {
        logincolaborador = true;
      }
    }
    if(req.isAuthenticated()) {
      rol = req.user.tipoUsuario;
      nombre = req.user.nombre;
      if(rol == "admin") {
        loginadmin = true;
      }
    }
    // else {
    //   logincliente = false;
    //   logincolaborador = false;
    // }
    if(req.isAuthenticated() != true) {
      notlogin = true;
    }
  res.render("crearServicio", {  
    layout: "main",
    logincliente, logincolaborador, loginadmin, notlogin, nombre }
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


exports.listarServicios = async (req, res, next) => {
  // Obtener todos los servicios disponibles
  const servicios = await Servicio.find().lean();

  res.render("listar_servicios", { servicios });
};








