var indice = document.getElementById("Registros");
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
    document.getElementById("spanInfo").innerHTML = `Bienvenido ${usuarioGlobal} - ${institucionGlobal}`;
  }
  else{
    institucionGlobal = "La manzana de isaac";
  }
  Listar ("");
  BoxDispositivo();
}

async function Listar(descripcion) {
     await fetch("https://ahorroenergetico-api-recomenda.herokuapp.com/api/recomendacion/gets/?descripcion=" + descripcion)
      .then((res) => res.json())
      .then(async (data) => {
        indice.innerHTML ="";
        for (var i = 0; i < data.length; i++) {
            indice.innerHTML += (
                        `
                        <tr class="table-success">
                        <td>${data[i].descripcion}</td>
                        <td>${data[i].recomendacion}</td>
                        <td><button type="button" onclick="ObtenerInformacionAnterior(${data[i].id}, '${data[i].recomendacion}')" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Editar</button></td>
                        <td><button type="button" onclick="EliminarAccion(${data[i].id})" class="btn btn-danger">Eliminar</button></td>
                        </tr>
                        `
              )}                
              
                        
              

              
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
      await fetch("https://ahorroenergetico-api-recomenda.herokuapp.com/api/recomendacion/?id=" + id + "&institucion=La manzana de Isaac" ,{
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
  var res = await fetch("https://ahorro-energetico-api-desc.herokuapp.com/api/descripciones")
  var data = await res.json();
  var registroHTML = "";

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    registroHTML += `<option value=${obj.id}>${obj.descripcion}</option>` 
  }     
  document.getElementById("comboBoxDispositivo").innerHTML = `<option value="">Todos</option>` + registroHTML;
  document.getElementById("ComboBoxNuevoDispositivo").innerHTML = registroHTML;                                                                                                                            
}

  
async function Buscar(){
  var ComboBoxDispositivo = document.getElementById("comboBoxDispositivo");
  if(ComboBoxDispositivo.value == "Todos"){
    Listar("");

  }
  else{
    Listar(ComboBoxDispositivo.value);
  }
}

async function agregarRecomendacion(){

    
  descripcion = document.getElementById("ComboBoxNuevoDispositivo").value;
  var url = "https://ahorro-energetico-api-desc.herokuapp.com/api/descripciones/?descripcion=" + descripcion
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
  await fetch("https://ahorroenergetico-api-recomenda.herokuapp.com/api/recomendacion/", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata,
  })
      Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'Añadido con éxito',
        showConfirmButton: false,
        timer: 1500
      })
      await delay(1.5);
      ActualizarPagina();
  })}
function delay(n){
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}

function ObtenerInformacionAnterior(id, recomendacion){
  console.log(recomendacion);
  idAnterior = id;
  document.getElementById("InputRecomendacion").value = recomendacion;
}
async function Modificar(){
 
    var RecomendacionNueva = document.getElementById("InputRecomendacion").value;
    var data ={
      "recomendacion": [
        RecomendacionNueva
      ]
    }
    if(CondicionesDeAceptacion(RecomendacionNueva)==false){
      return;
    }
    const url  = "https://ahorroenergetico-api-recomenda.herokuapp.com/api/recomendacion/?id="+ idAnterior + "&institucion=La manzana de isaac"
    await fetch(url, {
      method: 'PUT', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
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


function ActualizarPagina(){
    Listar("");
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
