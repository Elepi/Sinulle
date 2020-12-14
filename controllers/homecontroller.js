const mongoose = require("mongoose");
const Servicio = mongoose.model("Servicio");

exports.mostrarServicios = async (req, res, next) => {
  // Obtener todos los servicios disponibles
  const servicios = await Servicio.find().lean();
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
  

  
  res.render("index", { servicios, logincliente, logincolaborador, loginadmin, notlogin, nombre });
  // login: req.isAuthenticated() ? true : false
};

exports.manual = (req, res, next) => {
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
  
  res.render("manual", {
    logincliente, logincolaborador, loginadmin, notlogin, nombre
  })
}
