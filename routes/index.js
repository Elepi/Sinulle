// Importar los módulos requeridos
const express = require("express");

const usuarioController = require("../controllers/usuarioController");
const authController = require("../controllers/authController");
const servicioController = require("../controllers/servicioController");
const homeController = require("../controllers/homeController");
const ordenController = require("../controllers/ordenController");
const { check } = require("express-validator");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
  // Rutas disponibles y su tipo de peticion
  router.get("/",homeController.mostrarServicios, (req, res, next) => {
    var login = false;
    if(req.isAuthenticated()){
      login = true;
    }
    else {
      login = false;
    }
    res.render("index", { login }
    );
  });





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


// Rutas para servicioss


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

usuarioController.miPerfilDireccion);

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

//Rutas para orden de servicio
router.get("/crear-orden",
authController.verificarInicioSesion, 
ordenController.formularioCrearOrden,
);

router.post("/crear-orden",
authController.verificarInicioSesion,

ordenController.crearOrden);


  return router;
};