var indice = document.getElementById("Registros");

var institucionGlobal;
var usuarioGlobal;
var categoriaGlobal;

let fecha_inicio = document.getElementById("fecha_inicio");
//let fecha_fin = document.getElementById("fecha_fin");
let flexCheckDefault = document.getElementById("flexCheckDefault");
var habilitar = true;
fecha_inicio.disabled = true
//fecha_fin.disabled = true

flexCheckDefault.addEventListener("click", () => {
  if(habilitar == true){
  fecha_inicio.disabled = false
  //fecha_fin.disabled = false
  habilitar = false
}
else{
  fecha_inicio.disabled = true
  //fecha_fin.disabled = true
  habilitar = true
  
}
})


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
};

async function Buscar() {
  let fechaInicio = document.getElementById("fecha_inicio").value;
 // let fechaFin = document.getElementById("fecha_fin").value;
  if(habilitar==false){
    if(fechaInicio=="" //|| fechaFin==""){
){      Swal.fire({
        icon: "error",
        title: "Error de ingreso de datos!",
        text: "La fecha está incompleta o vacía.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#1B9752",
      });
      return;
    }

  }
  await fetch("https://ahorro-energetico-api-log.herokuapp.com/api/logAcciones/0")
    .then((res) => res.json())
    .then(async (data) => {
      indice.innerHTML = "";
      if (document.getElementById("flexCheckDefault").checked) {

      for (var i = 0; i < data.length; i++) {
          var date = new Date(data[i].fecha);

          var formatted_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        if (
          data[i].fecha.substring(0,10) >= fechaInicio.substring(0,10)
          //data[i].fecha.substring(0,10) <= fechaFin.substring(0,10)
        ) {
          indice.innerHTML += `
              
                    <tr class="table-success">
                    <td scope="col">${formatted_date}</td>
                      <td scope="col">${data[i].accion}</td>
                      <td scope="col">${data[i].objetivo}</td>
                      <td scope="col">${data[i].tipoDato}</td>
                        <td scope="col">${data[i].valor}</td>
                        <td scope="col">${data[i].nombre}</td>
                        <td scope="col">${data[i].planta}</td>
                        <td scope="col">${data[i].aula}</td>
                    </tr> `;
        }
      }
    }
    else{

cargarRows();
    }
    });
}

async function cargarRows() {
  await fetch("https://ahorro-energetico-api-log.herokuapp.com/api/logAcciones/0")
    .then((res) => res.json())
    .then(async (data) => {
      indice.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].fecha);
        var date = new Date(data[i].fecha);

          var formatted_date = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        indice.innerHTML += `
              
        <tr class="table-success">
        <td scope="col">${formatted_date}</td>
          <td scope="col">${data[i].accion}</td>
          <td scope="col">${data[i].objetivo}</td>
          <td scope="col">${data[i].tipoDato}</td>
            <td scope="col">${data[i].valor}</td>
            <td scope="col">${data[i].nombre}</td>
            <td scope="col">${data[i].planta}</td>
            <td scope="col">${data[i].aula}</td>
        </tr> `;
      }
    });
}
cargarRows();

