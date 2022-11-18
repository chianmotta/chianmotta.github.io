const buscarButton = document.getElementById("but");
const guardarButton = document.getElementById("agregarDispositivo");
const editarButton = document.getElementById("editarDispositivo");
var idEditar;
var institucionGlobal;
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
  } else {
    institucionGlobal = "La Manzana de Isaac";
  }
  cargarCombo();
  listar(0);
};

function buscar() {
  var descripcion = document.getElementById("comboBoxDispositivo").value;
  listar(descripcion);
}

async function listar(descripcion) {
  var res = await fetch(
    "https://ahorro-energetico-api-meta.herokuapp.com/api/meta/historica/?descripcion=" +
      descripcion +
      "&institucion=" +
      institucionGlobal,
    {}
  );
  var registroHTML = "";
  var data = await res.json();

  for (var i = 0; i < data.length; i++) {
    registroHTML += `<tr class="table-success">
            <td>${data[i].descripcion}</td> <td>${data[i].fechaDesde.substring(
      0,
      10
    )}</td> <td>${data[i].fechaHasta.substring(0, 10)}</td> <td>${
      data[i].consumoEsperado
    }</td> </tr>`;
  }
  document.querySelector("#Registros").innerHTML = registroHTML;
}

async function cargarCombo() {
  var res = await fetch(
    "https://ahorro-energetico-api-desc.herokuapp.com/api/descripciones"
  );
  var registroHTML = "";
  var data = await res.json();

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    registroHTML += `<option value=${obj.id}>${obj.descripcion}</option>`;
  }
  document.querySelector("#comboBoxDispositivo").innerHTML =
    `<option value=0>Todos</option>` + registroHTML;
}
