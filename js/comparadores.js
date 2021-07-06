// comparadores.js

let inputFocus = 1;

/*
    Esta función lo que hace es actualizar el valor de
    inputFocus para establecer cual input es el que está
    activado en el momento de ingresar un nuevo símbolo.
*/
function focusInput(nuevoFocus){
    inputFocus = nuevoFocus;
}


function agregarComparadores(simbolo){
  let comparadorAgregar;
  let inputs = document.querySelectorAll('.datos-variable-x > div input');
  let spanIntermediario = document.getElementById('permisor');
  let textoSpan2 = document.querySelector(".formato-de-entrada .span-2").textContent.substring(0,2);
  let valorAnterior = inputs[inputFocus - 1].value;

  /*
    Si textoSpan2 contiene el caracter '/' es porque hay en
    proceso una probabilidad condicional.
    De lo contrario, si contiene la letra 'x' es porque hay
    en proceso una probabilidad de intervalo.
    De lo contrario, hay una probabilidad normal.
  */
  if (textoSpan2.includes("/")){

    if (simbolo == 1){
        comparadorAgregar = String.raw`\geq${valorAnterior}`; 
        comparadoresMenorMayorIgual(inputs, comparadorAgregar, spanIntermediario, "condicional");

    } else if (simbolo == 2){
        comparadorAgregar = String.raw`\leq${valorAnterior}`;
        comparadoresMenorMayorIgual(inputs, comparadorAgregar, spanIntermediario, "condicional");

    } else if (simbolo == 3){
        agregarIgualQue(inputs, "condicional");

    } else if (simbolo == 4){
        comparadorAgregar = ">";
        agregarMayorMenorQue(inputs, comparadorAgregar, "condicional");

    } else {
        comparadorAgregar = "<";
        agregarMayorMenorQue(inputs, comparadorAgregar, "condicional");

    }
  } else if (textoSpan2.includes("x")){

    if (simbolo == 1){
        comparadorAgregar = String.raw`\geq${valorAnterior}`; 
        comparadoresMenorMayorIgual(inputs, comparadorAgregar, spanIntermediario, "intervalos");

    } else if (simbolo == 2){
        comparadorAgregar = String.raw`\leq${valorAnterior}`;
        comparadoresMenorMayorIgual(inputs, comparadorAgregar, spanIntermediario, "intervalos");

    } else if (simbolo == 3){
        agregarIgualQue(inputs, "intervalos");

    } else if (simbolo == 4){
        comparadorAgregar = ">";
        agregarMayorMenorQue(inputs, comparadorAgregar, "intervalos");

    } else {
        comparadorAgregar = "<";
        agregarMayorMenorQue(inputs, comparadorAgregar, "intervalos");

    }
  }  else {
    if (simbolo == 1){
        comparadorAgregar = String.raw`\geq${valorAnterior}`; 
        comparadoresMenorMayorIgual(inputs, comparadorAgregar, spanIntermediario, "normal");

    } else if (simbolo == 2){
        comparadorAgregar = String.raw`\leq${valorAnterior}`;
        comparadoresMenorMayorIgual(inputs, comparadorAgregar, spanIntermediario, "normal");

    } else if (simbolo == 3){
        agregarIgualQue(inputs, "normal");

    } else if (simbolo == 4){
        comparadorAgregar = ">";
        agregarMayorMenorQue(inputs, comparadorAgregar, "normal");

    } else {
        comparadorAgregar = "<";
        agregarMayorMenorQue(inputs, comparadorAgregar, "normal");

    }
  }            
}


function agregarMayorMenorQue(inputs, comparadorAgregar, tipoProbabilidad){
    if (tipoProbabilidad == "condicional"){
        inputs[inputFocus - 1].value = comparadorAgregar + inputs[inputFocus - 1].value;
    } else if (tipoProbabilidad == "intervalos") {
        if (inputFocus == 1) {
            inputs[inputFocus - 1].value = inputs[inputFocus - 1].value + comparadorAgregar;
        } else {
            inputs[inputFocus - 1].value = comparadorAgregar + inputs[inputFocus - 1].value;
        }
    } else {
        inputs[0].value = comparadorAgregar + inputs[0].value;
    }

    inputs[inputFocus - 1].focus();
}


function comparadoresMenorMayorIgual(inputs, comparadorAgregar, spanIntermediario, tipoProbabilidad){
    katex.render(comparadorAgregar, spanIntermediario, {throwOnError: false});
    
    if (tipoProbabilidad == "condicional"){
        inputs[inputFocus - 1].value = (spanIntermediario.textContent).substring(0,1) + inputs[inputFocus - 1].value;
    } else if (tipoProbabilidad == "intervalos") {
        if (inputFocus == 1) {
            inputs[inputFocus - 1].value = inputs[inputFocus - 1].value + (spanIntermediario.textContent).substring(0,1);
        } else {
            inputs[inputFocus - 1].value = (spanIntermediario.textContent).substring(0,1) + inputs[inputFocus - 1].value;
        }
    } else {
        inputs[0].value = (spanIntermediario.textContent).substring(0,1) + inputs[0].value;
    }

    inputs[inputFocus - 1].focus();
}


function agregarIgualQue(inputs, tipoProbabilidad){

    if (tipoProbabilidad == "condicional"){
        inputs[inputFocus - 1].value = "=" + inputs[inputFocus - 1].value;
    } else if (tipoProbabilidad == "intervalos"){
        if (inputFocus == 1){
            inputs[inputFocus - 1].value = inputs[inputFocus - 1].value + "=";
        } else {
            inputs[inputFocus - 1].value = "=" + inputs[inputFocus - 1].value;
        }
    } else {
        inputs[0].value = "=" + inputs[0].value;
    }
    
    inputs[inputFocus - 1].focus();
}