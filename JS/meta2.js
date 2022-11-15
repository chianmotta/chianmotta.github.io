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

function buscar() {
    var descripcion = document.getElementById("comboBoxDispositivo").value;
    listar(descripcion);
};

async function listar(descripcion) {
    var res = await fetch(
      "http://localhost:4022/api/meta/?descripcion=" + descripcion + "&institucion=" + institucionGlobal, {
    });
    var registroHTML = "";
    var data = await res.json();
  
    for (var i = 0; i < data.length; i++) {
      var obj = data[i];
      registroHTML +=
        `<tr class="table-success"><th scope="row">${obj.id}</th> 
         <td>${obj.descripcion}</td> <td>${format(obj.fechaDesde)}</td> <td>${format(obj.fechaHasta)}</td> <td>${obj.consumoEsperado}</td> 
         <td><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick='editar("${obj.id}","${obj.fechaDesde}","${obj.fechaHasta}","${obj.consumoEsperado}")'>Modificar</button></td>                  
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
    await fetch("http://localhost:4022/api/meta/?id="+ id, {
      method: 'DELETE'
    })
    if (result.isConfirmed) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Eliminado con éxito',
        showConfirmButton: false,
      })
      listar(0);
    }
  })
}

async function AgregarMeta(){
  var descripcion = document.getElementById("comboBoxDispositivoAgregar").value;
  var consumo = document.getElementById("InputConsumoAgregar").value;
  var fechaDesde = document.getElementById("Addstart").value;
  var fechaHasta = document.getElementById("Addfinished").value;

  await fetch("http://localhost:4022/api/meta", {
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
  listar(0);
}

function editar(id, fechaDesde, fechaHasta, consumo) {
  document.getElementById("inicio").value = formatoInvertido(fechaDesde);
  document.getElementById("finished").value = formatoInvertido(fechaHasta);
  document.getElementById("InputConsumo").value = consumo;
  idEditar = id;
}

async function editarDescripcion() {
  //var descripcion = document.getElementById("comboBoxDispositivoAgregar").value;
  var fechaDesde = document.getElementById("inicio").value;
  var fechaHasta = document.getElementById("finished").value;
  var consumo = document.getElementById("InputConsumo").value;

  await fetch("http://localhost:4022/api/meta/?" + idEditar, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      "fechaDesde": fechaDesde, 
      "fechaHasta": fechaHasta,
      "consumoEsperado": consumo, 
      "institucion": institucionGlobal
     }),
  })
  listar("");
}

function validarFecha(inicio, final){
  if (inicio.value != "" && final.value != ""){
    if (inicio.value > final.value){
      final.value = inicio.value;
    }
  }
}

async function cargarCombo() {
    var res = await fetch("http://localhost:4001/api/descripciones");
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
    
