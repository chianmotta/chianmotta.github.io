
var comboBoxDispositivo = document.getElementById("comboBoxDispositivo");
var ComboBoxDispositivoNuevo = document.getElementById("ComboBoxNuevoDispositivo");
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


async function BoxDispositivo(){
    await fetch("https://ahorro-energetico-api-desc.herokuapp.com/api/descripciones")
    .then((res) => res.json())
    .then(async (data) => {
        comboBoxDispositivo.innerHTML ="";
          for (var i = 0; i < data.length; i++) {
            comboBoxDispositivo.innerHTML += (
                    `
                    <option>${data[i].descripcion}</option>
                    `
                  )                                                              
    }});
  }
  BoxDispositivo();