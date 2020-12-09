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
    const { precio } = req.body;

    await Servicio.create({
      nombre,
    
      imagen,

      precio
      
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
//Obtener roles de usuario
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

res.render("listar_servicios", { servicios, logincliente, logincolaborador, loginadmin, notlogin, nombre });
};


// Agrega servicio  la orden de Servicio
exports.agregarServicioOrden = async (req, res, next) => {
try {
  // Obtener el servicio a través del URL

  const servicio = await Servicio.findOne({ url: req.params.url }).lean();

 
  res.render("ordenServicio", { servicio });
} catch (error) {
   console.log(error);
}
};

exports.formularioModificarServicio = async (req, res, next) => {
  const servicio = await Servicio.findOne({ url: req.params.url }).lean();
  res.render("modificarServicio", {
    servicio
  })
}
exports.modificarServicio = async (req, res, next) => {
  const { nombre, imagen, id, precio } = req.body;
  try {
    const servicio = await Servicio.findOne({ _id: id });
    servicio.imagen = imagen;
    servicio.nombre = nombre;
    servicio.precio = precio;
    //console.log(servicio);
    await servicio.save();
    res.redirect("/listar_servicios");
  } catch (error) {
    console.log(error);
  }
}


