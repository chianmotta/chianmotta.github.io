var indice = document.getElementById("01");

var ConfirmarBoton = document.getElementById("Confirmar");
var dispositivosDescr = {};
var AntModificarCriterio;
var AntAccionAplicar;
var AntDescripcion;
var AntPrioridad;
var indiceEscrituraCriterioBoxs = document.getElementById("AgregarCriterio");
var indiceEscrituraCriterio = document.getElementById("EscribirCriterios");
var botonAnterior;
var botonSiguiente;
var ValorAnt = false;
var cont;
var institucionGlobal;
var usuarioGlobal;
var categoriaGlobal;
var criterioSeleccionado;

var TemperaturaInput = document.getElementById("TemperaturaInput");
var MinMaxInput = document.getElementById("MinMaxInput");
var ObjetivoInput = document.getElementById("ObjetivoInput");

document.body.onload = () => {
  if (sessionStorage.getItem("institucion")) {
    categoriaGlobal = sessionStorage.getItem("categoria");
    institucionGlobal = sessionStorage.getItem("institucion");
    usuarioGlobal = sessionStorage.getItem("usuario");
    console.log(institucionGlobal, usuarioGlobal);
    document.getElementById(
      "spanInfo"
    ).innerHTML = `Bienvenido ${usuarioGlobal} - ${institucionGlobal}`;
  } else {
    institucionGlobal = "La Manzana de Isaac";
  }
  cargarRows(0, 0, 0);
  CargarDispositivos();
  CargarCriterios();
};

function obtenerid(Criterio, AccionAplicar, descId, prioridad) {
  ModificarURL =
    "https://ahorro-energetico-api-accion.herokuapp.com/api/accion/?institucion=" +
    institucionGlobal +
    "&idCriterio=" +
    Criterio +
    "&accionAplicar=" +
    AccionAplicar +
    "&descId=" +
    descId;
  console.log(ModificarURL);
  document.getElementById("PrioridadModificar").value = prioridad;
}

function ModAccion() {
  var data = {
    prioridad: document.getElementById("PrioridadModificar").value,
  };

  fetch(ModificarURL, {
    method: "PUT", // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      "Content-Type": "application/json",
    },
  }).then(result => {
    if (result.ok) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Actualizado con éxito',
        showConfirmButton: false,
        timer: 1500,
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: 'Intente mas tarde',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1B9752',
        timer: 1500,
      })
    }
    cargarRows(0, 0, 0);
  }).catch((error) => console.error("Error:", error));
  cargarRows(0, 0, 0);
}

function CargarRowsCriterio() {
  fetch(
    `https://ahorro-energetico-api-criterio.herokuapp.com/api/criterios/?institucion=${institucionGlobal}`
  )
    .then((res) => res.json())
    .then(async (data) => {
      indiceEscrituraCriterio.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        var dat = data[i];
        indiceEscrituraCriterio.innerHTML += `
                    <tr>
                    <td>${dat.criterioID}</td>
                    <td>${dat.objetivo}</td>
                    <td>${dat.dato}</td>
                    <td>${dat.valorMIN}</td>
                    <td>${dat.valorMAX}</td>
                    <th><button type="button" id="${
                      "boton " + i
                    }" onclick='ObtenerRegistroCriterio("${dat.criterioID}" ,"${
          dat.objetivo
        }" ,"${dat.dato}","${dat.valorMIN}","${
          dat.valorMAX
        }")' class="btn btn-success" data-bs-dismiss="modal" >Seleccionar</button></th>
                    </tr>`;
      }
    });
}
function ObtenerRegistroCriterio(
  criterioID,
  objetivo,
  dato,
  valorMIN,
  valorMAX
) {
  console.log(criterioID, objetivo, dato, valorMIN, valorMAX);
  TemperaturaInput.value = dato;
  MinMaxInput.value = valorMIN + " : " + valorMAX;
  ObjetivoInput.value = objetivo;
  criterioSeleccionado = criterioID;
}
function limpiarAccion(){
  TemperaturaInput.value = "";
  MinMaxInput.value = "";
  ObjetivoInput.value = "";
  criterioSeleccionado = 0;
}

function criterioDatos() {
  fetch(
    `https://ahorro-energetico-api-criterio.herokuapp.com/api/criterios/?institucion=${institucionGlobal}`
  )
    .then((res) => res.json())
    .then(async (data) => {
      for (var i = 0; i < data.length; i++) {
        indiceEscrituraCriterioBoxs.innerHTML += `<option>${data[i].criterioID}</option>`;
        indiceEscrituraCriterioBoxsOBJ.innerHTML += `<option>${data[i].objetivo}</option>`;
        indiceEscrituraCriterioBoxsMIN.innerHTML += `<option>${data[i].valorMIN}</option>`;
        indiceEscrituraCriterioBoxsMAX.innerHTML += `<option>${data[i].valorMAX}</option>`;
      }
    });
}

function CargarDispositivos() {
  fetch(
    "https://ahorro-energetico-api-desc.herokuapp.com/api/descripciones/?config=" +
      true +
      "institucion=" +
      institucionGlobal
  )
    .then((res) => res.json())
    .then(async (data) => {
      var registroHTML = "";
      for (var i = 0; i < data.length; i++) {
        registroHTML += `<option value=${data[i].id}>${data[i].descripcion}</option>`;
      }
      document.getElementById("BuscarPorDispositivo").innerHTML =
        `<option value=0>Todos</option>` + registroHTML;
      document.getElementById("AgregarDispositivo").innerHTML = registroHTML;
    });
}

function CargarCriterios() {
  fetch(
    `https://ahorro-energetico-api-criterio.herokuapp.com/api/criterios/?institucion=${institucionGlobal}`
  )
    .then((res) => res.json())
    .then(async (data) => {
      var registroHTML = "";

      for (var i = 0; i < data.length; i++) {
        registroHTML += `<option value=${data[i].criterioID}>${
          data[i].dato +
          " (" +
          data[i].valorMIN +
          " : " +
          data[i].valorMAX +
          ")  " +
          data[i].objetivo
        }</option>`;
      }
      indiceEscrituraCriterioBoxs.innerHTML = registroHTML;
    });
}

function cargarRows(descripID, accion, criterioID) {
  fetch(
    "https://ahorro-energetico-api-accion.herokuapp.com/api/accion/descripcion/?descID=" +
      descripID +
      "&accionAplicar=" +
      accion +
      "&criterioID=" +
      criterioID +
      "&institucion=" +
      institucionGlobal
  )
    .then((res) => res.json())
    .then(async (data) => {
      indice.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        var dat = data[i];
        indice.innerHTML += `<tr class="table-success">
                          <td>${
                            dat.dato +
                            " (" +
                            dat.valorMIN +
                            " : " +
                            dat.valorMAX +
                            ")  " +
                            dat.objetivo
                          }</td>
                          <td>${dat.accionAplicar}</td>
                          <td>${dat.descripcion}</td>
                          <td>${dat.prioridad}</td>
                          <td> <button type="button" onclick='obtenerid("${dat.criterioID}" , "${dat.accionAplicar}", "${dat.descID}", "${dat.prioridad}")'  
                          class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModalModificar">Editar</button>
                          <button type="button" onclick='EliminarAccion("${
                            dat.criterioID
                          }" , "${dat.accionAplicar}", "${
          dat.descID
        }")' class="btn btn-danger">Eliminar</button></td>
                        </tr>`;
      }
    });
}

function EliminarAccion(Criterio, AccionAplicar, descId) {
  Swal.fire({
    title: "¿Está seguro, que desea eliminar esta meta?",
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
        fetch(
          "https://ahorro-energetico-api-accion.herokuapp.com/api/accion/?institucion=" +
            institucionGlobal +
            "&idCriterio=" +
            Criterio +
            "&accionAplicar=" +
            AccionAplicar +
            "&descId=" +
            descId,
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
      }
    });
    setTimeout(() => { location. reload(); }, 2000);
}

function AgregarNuevaAccion() {
  var data = {
    criterioID: document.getElementById("AgregarCriterio").value,
    accionAplicar: document.getElementById("AccionAplicar").value,
    descId: document.getElementById("AgregarDispositivo").value,
    prioridad: document.getElementById("AgregarPrioridad").value,
    institucion: institucionGlobal,
  };
  JSONdata = JSON.stringify(data);
  fetch("https://ahorro-energetico-api-accion.herokuapp.com/api/accion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSONdata,
  }).then(result => {
    if (result.ok) {
     Swal.fire({
        position: "center",
        icon: "success",
        title: "Agregado con éxito",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    cargarRows(0, 0, 0);
  }).catch((error) => {
    console.log("Ocurrio un error: ", error)});
  cargarRows(0, 0, 0);
}

function BuscarAccion() {
  var Accion = document.getElementById("BuscarPorAccion").value;
  var Dispositivo = document.getElementById("BuscarPorDispositivo").value;
  cargarRows(Dispositivo, Accion, criterioSeleccionado);
}