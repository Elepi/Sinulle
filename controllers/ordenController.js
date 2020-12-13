const mongoose = require("mongoose");
const Orden = mongoose.model("Ordenes");
const Servicio = mongoose.model("Servicio");
const Usuario = mongoose.model("Usuarios");
const { validationResult } = require("express-validator");

exports.formularioCrearOrden =  async(req, res, next) => {
    const usuario = req.user.nombre;
    const direcciones= req.user.direcciones;
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

 const servicio = await Servicio.findOne({ url: req.params.url }).lean();
 
//Mostrar colaborador segun el servicio
 const usuariocolaborador = await Usuario.find( {servicio:servicio}).populate("servicio").lean();
 
 //console.log(usuariocolaborador);
 
 

    res.render("ordenServicio", {
      servicio,
        usuario,
        direcciones,
        logincliente, logincolaborador, loginadmin, notlogin, nombre,
        usuariocolaborador,
        
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
        const {direccion, servicio, descripcion, fechaSolicitud,total, colaborador} = req.body;
  
        await Orden.create({
            direccion,
         servicio, 
         descripcion,
         total,
         fechaSolicitud,
          cliente: req.user._id,
          colaborador,
        });
  
        messages.push({
          message: "¡Enviado  correctamente!",
          alertType: "success",
        });
        req.flash("messages", messages);
  
        res.redirect("/");
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

  exports.ordenUsuario = async (req, res, next) => {
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
    try {
      const ordenes = await Orden.find({ cliente: req.user._id }).lean();
      res.render("ordenesUsuario", { 
        ordenes,
        logincliente, logincolaborador, loginadmin, notlogin, nombre
        });
    } catch (error) {
      console.log(error);
      next();
      res.redirect("/");
    }
  };