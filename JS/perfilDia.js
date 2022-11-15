const apiButton = document.getElementById("but");
const guardarButton = document.getElementById("guardarPerfilDia");
const editarButton = document.getElementById("editarPerfilDia");
var editarDia;
var editarPlanta;
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
  var dia = document.getElementById("comboDia").value;
  var planta = document.getElementById("comboPlanta").value;
  
  //console.log(planta);
  if(planta<0)
  {
      var res = await fetch("http://localhost:4011/api/perfilxdia/get/?dia="+dia+"&institucion="+ institucionGlobal);  
  }
  else
  { 
      var res = await fetch("http://localhost:4011/api/perfilxdia/get/?dia="+dia+"&institucion="+ institucionGlobal+"&planta="+planta);
  }
  var registroHTML = "";
  var data = await res.json();

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    //console.log(data[i]);
    registroHTML +=
      `<tr class="table-success"><th scope="row">${i+1}</th> 
          <td>${obj.dia}</td>           
           <td>${obj.horaDesde}</td> 
           <td>${obj.horaHasta}</td> 
           <td>${obj.planta}</td>          
          <td><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#ModalEditar" onclick='editar("${obj.dia}","${obj.horaDesde}","${obj.horaHasta}","${obj.planta}")'>Editar</button>
          <button class="btn btn-danger" onclick='eliminarPerfilDia("${obj.dia}","${obj.planta}")'>Eliminar</button></td> </tr>`;
         
  }
  document.querySelector("#tabla").innerHTML = registroHTML;
}

async function eliminarPerfilDia(dia,planta) {
  console.log(planta);
  console.log(dia);
  await fetch("http://localhost:4011/api/perfilxdia/?dia="+dia+"&planta="+planta+"&institucion="+institucionGlobal,{
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

function editar(dia, horaDesde,horaHasta,planta) {
  editarDia=document.getElementById("editarDia").value = dia;
  editarPlanta=document.getElementById("editarPlanta").value = planta;
  document.getElementById("editarHoraInicial").value = horaDesde;
  document.getElementById("editarHoraLimite").value = horaHasta;
  
}

async function editarPerfilDia() {

  const editarHoraDesde=document.getElementById("editarHoraInicial").value;
  const editarHoraHasta=document.getElementById("editarHoraLimite").value;

  await fetch("http://localhost:4011/api/perfilxdia/?dia="+editarDia+"&planta="+editarPlanta+"&institucion="+institucionGlobal,
 {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      "horaDesde":editarHoraDesde,
      "horaHasta":editarHoraHasta          
      
     }),
  })
  listar();
}

async function agregarPerfilDia() {
  var dia = document.getElementById("comboDiaAgregar").value;
  var planta = document.getElementById("comboPlantaAgregar").value;
  var horaInicial = document.getElementById("horaInicialAgregar").value;
  var horaLimite = document.getElementById("horaLimiteAgregar").value; 

  const data = {
    "dia": dia,
    "horaDesde": horaInicial,
    "horaHasta": horaLimite,
    "planta": planta
    
  };
 
  await fetch("http://localhost:4011/api/perfilxdia/?institucion="+institucionGlobal, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  listar();
}

apiButton.addEventListener("click", listar);
guardarButton.addEventListener("click", agregarPerfilDia);
editarButton.addEventListener("click", editarPerfilDia);