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

function limpiarVariableMedia(m){
  let res = 0;

  if (m.includes("/")){
    let numeros = m.split("/");
    res = Number(numeros[0]) / Number(numeros[1]);
  } else {
    res = Number(m);
  }

  return res;
}

function calculadoraGamma(){
    let inputsVariablesPrincipales = document.querySelectorAll('.variables-principales-inputs div input');
    let inputsX = document.querySelectorAll(".formato-de-entrada input");
    let inputX1 = inputsX[0];
    let inputX2 = inputsX[1];

    let variableMedia = inputsVariablesPrincipales[0].value;
    let variableAlfa = Number(inputsVariablesPrincipales[1].value);
    
    variableMedia = limpiarVariableMedia(variableMedia);

    let variableX = limpiarVariableX([inputX1.value, inputX2.value], inputX2);      
    
    /**  ---------------------------------------------------------- WARNING*/
    let spanModelo = document.querySelector('.modelo span');
    let textoModelo = modelo(variableX);
    katex.render(textoModelo, spanModelo, {throwOnError: false});
    /**  ---------------------------------------------------------- WARNING*/

    let probabilidad = calcular(variableMedia, variableAlfa, variableX);
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


function calcular(media, alfa, x){

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
        return calcularProbabilidadCondicional(media, alfa, x);
      } else {
        return calcularProbabilidadIntervalo(media, alfa, x);
      }
  
    } else {
      return calcularProbabilidadNormal(media, alfa, x);
    }
}

  function calcularProbabilidadCondicional(media, alfa, x){
    try {
      let comparadorX1 = x[0];
      let x1 = x[1];
      let comparadorX2 = x[2];
      let x2 = x[3];
      let numerador = condicionalAcumulativaGamma(comparadorX1, x1, comparadorX2, x2, media, alfa);
      let denominador = funcionAcumulativaGamma(comparadorX2, x2, media, alfa);
      let divisionFinal = numerador / denominador;
      return round(divisionFinal, 6);
    } catch (e){
      alert("Ocurrió un error al calcular la probabilidad condicional. Error: " + e);
    }
    
}

function calcularProbabilidadIntervalo(media, alfa, x){
  try {
    let comparadorX1 = x[0];
    let x1 = x[1];
    let comparadorX2 = x[2];
    let x2 = x[3];
    let total = intervaloAcumulativaGamma(comparadorX1, x1, comparadorX2, x2, media, alfa);
    return round(total, 6);
  } catch (e){
    alert("Ocurrió un error al calcular la probabilidad por intervalo. Error: " + e);
  }
}

function calcularProbabilidadNormal(media, alfa, x){
    let comparadorX = x[0];
    x = x[1];    
    let total = funcionAcumulativaGamma(comparadorX, x, media, alfa);
  
    return round(total, 6);
}

/* Agrandar la imagen */
function agrandarImagen(){
  let contenedor = document.getElementsByClassName('gamma-incompleta')[0];
  let iconoCerrar = document.getElementsByClassName('fa-times')[0];
  contenedor.classList.add('imagen-grande');
  iconoCerrar.classList.remove('no-visible');
  let body = document.getElementsByTagName('body')[0];
  body.style.overflowY = 'hidden';
  window.scroll(0,0);
}

/* Cerrar la pestaña de agrandar imagen */
function cerrarAgrandar(){
  let contenedor = document.getElementsByClassName('gamma-incompleta')[0];
  let iconoCerrar = document.getElementsByClassName('fa-times')[0];
  contenedor.classList.remove('imagen-grande');
  iconoCerrar.classList.add('no-visible');
  let body = document.getElementsByTagName('body')[0];
  body.style.overflowY = 'visible';
}

