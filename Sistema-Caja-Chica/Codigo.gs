/**
 * Aspirante: Thomas Edmundo Martinez Mejia
 * 
 * Proyecto: Prueba Tecnica Caja chica
 */

const SHEET_ID = "198RxR5xSfPESYaxt3_2ltvm884O223zCMSWvmYXaVuo";
const SHEET_NAME = "Solicitudes";

/**
 * Esto es para incluir los estilos CSS
 */
function include(nombreArchivo) {
  return HtmlService
    .createHtmlOutputFromFile(nombreArchivo)
    .getContent();
}

/**
 * Este es el controlador principal para al app web
 */
function doGet(e) {
  const vista = e?.parameter?.vista;

  let pagina = "formulario";

  if (vista === "aprobador") {
    pagina = "aprobador";
  }

  return HtmlService
    .createTemplateFromFile(pagina)
    .evaluate();
}

/**
 * Esta funcion es para insertar la solicitud 
 */
function registrarSolicitud(datos) {

  validarDatos(datos);

  const hoja = obtenerHoja();
  const id = Utilities.getUuid();

  hoja.appendRow([
    id,
    datos.fecha,
    datos.concepto,
    datos.monto,
    datos.justificacion,
    datos.correo,
    "Pendiente",
    ""
  ]);

  Logger.log("Solicitud registrada: " + id);

  return "Solicitud enviada correctamente";
}

/**
 * Esta funcion la usamos para listar las solicitudes pendientes.
 */
function obtenerPendientes() {

  const hoja = obtenerHoja();
  const datos = hoja.getDataRange().getDisplayValues();

  const pendientes = datos.slice(1).filter(row =>
    String(row[6]).trim().toLowerCase() === "pendiente"
  );

  Logger.log("Pendientes encontrados: " + pendientes.length);

  return pendientes;
}

/**
 * Y esta funcion es para aceptar la solicitud 
 */
function aprobarSolicitud(id) {
  actualizarEstado(id, "Aprobado");
  return "Solicitud aprobada correctamente";
}

/**
 * Y esta funcion es para negar la solicitud
 */
function rechazarSolicitud(id) {
  actualizarEstado(id, "Rechazado");
  return "Solicitud rechazada correctamente";
}

/**
 * Y esta funcion hace actualizar el formulario constantemente
 */
function actualizarEstado(id, estado) {

  const hoja = obtenerHoja();
  const datos = hoja.getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {

    if (datos[i][0] === id) {

      hoja.getRange(i + 1, 7).setValue(estado);
      hoja.getRange(i + 1, 8).setValue(new Date());

      Logger.log("Estado actualizado: " + id + " → " + estado);

      return true;
    }
  }

  throw new Error("No se encontró la solicitud con ID: " + id);
}

/**
 * Esta funcion es para validar los datos a ingresar
 */
function validarDatos(datos) {

  if (!datos) {
    throw new Error("No se recibieron datos");
  }

  if (
    !datos.fecha ||
    !datos.concepto ||
    !datos.monto ||
    !datos.justificacion ||
    !datos.correo
  ) {
    throw new Error("Faltan campos obligatorios");
  }
}

/**
 * Esta funcion es para obtener hoja segura
 */
function obtenerHoja() {

  const hoja = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName(SHEET_NAME);

  if (!hoja) {
    throw new Error("No existe la hoja: " + SHEET_NAME);
  }

  return hoja;
}

/**
 * Esta funcion es para verificar las solicitudes pendientes
 */
function testPendientes() {
  Logger.log(obtenerPendientes());
}