const mongoose = require("mongoose");
const Trabajo = mongoose.model("Trabajos");
const Usuario = mongoose.model("Usuarios");
const { validationResult } = require("express-validator");
const shortid = require("shortid");
const multer = require("multer");

exports.formularioSubirTrabajo =  async (req, res, next) => {
   // const usuario = req.user.nombre;
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

  const usuario = req.user.nombre;

    res.render("subirTrabajo", {
        layout: "main",
        usuario,
        logincliente, logincolaborador, loginadmin, notlogin, nombre
    });
};

exports.crearTrabajo = async (req, res, next) => {
    //Verificar que no existan errores de validación
    const errores = validationResult(req);
    const messages = [];

    //Obtener variables del body
    // const { nombre, email, password, tipoUsuario,servicio } = req.body;

    //Si hay errores
    if(!errores.isEmpty()) {
        //Utilizar la funcion map para navegar dentro de un arreglo
        errores.array().map((error) => 
        messages.push({ message: error.msg, alertType: "danger" })

        );

        //Agregar los errores a nuestros mensajes flash 
        req.flash("messages", messages);

        res.redirect("/subir-trabajos");
    }
    else {
         //Intentar almacenar los datos del usuario
    try {
        //Agregar imagenes
        const imagen = [];
        const {descripcion} = req.body;

      for(let x=0; x< req.files.length; x++){
        if(req.files.length > 0){
          imagen[x]=req.files[x].filename;
        }
      }

        //Crear el usuario
        await Trabajo.create({
          colaborador: req.user._id,
           imagenes: imagen,
           descripcion
        });
         // Mostrar un mensaje luego de registrarse existosamente
         messages.push({ message: "Publicación creada satisfactoriamente.", alertType: "success" });
         req.flash("messages", messages);
         res.redirect("/mostrar-trabajos");
        } catch (error) {
            messages.push({
                message: error,
                alertType: "danger",
              });
              req.flash("messages", messages);
              res.redirect("/subir-trabajos");
        }
    } 
};

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
      res.redirect("/subir-trabajos");
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
                    "El tamaño del archivo es superior al límite. Máximo 1MB",
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
          res.redirect("/subir-trabajos");
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
      fileSize: 1000000,
    },
    // Dónde se almacena el archivo
    storage: (fileStorage = multer.diskStorage({
      destination: (req, res, cb) => {
        cb(null, `${__dirname}../../public/uploads/trabajos`);
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
  const upload = multer(configuracionMulter).array("imagen");


  //
  exports.mostrarTrabajos = async (req, res, next) => {
    const trabajos = await Trabajo.find().lean();
    const email = req.user.email;
    
    const usuario = await Usuario.findOne({email}).lean();
   // const nombre = usuario.nombre;

    res.render("mostrarTrabajos", { 
        layout: "main",
      
       trabajos,
       usuario

        
        });
};

