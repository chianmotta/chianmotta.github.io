  
var indice = document.getElementById("Registros");
var GuardarFechaDesde;
var ComboBoxDispositivo = document.getElementById("comboBoxDispositivo");
const AlertaFechaDesdeMenorAFechaHasta = "La fecha inicial debe ser inferior a la fecha fin de la meta, porfavor, ingrese una fecha inicial inferior a la fecha fin de la meta."
const AlertaFechaDesdeEsMenorAFechaActual = "La fecha inicial es menor a la fecha actual, porfavor, ingrese una fecha que sea vigente."
var FiltrarPorFecha = true;
var FechaDesdeDelRegistro;
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
  }
  else{
    institucionGlobal = "La manzana de isaac";
  }
}


async function Listar() {
    await fetch("http://localhost:4022/api/meta/?institucion="+institucionGlobal)
     .then((res) => res.json())
     .then(async (data) => {
       indice.innerHTML ="";
           for (var i = 0; i < data.length; i++) {
             var NombreDispositivo; 
             await fetch("http://localhost:4001/api/descripciones/"+data[i].id)
              .then((res) => res.json())
              .then(async () => {
                await fetch("http://localhost:4001/api/descripciones/"+data[i].descID).then((res) => res.json())
                          .then(async (data) => NombreDispositivo = data[0].descripcion)
                          const FechaDesdeSegundaConversion = NormalizadorDeFechaSegundaForma(data[i].fechaDesde);
                          const FechaHastaSegundaConversion = NormalizadorDeFechaSegundaForma(data[i].fechaHasta);
                          const FechaDesdePrimeraConversion = NormalizadorDeFecha(data[i].fechaDesde);
                          const FechaHastaPrimeraConversion = NormalizadorDeFecha(data[i].fechaHasta);
               indice.innerHTML += (
                       `<tr class="table-success">
                       <td>${i+1}</td>
                       <td>${NombreDispositivo}</td>
                       <td>${FechaDesdeSegundaConversion}</td>
                       <td>${FechaHastaSegundaConversion}</td>
                       <td>${data[i].consumoEsperado}</td>
                       <td><button type="button" onclick="ObtenerInformacionAnterior(${data[i].id} ,'${FechaDesdePrimeraConversion}', '${FechaHastaPrimeraConversion}',  '${data[i].consumoEsperado}')" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Modificar</button></td>                  
                       <td><button type="button" onclick="eliminarMeta(${data[i].id})" class="btn btn-danger">Eliminar</button></td>                  
                       
                       </tr>`
             )})}                
              BoxDispositivo();
                   });
 }

async function eliminarMeta (id){
Swal.fire({
  title: '¿Está seguro, que desea eliminar esta meta?',
  text: "¡No podrás revertir esto!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#1B9752',
  cancelButtonColor: '#d33',
  cancelButtonText: "Cancelar",
  confirmButtonText: 'Si, Eliminar!'
}).then(async (result) => {
  await fetch("http://localhost:4022/api/meta/?id="+ id + "&institucion=" + institucionGlobal , {
    method: 'DELETE'})
  if (result.isConfirmed) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Eliminado con éxito',
      showConfirmButton: false,
    })
    ActualizarPagina();
  }
})
}




function NormalizadorDeFecha (fecha){
  const date = new Date(fecha);
  var [year, month, day] = [ date.getFullYear() , date.getMonth()+1 , date.getDate() ];
  
if(month < 10){
  month = "0" + month;
}

if(day < 10){
  day = "0" + day;
}

var fecha = year + "-" + month + "-" + day;

      return fecha;
}


function NormalizadorDeFechaSegundaForma (fecha){
  const date = new Date(fecha);
  var [year, month, day] = [ date.getFullYear() , date.getMonth()+1 , date.getDate() ];
  
if(month < 10){
  month = "0" + month;
}

if(day < 10){
  day = "0" + day;
}

var fecha = day + "-" + month + "-" + year;

      return fecha;
}


  function ObtenerInformacionAnterior(id, fechaDesde, fechaHasta, consumoEsperado){
  FechaDesdeDelRegistro = fechaDesde;
  document.getElementById("InputConsumo").value = consumoEsperado;
  document.getElementById("finished").value = fechaHasta;
  IDParaModificar = id;
 }

 function condicionesDeFechasDesdeHasta(FechaDesde, FechaHasta){

  if(NormalizadorDeFecha(FechaDesde) == "NaN-NaN-NaN" ||  NormalizadorDeFecha(FechaHasta)=="NaN-NaN-NaN"){
    return 1;
  }
  if(FechaDesde > FechaHasta){
    return -1;
  }
  var now = moment();
  if(FechaDesde <= NormalizadorDeFecha(now)){
    return 0;
  }
 
 }


 async function Modificar(){
  var finishedValue = document.getElementById("finished").value;
  var consumoEsperado = document.getElementById("InputConsumo").value;
Swal.fire({
  title: '¿Está seguro, que desea modificar la meta?',
  icon: 'question',
  showCancelButton: true,
  confirmButtonColor: '#1B9752',
  cancelButtonColor: '#d33',
  cancelButtonText: "Cancelar",
  confirmButtonText: 'Si, Modificar!'
}).then(async (result) => {

  if(CondicionesDeAceptacion(FechaDesdeDelRegistro, finishedValue, consumoEsperado)==false)
  return;
  var url = "http://localhost:4022/api/meta/?id=" + IDParaModificar;
console.log(url);
const data = { "fechaDesde": FechaDesdeDelRegistro, 
               "fechaHasta": finishedValue,
               "consumoEsperado": consumoEsperado,
               "institucion": institucionGlobal
};
  await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    
 })
 
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
function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}
 async function Filtrar(TipoDispositivo){
    await fetch("http://localhost:4022/api/meta/")
    .then((res) => res.json())
    .then(async (data) => {
      indice.innerHTML ="";
      for (var i = 0; i < data.length; i++) {
        if(TipoDispositivo == data[i].descID){
        await fetch("http://localhost:4001/api/descripciones/"+data[i].id)
              .then((res) => res.json())
              .then(async () => {
                await fetch("http://localhost:4001/api/descripciones/"+data[i].descID).then((res) => res.json())
                          .then(async (data) => NombreDispositivo = data[0].descripcion)
                        
                          const FechaDesdeSegundaConversion = NormalizadorDeFechaSegundaForma(data[i].fechaDesde);
                          const FechaHastaSegundaConversion = NormalizadorDeFechaSegundaForma(data[i].fechaHasta);
                          const FechaDesdePrimeraConversion = NormalizadorDeFecha(data[i].fechaDesde);
                          const FechaHastaPrimeraConversion = NormalizadorDeFecha(data[i].fechaHasta);
               indice.innerHTML += (
                       `<tr class="table-success">
                       <td>${i+1}</td>
                       <td>${NombreDispositivo}</td>
                       <td>${FechaDesdeSegundaConversion}</td>
                       <td>${FechaHastaSegundaConversion}</td>
                       <td>${data[i].consumoEsperado}</td>
                       <td><button type="button" onclick="ObtenerInformacionAnterior(${data[i].id} ,'${FechaDesdePrimeraConversion}', '${FechaHastaPrimeraConversion}',  '${data[i].consumoEsperado}', '${NombreDispositivo}', ${data[i].descID})" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Modificar</button></td>                  
                       <td><button type="button" onclick="eliminarMeta(${data[i].id})" class="btn btn-danger">Eliminar</button></td>                  
                       
                       </tr>`
               )
              }
            
              )
          }
        }
      }
    )
    }
    async function BoxDispositivo(){
      await fetch("http://localhost:4001/api/descripciones")
      .then((res) => res.json())
      .then(async (data) => {
            for (var i = 0; i < data.length; i++) {
              ComboBoxDispositivo.innerHTML += (
                      `
                      <option>${data[i].descripcion}</option>
                      `
                    )
              comboBoxDispositivoAgregar.innerHTML += (
                `
                <option>${data[i].descripcion}</option>
                `
                
              )
                  
                   }                                                                                                              
                    });
    }
 Listar();

 async function Buscar(){
  var ComboBoxDispositivo = document.getElementById("comboBoxDispositivo").value;

  var url = "http://localhost:4001/api/descripciones/?descripcion="+ComboBoxDispositivo
  await fetch(url)
  .then((res) => res.json())
  .then(async (data) => {
    if(ComboBoxDispositivo == "Todos"){
      Listar();

    }
    else{
      Filtrar(data[0].id);

    }
})
}



function ActualizarPagina(){
location. reload();
}
 


function desactivarFiltroXFecha(){
  if(FiltrarPorFecha == true){
  document.getElementById("fecha_inicio_filtro").disabled = true;
  document.getElementById("fecha_fin_filtro").disabled = true;
  FiltrarPorFecha = false;
  document.getElementById("button_filtroXfecha").innerHTML = ("Filtrar por fecha");
}
else{
  document.getElementById("fecha_inicio_filtro").disabled = false;
  document.getElementById("fecha_fin_filtro").disabled = false;
  FiltrarPorFecha = true;
  document.getElementById("button_filtroXfecha").innerHTML = ("No Filtrar por fecha");

}
}

async function AgregarMeta(){
  Swal.fire({
    title: '¿Desea agregar esta meta?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#1B9752',
    cancelButtonColor: '#d33',
    cancelButtonText: "Cancelar",
    confirmButtonText: 'Si, Agregar!'
  }).then(async (result) => {
    

    var NuevaMeta;
    var comboBoxDispositivo = document.getElementById("comboBoxDispositivoAgregar").value;
    var InputConsumoAgregar = document.getElementById("InputConsumoAgregar").value;
    
    //ESTO VA A CAMBIAR TENERLO A MANO
    var comboBoxInstitucion = "La manzana de isaac";
    var comboBoxJuridiccion = "Ciudad Autónoma de Buenos Aires";
    
    var AgregarFechaDesde = document.getElementById("Addstart").value;
    var AgregarFechaHasta = document.getElementById("Addfinished").value;


   if(CondicionesDeAceptacion(AgregarFechaDesde, AgregarFechaHasta, InputConsumoAgregar)==false)
   return;

   console.log(comboBoxDispositivo);
    var url = "http://localhost:4001/api/descripciones/?descripcion="+comboBoxDispositivo;
    console.log(url);
      await fetch(url)
      .then((res) => res.json())
      .then(async (data) => {
    NuevaMeta = {
      "descID":  data[0].id,
      "fechaDesde": AgregarFechaDesde,
      "fechaHasta": AgregarFechaHasta,
      "consumoEsperado": InputConsumoAgregar,
      "institucion": comboBoxInstitucion,
      "jurisdiccion": comboBoxJuridiccion
    }
    JSONdata = JSON.stringify(NuevaMeta);
    await fetch("http://localhost:4022/api/meta", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSONdata,
    })
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
  
  })
}

function ValidarSoloNumeros(evt){
    
  var code = (evt.which) ? evt.which : evt.keyCode;
  
  if(code==8) { 
    return true;
  } else if(code>=48 && code<=57) { 
    return true;
  } else{ 
    return false;
  }
}

function CondicionesDeAceptacion(fechaDesde, FechaHasta, InputConsumo){
   
  if(condicionesDeFechasDesdeHasta(fechaDesde,FechaHasta) == 1){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'Complete y seleccione las fechas inicio y fin de la nueva meta.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })
    return false;
  }

  if(condicionesDeFechasDesdeHasta(fechaDesde,FechaHasta) == -1){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'La fecha de inicio de la meta debe ser mayor a la fecha de su finalización! porfavor, corrija dichos valores ingresados.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })
    return false;
  }
  if(condicionesDeFechasDesdeHasta(fechaDesde,FechaHasta) == 0){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'La fecha de inicio debe ser a partir de la fecha de hoy en adelante, por favor, corrija dichos valores ingresados.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })
    return false;
  }
  if(InputConsumo == ""){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'Ingrese el consumo esperado que desea.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })
    return false;
  }
    if(InputConsumo <= 100){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'Se espera que el consumo esperado sea mayor o igual a 100 como mínimo.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })
    return false;
  }
  return true;
}