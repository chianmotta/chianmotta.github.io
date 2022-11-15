var indice = document.getElementById("01");

var ConfirmarBoton = document.getElementById("Confirmar");
var dispositivosDescr = {}
var AntModificarCriterio;
var AntAccionAplicar;
var AntDescripcion;
var AntPrioridad;
var indiceEscrituraCriterioBoxs  = document.getElementById("AgregarCriterio");
var indiceEscrituraCriterio  = document.getElementById("EscribirCriterios");
var botonAnterior;
var botonSiguiente;
var ValorAnt = false;
var cont; 
var institucionGlobal;
var usuarioGlobal;
var categoriaGlobal;

var TemperaturaInput = document.getElementById("TemperaturaInput");
var MinMaxInput = document.getElementById("MinMaxInput");
var ObjetivoInput = document.getElementById("ObjetivoInput");


document.body.onload = () => {
  if (sessionStorage.getItem('institucion'))
  {
    categoriaGlobal= sessionStorage.getItem('categoria')
    institucionGlobal = sessionStorage.getItem("institucion");
    usuarioGlobal = sessionStorage.getItem('usuario');
    console.log(institucionGlobal,usuarioGlobal);
    document.getElementById("spanInfo").innerHTML = `Bienvenido ${usuarioGlobal} - ${institucionGlobal}`
    cargarRows(0,0);
    CargarDispositivos();
    CargarCriterios();
  }
  else{
    institucionGlobal = "La manzana de isaac";
    cargarRows(0,0);
    CargarDispositivos();
    CargarCriterios();
  }
}

function obtenerid (Criterio, AccionAplicar, descId){
  ModificarURL = "http://localhost:4000/api/accion/?institucion="+institucionGlobal+"&idCriterio="+Criterio+"&accionAplicar="+AccionAplicar+"&descId="+ descId;
  console.log(ModificarURL);
}

function ModAccion(){
  var data = {
    "prioridad":  document.getElementById("PrioridadModificar").value
  };

  fetch(ModificarURL, {
    method: 'PUT', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
  ActualizarPagina();

}

function CargarRowsCriterio() {
  fetch(`http://localhost:4006/api/criterios?institucion=${institucionGlobal}`)
    .then((res) => res.json())
    .then(async (data) => {
      indiceEscrituraCriterio.innerHTML ="";
          for (var i = 0; i < data.length; i++) {
            var dat = data[i];
            indiceEscrituraCriterio.innerHTML += (
                    `
                    <tr>
                    <td>${dat.criterioID}</td>
                    <td>${dat.objetivo}</td>
                    <td>${dat.dato}</td>
                    <td>${dat.valorMIN}</td>
                    <td>${dat.valorMAX}</td>
                    <th><button type="button" id="${'boton '+ i}" onclick='ObtenerRegistroCriterio("${dat.criterioID}" ,"${dat.objetivo}" ,"${dat.dato}","${dat.valorMIN}","${dat.valorMAX}")' class="btn btn-success" data-bs-dismiss="modal" >Seleccionar</button></th>
                    </tr>`
                  ) }                                                                                                              
                  });
}
function ObtenerRegistroCriterio(criterioID, objetivo, dato, valorMIN, valorMAX){
  console.log(criterioID, objetivo, dato, valorMIN, valorMAX);
  TemperaturaInput.value = dato;
  MinMaxInput.value = valorMIN + ' : ' + valorMAX;
  ObjetivoInput.value =objetivo;
}



function ComprobarSeleccion(){

}
function criterioDatos() {
  fetch(`http://localhost:4006/api/criterios?institucion=${institucionGlobal}`)
  .then((res) => res.json())
  .then(async (data) => {
    for (var i = 0; i < data.length; i++) {
      indiceEscrituraCriterioBoxs.innerHTML += (
              `<option>${data[i].criterioID}</option>`   
                  ) 
                  indiceEscrituraCriterioBoxsOBJ.innerHTML += (
              `<option>${data[i].objetivo}</option>`
                  )
              indiceEscrituraCriterioBoxsMIN.innerHTML += (
              `<option>${data[i].valorMIN}</option>`
               )
                        indiceEscrituraCriterioBoxsMAX.innerHTML += (
                          `<option>${data[i].valorMAX}</option>`
                              )
                }          
           
                  });
    
}


function CargarDispositivos() {
  fetch(`http://localhost:4001/api/descripciones?institucion=${institucionGlobal}`)
  .then((res) => res.json())
  .then(async (data) => {
    var registroHTML = "";
    for (var i = 0; i < data.length; i++) {
      registroHTML += `<option value=${data[i].id}>${data[i].descripcion}</option>`; 
    }          
    document.getElementById("BuscarPorDispositivo").innerHTML = `<option value=0>Todos</option>` + registroHTML; 
    document.getElementById("AgregarDispositivo").innerHTML = registroHTML;
    }); 
}

function CargarCriterios() {
  fetch(`http://localhost:4006/api/criterios?institucion=${institucionGlobal}`)
  .then((res) => res.json())
  .then(async (data) => {
    var registroHTML = "";
    
    for (var i = 0; i < data.length; i++) {
      registroHTML += 
      `<option value=${data[i].criterioID}>${data[i].dato + " (" + data[i].valorMIN + " : " + data[i].valorMAX + ")  " + data[i].objetivo}</option>`; 
    }          
    indiceEscrituraCriterioBoxs.innerHTML = registroHTML; 
  }) 
}

function cargarRows(descripID, accion) {
        fetch("http://localhost:4000/api/accion/descripcion/?descID=" + descripID + "&accionAplicar=" + accion + "&institucion=" + institucionGlobal)
        //fetch("http://localhost:4000/api/accion/descripcion/?descID=1&accionAplicar=1&institucion=La manzana de isaac")
        //localhost:4000/api/accion/descripcion/?descID=0&accionAplicar=0&institucion=La%20manzana%20de%20isaac

          .then((res) => res.json())
          .then(async (data) => {
                indice.innerHTML ="";
                for (var i = 0; i < data.length; i++) {
                  var dat = data[i]
                        indice.innerHTML += (
                          `<tr class="table-success">
                          <td>${dat.dato + " (" + dat.valorMIN + " : " + dat.valorMAX + ")  " + dat.objetivo}</td>
                          <td>${dat.accionAplicar}</td>
                          <td>${dat.descripcion}</td>
                          <td>${dat.prioridad}</td>
                          <td> <button type="button" onclick='obtenerid("${dat.criterioID}" , "${dat.accionAplicar}", "${dat.descID}")'  class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModalModificar">Modificar</button>
                          <button type="button" onclick='EliminarAccion("${dat.criterioID}" , "${dat.accionAplicar}", "${dat.descID}")' class="btn btn-danger">Eliminar</button></td>
                        </tr>`
                        ) }                                                                                                              
                        });
      }
      
function EliminarAccion(Criterio, AccionAplicar, descId){
  fetch('http://localhost:4000/api/accion/?institucion='+institucionGlobal+'&idCriterio='+Criterio+'&accionAplicar='+AccionAplicar+'&descId='+descId, {
    method: 'DELETE',
})
.then(res => res.json())
.then(res=> {
  ActualizarPagina();
});
  }

function ActualizarPagina(){
location. reload();
}

function AgregarNuevaAccion(){
  console.log("Holis")
  debugger;
    var data = {
        "criterioID": document.getElementById("AgregarCriterio").value,
        "accionAplicar": document.getElementById("AccionAplicar").value,
        "descId": document.getElementById("AgregarDispositivo").value,
        "prioridad": document.getElementById("AgregarPrioridad").value,
        "institucion":institucionGlobal
    }
    JSONdata = JSON.stringify(data);
    fetch("http://localhost:4000/api/accion", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSONdata,
    })
    .then((res)=>{
      ActualizarPagina();
    })
    .catch((error)=>{console.log("Ocurrio un error: ", error)})
  }
  function BuscarAccion(){
    var Accion = document.getElementById("BuscarPorAccion").value;
    var Dispositivo = document.getElementById("BuscarPorDispositivo").value;
    var Criterio = document.getElementById("BuscarPorDispositivo").value;
    
    cargarRows(Dispositivo, Accion);
    /*fetch('http://localhost:4000/api/accion')
    .then((res) => res.json())
    .then(async (data) => {
          indice.innerHTML ="";

          for (var i = 0; i < data.length; i++) {
            if(Accion == "Todos" && data[i].descId == Dispositivo){
                
              indice.innerHTML += (
                `<tr class="table-success">
                <td>${dat.criterioID}</td>
                <td>${dat.accionAplicar}</td>
                <td>${dat.descId}</td>
                <td>${dat.prioridad}</td>
                <td> <button type="button" onclick='obtenerid("${dat.criterioID}" , "${dat.accionAplicar}", "${dat.descId}", "${dat.descId}")'  class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModalModificar">Modificar</button>
                 <button type="button" onclick='EliminarAccion("${dat.criterioID}" , "${dat.accionAplicar}", "${dat.descId}")' class="btn btn-danger">Eliminar</button></td>
              </tr>`
              ) }
        }
        for (var i = 0; i < data.length; i++) {
            if(Accion == "Todos" && Dispositivo == "Todos"){
                cargarRows(0,0);
        }
    }
            for (var i = 0; i < data.length; i++) {
                if(Dispositivo == "Todos" && data[i].accionAplicar == Accion){
                  indice.innerHTML += (
                    `<tr class="table-success">
                    <td>${dat.criterioID}</td>
                    <td>${dat.accionAplicar}</td>
                    <td>${dat.descId}</td>
                    <td>${dat.prioridad}</td>
                    <td> <button type="button" onclick='obtenerid("${dat.criterioID}" , "${dat.accionAplicar}", "${dat.descId}", "${dat.descId}")'  class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModalModificar">
                     Modificar</button></td><td><button type="button" 
                    onclick='EliminarAccion("${dat.criterioID}" , "${dat.accionAplicar}", "${dat.descId}")' 
                    class="btn btn-danger">Eliminar</button></td>
                  </tr>`
                  ) }
            }
          for (var i = 0; i < data.length; i++) {
            if(data[i].accionAplicar == Accion && data[i].descId == Dispositivo){
                
              indice.innerHTML += (
                `<tr class="table-success">
                <td>${dat.criterioID}</td>
                <td>${dat.accionAplicar}</td>
                <td>${dat.descId}</td>
                <td>${dat.prioridad}</td>
                <td> <button type="button" onclick='obtenerid("${dat.criterioID}" , "${dat.accionAplicar}", "${dat.descId}", "${dat.descId}")'  class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModalModificar">
                 Modificar</button></td><td><button type="button" 
                onclick='EliminarAccion("${dat.criterioID}" , "${dat.accionAplicar}", "${dat.descId}")' 
                class="btn btn-danger">Eliminar</button></td>
              </tr>`
              )}
        }
    })
    */
}