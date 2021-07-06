// metodos.estadisticos.js



function mergeSort(array) {
    const half = array.length / 2;
    
    // Base case or terminating case
    if(array.length < 2){
      return array;
    }
    
    const left = array.splice(0, half);
    return merge(mergeSort(left),mergeSort(array));
}


function merge(left, right) {
    let arr = [];
    // Break out of loop if any one of the array gets empty
    while (left.length && right.length) {
        // Pick the smaller among the smallest element of left and right sub arrays 
        if (left[0] < right[0]) {
            arr.push(left.shift());
        } else {
            arr.push(right.shift()) ;
        }
    }
      
    // Concatenating the leftover elements
    // (in case we didn't go through the entire left or right array)
    return [ ...arr, ...left, ...right ];
}

function funcionAcumulativaExponencial(comparador, x, media){
    let res = 0;
    let potenciaE = Math.pow(Math.E, (media*-1*x));

    if(comparador == "≥" || comparador == ">" ){
        res = potenciaE;
    } else if (comparador == "≤" || comparador == "<") {
        res = 1 - potenciaE;
    }

    return res;
}

function funcionAcumulativaGamma(comparador, x, media, alfa){
    let res = 0;
    let alfaMap = alphas[alfa];
    let y = Math.round(x*media);

    if(comparador == "≥" || comparador == ">" ){
        if (alfaMap != null){
            res = 1 - alfaMap[y];
        } else {
            if (y >= 24 && alfa >= 10){
                res = 0;
            }
        }
    } else if (comparador == "≤" || comparador == "<") {
        if (alfaMap != null){
            res = alfaMap[y];
        } else {
            if (y >= 24 && alfa >= 10){
                res = 1;
            }
        }
    }

    return res;
}

function funcionAcumulativa(comparador, x){
    let valores = [];
  
    if(comparador == "≥"){
        for (let i = 0; i < x; i++){
            valores.push(i);
        }
        valores.push(true);
    } else if (comparador == "≤") {
        for (let i = 0; i <= x; i++){
            valores.push(i);
        }
    } else if (comparador == "<"){
        for (let i = 0; i < x; i++){
            valores.push(i);
        }
    } else if (comparador == ">"){
        for (let i = 0; i <= x; i++){
            valores.push(i);
        }
        valores.push(true);
    } else if (comparador == "="){
        valores.push(x);
    }
  
    return valores;
}


function interseccion(comparadorX1, x1, comparadorX2, x2, n){
    let valores1 = [];
    let valores2 = [];
    let intersecto = [];    
  
    if(comparadorX1 == "≥"){
        for (let i = x1; i <= n; i++){
            valores1.push(i);
        }
    } else if (comparadorX1 == "≤") {
        for (let i = 0; i <= x1; i++){
            valores1.push(i);
        }
    } else if (comparadorX1 == "<"){
        for (let i = 0; i < x1; i++){
            valores1.push(i);
        }
    } else if (comparadorX1 == ">"){
        for (let i = (x1+1); i <= n; i++){
            valores1.push(i);
        }
    }


    if(comparadorX2 == "≥"){
        for (let i = x2; i <= n; i++){
            valores2.push(i);
        }
    } else if (comparadorX2 == "≤") {
        for (let i = 0; i <= x2; i++){
            valores2.push(i);
        }
    } else if (comparadorX2 == "<"){
        for (let i = 0; i < x2; i++){
            valores2.push(i);
        }
    } else if (comparadorX2 == ">"){
        for (let i = (x2+1); i <= n; i++){
            valores2.push(i);
        }
    }

    valores1 = mergeSort(valores1);

    for (let i = 0; i < valores1.length; i++){
        valor1 = valores1[i];
        if (valores2.includes(valor1)){
            intersecto.push(valor1);
        }
    }
  
    return intersecto;
}

function interseccionAcumulativa(comparadorX1, x1, comparadorX2, x2){
    let intersecto = [];

    /** 
     * Si los comparadores son iguales
    */
    if (((comparadorX1 == ">" || comparadorX1 == "≥") && (comparadorX2 == ">" || comparadorX2 == "≥")) || 
        ((comparadorX1 == "<" || comparadorX1 == "≤") && (comparadorX2 == "<" || comparadorX2 == "≤"))){
            if (x1 > x2){
                for (let i = 0; i < x1; i++){
                    intersecto.push(i);
                }
            } else {
                for (let i = 0; i < x2; i++){
                    intersecto.push(i);
                }
            }
    } else {
        if (x1 > x2){
            if (comparadorX1 == "<" || comparadorX1 == "≤"){
                let limiteSuperior = x1;

                if (comparadorX1 == "<"){
                    limiteSuperior -= 1;
                }

                let limiteInferior = x2;
                if (comparadorX2 == ">"){
                    limiteInferior += 1;
                }

                while(limiteInferior <= limiteSuperior){
                    intersecto.push(limiteInferior);
                    limiteInferior++;
                }
            }
        } else if (x2 > x1){
            if (comparadorX2 == "<" || comparadorX2 == "≤"){
                let limiteSuperior = x2;

                if (comparadorX2 == "<"){
                    limiteSuperior -= 1;
                }

                let limiteInferior = x1;
                if (comparadorX1 == ">"){
                    limiteInferior += 1;
                }

                while(limiteInferior <= limiteSuperior){
                    intersecto.push(limiteInferior);
                    limiteInferior++;
                }
            }
        } else {

            /**
             * P(x >= 1 / x <= 1)
             */
            if ((comparadorX1 == "≤" && comparadorX1 == "≥") || 
                (comparadorX1 == "≥" && comparadorX1 == "≤")){
                    intersecto.push(x1);
            }
        }
    }

    return intersecto;
}

function condicionalAcumulativaExponencial(comparadorX1, x1, comparadorX2, x2, media){
    let a = funcionAcumulativaExponencial(comparadorX1, x1, media);
    let b = funcionAcumulativaExponencial(comparadorX2, x2, media);

    if ((comparadorX1 == ">" || comparadorX1 == "≥") && (comparadorX2 == ">" || comparadorX2 == "≥")){
        if (x1 > x2){
            return a;
        } else {
            return b;
        }
    } else if ((comparadorX1 == "<" || comparadorX1 == "≤") && (comparadorX2 == "<" || comparadorX2 == "≤")){
        if (x1 > x2){
            return b;
        } else {
            return a;
        }
    } else {
        if (x1 > x2 && (comparadorX1 == "<" || comparadorX1 == "≤")){
            return a - (1 - b);
        } else if (x2 > x1 && (comparadorX2 == "<" || comparadorX2 == "≤")){
            return b - (1 - a);
        }
    }

    return 0;
}

function intervaloAcumulativaExponencial(comparadorX1, x1, comparadorX2, x2, media){
    /*
        Se invierten los comparadores
    */
    if (comparadorX1 == ">"){
        comparadorX1 = "<";
    } else if (comparadorX1 == "<"){
        comparadorX1 = ">";
    } else if (comparadorX1 == "≤"){
        comparadorX1 = "≥";
    } else if (comparadorX1 == "≥"){
        comparadorX1 = "≤";
    }

    let a = funcionAcumulativaExponencial(comparadorX1, x1, media);
    let b = funcionAcumulativaExponencial(comparadorX2, x2, media);

    /** 
     * Si los comparadores son iguales
    */
    if ((comparadorX1 == ">" || comparadorX1 == "≥") && (comparadorX2 == ">" || comparadorX2 == "≥")){
            if (x1 > x2){
                return b - a;
            } else {
                return a - b;
            }
    } else if ((comparadorX1 == "<" || comparadorX1 == "≤") && (comparadorX2 == "<" || comparadorX2 == "≤")){
        if (x1 > x2){
            return a - b;
        } else {
            return b - a;
        }
    } else {
        if (x1 > x2 && (comparadorX1 == "<" || comparadorX1 == "≤")){            
            return b;
        } else if (x2 > x1 && (comparadorX2 == "<" || comparadorX2 == "≤")){
            return a;
        }
    }

    return 0;
}

/* Gamma */
function condicionalAcumulativaGamma(comparadorX1, x1, comparadorX2, x2, media, alfa){
    let a = funcionAcumulativaGamma(comparadorX1, x1, media, alfa);
    let b = funcionAcumulativaGamma(comparadorX2, x2, media, alfa);

    if ((comparadorX1 == ">" || comparadorX1 == "≥") && (comparadorX2 == ">" || comparadorX2 == "≥")){
        if (x1 > x2){
            return a;
        } else {
            return b;
        }
    } else if ((comparadorX1 == "<" || comparadorX1 == "≤") && (comparadorX2 == "<" || comparadorX2 == "≤")){
        if (x1 > x2){
            return b;
        } else {
            return a;
        }
    } else {
        if (x1 > x2 && (comparadorX1 == "<" || comparadorX1 == "≤")){
            return a - (1 - b);
        } else if (x2 > x1 && (comparadorX2 == "<" || comparadorX2 == "≤")){
            return b - (1 - a);
        }
    }

    return 0;
}

function intervaloAcumulativaGamma(comparadorX1, x1, comparadorX2, x2, media, alfa){
    /*
        Se invierten los comparadores
    */
    if (comparadorX1 == ">"){
        comparadorX1 = "<";
    } else if (comparadorX1 == "<"){
        comparadorX1 = ">";
    } else if (comparadorX1 == "≤"){
        comparadorX1 = "≥";
    } else if (comparadorX1 == "≥"){
        comparadorX1 = "≤";
    }

    let a = funcionAcumulativaGamma(comparadorX1, x1, media, alfa);
    let b = funcionAcumulativaGamma(comparadorX2, x2, media, alfa);
    
    /** 
     * Si los comparadores son iguales
    */
    if ((comparadorX1 == ">" || comparadorX1 == "≥") && (comparadorX2 == ">" || comparadorX2 == "≥")){
            if (x1 > x2){
                return b - a;
            } else {
                return a - b;
            }
    } else if ((comparadorX1 == "<" || comparadorX1 == "≤") && (comparadorX2 == "<" || comparadorX2 == "≤")){
        if (x1 > x2){
            return a - b;
        } else {
            return b - a;
        }
    } else {
        if (x1 > x2 && (comparadorX1 == "<" || comparadorX1 == "≤")){            
            return b;
        } else if (x2 > x1 && (comparadorX2 == "<" || comparadorX2 == "≤")){
            return a;
        }
    }

    return 0;
}

/* Normal */
function condicionalNormal(comparadorX1, x1, comparadorX2, x2, media, desviacion){
    let a = calcularProbabilidadNormal(media, desviacion, [comparadorX1, x1]);
    let b = calcularProbabilidadNormal(media, desviacion, [comparadorX2, x2]);

    if ((comparadorX1 == ">" || comparadorX1 == "≥") && (comparadorX2 == ">" || comparadorX2 == "≥")){
        if (x1 > x2){
            return a;
        } else {
            return b;
        }
    } else if ((comparadorX1 == "<" || comparadorX1 == "≤") && (comparadorX2 == "<" || comparadorX2 == "≤")){
        if (x1 > x2){
            return b;
        } else {
            return a;
        }
    } else {
        if (x1 > x2 && (comparadorX1 == "<" || comparadorX1 == "≤")){
            return a - (1 - b);
        } else if (x2 > x1 && (comparadorX2 == "<" || comparadorX2 == "≤")){
            return b - (1 - a);
        }
    }

    return 0;
}

function intervaloNormal(comparadorX1, x1, comparadorX2, x2, media, desviacion){
    /*
        Se invierten los comparadores
    */
    if (comparadorX1 == ">"){
        comparadorX1 = "<";
    } else if (comparadorX1 == "<"){
        comparadorX1 = ">";
    } else if (comparadorX1 == "≤"){
        comparadorX1 = "≥";
    } else if (comparadorX1 == "≥"){
        comparadorX1 = "≤";
    }

    console.log("Antes de enviar a a:\nMedia: " + media + "\nDesviacion: " + desviacion + "\nComparadorX1: " + comparadorX1
    + "\nx1: " + x1);

    let a = calcularProbabilidadNormal(media, desviacion, [comparadorX1, x1]);
    let b = calcularProbabilidadNormal(media, desviacion, [comparadorX2, x2]);

    console.log("A: " + a);
    console.log("B: " + b);
    
    /** 
     * Si los comparadores son iguales
    */
    if ((comparadorX1 == ">" || comparadorX1 == "≥") && (comparadorX2 == ">" || comparadorX2 == "≥")){
            if (x1 > x2){
                return b - a;
            } else {
                return a - b;
            }
    } else if ((comparadorX1 == "<" || comparadorX1 == "≤") && (comparadorX2 == "<" || comparadorX2 == "≤")){
        if (x1 > x2){
            return a - b;
        } else {
            return b - a;
        }
    } else {
        if (x1 > x2 && (comparadorX1 == "<" || comparadorX1 == "≤")){            
            return b;
        } else if (x2 > x1 && (comparadorX2 == "<" || comparadorX2 == "≤")){
            return a;
        }
    }

    return 0;
}

function calcularCombinacion(n, x){
    // fialN: Factorial N
    let fialN = factorialRecursivo(n);

    // fialResta: Factorial (n - x)
    let fialResta = factorialRecursivo(n-x);

    // fialX: Factorial X
    let fialX = factorialRecursivo(x);

    // Division
    let total = fialN / (fialResta*fialX);

    return total;
}
  
// Función para calcular el factorial
// de manera recursiva
function factorialRecursivo(n){
    if (n < 0){
        return 0;
    } else if (n == 1 | n == 0){
        return 1;
    } else {
      return n*factorialRecursivo(n-1);
    }
}

// Función para redondear, la cual
// aparentemente funciona con la notación e
function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }