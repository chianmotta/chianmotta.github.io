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
      institucionGlobal = "La Manzana de Isaac";
    }
 Listar();
  }

var indice = document.getElementById("Registros");

async function AceptarDispositivoRoto(idDispositivo, NombreDispositivo){  
    console.log(idDispositivo, NombreDispositivo, institucionGlobal);

    await fetch("https://ahorro-energetico-api-rec-alum.herokuapp.com/api/recomendacionAlumnos/recomendacionDispRoto/" + idDispositivo, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          "nombre": NombreDispositivo, 
          "institucion": institucionGlobal
        }),
      })
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Agregado con éxito",
        showConfirmButton: false,
        timer: 1500,
      });

      Listar();
}

async function RechazarDispositivoRoto(id){  
 Swal.fire({
    title: "¿Está seguro, que desea rechazar esta sugerencia de dispostiivo roto?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1B9752",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Si, Rechazar!",
  }).then(async (result) => {


    if (result.isConfirmed) {
      await fetch("https://ahorro-energetico-api-rec-alum.herokuapp.com/api/recomendacionAlumnos/recomendacionDispRoto/?institucion="+ institucionGlobal + "&id=" + id, {
        method: 'DELETE'});
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Rechazado con éxito",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    Listar();
  });

}

async function Listar() {
  
  await fetch("https://ahorro-energetico-api-rec-alum.herokuapp.com/api/recomendacionAlumnos/recomendacionDispRoto/?institucion="+ institucionGlobal)
    .then((res) => res.json())
    .then(async (data) => {
      indice.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
            indice.innerHTML += `
                          <tr class="table-success">
                        
                            
                            <td>${data[i].descripcion}</td>
                            <td>${data[i].nombre}</td>
                            <td>${data[i].planta}</td>
                            <td>${data[i].aula}</td>
                          <td><button type="button" class="btn btn-success" onclick="AceptarDispositivoRoto(${data[i].id},'${data[i].nombre}')">Aceptar</button></td>
                          <td><button type="button" class="btn btn-danger" onclick="RechazarDispositivoRoto(${data[i].id})">Rechazar</button></td>
                           </tr>
                          `;
      }
    }
    )
  }