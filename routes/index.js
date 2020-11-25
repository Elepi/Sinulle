// Importar los módulos requeridos
const express = require("express");

const usuarioController = require("../controllers/usuarioController");
const authController = require("../controllers/authController");
const servicioController = require("../controllers/servicioController");
const { check } = require("express-validator");

// Configura y mantiene todos los endpoints en el servidor
const router = express.Router();

module.exports = () => {
  // Rutas disponibles y su tipo de peticion
  router.get("/", (req, res, next) => {
    res.render("index");
  });

  // Rutas para usuario
  router.get("/crear-cuenta", usuarioController.formularioCrearCuenta);

  

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
router.get(
  "/crear-servicio",
  authController.verificarInicioSesion,
  servicioController.formularioCrearServicio
);


router.post(
  "/crear-servicio",
  authController.verificarInicioSesion,
  [
    check("nombre", "Debes ingresar el nombre del producto")
      .not()
      .isEmpty()
      .escape(),
  
  ],

  servicioController.crearServicio
);

//Rutas de perfil y direcciones de usuario
router.get("/miperfil", 
authController.verificarInicioSesion,
usuarioController.miPerfil);
router.post("/miperfil", 
authController.verificarInicioSesion,
usuarioController.miPerfilDireccion);
  

router.get("/orden-servicio",authController.verificarInicioSesion, (req, res, next) => {
  res.render("ordenServicio");
});

  return router;
};