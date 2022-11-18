

var indice = document.getElementById("Escritura");

var institucionGlobal;
var usuarioGlobal;
var categoriaGlobal;

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
}

function Buscar(){
  let fechaInicio = document.getElementById("fecha_inicio").value
  let fechaFin = document.getElementById("fecha_fin").value
  let HoraIni = document.getElementById("appt-time_inicial").value


  fetch('https://ahorro-energetico-api-log.herokuapp.com/api/logAcciones/0')
  .then((res) => res.json())
  .then(async (data) => {
        indice.innerHTML ="";
        for (var i = 0; i < data.length; i++) {
          var cambiarISOdate = new Date(data[i].fecha);
          var INTHoraini = new Date(HoraIni);
          var INTHoraini =  HoraIni;
          if(data[i].fecha >= fechaInicio && data[i].fecha <= fechaFin && cambiarISOdate > INTHoraini) {
          indice.innerHTML += (
                    `<tr >
              
                    <th scope="col">${data[i].id}</th>
                      <th scope="col">${data[i].fecha}</th>
                      <th scope="col">${data[i].accion}</th>
                      <th scope="col">${data[i].objetivo}</th>
                      <th scope="col">${data[i].tipoDato}</th>
                        <th scope="col">${data[i].valor}</th>
                        <th scope="col">${data[i].nombre}</th>
                        <th scope="col">${data[i].planta}</th>
                        <th scope="col">${data[i].aula}</th>
                    </tr> `
                  ) }   
                  
                }                                                                                                           
                });
}


function cargarRows(){
    fetch('https://ahorro-energetico-api-log.herokuapp.com/api/logAcciones/0')
      .then((res) => res.json())
      .then(async (data) => {
            indice.innerHTML ="";
            for (var i = 0; i < data.length; i++) {

              indice.innerHTML += (
                        `<tr >
                  
                        <th scope="col">${data[i].id}</th>
                          <th scope="col">${data[i].fecha}</th>
                          <th scope="col">${data[i].accion}</th>
                          <th scope="col">${data[i].objetivo}</th>
                          <th scope="col">${data[i].tipoDato}</th>
                            <th scope="col">${data[i].valor}</th>
                            <th scope="col">${data[i].nombre}</th>
                            <th scope="col">${data[i].planta}</th>
                            <th scope="col">${data[i].aula}</th>
                        </tr> `
                      ) }                                                                                                              
                    });

}
cargarRows();