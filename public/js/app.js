import axios from "axios";
import Swal from "sweetalert2";


document.addEventListener("DOMContentLoaded", () => {
    //Verificar si estamos en la página
    const panelDirecciones = document.querySelector("#panel-direcciones");
    if (panelDirecciones) panelDirecciones.addEventListener("click", eliminarDireccion);

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