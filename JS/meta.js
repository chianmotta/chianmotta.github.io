const buscarButton = document.getElementById("but");
const guardarButton = document.getElementById("agregarDispositivo");
const editarButton = document.getElementById("editarDispositivo");
var idEditar;
var institucionGlobal;
const jurisdiccion = "Ciudad Autonoma de Buenos Aires";

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
  cargarCombo();
  listar(0);
}

function Buscar() {
    var descripcion = document.getElementById("comboBoxDispositivo").value;
    listar(descripcion);
};

async function listar(descripcion) {
    var res = await fetch(
      "https://ahorro-energetico-api-meta.herokuapp.com/api/meta/?descripcion=" + descripcion + "&institucion=" + institucionGlobal, {
    });
    var registroHTML = "";
    var data = await res.json();
  
    for (var i = 0; i < data.length; i++) {
      var obj = data[i];
      registroHTML +=
        `<tr class="table-success"> 
         <td>${obj.descripcion}</td> <td>${format(obj.fechaDesde)}</td> <td>${format(obj.fechaHasta)}</td> <td>${obj.consumoEsperado}</td> 
         <td><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick='editar("${obj.id}","${obj.fechaDesde}","${obj.fechaHasta}","${obj.consumoEsperado}")'>Editar</button></td>                  
         <td><button type="button" onclick="eliminarMeta(${obj.id})" class="btn btn-danger">Eliminar</button></td></tr>`;
    }
    document.querySelector("#Registros").innerHTML = registroHTML;
  }

function format(dato) {
  const date = new Date(dato);
  const [year, month, day] = [date.getFullYear(), date.getMonth()+1, date.getDate()];
  return day.toString().padStart(2, '0') + "-" + month.toString().padStart(2, '0') + "-" + year;
}

function formatoInvertido(dato) {
  const date = new Date(dato);
  const [year, month, day] = [date.getFullYear(), date.getMonth()+1, date.getDate()];
  return year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');
}

function delay(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
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
    await fetch("https://ahorro-energetico-api-meta.herokuapp.com/api/meta/?id="+ id, {
      method: 'DELETE'
    })
    if (result.isConfirmed) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Eliminado con éxito',
        showConfirmButton: false,
        timer: 1500,
      });
      await delay(1.5);
      ActualizarPagina();
    }
  })
}
function ActualizarPagina() {
  location.reload();
}

async function AgregarMeta(){

  
    var descripcion = document.getElementById("comboBoxDispositivoAgregar").value;
    var consumo = document.getElementById("InputConsumoAgregar").value;
    var fechaDesde = document.getElementById("Addstart").value;
    var fechaHasta = document.getElementById("Addfinished").value;
  if(consumo=="" || fechaDesde=="" || fechaDesde==undefined || fechaHasta=="" || fechaHasta==undefined){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'Falta llenar campos',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })
    return;
  }else{
    if(consumo<=0){
      Swal.fire({
        icon: 'error',
        title: 'Error de ingreso de datos!',
        text: 'El consumo tiene que ser mayor o igual 0.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1B9752',
      })
      return;
  
    }
    if(fechaDesde>=fechaHasta)
    {
      Swal.fire({
        icon: 'error',
        title: 'Error de ingreso de datos!',
        text: 'La fecha de fin es menor a la fecha que comienza la meta.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1B9752',
      })
      return;
  
    }else{
    await fetch("https://ahorro-energetico-api-meta.herokuapp.com/api/meta", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "descID": descripcion, 
        "fechaDesde": fechaDesde, 
        "fechaHasta": fechaHasta,
        "consumoEsperado": consumo, 
        "institucion": institucionGlobal,
        "jurisdiccion": jurisdiccion
      }),
    });

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Añadido con éxito',
        showConfirmButton: false,
        timer: 1500,
      });
      await delay(1.5);
      ActualizarPagina();
    }
  }}

function editar(id, fechaDesde, fechaHasta, consumo) {
  document.getElementById("inicio").value = formatoInvertido(fechaDesde);
  document.getElementById("finished").value = formatoInvertido(fechaHasta);
  document.getElementById("InputConsumo").value = consumo;
  idEditar = id;
}

async function Modificar() {
  var fechaHasta = document.getElementById("finished").value;
  var consumo = document.getElementById("InputConsumo").value;
  console.log(fechaHasta,consumo);
  if(  consumo==undefined ||  fechaHasta=="" || fechaHasta==undefined ){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'Falta llenar campos.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })  
  }else{
    if(consumo<=0)
    {
      Swal.fire({
        icon: 'error',
        title: 'Error de ingreso de datos!',
        text: 'El consumo tiene que ser mayor o igual 0.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1B9752',
      })  
    }else{
  console.log( fechaHasta, consumo);
  await fetch("https://ahorro-energetico-api-meta.herokuapp.com/api/meta/?id=" + idEditar, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      "fechaHasta": fechaHasta,
      "consumoEsperado": consumo, 
      "institucion": institucionGlobal
    }),
  })
  
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Modificado con éxito',
    showConfirmButton: false,
    timer: 1500,
  });
  await delay(1.5);
  ActualizarPagina();
}}
}

function validarFecha(inicio, final){
  if (inicio.value != "" && final.value != ""){
    if (inicio.value >= final.value){
      var date = new Date(inicio.value);
      var next = new Date(date.setDate(date.getDate() + 2))
      final.value = formatoInvertido(next);
    }
  }
}


async function cargarCombo() {
    var res = await fetch("https://ahorro-energetico-api-desc.herokuapp.com/api/descripciones");
    var registroHTML = "";
    var data = await res.json();
  
    for (var i = 0; i < data.length; i++) {
      var obj = data[i];
      registroHTML +=
        `<option value=${obj.id}>${obj.descripcion}</option>`;
    }
    document.querySelector("#comboBoxDispositivo").innerHTML = `<option value=0>Todos</option>` + registroHTML;
    document.querySelector("#comboBoxDispositivoAgregar").innerHTML = registroHTML;
}