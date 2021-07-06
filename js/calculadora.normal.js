// calculadora.hipergeometrico.min.js

let comparadores = document.querySelectorAll('.comparadores div button');
let mayorIgual = comparadores[0];
let menorIgual = comparadores[1];


function agregarComparadoresKatex(){
  katex.render(String.raw`\geq`, mayorIgual, {
    throwOnError: false
  });

  katex.render(String.raw`\leq`, menorIgual, {
    throwOnError: false
  });
}

function limpiarVariableContinua(m){
  let res = 0;

  if (m.includes("/")){
    let numeros = m.split("/");
    res = Number(numeros[0]) / Number(numeros[1]);
  } else {
    res = Number(m);
  }

  return res;
}

function calculadoraNormal(){
    let inputsVariablesPrincipales = document.querySelectorAll('.variables-principales-inputs div input');
    let inputsX = document.querySelectorAll(".formato-de-entrada input");
    let inputX1 = inputsX[0];
    let inputX2 = inputsX[1];

    let variableMedia = inputsVariablesPrincipales[0].value;
    let variableDesviacion = inputsVariablesPrincipales[1].value;

    variableMedia = limpiarVariableContinua(variableMedia);
    variableDesviacion = limpiarVariableContinua(variableDesviacion);

    let variableX = limpiarVariableX([inputX1.value, inputX2.value], inputX2);      
    
    let spanModelo = document.querySelector('.modelo span');
    let textoModelo = modelo(variableX);
    katex.render(textoModelo, spanModelo, {throwOnError: false});

    let probabilidad = calcular(variableMedia, variableDesviacion, variableX);
    let porcentual = probabilidad*100;
    
    let spanRespuesta = document.querySelector('.respuesta span');
    
    /* 
      Seleccionamos el span-2 para verificar su valor con textContent
    */
    let textoSpan2 = document.querySelector(".formato-de-entrada .span-2").textContent;
    
    if (textoSpan2.includes("/")){
      spanRespuesta.innerHTML = "P(x" + variableX[0] + variableX[1] + " / x" + variableX[2] + variableX[3] + ") = " + porcentual.toString().substring(0,7) + "%";
    } else if (textoSpan2.includes("x")){
      spanRespuesta.innerHTML = "P(" + variableX[1] + variableX[0] + " x " + variableX[2] + variableX[3] + ") = " + porcentual.toString().substring(0,7) + "%";
    } else if (textoSpan2.includes(")")){
      spanRespuesta.innerHTML = "P(x" +  variableX[0] + variableX[1] + ") = " +  porcentual.toString().substring(0,7) + "%";
    }
}

function modelo(x){
  /* 
      Si x tiene un tamaño mayor a 2, es porque estamos hablando
      de una probabilidad condicional o de intervalos.
  */
  if (x.length > 2){
      
    /* 
      Si el último elemento del arreglo x, es true, es porque
      es una probabilidad condicional. 
      De lo contrario será de intervalos.
    */
    if (x[x.length - 1] == true){
      return String.raw`P(x ${x[0]} ${x[1]} / x ${x[2]} ${x[3]})`;
    } else {
      return String.raw`P(${x[1]} ${x[0]} x ${x[2]} ${x[3]})`;
    }
    
  } else {
    return String.raw`P(x ${x[0]} ${x[1]})`;
  }
}


function calcular(media, desviacion, x){

    /* 
      Si x tiene un tamaño mayor a 2, es porque estamos hablando
      de una probabilidad condicional o de intervalos.
    */
    if (x.length > 2){
      
      /* 
        Si el último elemento del arreglo x, es true, es porque
        es una probabilidad condicional. 
        De lo contrario será de intervalos.
      */
      if (x[x.length - 1] == true){
        return calcularProbabilidadCondicional(media, desviacion, x);
      } else {
        return calcularProbabilidadIntervalo(media, desviacion, x);
      }
  
    } else {
      return calcularProbabilidadNormal(media, desviacion, x);
    }
}

  function calcularProbabilidadCondicional(media, desviacion, x){
    try {
      let comparadorX1 = x[0];
      let x1 = x[1];
      let comparadorX2 = x[2];
      let x2 = x[3];
      let numerador = condicionalNormal(comparadorX1, x1, comparadorX2, x2, media, desviacion);
      let denominador = calcularProbabilidadNormal(media, desviacion, [comparadorX2, x2]);
      let divisionFinal = numerador / denominador;
      return round(divisionFinal, 6);
    } catch (e){
      alert("Ocurrió un error al calcular la probabilidad condicional. Error: " + e);
    }
    
}

function calcularProbabilidadIntervalo(media, desviacion, x){
  try {
    let comparadorX1 = x[0];
    let x1 = x[1];
    let comparadorX2 = x[2];
    let x2 = x[3];
    let total = intervaloNormal(comparadorX1, x1, comparadorX2, x2, media, desviacion);
    return round(total, 6);
  } catch (e){
    alert("Ocurrió un error al calcular la probabilidad por intervalo. Error: " + e);
  }
}

function calcularProbabilidadNormal(media, desviacion, x){
  let probabilidad = 0;

  if (x[0] == "<" || x[0] == "≤"){
    let z = (Number(x[1]) - media) / desviacion;
    let zRedondeado = round(z,2);
    let zTexto = zRedondeado.toString();
    let zUltimo = Number(zTexto.substr(zTexto.length - 1, 1));
    let zCortado = Number(zTexto.substr(0, zTexto.length - 1));
    let z10 = zCortado*10;

    if (z10 >= 0){
      let zmap = zps[zUltimo];
      probabilidad = zmap[z10];
    } else {
      let zmap = zns[zUltimo];
      probabilidad = zmap[z10*-1];
    }

  } else if (x[0] == ">" || x[0] == "≥"){
    let z = (Number(x[1]) - media) / desviacion;
    let zRedondeado = round(z,2);
    let zTexto = zRedondeado.toString();
    let zUltimo = Number(zTexto.substr(zTexto.length - 1, 1));
    let zCortado = Number(zTexto.substr(0, zTexto.length - 1));    
    let z10 = zCortado*10;

    if (z10 >= 0){
      let zmap = zps[zUltimo];
      probabilidad = 1 - zmap[z10];
    } else {
      let zmap = zns[zUltimo];
      probabilidad = 1 - zmap[z10*-1];
    }
  }
  
  return probabilidad;
}

