const mongoose = require("mongoose");
const Servicio = mongoose.model("Servicio");

exports.mostrarServicios = async (req, res, next) => {
  // Obtener todos los servicios disponibles
  const servicios = await Servicio.find().lean();

  res.render("index", { servicios });
};
