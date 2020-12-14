//Importar los módulos requeridos
const mongoose = require("mongoose");
const Usuario = mongoose.model("Usuarios");
const Servicio = mongoose.model("Servicio");
const { validationResult } = require("express-validator");
const shortid = require("shortid");
const multer = require("multer");

//Cargar el formulario de creación de una cuenta de usuario
exports.formularioCrearCuenta = (req, res, next) =>{
    res.render("registrarse", { layout: "auth" });
}
//mostrar formulario colaborador
exports.formularioCrearCuentaColaborador = async (req, res, next) =>{
  const servicios = await Servicio.find().lean();
 
  res.render("registrarseColaborador", 
 {servicios ,
   layout: "auth" });

}

//Procesar el formulario de creación de cuenta 
exports.crearCuenta = async (req, res, next) => {
    //Verificar que no existan errores de validación
    const errores = validationResult(req);
    const messages = [];

    //Obtener variables del body
    const { nombre, email, password, tipoUsuario,servicio } = req.body;

    //Si hay errores
    if(!errores.isEmpty()) {
        //Utilizar la funcion map para navegar dentro de un arreglo
        errores.array().map((error) => 
        messages.push({ message: error.msg, alertType: "danger" })

        );

        //Agregar los errores a nuestros mensajes flash 
        req.flash("messages", messages);
        if(servicio){

          res.redirect("/crear-cuentaColaborador");

        }else{

          res.redirect("/crear-cuenta");
          
        }

        
    }
    else {
         //Intentar almacenar los datos del usuario
    try {
        //Crear el usuario
        await Usuario.create({
            email,
            password,
            nombre, 
            tipoUsuario,
            servicio,
        });
         // Mostrar un mensaje luego de registrarse existosamente
         messages.push({ message: "Usuario creado satisfactoriamente.", alertType: "success" });
         req.flash("messages", messages);
         res.redirect("/iniciar-sesion");
        } catch (error) {
          if(servicio){
            messages.push({
              message: error,
              alertType: "danger",
            });
            req.flash("messages", messages);
            res.redirect("/crear-cuenta");
          } else{
            messages.push({
              message: error,
              alertType: "danger",
            });
            req.flash("messages", messages);
            res.redirect("/crear-cuentaColaborador");


          }
            
        }
    } 
};

//Renderizar la vista de formulario de inicio de sesión
exports.formularioIniciarSesion = (req, res, next) => {
    console.log(req.flash());
    res.render("iniciarSesion", { 
        layout: "auth",
        
        });
};

exports.miPerfil = (req, res, next) => {
  const usuario = req.user.nombre;
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
  
    res.render("perfil", {
        usuario,
        email: req.user.email,
        gravatar: req.user.gravatar,
        direcciones: req.user.direcciones,
        telefonoFijo: req.user.telefonoFijo,
        telefonoCelular: req.user.telefonoCelular,
        descripcionPersonal: req.user.descripcionPersonal, 
        logincliente, logincolaborador, loginadmin, notlogin, nombre
    });
}

exports.formularioPerfilDireccion = (req, res, next) => {
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
  res.render("perfilDireccion", { 
    direcciones: req.user.direcciones,
    logincliente, logincolaborador, loginadmin, notlogin, nombre
  });
}

exports.miPerfilDireccion = async (req, res, next) => {
    const { direccion } = req.body;
      try {
      const email = req.user.email;
      const usuario = await Usuario.findOne({email});
      usuario.direcciones.push(direccion); 
      await usuario.save();
      res.redirect("/miperfil");
        
      } catch (error) {
        console.log(error);
      }
}

exports.modificarUsuario = async (req, res, next) => {
  const { telefonoFijo, telefonoCelular, descripcionPersonal } = req.body;
  try {
    const email = req.user.email;
    const usuario = await Usuario.findOne({email});
    //usuario.nombre = nombre;
    //usuario.email = email;
    //console.log(usuario);
    usuario.telefonoFijo = telefonoFijo;
    usuario.telefonoCelular = telefonoCelular;
    usuario.descripcionPersonal = descripcionPersonal;
    console.log(usuario);
    await usuario.save();
    res.redirect("/miperfil");
  } catch (error) {
    res.redirect("/miperfil");
  }
 
}

//Eliminar dirección de usuario 
exports.eliminarDireccion = async (req, res, next) => {
  //Obtener el id del usuario 
  // const { id } = req.params;
  const { i } = req.params;
  const  id  = req.user._id;
  
  try {
    const usuario = await Usuario.findById(id);
    if(usuario) {
      //Eliminar dirección
      //usuario.remove();
      console.log(usuario);
      if(i !== -1) {
      // Posibles soluciones
      usuario.direcciones.splice(i,1);
      usuario.save();
      //usuario.update({}, { $pull: { direcciones: { $in: [i] } }});
      res.status(200).send("La dirección ha sido eliminada correctamente");
      //res.redirect("/miperfil");
      }
    }
  } catch (error) {
    console.log(error);
    //Dirección no encontrada o no se puede eliminar
    res.status(403).send("Error al momento de eliminar la dirección");
    
  }
    
  
};

exports.agregarImagenUsuario = (req, res, next) =>{
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
  res.render("perfilImagen", { layout: "main",
  logincliente, logincolaborador, loginadmin, notlogin, nombre
 });
}


exports.miPerfilImagen = async (req, res, next) => {
  
  const email = req.user.email;
  const usuario = await Usuario.findOne({email});  
  usuario.gravatar = req.file.filename;
  await usuario.save();
  res.redirect("/miperfil");
}

//MULTER
exports.subirImagen = (req, res, next) => {
    // Verificar que no existen errores de validación
    const errores = validationResult(req);
    const messages = [];
  
    if (!errores.isEmpty) {
      errores.array().map((error) => {
        messages.push({ message: error.msg, alertType: "danger" });
      });
  
      req.flash("messages", messages);
      res.redirect("/miperfil");
    } else {
      // Subir el archivo mediante Multer
      upload(req, res, function (error) {
        if (error) {
          // Errores de Multer
          if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
              req.flash("messages", [
                {
                  message:
                    "El tamaño del archivo es superior al límite. Máximo 300Kb",
                  alertType: "danger",
                },
              ]);
            } else {
              req.flash("messages", [
                { message: error.message, alertType: "danger" },
              ]);
            }
          } else {
            // Errores creado por el usuario
            req.flash("messages", [
              { message: error.message, alertType: "danger" },
            ]);
          }
          // Redireccionar y mostrar el error
          res.redirect("/miperfil");
          return;
        } else {
          // Archivo cargado correctamente
          return next();
        }
      });
    }
  };
  
  // Opciones de configuración para multer en productos
  const configuracionMulter = {
    // Tamaño máximo del archivo en bytes
    limits: {
      fileSize: 300000,
    },
    // Dónde se almacena el archivo
    storage: (fileStorage = multer.diskStorage({
      destination: (req, res, cb) => {
        cb(null, `${__dirname}../../public/uploads/users`);
      },
      filename: (req, file, cb) => {
        // Construir el nombre del archivo
        // iphone.png --> image/png --> ["image", "png"]
        // iphone.jpg --> image/jpeg
        const extension = file.mimetype.split("/")[1];
        cb(null, `${shortid.generate()}.${extension}`);
      },
    })),
    // Verificar el tipo de archivo mediante el mime type
    // https://developer.mozilla.org/es/docs/Web/HTTP/Basics_of_HTTP/MIME_types
    fileFilter(req, file, cb) {
      if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        // Si el callback retorne true se acepta el tipo de archivo
        cb(null, true);
      } else {
        cb(
          new Error(
            "Formato de archivo no válido. Solamente se permniten JPEG/JPG o PNG"
          ),
          false
        );
      }
    },
  };
  
  // Función que sube el archivo
  const upload = multer(configuracionMulter).single("gravatar");