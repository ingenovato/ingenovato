// variablex.js


/*
  Esta función se utiliza para invertir el comparador cuando hay una probabilidad por intervalos.
*/
function invertirComparador(comparador){
  if (comparador == "<"){
    comparador = ">";
  } else if (comparador == "≤"){
    comparador = "≥";
  }

  return comparador;
}


/*
  Esta función se utiliza cuando es necesario organizar los datos ingresados en los valores de X.
*/
function limpiarVariableX(x, inputX2){

  let arregloComparadores = ["=", "<", ">", "≥", "≤"];
    
  /*
    X siempre será un objeto. Si inputX2 no tiene la clase display-none, entonces
    será una probabilidad condicional o de intervalo. De lo contrario, será una probabilidad
    normal
  */

  if(!(inputX2.classList.contains('display-none'))){

    /* 
      Si el último caracter de x[0] es un comparador entonces es porque es una probabilidad por intervalo.
      De lo contrario, será una probabilidad condicional
    */ 
    if (arregloComparadores.includes(x[0].substring(x[0].length - 1))){
      return limpiarIntervalos(x);

    } else {
      return limpiarCondicional(x);

    }
  } else {
    return limpiarNormal(x[0], arregloComparadores);

  }

}

function limpiarCondicional(x){
  let comparadorX1 = x[0].substring(0, 1);
    let x1 = Number(x[0].substring(1));
    let comparadorX2 = x[1].substring(0, 1);
    let x2 = Number(x[1].substring(1));
    return [comparadorX1, x1, comparadorX2, x2, true];
}

function limpiarIntervalos(x){
    let comparadorX1 = invertirComparador(x[0].substring(x[0].length - 1));
    let x1 = Number(x[0].substring(0, x[0].length - 1));
    let comparadorX2 = x[1].substring(0, 1);
    let x2 = Number(x[1].substring(1));
    return [comparadorX1, x1, comparadorX2, x2, false];
}

function limpiarNormal(x, arregloComparadores){
  
  /* 
    Aquí sabremos si x tiene un comparador
  */
  if (arregloComparadores.includes(x.substring(0,1))){
    return [x.substring(0,1), Number(x.substring(1))];

  } else {
    return ["=", Number(x)];

  }

}