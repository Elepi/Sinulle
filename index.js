// Importar los módulos requeridos para el funcionamiento del servidor
const mongoose = require("mongoose");
const express = require("express");
//llamar la configuracion de la base
require("./config/db");
const exphbs = require("express-handlebars");
const router = require("./routes/index");
const bodyParser = require("body-parser");
const passport = require("./config/passport");
const cookieParser = require("cookie-parser");
const session  = require("express-session");
const MongoStore  = require("connect-mongo")(session);
const flash = require("connect-flash");

//Declaración de la variables path
const path = require("path");

// Habilitar el archivo de variables de entorno
require("dotenv").config({ path: ".env" });

// Crear un servidor utilizando express
const app = express();

// Habilitar Handlebars como nuestro template engine
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));

app.set("view engine", "hbs");

//Crear la sesion de usuario y la cookie encargada de almacenarla
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SECRET,
        key: process.env.KEY,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);

// Llama los archivos de la carpeta public
app.use(express.static(path.join(__dirname, "public")));

//Habilitar passport y la estrategia local
app.use(passport.initialize());
app.use(passport.session());

//Habilitar los mensajes flash
app.use(flash());

//Midleware personalizado para agregar mensajes flash
app.use((req, res, next) => {
    res.locals.messages = req.flash();

    next();
})

// Habilitar body-parser para obtener el cuerpo de la petición
app.use(bodyParser.urlencoded({ extended: true }));

// Implementar nuestro router
// si el endpoint no existe retornara error 404
app.use("/", router());


app.listen(process.env.PORT);