// variables.principales.binomial.js

// Función limpiarVariables
/* 
    Se encarga de limpiar las variables principales p y q teniendo en cuenta que se puede ingresar una fracción
    o un simple numero decimal.

    Este procedimiento se relaiza antes de enviarse a calcular.
*/
function limpiarVariables(variable){
    // Inicializando el valor del numerador y denominador
    let numerador = 0;
    let denominador = 1;

    if (variable.includes("/")){
        let numeros = variable.split("/");
        numerador = Number(numeros[0]);
        denominador = Number(numeros[1]);
        return numerador / denominador;

    } else if (variable.includes(",")){
        variable = Number(variable.replace(",", "."));
        return variable;

    } else if (variable.includes("%")) {
        let numero = Number(variable.substring(0, variable.length - 1));
        return numero / 100;

    } else {
        return Number(variable);
    }
  }