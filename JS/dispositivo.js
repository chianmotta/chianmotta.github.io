const buscarButton = document.getElementById("but");
const guardarButton = document.getElementById("agregarDispositivo");
const editarButton = document.getElementById("editarDispositivo");
var idEditar;
var zonasGlobales;
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
  listar(0, 0, -1);
  cargarCombo();  
}


const callApi = () => {
  var conexion = document.getElementById("comboConexion").value;
  var descripcion = document.getElementById("comboDescripcion").value;
  var piso = document.getElementById("buscarPiso").value;

  listar(conexion, descripcion, piso);
};

async function listar(tipoConexion, descripcion, piso) {
  var res = await fetch(
    "https://ahorro-energetico-api-disps.herokuapp.com/api/dispositivos/descripcion/?conexion=" + tipoConexion + "&descripcion=" + descripcion + "&planta=" + piso + "&institucion=" + institucionGlobal, {
  });
  var registroHTML = "";
  var data = await res.json();

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    registroHTML +=
      `<tr class="table-success">
          <td>${obj.descripcion}</td> <td>${obj.reparacion == 0 ? "No" : "Si"}</td> <td>${obj.aula}</td> <td>${obj.planta == 0 ? "Planta baja" : "Planta "+obj.planta}</td> <td>${obj.tipoConexion}</td> <td>${obj.direccionIP == "" ? "---------" : obj.direccionIP}</td> <td>${obj.consumo}</td>  
          <td><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#ModalEditar" onclick='editar("${obj.dispositivoID}","${obj.tipoConexion}","${obj.descID}","${obj.reparacion}","${obj.planta}","${obj.aula}","${obj.direccionIP}","${obj.numeroDispArduino}","${obj.consumo}")'>Modificar</button>
          <button class="btn btn-danger" onclick="eliminarDispositivo(${obj.dispositivoID})">Eliminar</button></td> </tr>`;
  }
  document.querySelector("#tablaDia").innerHTML = registroHTML;
}

async function agregarDispositivo() {
  var conexion = document.getElementById("comboTipoConexion").value;
  var descripcion = document.getElementById("comboTipoDispositivo");
  var piso = document.getElementById("comboPiso").value;
  var zona = document.getElementById("comboZona");
  var IP = document.getElementById("recipienteIP").value;
  var numArduino = document.getElementById("comboSerial").value;
  var consumo = document.getElementById("recipiente-consumo").value;
  var nombre;

  if (conexion == 3) {
    IP = "";
    numArduino = "";
    nombre = descripcion.options[descripcion.selectedIndex].text + " " + zona.options[zona.selectedIndex].text;
  } 
  else {
    nombre = IP+numArduino;
  }

  const data = {
    "tipoConexion": conexion,
    "descID": descripcion.value,
    "planta": piso,
    "aula": zona.options[zona.selectedIndex].text,
    "nombre": nombre,
    "direccionIP": IP,
    "numeroDispArduino": numArduino,
    "consumo": consumo,
    "institucion": institucionGlobal,
    "jurisdiccion": jurisdiccion
  };
 
  await fetch("https://ahorro-energetico-api-disps.herokuapp.com/api/dispositivos", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  listar(0, 0, -1);

  const getID = await fetch("https://ahorro-energetico-api-disps.herokuapp.com/api/dispositivos/getID");
  const nuevoID = await getID.json();

  const token = await obtenerToken();
  const datos = {
      "idDispositivo" : nuevoID[0].dispositivoID.toString(),
      "tipoDispositivo" : descripcion.value,
      "nombreDispositivo": nombre,
      "idArea": zona.value
    };

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Agregado con éxito',
      showConfirmButton: false,
      timer: 1500,
    });

  await fetch('https://pp1.ath.cx/api/Device', { 
    method: 'POST', 
    headers: { 
      'Authorization' : 'Bearer ' + token, 
      'Content-Type': 'application/json',
      'Cookie': 'metabase.DEVICE=70cfdbee-2e86-4447-85e7-7bbe7a4f799c'
    }, 
    body: JSON.stringify(datos),
  });
  await delay(1.5);
  ActualizarPagina();
}

async function eliminarDispositivo(id) {
  Swal.fire({
    title: '¿Está seguro, que desea eliminar el dipositivo?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1B9752',
    cancelButtonColor: '#d33',
    cancelButtonText: "Cancelar",
    confirmButtonText: 'Si, Eliminar!'
  }).then(async (result) => {
    await fetch("https://ahorro-energetico-api-disps.herokuapp.com/api/dispositivos/" + id, {
      method: 'DELETE'
    });


      const token = await obtenerToken();
      fetch('https://pp1.ath.cx/api/Device/' + id, { 
        method: 'DELETE', 
        headers: { 
          'Authorization' : 'Bearer ' + token
        }, 
      }
      
      )
      if (result.isConfirmed) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Eliminado con éxito',
          showConfirmButton: false,
          timer: 1500,
        });
        await delay(1.5);
        ActualizarPagina();
      }
    }
  )
}
  
function editar(id, conexion, descripcion, reparacion, piso, aula, ip, ard, consumo) {
  //setea todos los elementos del modal editar
  conexion = (conexion == "Electrico" ? 1 : conexion == "Señal" ? 2 : conexion == "Manual" ? 3 : 4);

  document.getElementById("editarTipoConexion").value = conexion;
  document.getElementById("editarTipoDispositivo").value = descripcion;
  document.getElementById("editarPiso").value = piso;
  cargarZonas(piso, document.getElementById("editarZona"));
  document.getElementById("editarZona").options = aula;
  document.getElementById("editarIP").value = ip;
  document.getElementById("editarArduino").value = ard;
  document.getElementById("editar-consumo").value = consumo;

  if (conexion == 3) {
    document.getElementById("editarLabelIP").style.display = "none";
    document.getElementById("editarIP").style.display = "none";
    document.getElementById("editarSerial").style.display = "none";
    document.getElementById("editarArduino").style.display = "none";
  } else{
    document.getElementById("editarLabelIP").style.display = "inline";
    document.getElementById("editarIP").style.display = "inline";
    document.getElementById("editarSerial").style.display = "inline";
    document.getElementById("editarArduino").style.display = "inline";
  }

  if (reparacion == 1) {
    document.getElementById("checkReparacion").checked = true;
  } else {
    document.getElementById("checkReparacion").checked = false;
  }

  idEditar = id;
}

async function editarDispositivo() {
  var conexion = document.getElementById("editarTipoConexion").value;
  var descripcion = document.getElementById("editarTipoDispositivo");
  var piso = document.getElementById("editarPiso").value;
  var zona = document.getElementById("editarZona");
  var IP = document.getElementById("editarIP").value;
  var numArduino = document.getElementById("editarArduino").value;
  var reparacion = document.getElementById("checkReparacion").checked;
  var consumo = document.getElementById("editar-consumo").value;
  var nombre;

  if(  document.getElementById("editar-consumo").value==""){
    Swal.fire({
      icon: 'error',
      title: 'Error de ingreso de datos!',
      text: 'Falta llenar el consumo esperado.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#1B9752',
    })
    return;
  }else{
    if(  document.getElementById("editar-consumo").value<=0){
      Swal.fire({
        icon: 'error',
        title: 'Error de ingreso de datos!',
        text: 'El consumo tiene que ser mayor o igual 0.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1B9752',
      })
      return;
    }
  if (conexion == 3){
    nombre = descripcion.options[descripcion.selectedIndex].text + " " + zona.options[zona.selectedIndex].text;
  } else {
    nombre = IP+numArduino;
  }
}

  const data = {
    "tipoConexion": conexion,
    "descID": descripcion.value,
    "reparacion": reparacion,
    "planta": piso,
    "aula": zona.options[zona.selectedIndex].text,
    "estado": 0,
    "nombre": nombre,
    "direccionIP": IP,
    "numeroDispArduino": numArduino,
    "consumo": consumo,
    "institucion": institucionGlobal,
    "jurisdiccion": jurisdiccion
  };

  await fetch("https://ahorro-energetico-api-disps.herokuapp.com/api/dispositivos/" + idEditar, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  listar(0, 0, -1);

  const token = await obtenerToken();
  const datos = {
      "idDispositivo" : idEditar.toString(),
      "tipoDispositivo" : descripcion.value,
      "nombreDispositivo": nombre,
      "idArea": zona.value
    };

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Modificado con éxito',
      showConfirmButton: false,
      timer: 1500,
    });
  await fetch('https://pp1.ath.cx/api/Device', { 
    method: 'POST', 
    headers: { 
      'Authorization' : 'Bearer ' + token, 
      'Content-Type': 'application/json',
      'Cookie': 'metabase.DEVICE=70cfdbee-2e86-4447-85e7-7bbe7a4f799c'
    }, 
    body: JSON.stringify(datos),
    
  });
  await delay(1.5);

}

async function cargarCombo() {
  var res = await fetch("https://ahorro-energetico-api-desc.herokuapp.com/api/descripciones");
  var registroHTML = "";
  var data = await res.json();

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    registroHTML +=
      `<option value=${obj.id}>${obj.descripcion}</option>`;
  }
  document.querySelector("#comboDescripcion").innerHTML = `<option value=0>Todos</option>` + registroHTML;
  document.querySelector("#comboTipoDispositivo").innerHTML = registroHTML;
  document.querySelector("#editarTipoDispositivo").innerHTML = registroHTML;

  var data;
  try{
    res = await fetch("http://pp1-iot.herokuapp.com/api/areas/nombres")
    data = await res.json();
    zonasGlobales = data;
    cargarZonas(0, document.querySelector("#comboZona"));
    
  } catch(e){
      console.log("error al comunicarse con IOT");
  }
}

function cargarZonas(select, combo) {
  var zonas = "";
  const piso = select == 0 ? "piso 0" : "piso "+select;

  for (var i = 0; i < zonasGlobales[piso].length; i++) {
    zonas += `<option value=${zonasGlobales[piso][i][0]}>${zonasGlobales[piso][i][1]}</option>`;
  };
  combo.innerHTML = zonas;
}

function ocultarNumSerial(select, labelIP ,comboIP, labelSerial, comboSerial) {
  if (select.value == 3) {
    labelIP.style.display = "none";
    comboIP.style.display = "none";
    labelSerial.style.display = "none";
    comboSerial.style.display = "none";

    if(comboSerial.value != "")
      comboSerial.value = "";
    if(comboIP.value != "")
      comboIP.value = "";
  } else {
    labelIP.style.display= "inline";
    comboIP.style.display = "inline";
    labelSerial.style.display = "inline";
    comboSerial.style.display = "inline";

    if(comboSerial.value == "")
      comboSerial.value = "d1";
  }
}

async function obtenerToken() {
  try {
    var res = await fetch("https://pp1.ath.cx/api/User", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "Username" : "AhorroEnergetico",
        "Password" : "SS1HI^41Owwg"
      }),
    });
    data = await res.json();
    return data.token;

  } catch(e){
    console.log(e);
  }
}

function delay(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
}

function ActualizarPagina() {
  location.reload();
}
buscarButton.addEventListener("click", callApi);
guardarButton.addEventListener("click", agregarDispositivo);
editarButton.addEventListener("click", editarDispositivo);