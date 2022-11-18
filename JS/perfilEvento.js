const apiButton = document.getElementById("but");
const guardarButton = document.getElementById("guardarPerfilEvento");
const editarButton = document.getElementById("editarPerfilEvento");
var editarFecha;
var editarPlanta;
var editarActivado;
var institucionGlobal;
var usuarioGlobal;
var botonActivadoAgregar;
var botonActivadoEditar;
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


async function listar() {
  
  var planta = document.getElementById("comboPlanta").value;
         
    var res = await fetch("https://ahorro-energetico-api-pereven.herokuapp.com/api/eventos/get?&planta="+planta+"&institucion="+institucionGlobal);      
    var registroHTML = "";
    var data = await res.json();

      for (var i = 0; i < data.length; i++) 
      {
        var obj = data[i];        
        //console.log(data[i]);
        registroHTML +=
          `<tr class="table-success">
              <td>${format(obj.fecha)}</td>           
              <td>${obj.activado==0 ? "Desactivado" : "Activado"}</td>           
              <td>${obj.horaDesde}</td> 
              <td>${obj.horaHasta}</td>           
              <td>${obj.planta}</td>          
              <td><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#ModalEditar" onclick='editar("${obj.planta}","${obj.fecha}","${obj.horaDesde}","${obj.horaHasta}","${obj.activado}")'>Editar</button>
              <button class="btn btn-danger" onclick='eliminarPerfilEvento("${obj.fecha}","${obj.planta}")'>Eliminar</button></td> </tr>`;
      }      
      document.querySelector("#tabla").innerHTML = registroHTML;
    
}
function activadoAgregar(num)
{
  botonActivadoAgregar=num;
}
function activadoEditar(num)
{
  pintarBoton(num);
  botonActivadoEditar=num;
}
function pintarBoton(num)
{
  var botonA = num==0 ? "actE0" : "actE1";
  document.getElementById(botonA).checked=true;

}
async function eliminarPerfilEvento(fecha,planta) {
  
  fecha=formatoInvertido(fecha);
    
  await fetch("https://ahorro-energetico-api-pereven.herokuapp.com/api/eventos?fecha="+fecha+"&planta="+planta+"&institucion="+institucionGlobal,{
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

function editar(planta,fecha, horaDesde,horaHasta, activado) {
  botonActivadoEditar=activado;
  pintarBoton(activado);
  editarPlanta=document.getElementById("editarPlanta").value = planta;
  editarFecha=document.getElementById("editarFecha").value = formatoInvertido(fecha);
  document.getElementById("horaInicialEditar").value = horaDesde;
  document.getElementById("horaLimiteEditar").value = horaHasta;
}

async function editarPerfilEvento() {
  const editarHoraDesde=document.getElementById("horaInicialEditar").value;
  const editarHoraHasta=document.getElementById("horaLimiteEditar").value;
  if(editarHoraDesde>=editarHoraHasta){
    alert("La hora inicio no debe ser mayor a la hora limite");
  }else{
    await fetch("https://ahorro-energetico-api-pereven.herokuapp.com/eventos/?dia="+editarFecha+"&planta="+editarPlanta+"&institucion="+institucionGlobal,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({       
        "fecha":editarFecha,
        "activado": botonActivadoEditar,
        "horaDesde":editarHoraDesde,
        "horaHasta":editarHoraHasta,   
        "planta": editarPlanta,
        "institucion":institucionGlobal
        
      }),
    })
    listar();
  }
}

function format(dato) {
  const date = new Date(dato);
  const [year, month, day] = [date.getFullYear(), date.getMonth()+1, date.getDate()];
  return day.toString().padStart(2, '0') + "-" + month.toString().padStart(2, '0') + "-" + year;
}

function formatoInvertido(dato) {
  const date = new Date(dato);
  const [year, month, day] = [date.getFullYear(), date.getMonth()+1, date.getDate()];
  return year + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');
}


async function agregarPerfilEvento() {

  var fecha = document.getElementById("agregarFecha").value; 
  var planta = document.getElementById("comboPlantaAgregar").value;
  var horaInicial = document.getElementById("horaInicialAgregar").value;
  var horaLimite = document.getElementById("horaLimiteAgregar").value; 
  if(fecha==undefined || fecha=="" ||
  planta==undefined || planta=="" ||
  horaInicial==undefined || horaInicial=="" ||
  horaLimite==undefined || horaLimite=="" ){
    alert("Los campos no pueden estar vacios");
  }else {
    if(horaInicial>=horaLimite){
      alert("La hora inicio no debe ser mayor a la hora limite");
    }else{
      const data = {
        "fecha": fecha,
        "activado": botonActivadoAgregar,
        "horaDesde": horaInicial,
        "horaHasta": horaLimite,
        "planta": planta,
        "institucion":institucionGlobal
        
      };
      
      await fetch("https://ahorro-energetico-api-pereven.herokuapp.com/api/eventos", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      listar();
    }
  }
}


apiButton.addEventListener("click", listar);
//Si la tabla está vacia, rompe aca
guardarButton.addEventListener("click", agregarPerfilEvento);
editarButton.addEventListener("click", editarPerfilEvento);