const buscarButton = document.getElementById("but");
var indice = document.getElementById("Registros");
var idEditar;
var zonasGlobales;
var institucionGlobal;

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
  ListarRegistros();
  //listar(0, 0, institucionGlobal);
};

async function ListarRegistros() {
  await fetch(sql)
    .then((res) => res.json())
    .then(async (data) => {
      indice.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        var NombreDispositivo;
        var sql =
          "https://ahorro-energetico-api-desc.herokuapp.com/api/descripciones/" +
          data[i].id;
        await fetch(sql)
          .then((res) => res.json())
          .then(async (descripcionData) => {
            indice.innerHTML += `
                     <tr class="table-success">
                     <td>${data[i].recomendacion}</td>
                     </tr>
                     `;
          });
      }
      BoxDispositivo();
    });
}

async function listar(tipoConexion, descripcion) {
  var res = await fetch(
    "https://ahorro-energetico-api-disps.herokuapp.com/api/dispositivos/descripcion/?conexion=" +
      tipoConexion +
      "&descripcion=" +
      descripcion +
      "&institucion=" +
      institucionGlobal,
    {}
  );
  var registroHTML = "";
  var data = await res.json();

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    registroHTML += `<tr class="table-success"><th scope="row">${
      obj.dispositivoID
    }</th> 
          <td>${obj.descripcion}</td> <td>${
      obj.reparacion == 0 ? "No" : "Si"
    }</td> <td>${obj.aula}</td> <td>${obj.planta}</td> 
          <td>${obj.tipoConexion}</td> <td>${
      obj.direccionIP == "" ? "---------" : obj.direccionIP
    }</td> <td>${obj.consumo}</td>  
          <td><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#ModalEditar" 
          onclick='editar("${obj.dispositivoID}","${obj.tipoConexion}","${
      obj.descID
    }","${obj.reparacion}","${obj.planta}","${obj.aula}","${
      obj.direccionIP
    }","${obj.numeroDispArduino}","${obj.consumo}")'>Editar</button>
          <button class="btn btn-danger" onclick="eliminarDispositivo(${
            obj.dispositivoID
          })">Eliminar</button></td> </tr>`;
  }
  document.querySelector("#Registros").innerHTML = registroHTML;
}

function cargarZonas(select, combo) {
  var zonas = "";

  for (var i = 0; i < zonasGlobales[select].length; i++) {
    //console.log(zonasGlobales[select][i][1]);
    zonas += `<option>${zonasGlobales[select][i][1]}</option>`;
  }
  combo.innerHTML = zonas;

  cargarDispositivosZona();
}

async function cargarCombo() {
  var data;
  try {
    res = await fetch("https://pp1-iot.herokuapp.com/api/areas/nombres");
    data = await res.json();
    zonasGlobales = data;
    cargarZonas("piso 0", document.querySelector("#editarZona"));
  } catch (e) {
    console.log("error al comunicarse con IOT");
  }
}

async function cargarDispositivosZona() {
  var zona = document.getElementById("editarZona");
  var planta = document.getElementById("editarPiso").value;
  document.getElementById("comboTipoDispositivo").innerHTML = "";
  try {
    res = await fetch(
      "https://ahorro-energetico-api-disps.herokuapp.com/api/dispositivos/descripcion/?zona=" +
        zona.options[zona.selectedIndex].text +
        "&planta=" +
        planta
    );
    data = await res.json();
    //console.log(data);
    for (var i = 0; i < data.length; i++) {
      document.getElementById(
        "comboTipoDispositivo"
      ).innerHTML += `<option value=${data[i].dispositivoID}>${data[i].descripcion} - ${data[i].nombre}</option>`;
    }
  } catch (e) {
    console.log("error al cargar los datos de los dispositivos de dicha zona");
  }
}

async function guardarDispositivoRoto() {
  Swal.fire({
    title: "¿Desea reportar que este dispositivo esta roto?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#1B9752",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Si, Agregar!",
  }).then(async (result) => {
    
    if (result.isConfirmed) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Añadido con éxito",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    ListarRegistros();
  });
}

function delay(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
}

function ActualizarPagina() {
  ListarRegistros();
}
async function ListarRegistros() {
  sql =
    "https://ahorro-energetico-api-rec-alum.herokuapp.com/api/recomendacionAlumnos/recomendacionDispRoto/?institucion=la manzana de isaac";
  await fetch(sql)
    .then((res) => res.json())
    .then(async (data) => {
      indice.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        indice.innerHTML += `
                          <tr class="table-success">
                          <td>${data[i].descripcion}</td>
                          <td>${data[i].planta}</td>
                          <td>${data[i].aula}</td>
                          <td>${data[i].nombre}</td>
                          <td>${data[i].nombreAlumno}</td>
                           </tr>
                          `;
      }
    });
}
