// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.7.1.js
// ==/UserScript==

(function() {
    'use strict';


    GM_addStyle(`
     /* The Modal (background) test*/
  .modal {
    display: none;
    /* Hidden by default */
    position: fixed;
    /* Stay in place */
    z-index: 1;
    /* Sit on top */
    padding-top: 25px;
    /* Location of the box */
    left: 0;
    top: 0;
    width: 100%;
    /* Full width */
    height: 100%;
    /* Full height */
    overflow: auto;
    /* Enable scroll if needed */
    background-color: rgb(0, 0, 0);
    /* Fallback color */
    background-color: rgba(0, 0, 0, 0.75);
    /* Black w/ opacity */
  }

  /* Modal Content */
  .modal-content {
    background-color: #fefefe00;
    margin: auto;
    padding: 20px;
    width: 95%;
  }

  /* The Close Button */
  .close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }


  /* The Modal (background) */
  .modal_1 {
    display: none;
    /* Hidden by default */
    position: fixed;
    /* Stay in place */
    z-index: 1;
    /* Sit on top */
    padding-top: 25px;
    /* Location of the box */
    left: 0;
    top: 0;
    width: 100%;
    /* Full width */
    height: 100%;
    /* Full height */
    overflow: auto;
    /* Enable scroll if needed */
    background-color: rgb(0, 0, 0);
    /* Fallback color */
    background-color: rgba(0, 0, 0, 0.75);
    /* Black w/ opacity */
  }

  /* Modal Content */
  .modal-content_1 {
    background-color: #fefefe00;
    margin: auto;
    padding: 20px;
    width: 45%;
  }

  /* The Close Button */
  .close_1 {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close_1:hover,
  .close_1:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }

     .modal_cargando {
        display: none;
        /* Hidden by default */
        position: fixed;
        /* Stay in place */
        z-index: 1;
        /* Sit on top */
        padding-top: 25px;
        /* Location of the box */
        left: 0;
        top: 0;
        width: 100%;
        /* Full width */
        height: 100%;
        /* Full height */
        overflow: auto;
        /* Enable scroll if needed */
        background-color: rgb(0, 0, 0);
        /* Fallback color */
        background-color: rgba(0, 0, 0, 0.75);
        /* Black w/ opacity */
    }

    /* Modal Content */
    .modal-content_cargando {
        background-color: #fefefe00;
        padding-top: 15%;
        width: 95%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* The Close Button */
    .close_cargando {
        color: #aaaaaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close_cargando:hover,
    .close_cargando:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }

     `);



    var cats = {};
    cats["senior"] = "senior";
    cats["world"] = "seniorw";
    cats["u23"] = "SUB23";
    cats["u21"] = "SUB21";
    cats["u18"] = "SUB18";
    cats["u23_world"] = "SUB23w";
    cats["u21_world"] = "SUB21w";
    cats["u18_world"] = "SUB18w";
    window.cats=cats;



    function getCookie(nombre) {
        var regex = new RegExp("(?:(?:^|.*;\\s*)" + nombre + "\\s*\\=\\s*([^;]*).*$)|^.*$");
        var valorCookie = document.cookie.replace(regex, "$1");
        return decodeURIComponent(valorCookie);
    }
    var langs = new Map();
    langs.set('es', 'SPANISH');
    langs.set('ar', 'SPANISH')
    langs.set('en', 'ENGLISH');
    langs.set('br', 'PORTUGUES');
    langs.set('pt', 'PORTUGUES');
    langs.set('pl', 'POLISH');
    langs.set('ro', 'ROMANIAN');
    langs.set('tr', 'TURKISH');

    var lanCookie = getCookie("MZLANG");
    if(langs.has(lanCookie)){
        window.lang=langs.get(lanCookie);
    }else{
        window.lang="ENGLISH";
    }

    console.log(window.lang)


// Ejemplo de uso
    var sportCookie = getCookie("MZSPORT");
    console.log(sportCookie);
    var lsport="F"
    if(sportCookie=="hockey"){
        lsport="H";
    }
    window.sport=sportCookie;
    window.lsport=lsport;


    document.addEventListener("DOMContentLoaded", function() {
        var urlParams = new URLSearchParams(window.location.search);
        if((urlParams.has('p')) && (urlParams.get('p') === 'league')){


            leagues();


        }
    });

    var teams_data="";

    function leagues(){






        var linkIds=""
        var urlParams = new URLSearchParams(window.location.search);
        setTimeout(function() {

            var elems = document.getElementsByClassName("nice_table");
            var tabla = elems[0]


            var values = new Map();

// Agregar elementos al mapa
            values.set('valor23', 'Value U23');
            values.set('valor21', 'Value U21');
            values.set('valor18', 'Value U18');
            values.set('valorUPSenior', 'Value LM');
            values.set('valorUPSUB23', 'Value LM U23');
            values.set('valorUPSUB21', 'Value LM U21');
            values.set('valorUPSUB18', 'Value LM U18');
            values.set('valor11', 'TOP 11');
            values.set('valor11_23', 'TOP 11 U23');
            values.set('valor11_21', 'TOP 11 U21');
            values.set('valor11_18', 'TOP 11 U18');
            values.set('elo', 'ELO Score');
            values.set('elo23', 'ELO Score U23');
            values.set('elo21', 'ELO Score U21');
            values.set('elo18', 'ELO Score U18');

            var contenidoNuevo = '<div id=testClick><center><table><tr><td><label><input class="statsxente" type="checkbox" id="valor" value="Value">Value</label></td>';
            values.forEach(function(valor, clave) {
                /*if(clave=="valorUPSenior"){
                    contenidoNuevo+="</tr><tr>";
                }*/
                if(clave=="valor11"){
                    contenidoNuevo+="</tr><tr>";
                }
                /* if(clave=="elo"){
                     contenidoNuevo+="</tr><tr>";
                 }*/
                contenidoNuevo+='<td><label><input class="statsxente" type="checkbox" value="'+valor+'" id="'+clave+'">'+valor+'</label></td>';

            });



            contenidoNuevo+="</tr></table></center></div>";


            values.set('valor', 'Value');

            elems = document.getElementsByClassName("nice_table");
            tabla = elems[0]


            tabla.insertAdjacentHTML('beforebegin', contenidoNuevo);



            values.forEach(function(valor, clave) {

                var elemento = document.getElementById(clave);
                elemento.addEventListener('click', handleClick);

            });



            // Añadir una nueva celda en la fila de encabezados
            var nuevaCeldaEncabezado = document.createElement("th");
            nuevaCeldaEncabezado.textContent = "Stats Xente";
            nuevaCeldaEncabezado.style.backgroundColor="#246355"
            nuevaCeldaEncabezado.style.color="white"
            var ser = document.getElementsByClassName("seriesHeader")
            document.getElementsByClassName("seriesHeader")[0].appendChild(nuevaCeldaEncabezado);


            nuevaCeldaEncabezado = document.createElement("th");
            nuevaCeldaEncabezado.textContent = "Value";
            nuevaCeldaEncabezado.style.backgroundColor="#246355"
            nuevaCeldaEncabezado.style.color="white"
            ser = document.getElementsByClassName("seriesHeader")
            document.getElementsByClassName("seriesHeader")[0].appendChild(nuevaCeldaEncabezado);

            // Añadir una nueva columna al final de cada fila de datos
            var contIds=0
            var filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
            for (var i = 0; i < filasDatos.length; i++) {
                var celda = tabla.rows[i+1].cells[1];

                var equipo=celda.textContent.trim()
                var iniIndex = celda.innerHTML.indexOf("tid=");
                var lastIndex = celda.innerHTML.indexOf("\">", iniIndex+4);
                var data=String(celda.innerHTML)
                var id=data.substring(iniIndex+4,lastIndex)
                linkIds+="&idEquipo"+contIds+"="+id
                contIds++
                celda.innerHTML+="<input type='hidden' id='team_"+id+"' value='"+equipo+"'/>"




                var nuevaColumna = document.createElement("td");
                // var iner = "<img src='https://statsxente.com/MZ1/View/Images/detail.png' width='20px' height='20px' onclick=\"openModalStatsEquiposHistoricoFiltro1("+id+",'team_"+id+"','z_hola',77,77,'soccer')\"/>";
                var iner = "<img src='https://statsxente.com/MZ1/View/Images/detail.png' width='20px' height='20px' id='but"+id+"' style='cursor:pointer;'/>";
                iner += "<img src='https://statsxente.com/MZ1/View/Images/graph.png' width='20px' height='20px' id='but1"+id+"' style='cursor:pointer;'/>";
                iner += "<img src='https://statsxente.com/MZ1/View/Images/report.png' width='20px' height='20px' onclick=\"openModalStatsEquiposHistoricoFiltro1("+id+",'team_"+id+"','z_hola',77,77,'soccer')\"/>";
                var cat = cats[urlParams.get('type')]
                nuevaColumna.innerHTML=iner
                filasDatos[i].appendChild(nuevaColumna);

                nuevaColumna = document.createElement("td");


//var link="https://statsxente.com/MZ1/Graficos/graficoProgresoEquipo.php?idEquipo=276402&modal=yes&idioma=SPANISH&divisa=EUR&deporte=F"



                (function (currentId,currentLSport,lang) {
                    document.getElementById("but1" + currentId).addEventListener('click', function () {
                        var link = "https://statsxente.com/MZ1/Graficos/graficoProgresoEquipo.php?idEquipo="+currentId+"&idioma="+lang+"&divisa=EUR&deporte="+currentLSport;
                        openWindow(link,0.95,1.25);
                    });
                })(id,window.lsport,window.lang);

                (function (currentId, currentEquipo,currentCat,currentSport,lang) {
                    document.getElementById("but" + currentId).addEventListener('click', function () {
                        var link = "https://statsxente.com/MZ1/View/filtroStatsEquiposHistorico.php?tamper=yes&idEquipo=" + currentId + "&idioma="+lang+"&modal=yes&deporte="+currentSport+"&season=77&season_actual=77&categoria="+currentCat+"&equipo=" + currentEquipo + "&cerrar=no";
                        openWindow(link,0.95,1.25);
                    });
                })(id, equipo,cat,window.sport,window.lang);




            }

            console.log(linkIds)
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://bdstatsxente.sytes.net/MZ1/View/test6.php?team_id=771617&deporte=soccer&world=yes"+linkIds,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    var jsonResponse = JSON.parse(response.responseText);

                    teams_data=jsonResponse;
                    var filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                    for (var i = 0; i < filasDatos.length; i++) {
                        var celda = tabla.rows[i+1].cells[1];

                        var equipo=celda.textContent.trim()
                        var iniIndex = celda.innerHTML.indexOf("tid=");
                        var lastIndex = celda.innerHTML.indexOf("\">", iniIndex+4);
                        var data=String(celda.innerHTML)
                        var id=data.substring(iniIndex+4,lastIndex)



                        var nuevaColumna = document.createElement("td");

                        var valor= new Intl.NumberFormat("es-ES").format(Math.round(jsonResponse[id]["valor"]))
                        nuevaColumna.innerHTML=valor
                        filasDatos[i].appendChild(nuevaColumna);



                    }




                    var thead=document.getElementsByClassName("seriesHeader")[0]

                    console.log(thead)
                    var ths = thead.querySelectorAll("th");

                    // Agregar event listener a cada th
                    ths.forEach(function(th, index) {
                        th.addEventListener("click", function() {
                            ordenarTabla(index);
                        });
                    });



                }
            });





        }, 3000);






    }






    function openWindow(link,porAncho,porAlto){
        var ventanaAncho=(window.innerWidth)*porAncho
        var ventanaAlto= (window.innerHeight)*porAlto
        console.log(ventanaAlto)
        // Calcular las coordenadas para centrar la ventana
        var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
        var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;

        // Opciones de la ventana (puedes ajustar según tus necesidades)
        var opcionesVentana = "width=" + ventanaAncho +
            ",height=" + ventanaAlto +
            ",left=" + ventanaIzquierda +
            ",top=" + ventanaArriba;
        // Abrir la nueva ventana en el centro
        window.open(link, "_blank", opcionesVentana);
    }




    function handleClick(event) {



        var elems = document.getElementsByClassName("nice_table");
        var tabla = elems[0]
        var filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

// Obtener el segundo th del thead
        var thSegundo = tabla.querySelector("thead th:nth-child(2)");

// Cambiar el ancho del segundo th
        thSegundo.style.width = "320px";

// Iterar sobre cada fila
        for (var i = 0; i < filas.length; i++) {
            // Obtener todas las celdas de la fila



            var celda = tabla.rows[i+1].cells[1];

            var equipo=celda.textContent.trim()
            var iniIndex = celda.innerHTML.indexOf("tid=");
            var lastIndex = celda.innerHTML.indexOf("\">", iniIndex+4);
            var data=String(celda.innerHTML)
            var id=data.substring(iniIndex+4,lastIndex)


            var celdas = filas[i].getElementsByTagName("td");

            // Obtener la última celda de la fila
            var ultimaCelda = celdas[celdas.length - 1];



            console.log(teams_data[id])

            var valor= new Intl.NumberFormat("es-ES").format(Math.round(teams_data[id][event.target.id]))
            ultimaCelda.innerHTML = valor;
        }
        var checkboxes = document.querySelectorAll('.statsxente');



        var ultimaFilaEncabezado = tabla.querySelector("thead tr:last-child");

// Obtener la última celda de encabezado (<th>) dentro de la última fila de encabezado
        var ultimaCeldaEncabezado = ultimaFilaEncabezado.querySelector("th:last-child");

// Cambiar el texto de la última celda de encabezado
        ultimaCeldaEncabezado.textContent = event.target.value;


// Iterar sobre los elementos
        checkboxes.forEach(function(checkbox) {
            console.log(checkbox.id )
            // Verificar si el checkbox no tiene el ID "hola"
            if (checkbox.id !== event.target.id) {
                // Deseleccionar el checkbox
                checkbox.checked = false;
            }
        });







        var columna=12



    }


    function ordenarTabla(columna){


        var elems = document.getElementsByClassName("nice_table");
        var tabla = elems[0]

        var filas, switching, i, x, y, debeCambiar, direccion, cambioRealizado;

        switching = true;
        // Establecer la dirección de orden inicial a ascendente
        direccion = "descendente";
        // Continuar ordenando hasta que no haya más cambios realizados
        while (switching) {
            switching = false;
            filas = tabla.rows;
            // Recorrer todas las filas excepto la primera (encabezados)
            for (i = 1; i < (filas.length - 1); i++) {
                debeCambiar = false;
                // Obtener los elementos a comparar, uno de la columna actual y otro de la siguiente
                x = filas[i].getElementsByTagName("td")[columna];
                y = filas[i + 1].getElementsByTagName("td")[columna];
                // Comparar los elementos según la dirección de orden y el tipo de datos
                if (direccion == "ascendente") {
                    if (isNaN(parseInt(x.innerHTML))) {
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            debeCambiar = true;
                            break;
                        }
                    } else {
                        if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                            debeCambiar = true;
                            break;
                        }
                    }
                } else if (direccion == "descendente") {
                    if (isNaN(parseInt(x.innerHTML))) {
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            debeCambiar = true;
                            break;
                        }
                    } else {
                        if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
                            debeCambiar = true;
                            break;
                        }
                    }
                }
            }
            if (debeCambiar) {
                // Si debe cambiar, marcarlo y cambiar el orden de las filas
                filas[i].parentNode.insertBefore(filas[i + 1], filas[i]);
                switching = true;
                // Marcar que se realizó un cambio
                cambioRealizado = true;
            } else {
                // Si no se realizó ningún cambio y se estaba ordenando de forma ascendente,
                // cambiar a orden descendente y volver a empezar
                if (!cambioRealizado && direccion == "descendente") {
                    direccion = "ascendente";
                    switching = true;
                }
            }
        }


        filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

// Recorrer todas las filas
        for ( i = 0; i < filas.length; i++) {
            // Obtener el primer td de la fila
            var primerTd = filas[i].querySelector("td");

            // Establecer el contenido del primer td
            primerTd.innerHTML = (i+1);
        }
    }




    // Your code here...
})();
