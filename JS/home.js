//chianmotta.github.io/?usuario=$name&categoria=$rol&institucion=$institucion&estecnico=$tecnico
const querystring = window.location.search;
console.log(querystring);
//usuario=Gian&categoria=Directtivo&institucion=LaManzanaDeIsaac&estecnico=si
// usando el querystring, creamos un objeto del tipo URLSearchParams
const params = new URLSearchParams(querystring);

if (
  (!params.get("usuario") ||
    !params.get("categoria") ||
    !params.get("institucion")) &&
  (!sessionStorage.getItem("categoria") ||
    !sessionStorage.getItem("usuario") ||
    !sessionStorage.getItem("institucion"))
) {
  alert("Falta algun parametro para ingresar, verifique e intente nuevamente");
  //window.location.replace("https://chianmotta.github.io/error.html");
} else {
  if (
    sessionStorage.getItem("usuario") &&
    sessionStorage.getItem("usuario") != "null"
  ) {
    document.getElementById(
      "spanInfo"
    ).innerHTML = `Bienvenido ${sessionStorage.getItem(
      "usuario"
    )} - ${sessionStorage.getItem("institucion")}`;
  } else {
    if (params.get("ultimoanio")) {
      //window.location.replace("https://chianmotta.github.io/sugerencias.html");
      sessionStorage.setItem("usuario", params.get("usuario"));
      sessionStorage.setItem("categoria", params.get("categoria"));
      sessionStorage.setItem("institucion", params.get("institucion"));
      sessionStorage.setItem("ultimoanio", params.get("ultimoanio"));
      alert("Usuario no habilitado para el modulo ahorro de energia.");
      console.log(params.get("ultimoanio").value);
      window.location.href =
        params.get("ultimoanio") == "no"
          ? "accesoDenegado.html"
          : "home_sugerencias.html";
    } else {
      sessionStorage.setItem("usuario", params.get("usuario"));
      sessionStorage.setItem("categoria", params.get("categoria"));
      sessionStorage.setItem("institucion", params.get("institucion"));
      params.get("estecnico")
        ? sessionStorage.setItem("estecnico", params.get("estecnico"))
        : "";
    }
    document.getElementById("spanInfo").innerHTML = `Bienvenido ${params.get(
      "usuario"
    )} - ${params.get("institucion")}`;
  }
}
