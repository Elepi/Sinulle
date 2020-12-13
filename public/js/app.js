import axios from "axios";
import Swal from "sweetalert2";


document.addEventListener("DOMContentLoaded", () => {
    //Verificar si estamos en la página
    const panelDirecciones = document.querySelector("#panel-direcciones");
    if (panelDirecciones) panelDirecciones.addEventListener("click", eliminarDireccion);

    const panelServicios = document.querySelector("#panel-servicios");
    if (panelServicios) panelServicios.addEventListener("click", eliminarServicio);

});

const eliminarDireccion = (e) => {
    //Prevenir el comportamiento por defecto
    e.preventDefault();

   

    //Verificar que el boton seleccionado es el boton de eliminar
    if(e.target.dataset.eliminar) {
        
        Swal.fire({
            title: "¿Está seguro que desea eliminar la dirección?",
            text: "¡Una vez eliminada, no se puede recuperar!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d330000",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if(result.value) {
                //El usuario hace click en eliminar
                //Redireccionar a la ruta correspondiente
                const axiosUrl = `${location.origin}/direccion/${e.target.dataset.eliminar}`;
                console.log(axiosUrl);
                //petición AJAX de eliminación 
                axios.delete(axiosUrl, { i: e.target.dataset.eliminar }).then((response) => {
                    if (response.status == 200) {
                        Swal.fire("¡Eliminada!", response.data, "success");

                        //Eliminar dirección del DOM
                        e.target.parentElement.parentElement.removeChild(
                            e.target.parentElement
                        );
                    }
                }).catch(() => {
                    Swal.fire({
                        type: "error",
                        title: "Error",
                        text: "Error al momento de eliminar la dirección",
                    });
                });
            } 
        });
    } else if (e.target.tagName === "A") {
        //Si no es el boton de Eliminar direccion, realizar las redirección
        window.location.href == e.target.href;
    } 
};

const eliminarServicio= (e) => {
    // Prevenir el comportamiento por defecto
    e.preventDefault();
  
    // Verificar que el botón seleccionado es el botón de eliminar
    if (e.target.dataset.eliminar) {
      Swal.fire({
        title: "¿Está seguro que desea eliminar el servicio?",
        text: "¡Una vez eliminado, no se puede recuperar!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d330000",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.value) {
          // El usuario hace click en eliminar
          // Redireccionar a la ruta correspondiente
          const axiosUrl = `${location.origin}/servicio/${e.target.dataset.eliminar}`;
  
          // Petición AJAX de eliminación
          axios
            .delete(axiosUrl, { id: e.target.dataset.eliminar })
            .then((response) => {
              if (response.status == 200) {
                Swal.fire("¡Eliminado!", response.data, "success");
  
                // Eliminar el servicio del DOM
                e.target.parentElement.parentElement.removeChild(
                  e.target.parentElement
                );
              }
            })
            .catch(() => {
              Swal.fire({
                type: "error",
                title: "Error",
                text: "Ocurrió un error al momento de eliminar el servicio",
              });
            });
        }
      });
    } else if (e.target.tagName === "A") {
      // Si no es el botón de eliminar servicio, realizar la redirección
      window.location.href = e.target.href;
    }
  };