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

function calculadoraHipergeometrico(){
    let inputsVariablesPrincipales = document.querySelectorAll('.variables-principales-inputs div input');
    let inputsX = document.querySelectorAll(".formato-de-entrada input");
    let inputX1 = inputsX[0];
    let inputX2 = inputsX[1];

    let variableExitoPoblacional = Number(inputsVariablesPrincipales[0].value);
    let variablePoblacion = Number(inputsVariablesPrincipales[1].value);
    let variableMuestra = Number(inputsVariablesPrincipales[2].value);
    let variableX = limpiarVariableX([inputX1.value, inputX2.value], inputX2);      
    
    let spanModelo = document.querySelector('.modelo span');
    let textoModelo = modelo(inputsVariablesPrincipales[0].value, inputsVariablesPrincipales[1].value , variableMuestra);
    katex.render(textoModelo, spanModelo, {throwOnError: false});

    let probabilidad = calcular(variableExitoPoblacional, variablePoblacion, variableMuestra, variableX);
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

function modelo(M, N, n){
    let resta = parseInt(N) - parseInt(M);
    return String.raw`P(x) = \frac {\begin{pmatrix} ${M} \\ x \end{pmatrix} \begin{pmatrix} ${resta} \\ ${n}-x \end{pmatrix}}{\begin{pmatrix}${N} \\ ${n}\end{pmatrix}}`;
}

function probabilidadRecursiva(i,f,M,N,n){
    if ((f-i) == 0){
        let combinacion1 = calcularCombinacion(M, i);
        let combinacion2 = calcularCombinacion((N-M), (n-i));
        let combinacion3 = calcularCombinacion(N, n);
        let res = (combinacion1*combinacion2)/combinacion3;
        return res;
    } else {
        let combinacion1 = calcularCombinacion(M, i);
        let combinacion2 = calcularCombinacion((N-M), (n-i));
        let combinacion3 = calcularCombinacion(N, n);
        let res = (combinacion1*combinacion2)/combinacion3;
        return res + probabilidadRecursiva(i+1, f, M,N,n);
    }
  }

function calcular(M, N, n, x){

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
        return calcularProbabilidadCondicional(M, N, n, x);
      } else {
        return calcularProbabilidadIntervalo(M, N, n, x);
      }
  
    } else {
      return calcularProbabilidadNormal(M,N,n,x);
    }
}

  function calcularProbabilidadCondicional(M, N, n, x){
    let comparadorX1 = x[0];
    let x1 = x[1];
    let comparadorX2 = x[2];
    let x2 = x[3];
    let intersecto = interseccion(comparadorX1, x1, comparadorX2, x2, n);
  
    let numerador = probabilidadRecursiva(intersecto[0], intersecto[intersecto.length - 1], M, N, n);
    let valoresDenominador = funcionAcumulativa(comparadorX2, x2);
    let sumatoriaAcumulativa = 0;
    let denominador = 1;
  
    if (valoresDenominador[valoresDenominador.length - 1] == true && typeof(valoresDenominador[valoresDenominador.length - 1]) == "boolean"){
      sumatoriaAcumulativa = probabilidadRecursiva(valoresDenominador[0], valoresDenominador[valoresDenominador.length - 2], M, N, n);
      denominador = 1 - sumatoriaAcumulativa;
    } else {
      denominador = probabilidadRecursiva(valoresDenominador[0], valoresDenominador[valoresDenominador.length - 1], M, N, n);
    }
  
    let divisionFinal = numerador/denominador; 
    return round(divisionFinal, 6);    
}

function calcularProbabilidadIntervalo(M, N, n, x){
    let comparadorX1 = x[0];
    let x1 = x[1];
    let comparadorX2 = x[2];
    let x2 = x[3];
    let intersecto = interseccion(comparadorX1, x1, comparadorX2, x2, n);
    let total = probabilidadRecursiva(intersecto[0], intersecto[intersecto.length - 1], M, N, n);
    return round(total, 6);
}

function calcularProbabilidadNormal(M, N, n, x){
    let comparadorX = x[0];
    x = x[1];
    let total;
    let valores = funcionAcumulativa(comparadorX, x);
    let sumatoriaAcumulativa = 0;
  
  
    if (valores[valores.length - 1] == true && typeof(valores[valores.length - 1]) == "boolean"){
      sumatoriaAcumulativa = probabilidadRecursiva(valores[0], valores[valores.length - 2], M, N, n);
      total = 1 - sumatoriaAcumulativa;        
    } else {
      total = probabilidadRecursiva(valores[0], valores[valores.length - 1], M, N,n);
    }
  
    return round(total, 6);
}