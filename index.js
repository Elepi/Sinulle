// Importar los módulos requeridos para el funcionamiento del servidor
const express = require("express");
//llamar la configuracion de la base
require("./config/db");
const exphbs = require("express-handlebars");
const router = require("./routes/index");
const bodyParser = require("body-parser");
const passport = require("./config/passport");

//Declaración de la variables path
const path = require("path");

// Habilitar el archivo de variables de entorno
require("dotenv").config({ path: ".env" });

// Crear un servidor utilizando express
const app = express();

// Habilitar Handlebars como nuestro template engine
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));

app.set("view engine", "hbs");


// Llama los archivos de la carpeta public
app.use(express.static(path.join(__dirname, "public")));

//Habilitar passport y la estrategia local
app.use(passport.initialize());
app.use(passport.session());

// Habilitar body-parser para obtener el cuerpo de la petición
app.use(bodyParser.urlencoded({ extended: true }));

// Implementar nuestro router
// si el endpoint no existe retornara error 404
app.use("/", router());


app.listen(process.env.PORT);