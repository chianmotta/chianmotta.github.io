const apiButton = document.getElementById("but");
const guardarButton = document.getElementById("guardarCriterio");
const editarButton = document.getElementById("editarCriterio");
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
  buscar("","");
}

const callApi = () => {
  dato = document.getElementById("selectIndicador").value;
  valor = document.getElementById("number").value;
  if (document.getElementById("flexCheckDefault").checked) {
      valor = "";
    }
  buscar(dato, valor);
};

async function buscar(dato, valor) {
  
  const res = await fetch(
    `https://ahorro-energetico-api-criterio.herokuapp.com/api/criterios/?dato=${dato}&valor=${valor}&institucion=${institucionGlobal}`, {
  });
  var registroHTML = "";
  var data = await res.json();

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    registroHTML +=
      `<tr class="table-success">
        <td>${obj.dato}</td> <td>${obj.valorMIN}</td> <td>${obj.valorMAX}</td> <td>${obj.objetivo}</td>
        <td><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#ModalEditar" onclick='editar("${obj.criterioID}", "${obj.dato}","${obj.valorMIN}","${obj.valorMAX}","${obj.objetivo}")'>Editar</button>
        <button class="btn btn-danger" onclick="eliminarCriterio(${obj.criterioID})">Eliminar</button></td></tr>`;
  }
  document.querySelector("#tabla").innerHTML = registroHTML;
}

function editar(id, dato, valorMIN, valorMAX, objetivo) {
  document.getElementById("editarObjetivo").value = objetivo;
  document.getElementById("editarIndicador").value = dato;
  document.getElementById("editar_valorMIN").value = valorMIN;
  document.getElementById("editar_valorMAX").value = valorMAX;

  idEditar = id;
}

async function eliminarCriterio(id) {
  Swal.fire({
    title: '¿Está seguro, que desea eliminar este criterio?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1B9752',
    cancelButtonColor: '#d33',
    cancelButtonText: "Cancelar",
    confirmButtonText: 'Si, Eliminar!'
  }).then(async (result) => {
    await fetch("https://ahorro-energetico-api-criterio.herokuapp.com/api/criterios/" + id, {
      method: 'DELETE',
    })

    if (result.isConfirmed) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Eliminado con éxito',
        showConfirmButton: false,
        timer: 1500,
      })
      await delay(1.5);
      ActualizarPagina();
    }
  })
}

async function agregarCriterio() {
  var objetivo = document.getElementById("agregarObjetivo").value;
  var dato = document.getElementById("agregarIndicador").value;
  var valorMIN = document.getElementById("agregar_valorMIN").value;
  var valorMAX = document.getElementById("agregar_valorMAX").value;
  console.log(document.getElementById("agregar_valorMAX").value <= document.getElementById("agregar_valorMIN").value);
  
  if((document.getElementById("agregar_valorMAX").value <= document.getElementById("agregar_valorMIN").value)==false){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'El valor máximo debe ser mayor al valor mínimo, por favor, intente corregir dichos datos.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })
    return;
  }
  
  if(valorMIN == "" || valorMAX==""){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'Falta llenar campos.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })
    return;
    
  }
  const data = {
    "objetivo": objetivo,
    "dato": dato,
    "valorMIN": valorMIN,
    "valorMAX": valorMAX,
    "institucion": institucionGlobal,
    "jurisdiccion": jurisdiccion
  };
  

  await fetch("https://ahorro-energetico-api-criterio.herokuapp.com/api/criterios", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
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

async function editarCriterio() {
  
  var objetivo = document.getElementById("editarObjetivo").value;
  var dato = document.getElementById("editarIndicador").value;
  var valorMIN = document.getElementById("editar_valorMIN").value;
  var valorMAX = document.getElementById("editar_valorMAX").value;
  
  
  if(valorMIN == "" || valorMAX==""){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'Falta llenar campos.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })
    return;
    
  }
  /*
  if((Math.abs(valorMIN)  >= Math.abs(valorMAX))){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'El valor máximo debe ser mayor al valor mínimo, por favor, intente corregir dichos datos.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })
    return;
  }*/

  const data = {
    "objetivo": objetivo,
    "dato": dato,
    "valorMIN": valorMIN,
    "valorMAX": valorMAX,
    "institucion": institucionGlobal,
    "jurisdiccion": jurisdiccion
  };

  await fetch("https://ahorro-energetico-api-criterio.herokuapp.com/api/criterios/" + idEditar+"?institucion=La manzana de isaac", {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Modificado con éxito',
    showConfirmButton: false,
    timer: 1500,
  });
  await delay(1.5);
  ActualizarPagina();

}

apiButton.addEventListener("click", callApi);
guardarButton.addEventListener("click", agregarCriterio);
editarButton.addEventListener("click", editarCriterio);
  
function delay(n) {
return new Promise(function (resolve) {
  setTimeout(resolve, n * 1000);
});
}

function ActualizarPagina() {
location.reload();
}
