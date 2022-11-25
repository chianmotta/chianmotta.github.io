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
  Swal.fire({
    title: "¿Está seguro, que desea eliminar esta notificación?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1B9752",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Si, Eliminar!",
  })
    .then(async (result) => {
     
      if (result.isConfirmed) {
        fetch(
          " https://ahorro-energetico-api-telemerg.herokuapp.com/api/contactoEmergencia/?institucion=La manzana de isaac&id=" +
            Id,
          {
            method: "DELETE",
          }
        )
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Eliminado con éxito",
          showConfirmButton: false,
          timer: 1500,
        });
        listar();
      }
      listar();
    })
}

function editar(id, nombre, telefono, tipoEmergencia) {
  document.getElementById("nombre-modal").value = nombre;
  document.getElementById("telefono-modal").value = telefono;
  document.getElementById("notificacion-modal").value = tipoEmergencia;
  idEditar = id;
}

async function editarContacto() {
  if (document.getElementById("telefono-modal").value == "" || document.getElementById("nombre-modal").value == "" || document.getElementById("notificacion-modal").value) {
    Swal.fire({
      icon: "error",
      title: "Error de ingreso de datos!",
      text: "No puede haber campos vacios.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#1B9752",
    });
    return;
  } 
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
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Actualizado con éxito",
    showConfirmButton: false,
    timer: 1500,
  });
  listar("");
}

async function agregarContactoNuevo() {
  var telefono = document.getElementById("agregar-telefono").value;
  var nombre = document.getElementById("agregar-nombre").value;
  var tipoEmergencia = document.getElementById("agregar-notificacion").value;
  if (telefono == "" || nombre == "") {
    Swal.fire({
      icon: "error",
      title: "Error de ingreso de datos!",
      text: "No puede haber campos vacios.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#1B9752",
    });
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
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "Agregado con éxito",
      showConfirmButton: false,
      timer: 1500,
    });
    listar("");
  }
}

agregarContacto.addEventListener("click", agregarContactoNuevo);
editarContactoA.addEventListener("click", editarContacto);
