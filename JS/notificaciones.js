var indice = document.getElementById("tablaDia");
const editarButton = document.getElementById("editarContacto");
var idEditar;
var institucionGlobal;
var usuarioGlobal;
var categoriaGlobal;

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
  listar();
};

function listar() {
  fetch(
    "https://ahorro-energetico-api-telemerg.herokuapp.com/api/contactoEmergencia/?institucion=La manzana de isaac"
  )
    .then((res) => res.json())
    .then(async (data) => {
      indice.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        var dat = data[i];
        indice.innerHTML += `<tr class="table-success">
                      <td>${dat.nombre}</td>
                      <td>${dat.telefono}</td>

                      <td>${dat.tipoEmergencia}</td>
                      <td> <button type="button" onclick='editar("${dat.id}","${dat.nombre}","${dat.telefono}","${dat.tipoEmergencia}")'  class="btn btn-success" data-bs-toggle="modal" data-bs-target="#ModalEditar">Editar</button>
                      
                      <button type="button" onclick='EliminarAccion("${dat.id}")' class="btn btn-danger">Eliminar</button></td>
                    </tr>`;
      }
    });
}

function EliminarAccion(Id) {
  fetch(
    " https://ahorro-energetico-api-telemerg.herokuapp.com/api/contactoEmergencia/?institucion=La manzana de isaac&id=" +
      Id,
    {
      method: "DELETE",
    }
  )
    .then((res) => res.json())
    .then((res) => {
      listar();
    });
}

function editar(id, nombre, telefono, tipoEmergencia) {
  document.getElementById("nombre-modal").value = nombre;
  document.getElementById("telefono-modal").value = telefono;
  document.getElementById("notificacion-modal").value = tipoEmergencia;
  idEditar = id;
}

async function editarContacto() {
  await fetch(
    "https://ahorro-energetico-api-telemerg.herokuapp.com/api/contactoEmergencia/?institucion=La manzana de isaac&id=" +
      idEditar,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        telefono: document.getElementById("telefono-modal").value,
        nombre: document.getElementById("nombre-modal").value,
        tipoEmergencia: document.getElementById("notificacion-modal").value,
      }),
    }
  );
  listar("");
}

async function agregarContactoNuevo() {
  var telefono = document.getElementById("agregar-telefono").value;
  var nombre = document.getElementById("agregar-nombre").value;
  var tipoEmergencia = document.getElementById("agregar-notificacion").value;
  if (telefono == "" || nombre == "") {
    alert("Todos los campos son requerido");
  } else {
    await fetch(
      "https://ahorro-energetico-api-telemerg.herokuapp.com/api/contactoEmergencia/?institucion=La manzana de isaac",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telefono: telefono,
          nombre: nombre,
          tipoEmergencia: tipoEmergencia,
        }),
      }
    );
    listar("");
  }
}

agregarContacto.addEventListener("click", agregarContactoNuevo);
editarContactoA.addEventListener("click", editarContacto);
