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
      "http://localhost:4022/api/meta/historica/?descripcion=" + descripcion + "&institucion=" + institucionGlobal, {
    });
    var registroHTML = "";
    var data = await res.json();
  
    for (var i = 0; i < data.length; i++) {
      var obj = data[i];
      registroHTML +=
        `<tr class="table-success"><th scope="row">${obj.id}</th> 
            <td>${obj.descripcion}</td> <td>${format(obj.fechaDesde)}</td> <td>${format(obj.fechaHasta)}</td> <td>${obj.consumoEsperado}</td> </tr>`;
    }
    document.querySelector("#Registros").innerHTML = registroHTML;
  }

function format(dato) {
    const date = new Date(dato);
    const [year, month, day] = [date.getFullYear(), date.getMonth()+1, date.getDate()];
    return day.toString().padStart(2, '0') + "-" + month.toString().padStart(2, '0') + "-" + year;
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
}