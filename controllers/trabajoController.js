const mongoose = require("mongoose");
const Trabajo = mongoose.model("Trabajos");
const { validationResult } = require("express-validator");

exports.formularioSubirTrabajo =  async (req, res, next) => {
   // const usuario = req.user.nombre;
    res.render("subirTrabajo", {
     
    });
};