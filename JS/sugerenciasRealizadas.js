var indice = document.getElementById("Registros");
var institucionGlobal;
var usuarioGlobal;
var categoriaGlobal;

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
  Listar();
  BoxDispositivo();
};

async function BoxDispositivo() {
  var res = await fetch(
    "https://ahorro-energetico-api-desc.herokuapp.com/api/descripciones"
  );
  var data = await res.json();
  var registroHTML = "";

  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    registroHTML += `<option value=${obj.id}>${obj.descripcion}</option>`;
  }
  document.getElementById("inputTipoDispositivo").innerHTML =
    '<option value="0">---</option>' + registroHTML;
}

function actualizarGrafico() {
  const iframe = document.getElementById("iframe_id");
  const anio = document.getElementById("inputAnio").value;
  const mes = document.getElementById("inputMes").value;
  const tipoDispositivo = document.getElementById("inputTipoDispositivo").value;

  if (mes != "0") {
    if (tipoDispositivo == "0") {
      iframe.src =
        "https://pp1.ath.cx:8443/public/question/9936cd26-11ed-403c-94ad-a4fab63706fa?anio=" +
        anio +
        "&mes=" +
        mes +
        "#hide_parameters=anio,mes,tipoDispositivo";
    } else {
      iframe.src =
        "https://pp1.ath.cx:8443/public/question/9936cd26-11ed-403c-94ad-a4fab63706fa?anio=" +
        anio +
        "&mes=" +
        mes +
        "&tipoDispositivo=" +
        tipoDispositivo +
        "#hide_parameters=anio,mes,tipoDispositivo";
    }
  } else {
    if (tipoDispositivo == "0") {
      iframe.src =
        "https://pp1.ath.cx:8443/public/question/53e63619-73bf-4471-a323-ac5fdcaf579f?anio=" +
        anio +
        "#hide_parameters=anio,mes,areaId,tipoDispositivo";
    } else {
      iframe.src =
        "https://pp1.ath.cx:8443/public/question/53e63619-73bf-4471-a323-ac5fdcaf579f?anio=" +
        anio +
        "&tipoDispositivo=" +
        tipoDispositivo +
        "#hide_parameters=anio,mes,areaId,tipoDispositivo";
    }
  }
  console.log(iframe.src);
}

async function AceptarRecomendacion(id, descID, recomendacion) {
  console.log(id, descID, recomendacion, institucionGlobal);
  await fetch(
    "https://ahorro-energetico-api-rec-alum.herokuapp.com/api/recomendacionAlumnos/recomendacionDisp/" +
      id,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        descID: descID,
        recomendacion: recomendacion,
        institucion: institucionGlobal,
        jurisdiccion: "Ciudad Autonoma de Buenos Aires",
      }),
    }
  );
  Swal.fire({
    position: "top-center",
    icon: "success",
    title: "Agregado con éxito",
    showConfirmButton: false,
    timer: 1500,
  });
  Listar();
}

async function RechazarRecomendacion(id) {
  Swal.fire({
    title: "¿Está seguro, que desea rechazar esta recomendación?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1B9752",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Si, Rechazar!",
  }).then(async (result) => {
 
    if (result.isConfirmed) {
      await fetch(
        "https://ahorro-energetico-api-rec-alum.herokuapp.com/api/recomendacionAlumnos/recomendacionDisp/?institucion=" +
          institucionGlobal +
          "&id=" +
          id,
        {
          method: "DELETE",
        }
      );
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Rechazado con éxito",
        showConfirmButton: false,
        timer: 1500,
      });
      Listar();
    }
  });
}
async function Listar() {
  await fetch(
    "https://ahorro-energetico-api-rec-alum.herokuapp.com/api/recomendacionAlumnos/recomendacionDisp/?institucion=" +
      institucionGlobal
  )
    .then((res) => res.json())
    .then(async (data) => {
      indice.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        indice.innerHTML += `
                          <tr class="table-success">
                          <td>${data[i].descripcion}</td>
                          <td>${data[i].recomendacion}</td>
                          <td>${data[i].nombreAlumno}</td>
                          <td><button type="button" onclick="AceptarRecomendacion(${data[i].id}, ${data[i].descID},'${data[i].recomendacion}')"class="btn btn-success">Aceptar</button></td>
                          <td><button type="button"  onclick="RechazarRecomendacion(${data[i].id})" class="btn btn-danger">Rechazar</button></td>
                           </tr>
                          `;
      }
    });
}