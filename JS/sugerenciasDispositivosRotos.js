
    var institucionGlobal;
    var usuarioGlobal;
    var categoriaGlobal;
    
document.body.onload = () => {
    Listar();
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

      Listar();
}

async function RechazarDispositivoRoto(id){  
  console.log(id);

  await fetch("https://ahorro-energetico-api-rec-alum.herokuapp.com/api/recomendacionAlumnos/recomendacionDispRoto/?institucion=la%20manzana%20de%20isaac&id="+ id, {
    method: 'DELETE'})

  Listar();
}

async function Listar() {
  
  await fetch("https://ahorro-energetico-api-rec-alum.herokuapp.com/api/recomendacionAlumnos/recomendacionDispRoto/?institucion="+ sessionStorage.getItem("institucion"))
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