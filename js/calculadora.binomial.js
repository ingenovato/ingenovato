// calculadora.binomial.min.js

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


function calculadoraBinomial(){
  try{
    
    let inputsVariablesPrincipales = document.querySelectorAll('.variables-principales-inputs div input');
    let inputsX = document.querySelectorAll(".formato-de-entrada input");
    let inputX1 = inputsX[0];
    let inputX2 = inputsX[1];

    let variableExito = limpiarVariables(inputsVariablesPrincipales[0].value);
    let variableError = limpiarVariables(inputsVariablesPrincipales[1].value);
    let variablePoblacion = limpiarVariables(inputsVariablesPrincipales[2].value);
    let variableX = limpiarVariableX([inputX1.value, inputX2.value], inputX2);      
    
    let spanModelo = document.querySelector('.modelo');
    let textoModelo = modelo(inputsVariablesPrincipales[0].value, inputsVariablesPrincipales[1].value , variablePoblacion);
    katex.render(textoModelo, spanModelo, {throwOnError: false});
    
    let probabilidad = calcular(variableExito, variableError, variablePoblacion, variableX);
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
  } catch (e){
    alert("Lo sentimos, no se pudo efectuar el proceso. Por favor verifique que las variables estén escritas de manera correcta. Error: " + e);
  }
}


function modelo(p, q, n){
  return String.raw`P(x) = \begin{pmatrix} ${n} \\ x \end{pmatrix}${p}^x${q}^{${n}-x}`;;
}


function probabilidadRecursiva(i,f,p,q,n){
  if ((f-i) == 0){
      let combinacion = calcularCombinacion(n, i);
      let exito = calcularExito(p, i);
      let error = calcularError(q, n, i);
      let res = combinacion*exito*error;
      return res;
  } else {
      let combinacion = calcularCombinacion(n, i);
      let exito = calcularExito(p, i);
      let error = calcularError(q, n, i);
      let res = combinacion*exito*error;
      return res + probabilidadRecursiva(i+1, f, p,q,n);
  }
}


function calcular(p, q, n, x){

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
      return calcularProbabilidadCondicional(p, q, n, x);
    } else {
      return calcularProbabilidadIntervalo(p, q, n, x);
    }

  } else {
    return calcularProbabilidadNormal(p,q,n,x);
  }
}

function calcularProbabilidadCondicional(p, q, n, x){
  let comparadorX1 = x[0];
  let x1 = x[1];
  let comparadorX2 = x[2];
  let x2 = x[3];
  let intersecto = interseccion(comparadorX1, x1, comparadorX2, x2, n);

  let numerador = probabilidadRecursiva(intersecto[0], intersecto[intersecto.length - 1], p, q, n);
  let valoresDenominador = funcionAcumulativa(comparadorX2, x2);
  let sumatoriaAcumulativa = 0;
  let denominador = 1;

  if (valoresDenominador[valoresDenominador.length - 1] == true && typeof(valoresDenominador[valoresDenominador.length - 1]) == "boolean"){
    sumatoriaAcumulativa = probabilidadRecursiva(valoresDenominador[0], valoresDenominador[valoresDenominador.length - 2], p, q, n);
    denominador = 1 - sumatoriaAcumulativa;
  } else {
    denominador = probabilidadRecursiva(valoresDenominador[0], valoresDenominador[valoresDenominador.length - 1], p, q, n);
  }

  let divisionFinal = numerador/denominador; 
  return round(divisionFinal, 6);    
}


function calcularProbabilidadIntervalo(p, q, n, x){
  let comparadorX1 = x[0];
  let x1 = x[1];
  let comparadorX2 = x[2];
  let x2 = x[3];
  let intersecto = interseccion(comparadorX1, x1, comparadorX2, x2, n);
  let total = probabilidadRecursiva(intersecto[0], intersecto[intersecto.length - 1], p, q, n);
  return round(total, 6);
}


function calcularProbabilidadNormal(p, q, n, x){
  let comparadorX = x[0];
  x = x[1];
  let total;
  let valores = funcionAcumulativa(comparadorX, x);
  let sumatoriaAcumulativa = 0;


  if (valores[valores.length - 1] == true && typeof(valores[valores.length - 1]) == "boolean"){
    sumatoriaAcumulativa = probabilidadRecursiva(valores[0], valores[valores.length - 2], p, q, n);
    total = 1 - sumatoriaAcumulativa;        
  } else {
    total = probabilidadRecursiva(valores[0], valores[valores.length - 1], p, q,n);
  }

  return round(total, 6);
}


function calcularExito(p, x){
  return Math.pow(p, x);
}


function calcularError(q, n, x){
  return Math.pow(q, (n-x));
}

