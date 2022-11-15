const apiButton = document.getElementById("but");
const guardarButton = document.getElementById("guardarPerfilEvento");
const editarButton = document.getElementById("editarPerfilEvento");
var editarFecha;
var editarPlanta;
var editarActivado;
var institucionGlobal;
var usuarioGlobal;
var plantasGlobales;
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
    listar();
  }
  else{
    institucionGlobal = "La manzana de isaac";
    listar();
  }
}


/*const callApi = () => {
  
  listar(dia, planta);
};*/

async function listar() {
  
  var planta = document.getElementById("comboPlanta").value;
         
    var res = await fetch("http://localhost:4012/api/eventos/get?&planta="+planta+"&institucion="+institucionGlobal);      
    var registroHTML = "";
    var data = await res.json();

      for (var i = 0; i < data.length; i++) 
      {
        var obj = data[i];        
        //console.log(data[i]);
        registroHTML +=
          `<tr class="table-success"><th scope="row">${i+1}</th> 
              <td>${obj.fecha}</td>           
              <td>${obj.activado}</td>           
              <td>${obj.horaDesde}</td> 
              <td>${obj.horaHasta}</td>           
              <td>${obj.planta}</td>          
              <td><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#ModalEditar" onclick='editar("${obj.planta}","${obj.activado}","${obj.fecha}","${obj.horaDesde}","${obj.horaHasta}")'>Editar</button>
              <button class="btn btn-danger" onclick='eliminarPerfilEvento("${obj.fecha}","${obj.planta}")'>Eliminar</button></td> </tr>`;
      }      
      document.querySelector("#tabla").innerHTML = registroHTML;
    
}

async function eliminarPerfilEvento(fecha,planta) {
  //console.log(planta);
  //console.log(fecha); 
  //ESTA AGARRANDO MAL LA FECHA, TIENE DATOS BASURA
  await fetch("http://localhost:4012/api/eventos?fecha="+fecha+"&planta="+planta+"&institucion="+institucionGlobal,{
    method: 'DELETE',
  })
  listar();
}

function cargarPlantas(select, combo) {
  var plantas = "";

  for (var i = 0; i < plantasGlobales[select].length; i++) {
    plantas += `<option value=${plantasGlobales[select][i][0]}>${plantasGlobales[select][i][1]}</option>`;
  };
  combo.innerHTML = plantas;
}

function editar(planta,activado, fecha, horaDesde,horaHasta) {
  editarFecha=document.getElementById("editarFecha").value = fecha;
  editarPlanta=document.getElementById("editarPlanta").value = planta;
  //document.getElementById("editarActivado").value = activado; //HAY QUE AGARRAR BIEN ACA
  document.getElementById("editarHoraInicial").value = horaDesde;
  document.getElementById("editarHoraLimite").value = horaHasta;
  
}

async function editarPerfilEvento() {

  const editarHoraDesde=document.getElementById("editarHoraInicial").value;
  const editarHoraHasta=document.getElementById("editarHoraLimite").value;
  //const editarActivado=document.getElementById("editarActivado").value; //AGREGAR ESTE

  await fetch("http://localhost:4011/api/perfilxdia/?dia="+editarDia+"&planta="+editarPlanta+"&institucion="+institucionGlobal,
 {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({       
      //"activado": editarActivado, //AGREGAR ESTE
      "horaDesde":editarHoraDesde,
      "horaHasta":editarHoraHasta          
      
     }),
  })
  listar();
}

async function agregarPerfilEvento() {
  var fecha = document.getElementById("agregarFecha").value;
  var planta = document.getElementById("comboPlantaAgregar").value;
  var horaInicial = document.getElementById("horaInicialAgregar").value;
  var horaLimite = document.getElementById("horaLimiteAgregar").value; 

  //PRUEBAS DE QUE AGARRA, SIEMPRE ES ON
  console.log(document.getElementById("danger-outlined").value);
  console.log(document.getElementById("success-outlined").value);
  
  //activado =document.getElementById("success-outlined").value;
  //activado = (activado == "off" ? 0 : activado == "off" ? 1:1);

  //FORZADO PORQUE TODAVIA NO LO PUEDO AGARRAR
  activado=1;

//  console.log(activado);

  /*console.log(fecha);
  console.log(planta);
  console.log(horaInicial);
  console.log(horaLimite);*/

  const data = {
    "fecha": fecha,
    "activado": activado,
    "horaDesde": horaInicial,
    "horaHasta": horaLimite,
    "planta": planta,
    "institucion":institucionGlobal
    
  };
 
  await fetch("http://localhost:4012/api/eventos", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  listar();
}


apiButton.addEventListener("click", listar);
//Si la tabla está vacia, rompe aca
guardarButton.addEventListener("click", agregarPerfilEvento);
editarButton.addEventListener("click", editarPerfilEvento);