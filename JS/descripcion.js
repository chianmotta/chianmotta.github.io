const apiButton = document.getElementById("but");
const guardarButton = document.getElementById("guardarDescripcion");
const editarButton = document.getElementById("editarDescripcion");
var idEditar;
var institucionGlobal;
var usuarioGlobal;
var categoriaGlobal;
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
  listar("");
}

const callApi = () => {
  descripcion = document.getElementById("descripcion").value;
  if (descripcion.length == 0) {
    listar("");
  } else {
    listar(descripcion);
  }
};

async function listar(descripcion) {
  var res = await fetch("http://localhost:4001/api/descripciones/?descripcion=" + descripcion + "&institucion=" + institucionGlobal)
  var registroHTML = "";
  var data = await res.json();

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    registroHTML +=
      `<tr class="table-success"><th scope="row">${obj.id}</th> <td>${obj.descripcion}</td>
        <td><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#ModalEditar" onclick='editar("${obj.id}","${obj.descripcion}")'>Editar</button>
        <button class="btn btn-danger" onclick="eliminarDescripcion(${obj.id})">Eliminar</button></td></tr>`;
  }
  document.querySelector("#tabla").innerHTML = registroHTML;
}

async function eliminarDescripcion(id) {
  Swal.fire({
    title: '¿Está seguro, que desea eliminar esta categoria?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1B9752',
    cancelButtonColor: '#d33',
    cancelButtonText: "Cancelar",
    confirmButtonText: 'Si, Eliminar!'
  }).then(async (result) => {
    await fetch("http://localhost:4001/api/descripciones/" + id, {
      method: 'DELETE',
    });

    if (result.isConfirmed) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Eliminado con éxito',
        showConfirmButton: false,
      })
      listar("");
    }
  })
}

function editar(id, descripcion) {
  var recipiente = document.getElementById("recipiente-editar");
  recipiente.value = descripcion;
  idEditar = id;
}

async function editarDescripcion() {
  const descripcion = document.getElementById("recipiente-editar").value

  await fetch("http://localhost:4001/api/descripciones/" + idEditar, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      "descripcion": descripcion,
      "institucion": institucionGlobal,
      "jurisdiccion": jurisdiccion
     }),
  })
  listar("");
}

async function agregarDescripcion() {
  var recipiente = document.getElementById("recipiente-agregar").value;

  await fetch("http://localhost:4001/api/descripciones", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      "descripcion": recipiente, 
      "institucion": institucionGlobal,
      "jurisdiccion": jurisdiccion
    }),
  });
  listar("");
}

apiButton.addEventListener("click", callApi);
guardarButton.addEventListener("click", agregarDescripcion);
editarButton.addEventListener("click", editarDescripcion);