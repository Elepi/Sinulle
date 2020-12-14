// Importar los módulos requeridos
const express = require("express");

const usuarioController = require("../controllers/usuarioController");
const authController = require("../controllers/authController");
const servicioController = require("../controllers/servicioController");
const homeController = require("../controllers/homeController");
const ordenController = require("../controllers/ordenController");
const trabajoController = require("../controllers/trabajoController");
const { check } = require("express-validator");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
  // Rutas disponibles y su tipo de peticion
  router.get("/",homeController.mostrarServicios);





  // Rutas para usuario
  router.get("/crear-cuenta", usuarioController.formularioCrearCuenta);

  router.get("/crear-cuentaColaborador", usuarioController.formularioCrearCuentaColaborador);

 router.post("/crear-cuenta",
 [
  //Realizar una verificación de los atributos del formulario
  check("nombre", "Debes ingresar tu nombre.")
  .not()
  .isEmpty()
  .escape(),
  check("email", "Debes ingresar un correo electrónico.")
  .not().isEmpty(),
  check("email", "El correo electónico no es válido.")
  .isEmail().normalizeEmail(),
  check("password", "Debes ingresar una contraseña").not().isEmpty(),
  //Validacion de campo de confirmacion de contraseña.
  // check("confirmpassoword", "La contraseña de confirmación es diferente")
  // .custom((value, { req }) => value === req.body.password),
  ],
 usuarioController.crearCuenta);




 

router.get("/iniciar-sesion", usuarioController.formularioIniciarSesion);

router.post("/iniciar-sesion", authController.autenticarUsuario);

router.get("/olvide-password", authController.formularioRestablecerPassword);

router.post("/olvide-password", authController.enviarToken);

router.get("/olvide-password/:token", authController.formularioNuevoPassword);

router.post("/olvide-password/:token", authController.almacenarNuevaPassword);

//Cerrar Sesion
router.get("/salir",authController.cerrarSesion);

//Rutas de administracion
router.get("/administrar", (req, res, next)=> {
  res.send("Administración del sitio");
});




//Rutas de perfil y direcciones de usuario
router.get("/miperfil", 
authController.verificarInicioSesion,
usuarioController.miPerfil);
router.post("/miperfil", 
authController.verificarInicioSesion,
[
  check("direccion", "Debes ingresar una dirección.")
  .not()
  .isEmpty()
  .escape(),
  
],
usuarioController.modificarUsuario);

//Direcciones
router.get("/miperfil-direccion",
authController.verificarInicioSesion,
usuarioController.formularioPerfilDireccion);

router.post("/miperfil-direccion",
authController.verificarInicioSesion,
usuarioController.miPerfilDireccion
);

///Imagen
router.get("/miperfil-imagen", 
authController.verificarInicioSesion,
usuarioController.agregarImagenUsuario);
router.post("/miperfil-imagen", 
authController.verificarInicioSesion,
// [
 
//   check("gravatar", "Debes seleccionar una imagen.")
//         // .not()
//         // .isEmpty()
// ],
usuarioController.subirImagen,
 usuarioController.miPerfilImagen);
  




// Rutas para servicio
router.get(
  "/crear-servicio",
  authController.verificarInicioSesion,
  servicioController.formularioCrearServicio
);

router.post("/crear-servicio",
  authController.verificarInicioSesion,
 
  servicioController.crearServicio,
  [
    check("nombre", "Debes ingresar el nombre del servicio")
      .not()
      .isEmpty()
      .escape(),
      check("imagen", "Debes ingresar el url de la imagen")
      .not()
      .isEmpty()
      .escape(),
  
  ],
  
);

router.get(
  "/listar_servicios",
  servicioController.listarServicios,

  authController.verificarInicioSesion,
  
);

router.get("/modificar-servicio/:url",
servicioController.formularioModificarServicio);
router.post("/modificar-servicio",
servicioController.modificarServicio);

router.delete(
"/servicio/:id",
authController.verificarInicioSesion,
servicioController.eliminarServicio
);

//Rutas para orden de servicio
router.get("/crear-orden/:url",
authController.verificarInicioSesion, 
ordenController.formularioCrearOrden,

);

router.post("/crear-orden",
authController.verificarInicioSesion,
[
  check("fechaSolicitud", "Debes ingresar la fecha que requieres el servicio")
      .not()
      .isEmpty()
      .escape(),
  check("direccion", "Debes seleccionar una direccion")
      .not()
      .isEmpty()
      .escape(),
      check("descripcion", "Debes describir que necesitas en tu servicio")
      .not()
      .isEmpty()
      .escape(),

],
ordenController.crearOrden);


//rutas para trabajos de colaborador

router.get("/subir-trabajos", 
authController.verificarInicioSesion,
trabajoController.formularioSubirTrabajo,
);
router.post("/subir-trabajos",
trabajoController.subirImagen,
trabajoController.crearTrabajo
);

router.get("/mostrar-trabajos", 
authController.verificarInicioSesion,
trabajoController.mostrarTrabajos,
);

//Ruta para eliminar dirección de usuario
router.delete("/direccion/:i",
authController.verificarInicioSesion,
usuarioController.eliminarDireccion);

  return router;
};

//
// Manual de usuario
router.get("/manual", (req, res, next)=> {
  res.render("manual");
});


//Ordenes de usuario
router.get("/ordenes-usuario", 
authController.verificarInicioSesion,
  ordenController.ordenUsuario);

  // Manual de usuario
router.get("/terminos", (req, res, next)=> {
  res.render("terminos");
});