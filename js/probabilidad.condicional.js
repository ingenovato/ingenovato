// probabilidad.condicional.js

function probabilidadCondicional(){
    let adicionales = document.getElementsByClassName('adicionales');
    let adicionalInput = adicionales[0];
    let adicionalSpan = adicionales[1];
  
    let spansProbabilidadX = document.querySelectorAll('.formato-de-entrada span');
    let textoBoton = document.querySelectorAll('.diferentes-probabilidades button');
  
    let textoSpan2 = spansProbabilidadX[1].textContent.substring(0,2);    

    if (textoSpan2.includes("x")){
        textoBoton[0].innerHTML = "Desactivar probabilidad condicional";
        spansProbabilidadX[0].innerHTML = "P (x&nbsp;";
        spansProbabilidadX[1].innerHTML = "&nbsp;/&nbsp;x&nbsp;";
        textoBoton[1].innerHTML = "Activar probabilidad por intervalo";
        adicionalInput.classList.remove('display-none');
        adicionalSpan.classList.remove('display-none');

    } else if (textoSpan2.includes("/")){
        textoBoton[0].innerHTML = "Activar probabilidad condicional";
        spansProbabilidadX[0].innerHTML = "P (x&nbsp;&nbsp;";
        spansProbabilidadX[1].innerHTML = ")";
        adicionalInput.classList.add('display-none');
        adicionalSpan.classList.add('display-none');

    } else {
        textoBoton[0].innerHTML = "Desactivar probabilidad condicional";
        spansProbabilidadX[0].innerHTML = "P (x&nbsp;";
        spansProbabilidadX[1].innerHTML = "&nbsp;/&nbsp;x&nbsp;";
        adicionalInput.classList.remove('display-none');
        adicionalSpan.classList.remove('display-none');

    }

}