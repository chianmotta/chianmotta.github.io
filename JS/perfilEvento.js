const apiButton = document.getElementById("but");
const guardarButton = document.getElementById("guardarPerfilEvento");
const editarButton = document.getElementById("editarPerfilEvento");
var editarFecha;
var editarPlanta;
var editarActivado;
var institucionGlobal;
var usuarioGlobal;
var botonActivadoAgregar;
var botonActivadoEditar;
var plantasGlobales;
var categoriaGlobal;
const jurisdiccion = "Ciudad Autonoma de Buenos Aires";

document.body.onload = () => {
  if (sessionStorage.getItem("institucion")) {
    categoriaGlobal = sessionStorage.getItem("categoria");
    institucionGlobal = sessionStorage.getItem("institucion");
    usuarioGlobal = sessionStorage.getItem("usuario");
    console.log(institucionGlobal, usuarioGlobal);
    document.getElementById(
      "spanInfo"
    ).innerHTML = `Bienvenido ${usuarioGlobal} - ${institucionGlobal}`;
    listar();
  } else {
    institucionGlobal = "La Manzana de Isaac";
    listar();
  }
};

async function listar() {
  var planta = document.getElementById("comboPlanta").value;

  var res = await fetch(
    "https://ahorro-energetico-api-pereven.herokuapp.com/api/eventos/get?&planta=" +
      planta +
      "&institucion=" +
      institucionGlobal
  );
  var registroHTML = "";
  var data = await res.json();

  for (var i = 0; i < data.length; i++) {
    registroHTML += `<tr class="table-success">
              <td>${data[i].fecha.substring(0, 10)}</td>           
              <td>${
                data[i].activado == 0 ? "Desactivado" : "Activado"
              }</td>           
              <td>${data[i].horaDesde}</td> 
              <td>${data[i].horaHasta}</td>           
              <td>${data[i].planta}</td>          
              <td><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#ModalEditar" onclick='editar("${
                data[i].planta
              }","${data[i].fecha}","${data[i].horaDesde}","${
      data[i].horaHasta
    }","${data[i].activado}")'>Editar</button>
              <button class="btn btn-danger" onclick='eliminarPerfilEvento("${
                data[i].fecha
              }","${data[i].planta}")'>Eliminar</button></td> </tr>`;
  }
  document.querySelector("#tabla").innerHTML = registroHTML;
}
function activadoAgregar(num) {
  botonActivadoAgregar = num;
}
function activadoEditar(num) {
  pintarBoton(num);
  botonActivadoEditar = num;
}
function pintarBoton(num) {
  var botonA = num == 0 ? "actE0" : "actE1";
  document.getElementById(botonA).checked = true;
}
async function eliminarPerfilEvento(fecha, planta) {
  Swal.fire({
    title: "¿Está seguro, que desea eliminar este perfil por evento?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1B9752",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Si, Eliminar!",
  })
    .then(async (result) => {
     
      if (result.isConfirmed) {
        fecha = fecha.substring(0, 10);

        await fetch(
          "https://ahorro-energetico-api-pereven.herokuapp.com/api/eventos?fecha=" +
            fecha +
            "&planta=" +
            planta +
            "&institucion=" +
            institucionGlobal,
          {
            method: "DELETE",
          }
        );
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Eliminado con éxito",
          showConfirmButton: false,
          timer: 1500,
        });
        listar();
      }
      listar();
    })





}

function cargarPlantas(select, combo) {
  var plantas = "";

  for (var i = 0; i < plantasGlobales[select].length; i++) {
    plantas += `<option value=${plantasGlobales[select][i][0]}>${plantasGlobales[select][i][1]}</option>`;
  }
  combo.innerHTML = plantas;
}

function editar(planta, fecha, horaDesde, horaHasta, activado) {
  botonActivadoEditar = activado;
  pintarBoton(activado);
  editarPlanta = document.getElementById("editarPlanta").value = planta;
  editarFecha = document.getElementById("editarFecha").value = fecha.substring(0, 10);
  document.getElementById("horaInicialEditar").value = horaDesde;
  document.getElementById("horaLimiteEditar").value = horaHasta;
}

async function editarPerfilEvento() {
  const editarHoraDesde = document.getElementById("horaInicialEditar").value;
  const editarHoraHasta = document.getElementById("horaLimiteEditar").value;

  if (editarHoraDesde >= editarHoraHasta) {
    alert("La hora inicio no debe ser mayor a la hora limite");
  } 
  else {
    await fetch(
      "https://ahorro-energetico-api-pereven.herokuapp.com/api/eventos/?dia=" +
        editarFecha +
        "&planta=" +
        editarPlanta +
        "&institucion=" +
        institucionGlobal,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha: editarFecha,
          activado: botonActivadoEditar,
          horaDesde: editarHoraDesde,
          horaHasta: editarHoraHasta,
          planta: editarPlanta,
          institucion: institucionGlobal,
        }),
      }
    );
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Actualizado con éxito',
      showConfirmButton: false,
      timer: 1500,
    })
    listar();
  }
}

async function agregarPerfilEvento() {
  var fecha = document.getElementById("agregarFecha").value;
  var planta = document.getElementById("comboPlantaAgregar").value;
  var horaInicial = document.getElementById("horaInicialAgregar").value;
  var horaLimite = document.getElementById("horaLimiteAgregar").value;
  if (
    fecha == undefined ||
    fecha == "" ||
    planta == undefined ||
    planta == "" ||
    horaInicial == undefined ||
    horaInicial == "" ||
    horaLimite == undefined ||
    horaLimite == ""
  ) {

    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'Los campos no pueden estar vacios.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })  
  } else {
    if (horaInicial >= horaLimite) {
      Swal.fire({
        icon: 'error',
        title: 'Error de ingreso de datos!',
        text: 'La hora inicio no debe ser mayor a la hora limite.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1B9752',
      })  
    } else {
      const data = {
        fecha: fecha,
        activado: botonActivadoAgregar,
        horaDesde: horaInicial,
        horaHasta: horaLimite,
        planta: planta,
        institucion: institucionGlobal,
      };

      await fetch(
        "https://ahorro-energetico-api-pereven.herokuapp.com/api/eventos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );    
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Agregado con éxito",
        showConfirmButton: false,
        timer: 1500,
      });
      listar();
    }
  }
}

apiButton.addEventListener("click", listar);
//Si la tabla está vacia, rompe aca
guardarButton.addEventListener("click", agregarPerfilEvento);
editarButton.addEventListener("click", editarPerfilEvento);
