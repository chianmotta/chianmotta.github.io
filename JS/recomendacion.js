
var sql = "http://localhost:4013/api/recomendacion/gets"
var indice = document.getElementById("Registros");
var ComboBoxDispositivoNuevo = document.getElementById("ComboBoxNuevoDispositivo");
var ComboBoxDispositivo = document.getElementById("comboBoxDispositivo");
var InputNuevaRecomendacion = document.getElementById("InputNuevaRecomendacion");
var idDesc;
var RecomendacionAnterior;
var idAnterior; 
var DescIDAnterior;
var institucionGlobal;
var usuarioGlobal;
var categoriaGlobal;

document.body.onload = () => {
  if (sessionStorage.getItem('institucion'))
  {
    categoriaGlobal= sessionStorage.getItem('categoria')
    institucionGlobal = sessionStorage.getItem("institucion");
    usuarioGlobal = sessionStorage.getItem('usuario');
    console.log(institucionGlobal,usuarioGlobal);
    document.getElementById("spanInfo").innerHTML = `Bienvenido ${usuarioGlobal} - ${institucionGlobal}`
    listar();
  }
  else{
    institucionGlobal = "La manzana de isaac";
    listar();
  }
}

async function listar() {
     await fetch(sql)
      .then((res) => res.json())
      .then(async (data) => {
        indice.innerHTML ="";
        ComboBoxDispositivo.innerHTML = "";
            for (var i = 0; i < data.length; i++) {
              var NombreDispositivo; 
              var sql = "http://localhost:4001/api/descripciones/"+data[i].id; 
              await fetch(sql)
               .then((res) => res.json())
               .then(async (descripcionData) => {
                indice.innerHTML += (
                        `
                        <tr class="table-success">
                        <td>${await fetch("http://localhost:4001/api/descripciones/"+data[i].descID).then((res) => res.json())
                           .then(async (data) => data[0].descripcion)}</td>
                        <td>${data[i].recomendacion}</td>
                        <td><button type="button" onclick="ObtenerInformacionAnterior(${data[i].id},${data[i].descID}, '${data[i].recomendacion}', '${data[i].institucion}', '${data[i].jurisdiccion}', '${NombreDispositivo}')" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Modificar</button></td>
                        <td><button type="button" onclick="EliminarAccion(${data[i].id})" class="btn btn-danger">Eliminar</button></td>
                        </tr>
                        `
              )})}                
              BoxDispositivo();
                        
              

              
                    });
  }
async function EliminarAccion(id){
    Swal.fire({
      title: '¿Está seguro, que desea eliminar esta recomendación?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1B9752',
      cancelButtonColor: '#d33',
      cancelButtonText: "Cancelar",
      confirmButtonText: 'Si, Eliminar!'
    }).then(async (result) => {
      await fetch("http://localhost:4013/api/recomendacion/?id="+ id, {
        method: 'DELETE'})
      if (result.isConfirmed) {
        Swal.fire({
          position: 'top-center',
          icon: 'success',
          title: 'Eliminado con éxito',
          showConfirmButton: false,
          timer: 1500
        })
        await delay(1.5);
        ActualizarPagina();
      }
    })
}
async function BoxDispositivo(){
  await fetch("http://localhost:4001/api/descripciones")
  .then((res) => res.json())
  .then(async (data) => {
    ComboBoxDispositivo.innerHTML ="<option>Todos</option";
    ComboBoxDispositivoNuevo.innerHTML ="";
        for (var i = 0; i < data.length; i++) {
          ComboBoxDispositivo.innerHTML += (
                  `
                  <option>${data[i].descripcion}</option>
                  `
                )
              
                ComboBoxDispositivoNuevo.innerHTML  +=(
                  `
                  <option>${data[i].descripcion}</option>
                  `) 
               }                                                                                                              
                });
}

  
async function Buscar(){
  var ComboBoxDispositivo = document.getElementById("comboBoxDispositivo");
  if(ComboBoxDispositivo.value == "Todos"){
    Listar();

  }
  else{
  var url = "http://localhost:4001/api/descripciones/?descripcion="+ComboBoxDispositivo.value
  await fetch(url)
  .then((res) => res.json())
  .then(async (data) => {
      ListarPorFiltro(data[0].id);
  }
  )
  }
  }
    

async function agregarRecomendacion(){
  Swal.fire({
    title: '¿Desea agregar esta recomendación?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#1B9752',
    cancelButtonColor: '#d33',
    cancelButtonText: "Cancelar",
    confirmButtonText: 'Si, Agregar!'
  }).then(async (result) => {
    
  descripcion = document.getElementById("ComboBoxNuevoDispositivo").value;
  var url = "http://localhost:4001/api/descripciones/?descripcion=" + descripcion
  var RecomendacionNueva =  document.getElementById("InputNuevaRecomendacion").value;
  if(CondicionesDeAceptacion(RecomendacionNueva) == false){
    return;
  }
  await fetch(url)
  .then((res) => res.json())
  .then(async (data) => {
  var NuevaRecomendacionJSON = {
      "descID": data[0].id,
      "recomendacion": RecomendacionNueva,
      "institucion": "La manzana de isaac",
      "jurisdiccion": "Ciudad Autónoma de Buenos Aires"
  }
  JSONdata = JSON.stringify(NuevaRecomendacionJSON);
  await fetch("http://localhost:4013/api/recomendacion/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata,
  })
    if (result.isConfirmed) {
      Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Añadido con éxito',
        showConfirmButton: false,
        timer: 1500
      })
      await delay(1.5);
      ActualizarPagina();
      
    }
    
  }
  )
})
}

function delay(n){
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}
async function ListarPorFiltro(PorDispositivo){
  await fetch(sql)
  .then((res) => res.json())
  .then(async (data) => {
    indice.innerHTML ="";
        for (var i = 0; i < data.length; i++) {
          if(data[i].descID == PorDispositivo){
          var NombreDispositivo; 
          var sql = "http://localhost:4001/api/descripciones/"+data[i].id; 
          await fetch(sql)
           .then((res) => res.json())
           .then(async (data) => {
            NombreDispositivo = data[0].descripcion;
          }
           )
          indice.innerHTML += (
            `
            <tr class="table-success">
            <td>${await fetch("http://localhost:4001/api/descripciones/"+data[i].descID).then((res) => res.json())
               .then(async (data) => data[0].descripcion)}</td>
            <td>${data[i].recomendacion}</td>
            <td><button type="button" onclick="ObtenerInformacionAnterior(${data[i].id},${data[i].descID}, '${data[i].recomendacion}', '${data[i].institucion}', '${data[i].jurisdiccion}', '${NombreDispositivo}')" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Modificar</button></td>
            <td><button type="button" onclick="EliminarAccion(${data[i].id})" class="btn btn-danger">Eliminar</button></td>
            </tr>`
                ) }                                                                                                         
              }});
}

function ObtenerInformacionAnterior(id, descID, recomendacion, institucion, jurisdiccion, NombreDispositivo){
  idAnterior = id;
  document.getElementById("InputRecomendacion").value = recomendacion;
}
async function Modificar(){
  Swal.fire({
    title: '¿Está seguro, que desea modificar la recomendación?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#1B9752',
    cancelButtonColor: '#d33',
    cancelButtonText: "Cancelar",
    confirmButtonText: 'Si, Modificar!'
  }).then(async (result) => {
    var RecomendacionNueva = document.getElementById("InputRecomendacion").value;
    var data ={
      "recomendacion": [
        RecomendacionNueva
      ]
    }
    const url  = "http://localhost:4013/api/recomendacion/?id="+ idAnterior
    await fetch(url, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    if (result.isConfirmed) {
      Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Modificado con éxito',
        showConfirmButton: false,
        timer: 1500
      })
      await delay(1.5);
      ActualizarPagina();
    }
  })
}


function ActualizarPagina(){
  location. reload();
  }


  function CondicionesDeAceptacion(Recomendacion){
   
    if(Recomendacion == ""){
      Swal.fire({
        icon: 'error',
        title: 'Error de ingreso de datos!',
        text: 'Ingrese la recomendación.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1B9752',
      })  
      return false;
    }
    if(Recomendacion.length <= 10){
      Swal.fire({
        icon: 'error',
        title: 'Error de ingreso de datos!',
        text: 'La recomendación es muy corta, tiene pocos caracteres, por favor, ingrese una recomendación mas completa.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1B9752',
      })
      return false;
    }
    return true;
  }
