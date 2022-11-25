var sql;
var indice = document.getElementById("Registros");
var ComboBoxDispositivo = document.getElementById("comboBoxDispositivo");

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
    institucionGlobal = "La manzana de isaac";
  }
	sql =
    "https://ahorro-energetico-api-rec-alum.herokuapp.com/api/recomendacionAlumnos/recomendacionDisp/?institucion=" +
    institucionGlobal;
  Listar();
  
};

async function Listar() {
  await fetch(sql)
    .then((res) => res.json())
    .then(async (data) => {
      indice.innerHTML = "";
      ComboBoxDispositivo.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        indice.innerHTML += `
                          <tr class="table-success">
                          <td>${data[i].descripcion}</td>
                          <td>${data[i].recomendacion}</td>
                          <td>${data[i].nombreAlumno}</td>
                           </tr>
                          `;
      }
    });
  BoxDispositivo();
}
async function RealizarRecomendacion() {
  Swal.fire({
    title: "¿Está seguro en sugerir esta recomendación?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#1B9752",
    cancelButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    confirmButtonText: "Si, Agregar!",
  }).then(async (result) => {
   
    if (result.isConfirmed) {
      var recomendacion_sugerencia = document.getElementById(
        "exampleFormControlTextarea"
      ).value;
      var tipo_dispositivo_sugerencia = document.getElementById(
        "comboBoxDispositivo"
      ).value;
      var url =
        "https://ahorro-energetico-api-desc.herokuapp.com/api/descripciones/?descripcion=" +
        tipo_dispositivo_sugerencia;
      if (
        CondicionesDeAceptacionRecomendaciones(recomendacion_sugerencia) == false
      ) {
        return;
      }
      await fetch(url)
        .then((res) => res.json())
        .then(async (data) => {
          var NuevaRecomendacionAlumnoJSON = {
            descID: data[0].id,
            recomendacion: recomendacion_sugerencia,
            institucion: institucionGlobal,
            nombreAlumno: usuarioGlobal,
          };
  
          JSONdata = JSON.stringify(NuevaRecomendacionAlumnoJSON);
          await fetch(
            "https://ahorro-energetico-api-rec-alum.herokuapp.com/api/recomendacionAlumnos/recomendacionDisp/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSONdata,
            }
          );
        });
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Añadido con éxito",
        showConfirmButton: false,
        timer: 1500,
      });
      document.getElementById("exampleFormControlTextarea").value = "";
      Listar();
    }
  });
}

function ActualizarPagina() {
  location.reload();
}

async function BoxDispositivo() {
  var registroHTML = '<option value="0">----</option>';
  await fetch(
    "https://ahorro-energetico-api-desc.herokuapp.com/api/descripciones"
  )
    .then((res) => res.json())
    .then(async (data) => {
      ComboBoxDispositivo.innerHTML = "";
      for (var i = 0; i < data.length; i++) {
        ComboBoxDispositivo.innerHTML +=
          "<option>" + data[i].descripcion + "</option>";
        registroHTML += `<option value=${data[i].id}>${data[i].descripcion}</option>`;
      }
      document.getElementById("inputTipoDispositivo").innerHTML = registroHTML;
    });
}

function delay(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
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

function CondicionesDeAceptacionRecomendaciones(RecomendacionDeSugerencia) {
  console.log(isNaN(RecomendacionDeSugerencia));

  if (isNaN(RecomendacionDeSugerencia)) {
    Swal.fire({
      icon: "error",
      title: "Error de ingreso de datos!",
      text: "La sugerencia de son todos números, por favor ingresé una sugerencia recomendación.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#1B9752",
    });
    return false;
  }

  if (RecomendacionDeSugerencia == "") {
    Swal.fire({
      icon: "error",
      title: "Error de ingreso de datos!",
      text: "Ingrese la sugerencia.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#1B9752",
    });
    return false;
  }
  if (RecomendacionDeSugerencia.length <= 10) {
    Swal.fire({
      icon: "error",
      title: "Error de ingreso de datos!",
      text: "La sugerencia de recomendación es muy corta, tiene pocos caracteres, por favor, ingrese una sugerencia recomendación mas completa.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#1B9752",
    });
    return false;
  }
  return true;
}

function CondicionesDeAceptacionRecomendaciones(RecomendacionDeSugerencia) {
  if (RecomendacionDeSugerencia == "") {
    Swal.fire({
      icon: "error",
      title: "Error de ingreso de datos!",
      text: "Ingrese la sugerencia.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#1B9752",
    });
    return false;
  }
  if (RecomendacionDeSugerencia.length <= 10) {
    Swal.fire({
      icon: "error",
      title: "Error de ingreso de datos!",
      text: "La sugerencia de recomendación es muy corta, tiene pocos caracteres, por favor, ingrese una recomendación mas completa.",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#1B9752",
    });
    return false;
  }
  return true;
}
