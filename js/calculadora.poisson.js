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

function calculadoraPoisson(){
    let inputsVariablesPrincipales = document.querySelectorAll('.variables-principales-inputs div input');
    let inputsX = document.querySelectorAll(".formato-de-entrada input");
    let inputX1 = inputsX[0];
    let inputX2 = inputsX[1];

    let variableMedia = Number(inputsVariablesPrincipales[0].value);
    let variableX = limpiarVariableX([inputX1.value, inputX2.value], inputX2);      
    
    let spanModelo = document.querySelector('.modelo span');
    let textoModelo = modelo(inputsVariablesPrincipales[0].value);
    katex.render(textoModelo, spanModelo, {throwOnError: false});

    let probabilidad = calcular(variableMedia, variableX);
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

function modelo(media){
    return String.raw`P(x) = \frac {${media}^{x} \cdot e^{-${media}}}{x!}`;
}

function probabilidadRecursiva(i,f,media){
    if ((f-i) == 0){
        let potencia = Math.pow(media, i);
        let potenciaE = Math.pow(Math.E, (media*-1));
        let factorialx = factorialRecursivo(i);
        let res = (potencia*potenciaE)/factorialx;
        return res;
    } else {
        let potencia = Math.pow(media, i);
        let potenciaE = Math.pow(Math.E, (media*-1));
        let factorialx = factorialRecursivo(i);
        let res = (potencia*potenciaE)/factorialx;
        return res + probabilidadRecursiva(i+1, f, media);
    }
  }

function calcular(media, x){

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
        return calcularProbabilidadCondicional(media, x);
      } else {
        return calcularProbabilidadIntervalo(media, x);
      }
  
    } else {
      return calcularProbabilidadNormal(media,x);
    }
}

  function calcularProbabilidadCondicional(media, x){
    try {
      let comparadorX1 = x[0];
      let x1 = x[1];
      let comparadorX2 = x[2];
      let x2 = x[3];
      let intersecto = interseccionAcumulativa(comparadorX1, x1, comparadorX2, x2);
  
      let numerador = probabilidadRecursiva(intersecto[0], intersecto[intersecto.length - 1], media);
      let valoresDenominador = funcionAcumulativa(comparadorX2, x2);
      let sumatoriaAcumulativa = 0;
      let denominador = 1;
  
      if (valoresDenominador[valoresDenominador.length - 1] == true && typeof(valoresDenominador[valoresDenominador.length - 1]) == "boolean"){
        sumatoriaAcumulativa = probabilidadRecursiva(valoresDenominador[0], valoresDenominador[valoresDenominador.length - 2], media);
        denominador = 1 - sumatoriaAcumulativa;
      } else {
        denominador = probabilidadRecursiva(valoresDenominador[0], valoresDenominador[valoresDenominador.length - 1], media);
      }
  
      let divisionFinal = numerador/denominador; 
      return round(divisionFinal, 6);    
    } catch (e){
      alert("Ocurrió un error al calcular la probabilidad condicional. Error: " + e);
    }
    
}

function calcularProbabilidadIntervalo(media, x){
  try {
    let comparadorX1 = x[0];
    let x1 = x[1];
    let comparadorX2 = x[2];
    let x2 = x[3];
    let intersecto = interseccionAcumulativa(comparadorX1, x1, comparadorX2, x2);
    let total = probabilidadRecursiva(intersecto[0], intersecto[intersecto.length - 1], media);
    return round(total, 6);
  } catch (e){
    alert("Ocurrió un error al calcular la probabilidad por intervalo. Error: " + e);
  }
}

function calcularProbabilidadNormal(media, x){
    let comparadorX = x[0];
    x = x[1];
    let total;
    let valores = funcionAcumulativa(comparadorX, x);
    let sumatoriaAcumulativa = 0;
  
  
    if (valores[valores.length - 1] == true && typeof(valores[valores.length - 1]) == "boolean"){
      sumatoriaAcumulativa = probabilidadRecursiva(valores[0], valores[valores.length - 2], media);
      total = 1 - sumatoriaAcumulativa;        
    } else {
      total = probabilidadRecursiva(valores[0], valores[valores.length - 1], media);
    }
  
    return round(total, 6);
}