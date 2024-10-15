// ==UserScript==
// @name         Stats Xente Script
// @namespace    http://tampermonkey.net/
// @version      0.103
// @description  Stats Xente script for inject own data on Managerzone site
// @author       xente
// @match        https://www.managerzone.com/*
// @icon         https://statsxente.com/MZ1/View/Images/etiqueta_bota.png
// @license      GNU
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @require      https://code.jquery.com/jquery-3.7.1.js
// @downloadURL https://update.greasyfork.org/scripts/491442/Stats%20Xente%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/491442/Stats%20Xente%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*var keys = GM_listValues();
    keys.forEach(function(key) {
        console.log(key+" "+GM_getValue(key))
    });*/

    /*var actual_version="0.9666"
    console.log(GM_info.script.version)

    if(GM_info.script.version!=actual_version){
        console.log("here")
        keys = GM_listValues();
                keys.forEach(function (key) {
                    GM_deleteValue(key);
                });
    }*/


    setCSSStyles()
    createModalMenu()
    createModalEventListeners()
    setLangSportCats()
    getUsernameData()
    checkScriptVersion()






    /// FUNCTIONS MENU
    setTimeout(function () {

        var urlParams = new URLSearchParams(window.location.search);
        if ((urlParams.has('p')) && (urlParams.get('p') === 'league') && (GM_getValue("leagueFlag"))) {
            waitToDOM(leagues, ".nice_table", 0)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'federations')
            && (urlParams.get('sub') === 'league') && (GM_getValue("federationFlag"))) {
            waitToDOM(clashLeagues, ".nice_table", 0)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'federations')
            && (urlParams.get('sub') === 'clash') && (GM_getValue("federationFlag"))) {
            waitToDOM(clash, ".fed_badge", 0)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'match')
            && (urlParams.get('sub') === 'result') && (GM_getValue("matchFlag"))) {
            setTimeout(function () {
                waitToDOM(match, ".hitlist.statsLite.marker", 0)
            }, 2000);
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'players') && (!urlParams.has('pid'))
            && (GM_getValue("playersFlag"))) {
            waitToDOM(playersPage, ".playerContainer", 0)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'players') && (urlParams.has('pid'))) {
            waitToDOM(playersPageStats, ".player_name", 0)
        }


        if ((urlParams.has('p')) && (urlParams.get('p') === 'rank') && (urlParams.get('sub') === 'countryrank')
            && (GM_getValue("countryRankFlag"))) {
            countryRank();
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'clubhouse')) {
            StatsXenteNextMatchesClubhouse()
        }


        if ((urlParams.has('p')) && (urlParams.get('p') === 'friendlyseries')
            && (urlParams.get('sub') === 'standings')) {
            waitToDOM(friendlyCupsAndLeagues, ".nice_table", 0)
        }


        if ((urlParams.has('p')) && (urlParams.get('p') === 'cup') && (urlParams.get('sub') === 'groupplay')) {
            waitToDOM(friendlyCupsAndLeagues, ".nice_table", 0)
        }


        if ((urlParams.has('p')) && (urlParams.get('p') === 'private_cup') && (urlParams.get('sub') === 'groupplay')) {
            waitToDOM(friendlyCupsAndLeagues, ".nice_table", 0)
        }

        if ((urlParams.has('p')) && (urlParams.get('p') === 'match') && (urlParams.get('sub') === 'played')) {
            waitToDOM(lastMatchesELO, ".group", 0)
            waitToDOM(nextMatches, ".group", 0)
        }


        if ((urlParams.has('p')) && (urlParams.get('p') === 'team')) {
            teamPage()
        }



        if ((urlParams.has('p')) && (urlParams.get('p') === 'match') && (urlParams.get('sub') === 'scheduled')) {
            waitToDOM(nextMatches, ".group", 0)
        }










        const elementos = document.querySelectorAll('.player_link'); //Adds stats icon in players page, when click on player info
        elementos.forEach(function (elemento) {
            elemento.addEventListener('click', function () {
                waitToDOM(playersPageStats, ".player_name", 0)
            });
        });


    }, 1000);

    (function () {
        if (document.getElementById("league_tab_table") !== null) {
            document.getElementById("league_tab_table").addEventListener('click', function () {
                if (document.getElementById("showMenu") === null) {
                    waitToDOM(leagues, ".nice_table", 0)
                }
            });

        }
    })();

    setTimeout(function () {




        (function () {

            if (document.getElementById("ui-id-2") !== null) {
                document.getElementById("ui-id-2").parentNode.addEventListener('click', function () {
                    if (document.getElementById("showMenu") === null) {

                        var urlParams = new URLSearchParams(window.location.search);

                        if (urlParams.get('fsid')) {
                            waitToDOM(friendlyCupsAndLeagues, ".nice_table", 0)
                        } else {
                            waitToDOM(clashLeagues, ".nice_table", 0)
                        }


                    }
                });

            }
        })();



        (function () {

            if (document.getElementById("ui-id-4") !== null) {
                document.getElementById("ui-id-4").parentNode.addEventListener('click', function () {
                    if (document.getElementById("showMenu") === null) {
                        waitToDOM(friendlyCupsAndLeagues, ".nice_table", 0)
                    }
                });

            }
        })();





    }, 2000);

    var teams_data = "";
    var searchClassName = ""
    var players = []
    var lines = []
    var gk_line = ""
    var skills_names = []
    var su_line = "unsetted";


    //Next matches page
    function nextMatches(){

        var team_id=""
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('tid')){
            team_id=urlParams.get("tid")
        }else{
            if(window.sport=="soccer"){
                team_id=GM_getValue("soccer_team_id")
            }else{
                team_id=GM_getValue("hockey_team_id")
            }
        }


        var team_ids=[]
        var linkIds=""
        var contIds=0
        var cIds=""
        var contCIds=0
        var comps=[]
        var comp_ids=[]
        var elements0 = document.querySelectorAll('.odd');

        elements0.forEach(element0 => {
            var cat=element0.getElementsByClassName("responsive-hide match-reference-text-wrapper flex-grow-0");
            if(cat.length>0){
                var links = cat[0].querySelectorAll('a');

                if(links.length>0){
                    var urlObj = new URL("https://www.managerzone.com/" + links[0].getAttribute('href'));
                    var params = new URLSearchParams(urlObj.search);
                    var type = params.get('type');

                    if(type===null){

                        if((params.get('p')=="cup")||(params.get('p')=="private_cup")){


                            if(links[0].textContent.includes("U23")){
                                comps[params.get('cid')]="U23"
                            }else{
                                if(links[0].textContent.includes("U21")){
                                    comps[params.get('cid')]="U21"
                                }else{


                                    if(links[0].textContent.includes("U18")){
                                        comps[params.get('cid')]="U18"
                                    }else{

                                        comps[params.get('cid')]="SENIOR";
                                    }
                                }
                            }
                        }else{

                            var id=0;

                            switch(params.get('p')){
                                case "cup":
                                    id=params.get('cid');
                                    break;
                                case "private_cup":
                                    id=params.get('cid');
                                    break;
                                case "friendly_series":
                                    id=params.get('fsid');
                                    break;

                            }

                            if (!comp_ids.includes(id)) {
                                comp_ids.push(id);
                                cIds += "&idComp" + contCIds + "=" + id
                                contCIds++;
                            }
                        }
                    }
                }
            }



            var elements1 = element0.querySelectorAll('.teams-wrapper .flex-grow-1');
            elements1.forEach(element1 => {
                var elements2 = element1.querySelectorAll('.clippable');
                elements2.forEach(element2 => {
                    var urlObj = new URL("https://www.managerzone.com/" + element2.getAttribute('href'));
                    var params = new URLSearchParams(urlObj.search);
                    var tidValue = params.get('tid');
                    if(tidValue!==null){
                        if (!team_ids.includes(tidValue)) {
                            team_ids.push(tidValue);
                            linkIds += "&idEquipo" + contIds + "=" + tidValue
                            contIds++;
                        }
                    }
                });
            });
        });

        if (!team_ids.includes(team_id)) {
            linkIds += "&idEquipo" + contIds + "=" + team_id
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_elo_values.php?sport=" + window.sport + linkIds+cIds,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                var rawJSON = JSON.parse(response.responseText);
                var jsonResponse=rawJSON["teams"]


                for (let key in rawJSON["comps"]) {
                    comps[key]=rawJSON["comps"][key]['restriction']
                }

                var elements0 = document.querySelectorAll('.odd:not(.uxx)');
                elements0.forEach(element0 => {
                    var elements1 = element0.querySelectorAll('.teams-wrapper .flex-grow-1');
                    elements1.forEach(element1 => {
                        var elements2 = element1.querySelectorAll('.clippable');
                        elements2.forEach(element2 => {
                            var urlObj = new URL("https://www.managerzone.com/" + element2.getAttribute('href'));
                            var params = new URLSearchParams(urlObj.search);
                            var tidValue = params.get('tid');
                            if(tidValue!==null){
                                tidValue=parseInt(tidValue)
                                var valor=0;
                                if (jsonResponse[tidValue]?.SENIOR) {
                                    valor = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(jsonResponse[tidValue]["SENIOR"]).toFixed(0))
                                }
                                element1.innerHTML+="</br>"+valor;
                            }else{
                                tidValue=parseInt(team_id)
                                valor=0;
                                if (jsonResponse[tidValue]?.SENIOR) {
                                    valor = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(jsonResponse[tidValue]["SENIOR"]).toFixed(0))
                                }
                                element1.innerHTML+="</br>"+valor;
                            }
                        });
                    });
                });

                var temp_cats=[]

                temp_cats["u23"] = "U23";
                temp_cats["u21"] = "U21";
                temp_cats["u18"] = "U18";
                temp_cats["u23_world"] = "U23";
                temp_cats["u21_world"] = "U21";
                temp_cats["u18_world"] = "U18";






                elements0 = document.querySelectorAll('.odd.uxx');

                elements0.forEach(element0 => {
                    var cat=element0.getElementsByClassName("responsive-hide match-reference-text-wrapper flex-grow-0");
                    var links = cat[0].querySelectorAll('a');
                    var urlObj = new URL("https://www.managerzone.com/" + links[0].getAttribute('href'));
                    var params = new URLSearchParams(urlObj.search);
                    var type = params.get('type');
                    var elo_type="SENIOR"
                    if(type==null){
                        if(params.get('cid')!=null){
                            elo_type=comps[params.get('cid')]
                        }
                        if(params.get('fsid')!=null){
                            elo_type=comps[params.get('fsid')]
                        }
                    }else{
                        elo_type=temp_cats[type]
                    }
                    var elements1 = element0.querySelectorAll('.teams-wrapper .flex-grow-1');
                    elements1.forEach(element1 => {
                        var elements2 = element1.querySelectorAll('.clippable');
                        elements2.forEach(element2 => {
                            var urlObj = new URL("https://www.managerzone.com/" + element2.getAttribute('href'));
                            var params = new URLSearchParams(urlObj.search);
                            var tidValue = params.get('tid');
                            if(tidValue!==null){
                                tidValue=parseInt(tidValue)
                                valor=0;
                                if(jsonResponse[tidValue] && jsonResponse[tidValue][elo_type] !== undefined)  {
                                    var valor = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(jsonResponse[tidValue][elo_type]).toFixed(0))
                                }
                                element1.innerHTML+="</br>"+valor;
                            }else{
                                tidValue=parseInt(team_id)
                                valor=0;
                                if(jsonResponse[tidValue] && jsonResponse[tidValue][elo_type] !== undefined){
                                    valor = new Intl.NumberFormat(window.userLocal).format(Number.parseFloat(jsonResponse[tidValue][elo_type]).toFixed(0))
                                }
                                element1.innerHTML+="</br>"+valor;
                            }
                        });
                    });
                });
            }
        });


    }
    //Team page
    function teamPage(){
        var u23_type="",u21_type="",u18_type=""
        var team_name_div=document.getElementsByClassName("teamDataText clippable");
        const team_name=encodeURI(team_name_div[0].textContent)
        var team_id=""
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('tid')){
            team_id=urlParams.get("tid")
        }else{
            if(window.sport=="soccer"){
                team_id=GM_getValue("soccer_team_id")
            }else{
                team_id=GM_getValue("hockey_team_id")
            }
        }

        var main_div=document.getElementById("infoAboutTeam")
        var dds = main_div.querySelectorAll('dd');

        dds.forEach(dd => {
            var as = dd.querySelectorAll('a');
            if(as.length>0){
                let href = as[0].getAttribute('href');
                let urlParams = new URLSearchParams(href.split('?')[1]);
                var type = urlParams.get('type');
                if(type.includes("u23")){
                    u23_type=window.cats[type]
                }
                if(type.includes("u21")){
                    u21_type=window.cats[type]
                }
                if(type.includes("u18")){
                    u18_type=window.cats[type]
                }
            }
        });


        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_detailed_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + "&idEquipo="+team_id,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {

                var jsonResponse = JSON.parse(response.responseText);

                var aux=team_id

                var top="TOP 11"

                if(window.sport=="hockey"){
                    top="TOP 21"
                }

                var teamTable='<div style="display: flex;flex-direction: column;justify-content: center;align-items: center;flex-wrap: wrap;max-height: 100%;">'
                teamTable+='<table class="matchValuesTable"><thead><tr>'
                teamTable+='<th id=thTransparent0 style="background-color:transparent; border:0px;"></th>'
                teamTable+='<th style="border-top-left-radius: 5px;">Value</th><th>LM Value</th>'
                teamTable+='<th >'+top+'</th><th>ELO</th>'
                teamTable+='<th>Age</th>'
                teamTable+='<th>Salary</th>'
                teamTable+='<th>Players</th>'
                teamTable+='<th style="border-top-right-radius: 5px;"></th>'
                teamTable+='</tr></thead><tbody>'
                var valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor']))
                var valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSenior']))
                var valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11']))
                var elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo']))
                var edad= Number.parseFloat(jsonResponse[aux]['edad']).toFixed(2)
                var salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salario']))
                var numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['numJugadores']))
                teamTable+='<tr><th style="border-top-left-radius: 5px;">Senior</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td>'+elo+'</td><td>'+edad+'</td><td>'+salario+'</td>'
                teamTable+='<td>'+numJugs+'</td>'
                teamTable+='<td style="border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img style="cursor:pointer;" id="seniorButton" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'

                teamTable+='</td></tr>'

                valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor23']))
                valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB23']))
                valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_23']))
                elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo23']))
                edad=Number.parseFloat(jsonResponse[aux]['age23']).toFixed(2)
                salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salary23']))
                numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['players23']))
                teamTable+='<tr><th>U23</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td>'+elo+'</td><td>'+edad+'</td><td>'+salario+'</td>'
                teamTable+='<td>'+numJugs+'</td>'
                teamTable+='<td style="border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img style="cursor:pointer;" id="sub23Button" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'
                teamTable+='</td></tr>'



                valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor21']))
                valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB21']))
                valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_21']))
                elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo21']))
                edad=Number.parseFloat(jsonResponse[aux]['age21']).toFixed(2)
                salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salary21']))
                numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['players21']))
                teamTable+='<tr><th>U21</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td>'+elo+'</td><td>'+edad+'</td><td>'+salario+'</td>'
                teamTable+='<td>'+numJugs+'</td>'
                teamTable+='<td style="border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img style="cursor:pointer;" id="sub21Button" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'
                teamTable+='</td></tr>'




                valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor18']))
                valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB18']))
                valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_18']))
                elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo18']))
                edad=Number.parseFloat(jsonResponse[aux]['age18']).toFixed(2)
                salario=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['salary18']))
                numJugs=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['players18']))
                teamTable+='<tr><th style="border-bottom-left-radius: 5px;">U18</th><td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valor+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valorLM+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valor11+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td><td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+edad+'</td><td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+salario+'</td>'
                teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+numJugs+'</td>'
                teamTable+='<td style="border-radius: 0 0 10px 0; border-bottom:1px solid '+GM_getValue("bg_native")+'; border-right:1px solid '+GM_getValue("bg_native")+';">'
                teamTable+='<img style="cursor:pointer;" id="sub18Button" src="https://statsxente.com/MZ1/View/Images/detail.png" width="20px" height="20px"/>'
                teamTable+='</td></tr>'

                teamTable+='</tbody></table></div>'
                var divToInserT=document.getElementById("streakAndCupInfo")
                divToInserT.innerHTML=teamTable+divToInserT.innerHTML



                document.getElementById("seniorButton").addEventListener('click', function () {
                    var link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category=senior&elo_category=SENIOR&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });
                document.getElementById("sub23Button").addEventListener('click', function () {
                    var link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category="+u23_type+"&elo_category=U23&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });

                document.getElementById("sub21Button").addEventListener('click', function () {
                    var link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category="+u21_type+"&elo_category=U21&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });


                document.getElementById("sub18Button").addEventListener('click', function () {
                    var link = "https://www.statsxente.com/MZ1/Functions/tamper_teams_stats.php?team_id=" + team_id +
                        "&category="+u18_type+"&elo_category=U18&sport=" + window.sport+ "&idioma=" + window.lang+"&team_name="
                        +team_name+"&divisa=" + GM_getValue("currency")
                    openWindow(link, 0.95, 1.25);
                });



                const thElements = document.querySelectorAll('table.matchValuesTable th');
                thElements.forEach(th => {
                    th.style.backgroundColor = GM_getValue("bg_native");
                    th.style.color = GM_getValue("color_native");
                });
                document.getElementById("thTransparent0").style.backgroundColor="transparent";
            }
        });
    }
    //Last matches page
    function lastMatchesELO(){
        var selectElements = document.getElementsByName('limit');
        if (selectElements.length > 0) {
            var selectElement = selectElements[0];
            selectElement.addEventListener('change', function(event) {
                waitToDOM(lastMatchesELO, ".group", 0)
            });
        }
        selectElements = document.getElementsByName('selectType');
        if (selectElements.length > 0) {
            selectElement = selectElements[0];
            selectElement.addEventListener('change', function(event) {
                waitToDOM(lastMatchesELO, ".group", 0)
            });
        }






        const today = new Date();

        today.setDate(today.getDate() + 2);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        var finalDate = `${year}-${month}-${day}`;

        var initialDate=""



        var elems = document.getElementsByClassName("group");
        Array.from(elems).forEach(function(elem) {
            var fecha=elem.innerText
            const [day, month, year] = fecha.split("-");
            initialDate = `${year}-${month}-${day}`;
        });

        getUsernameData()


        var team_id=""
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('tid')){
            team_id=urlParams.get("tid")
        }else{

            if(window.sport=="soccer"){
                team_id=GM_getValue("soccer_team_id")
            }else{
                team_id=GM_getValue("hockey_team_id")
            }

        }



        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_elo_matches.php?sport=" + window.sport + "&team_id="+team_id+"&initial_date="+initialDate+"&final_date="+finalDate,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                var jsonResponse = JSON.parse(response.responseText);




                var elems = document.getElementsByClassName("bold score-cell-wrapper textCenter flex-grow-0");

                Array.from(elems).forEach(function(elem) {

                    let links = elem.getElementsByClassName('score-hidden gray');
                    let href = links[0].getAttribute('href');
                    let urlParams = new URLSearchParams(href.split('?')[1]);
                    var mid = parseInt(urlParams.get('mid'));

                    if(mid in jsonResponse){

                        var diff=jsonResponse[mid]['score']-jsonResponse[mid]['old_score']
                        diff = diff.toFixed(2)

                        var symbol="";
                        var status="down";
                        if(diff>0){
                            symbol="+";
                            status="up";
                        }

                        elem.innerHTML+="</br><div id='showELOChange' style='display: flex;align-items: center;'>"+symbol+diff+"<img src='https://statsxente.com/MZ1/View/Images/"+status+".png' width='10px' height='10px'/></div>";
                    }


                });

            }
        });




    }
    //Federation clash page
    function clash() {

        var badges = document.getElementsByClassName("fed_badge");
        var regex = /fid=(\d+)/;
        var srcLocal = badges[0].getAttribute('src');
        var local_id = srcLocal.match(regex);
        var src_away = badges[1].getAttribute('src');
        var away_id = src_away.match(regex);
        var names = document.getElementsByClassName("name-score text-ellipsis")
        var homeName=encodeURIComponent(names[0].innerText)
        var awayName=encodeURIComponent(names[1].innerText)
        var elems = document.getElementsByClassName("top-pane__deadline");
        var tabla = elems[0]

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_federations_clash_data.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport +"&home="+local_id[1]+"&away="+away_id[1],
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                var jsonResponse = JSON.parse(response.responseText);



                var contenidoNuevo = "</br></br><center><table><tr><td class='subheader clearfix'>Clash Compare</td></tr><tr><td><center><img id=clashCompare src='https://www.statsxente.com/MZ1/View/Images/clash_icon.png' style='width:45px; height:45px; cursor:pointer;'/></center></td></tr></table></center>";
                contenidoNuevo+="<center><table border='0' style='width:65%;' class='hitlist challenges-list'><thead><tr>"
                contenidoNuevo+="<th colspan='2'>Rank</th><th>Value</th><th>LM Value</th><th>ELO Score</th></tr></thead>"
                contenidoNuevo+="<tbody>"

                contenidoNuevo+="<tr class='odd'>"

                contenidoNuevo+="<td style='text-align:right;'><img src='https://www.managerzone.com/dynimg/pic.php?type=federation&fid="+local_id[1]+"&size=medium&sport="+window.sport+"' width=35px height=35px/></td>"
                contenidoNuevo+="<td style='text-align:left;'>#"+jsonResponse[local_id[1]]["table_index"]+"</td>"

                var valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[local_id[1]]["value"]))
                contenidoNuevo+="<td><center>"+valor+"</center></td>"
                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[local_id[1]]["valueLM"]))
                contenidoNuevo+="<td><center>"+valor+"</center></td>"
                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[local_id[1]]["elo"]))
                contenidoNuevo+="<td><center>"+valor+"</center></td>"

                contenidoNuevo+="</tr>"

                contenidoNuevo+="<tr class='even'>"
                contenidoNuevo+="<td style='text-align:right;'><img src='https://www.managerzone.com/dynimg/pic.php?type=federation&fid="+away_id[1]+"&size=medium&sport="+window.sport+"' width=35px height=35px/></td>"
                contenidoNuevo+="<td style='text-align:left;'>#"+jsonResponse[away_id[1]]["table_index"]+"</td>"


                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[away_id[1]]["value"]))
                contenidoNuevo+="<td><center>"+valor+"</center></td>"
                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[away_id[1]]["valueLM"]))
                contenidoNuevo+="<td><center>"+valor+"</center></td>"
                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[away_id[1]]["elo"]))
                contenidoNuevo+="<td><center>"+valor+"</center></td>"

                contenidoNuevo+="</tr>"

                contenidoNuevo+="</tbody>"
                contenidoNuevo+="</table></center>"
                tabla.insertAdjacentHTML('beforeend', contenidoNuevo)

                document.getElementById("clashCompare").addEventListener('click', function () {
                    var link = "https://statsxente.com/MZ1/Functions/loadClashFederationData.php?tamper=yes&fid=" + local_id[1] + "&fid1=" + away_id[1] + "&fede=" + homeName + "&fede1=" + awayName + "&idioma=" + window.lang + "&divisa=" + GM_getValue("currency") + "&sport=" + window.sport;
                    openWindow(link, 0.95, 1.25);
                });

                names[0].innerText="(#"+jsonResponse[local_id[1]]["table_index"]+")"+names[0].innerText;
                names[1].innerText="(#"+jsonResponse[away_id[1]]["table_index"]+")"+names[1].innerText;




























                var tables = document.querySelectorAll('.hitlist');
                var table=tables[1]


                const thead = table.querySelector("thead");

                // Verifica si el thead no tiene th
                if (thead.children.length === 0) {
                    const th1 = document.createElement("th");
                    th1.innerText = "Equipo";

                    const th2 = document.createElement("th");
                    th2.innerText = "Resultado";
                    const nuevaFila = document.createElement("tr");
                    nuevaFila.appendChild(th1);
                    nuevaFila.appendChild(th2);
                    thead.appendChild(nuevaFila);
                }




                const colCount =  table.rows[0].cells.length;

                var eloCol=0
                var lmCol=1
                if(colCount>2){

                    eloCol=5
                    lmCol=6

                }


                table.id="clash_table";


                var contIds = 0
                var linkIds = ""

                for (let i = 1; i < table.rows.length; i++) {
                    let row = table.rows[i];
                    let thirdColumnCell = row.cells[eloCol];
                    let teamNameElement = thirdColumnCell.querySelector('.team-name');
                    let href = teamNameElement.getAttribute('href');
                    let urlParams = new URLSearchParams(href.split('?')[1]);
                    let tid = urlParams.get('tid');
                    linkIds += "&idEquipo" + contIds + "=" + tid
                    contIds++
                }

                var urlParams = new URLSearchParams(window.location.search);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://statsxente.com/MZ1/Functions/tamper_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function (response) {
                        var cat = window.cats[urlParams.get('type')]
                        var jsonResponse = JSON.parse(response.responseText);


                        var valor=0
                        var tid=0
                        for (let i = 0; i < table.rows.length; i++) {
                            let row = table.rows[i];


                            if(i>0){

                                let thirdColumnCell = row.cells[eloCol];
                                let teamNameElement = thirdColumnCell.querySelector('.team-name');
                                let href = teamNameElement.getAttribute('href');
                                let urlParams = new URLSearchParams(href.split('?')[1]);
                                tid = urlParams.get('tid');


                            }


                            let newCell1 = row.insertCell(eloCol);
                            if (i === 0) {

                                let th = document.createElement('th');
                                th.innerHTML = "ELO";
                                th.style.width="50px";
                                th.id="elo_th"
                                newCell1.replaceWith(th);

                            } else {
                                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[tid]["elo"]))
                                newCell1.innerHTML = valor;
                            }

                            let newCell = row.insertCell(lmCol);
                            if (i === 0) {

                                let th1 = document.createElement('th');
                                th1.innerHTML = "LM Value";
                                th1.style.width="80px";
                                th1.id="lm_th"
                                newCell.replaceWith(th1);
                            } else {
                                valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[tid]["valorUPSenior"]))
                                newCell.innerHTML = valor;
                            }


                            if(eloCol==0){
                                let rankCell = row.insertCell(eloCol);

                                if (i === 0) {


                                    let th2 = document.createElement('th'); // Creamos un elemento 'th'
                                    th2.innerHTML = "Rank";
                                    th2.style.width="50px";
                                    rankCell.replaceWith(th2);


                                }else{
                                    rankCell.innerHTML = i

                                }
                            }



                        }


                        if(eloCol==0){
                            eloCol++;
                            lmCol++;
                        }

                        document.getElementById("elo_th").addEventListener("click", function () {

                            ordenarTabla(eloCol, false, "clash_table",true);
                        });


                        document.getElementById("lm_th").addEventListener("click", function () {

                            ordenarTabla(lmCol, false, "clash_table",true);
                        });
                    }
                });





            }

        });


    }
    //Leagues page
    function leagues() {
        var urlParams = new URLSearchParams(window.location.search);
        var initialValues = {};
        initialValues["senior"] = GM_getValue("league_default_senior");
        initialValues["world"] = GM_getValue("league_default_senior");
        initialValues["u23"] = GM_getValue("league_default_u23");
        initialValues["u21"] = GM_getValue("league_default_u21");
        initialValues["u18"] = GM_getValue("league_default_u18");
        initialValues["u23_world"] = GM_getValue("league_default_u23");
        initialValues["u21_world"] = GM_getValue("league_default_u21");
        initialValues["u18_world"] = GM_getValue("league_default_u18");;

        var linkIds = ""
        var elems = document.getElementsByClassName("nice_table");
        var tabla = elems[0]
        var thSegundo = tabla.querySelector("thead th:nth-child(2)");
        thSegundo.style.width = "250px";


        var values = new Map();
        values.set('valor23', 'U23 Value');
        values.set('valor21', 'U21 Value');
        values.set('valor18', 'U18 Value');
        values.set('salario', 'Salary');
        values.set('valorUPSenior', 'LM Value');
        values.set('valorUPSUB23', 'U23 LM Value');
        values.set('valorUPSUB21', 'U21 LM Value');
        values.set('valorUPSUB18', 'U18 LM Value');
        values.set('edad', 'Age');
        if (window.sport == "soccer") {
            values.set('valor11', 'TOP 11');
            values.set('valor11_23', 'U23 TOP 11');
            values.set('valor11_21', 'U21 TOP 11');
            values.set('valor11_18', 'U18 TOP 11');
        } else {
            values.set('valor11', 'TOP 21');
            values.set('valor11_23', 'U23 TOP 21');
            values.set('valor11_21', 'U21 TOP 21');
            values.set('valor11_18', 'U18 TOP 21');
        }

        values.set('noNac', 'Foreigners');
        values.set('elo', 'ELO Score');
        values.set('elo23', 'U23 ELO Score');
        values.set('elo21', 'U21 ELO Score');
        values.set('elo18', 'U18 ELO Score');
        values.set('numJugadores', 'Number of players');

        if (urlParams.get('type') == "senior") {
            values.set('leagues', 'Leagues');
            values.set('world_leagues_all', 'World Leagues');
            values.set('youth_leagues_all', 'Youth Leagues');
            values.set('world_youth_leagues_all', 'Youth World Leagues');
            values.set('federation_leagues', 'Federation Leagues');
        }


        if (urlParams.get('type') == "world") {
            values.set('leagues_all', 'Leagues');
            values.set('world_leagues', 'World Leagues');
            values.set('youth_leagues_all', 'Youth Leagues');
            values.set('world_youth_leagues_all', 'Youth World Leagues');
            values.set('federation_leagues', 'Federation Leagues');
        }


        if ((urlParams.get('type').includes("u")) && (!urlParams.get('type').includes("_"))) {
            var actual_cat = urlParams.get('type').toUpperCase();
            GM_setValue("actual_league_cat", actual_cat)
            values.set('leagues_all', 'Leagues');
            values.set('world_leagues_all', 'World Leagues');
            values.set('youth_leagues', actual_cat + ' Youth Leagues');
            values.set('world_youth_leagues_all', 'Youth World Leagues');
            values.set('federation_leagues', 'Federation Leagues');
        }


        if ((urlParams.get('type').includes("u")) && (urlParams.get('type').includes("_"))) {
            actual_cat = urlParams.get('type').substring(0, 3).toUpperCase();
            GM_setValue("actual_league_cat", actual_cat)
            values.set('leagues_all', 'Leagues');
            values.set('world_leagues_all', 'World Leagues');
            values.set('youth_leagues_all', 'Youth Leagues');
            values.set('world_youth_leagues', actual_cat + ' Youth World Leagues');
            values.set('federation_leagues', 'Federation Leagues');
        }
        values.set('cup', 'Cups');
        values.set('cup_u23', 'U23 Cups');
        values.set('cup_u21', 'U21 Cups');
        values.set('cup_u18', 'U18 Cups');
        values.set('special_cup', 'Special Cups');

        var contenidoNuevo = '<div id=testClick><center>'


        getNativeTableStyles();

        var idProgress = "noProgress";
        if (urlParams.get('type') == "senior") {
            idProgress = "divProgress"
        }


        var widthTable = "1.5em"
        ///MENU TABLE
        contenidoNuevo += "<center><table id=showMenu border=0><thead style='background-color:" + GM_getValue("bg_native") + "; color:" + GM_getValue("color_native") + ";'><tr>";
        contenidoNuevo += '<th align=center style="padding:4px;">Stats</th><th align=center style="padding:4px;">Graph</th>';
        contenidoNuevo += "<th align=center style='padding:4px;'>History</th>";
        contenidoNuevo += "<th align=center style='padding:4px;'>Top Players</th></tr></thead>";
        contenidoNuevo += "<tr>";
        contenidoNuevo += "<td style='padding:4px; max-width: " + widthTable + "; width:" + widthTable + ";'><center><img id='detailDivision' style='cursor:pointer;' src=https://statsxente.com/MZ1/View/Images/detail.png width=25 height=25/></center></td>";
        contenidoNuevo += "<td style='padding:4px; max-width:" + widthTable + ";  width:" + widthTable + ";'><center><img id='graphDivision' style='cursor:pointer;' src=https://statsxente.com/MZ1/View/Images/report.png width=31 height=25/></center></td>";
        if (idProgress == "noProgress") {
            contenidoNuevo += "<td style='padding:4px; max-width: " + widthTable + ";  width: " + widthTable + ";'><center><img id='" + idProgress + "' style='cursor:pointer;' src=https://statsxente.com/MZ1/View/Images/graph_disabled.png width=25 height=25/></center></td>";
        } else {
            contenidoNuevo += "<td style='padding:4px; max-width: " + widthTable + ";  width: " + widthTable + ";'><center><img id='" + idProgress + "' style='cursor:pointer;' src=https://statsxente.com/MZ1/View/Images/graph.png width=25 height=25/></center></td>";
        }
        contenidoNuevo += "<td style='padding:4px; max-width: " + widthTable + ";  width: " + widthTable + ";'><center><img id='topPlayersDivision' style='cursor:pointer;' src=https://statsxente.com/MZ1/View/Images/top-10.png width=25 height=25/></center></td>";
        contenidoNuevo += "</tr>";

        var styleTable = " style='display:none;'";
        var styleIcon = ""
        var styleSep = "style='padding-top:5px;'";

        if (GM_getValue("show_league_selects") == true) {
            styleTable = "";
            styleIcon = " active"
            styleSep = " style='display:none;'";
        }


        contenidoNuevo += "<tr><td></td><td colspan='2'>";
        contenidoNuevo += '<center><div id="moreInfo" class="expandable-icon' + styleIcon + '" style="cursor:pointer; background-color:' + GM_getValue("bg_native") + ';"><div id="line1" class="line"></div><div  id="line2" class="line"></div></div></center>';
        contenidoNuevo += "</td><td></td></tr>";
        contenidoNuevo += "<tr><td colspan='5' id='separatorTd'" + styleSep + "></td></tr>";
        contenidoNuevo += "</table></center>";
        contenidoNuevo += '<table id=show3 border="0"' + styleTable + '><tr><td><label>';

        if ((urlParams.get('type') == 'senior') || (urlParams.get('type') == 'world')) {
            if ("valor" == initialValues[urlParams.get('type')]) {
                contenidoNuevo += '<input class="statsxente" type="checkbox" checked id="valor" value="Value">Value</label></td>';
            } else {
                contenidoNuevo += '<input class="statsxente" type="checkbox" id="valor" value="Value">Value</label></td>';
            }
        } else {
            contenidoNuevo += '<input class="statsxente" type="checkbox" id="valor" value="Value">Value</label></td>';
        }

        values.forEach(function (valor, clave) {

            if (clave == "valorUPSenior") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave == "valor11") {
                contenidoNuevo += "</tr><tr>";
            }
            if (clave == "elo") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave == "leagues") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave == "leagues_all") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave == "cup") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave == initialValues[urlParams.get('type')]) {
                contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" checked value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
            } else {
                contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
            }
        });
        contenidoNuevo += "</tr></table></center>"
        contenidoNuevo += "</div></br>";
        values.set('valor', 'Value');

        elems = document.getElementsByClassName("nice_table");
        tabla = elems[0]
        tabla.insertAdjacentHTML('beforebegin', contenidoNuevo);

        if (GM_getValue("show_league_selects") == true) {
            document.getElementById("line2").style.transform = 'rotateZ(0deg)';
            document.getElementById("line1").style.transform = 'rotateZ(180deg)';
            document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
        }


        values.forEach(function (valor, clave) {
            var elemento = document.getElementById(clave);
            elemento.addEventListener('click', handleClick);
        });

        var nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = values.get(initialValues[urlParams.get('type')]);
        nuevaCeldaEncabezado.style.textAlign = 'center';
        nuevaCeldaEncabezado.style.maxWidth = '6.5em';
        nuevaCeldaEncabezado.style.width = '6.5em';
        nuevaCeldaEncabezado.style.whiteSpace = 'nowrap';
        nuevaCeldaEncabezado.style.overflow = 'hidden';
        nuevaCeldaEncabezado.style.textOverflow = 'ellipsis';

        var ser = document.getElementsByClassName("seriesHeader")
        document.getElementsByClassName("seriesHeader")[0].appendChild(nuevaCeldaEncabezado);

        nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = "Stats Xente";
        nuevaCeldaEncabezado.style.textAlign = 'center';
        document.getElementsByClassName("seriesHeader")[0].appendChild(nuevaCeldaEncabezado);


        if (tabla.getElementsByTagName("tbody")[0].innerHTML.includes("mazyar")) {
            searchClassName = "responsive-hide"
        }

        var contIds = 0
        var filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        for (var i = 0; i < filasDatos.length; i++) {
            if (checkClassNameExists(tabla.rows[i + 1], searchClassName)) {
                var celda = tabla.rows[i + 1].cells[1];
                var equipo = celda.textContent.trim()
                var iniIndex = celda.innerHTML.indexOf("tid=");
                var lastIndex = celda.innerHTML.indexOf("\">", iniIndex + 4);
                var data = String(celda.innerHTML)
                var id = data.substring(iniIndex + 4, lastIndex)
                linkIds += "&idEquipo" + contIds + "=" + id
                contIds++
                celda.innerHTML += "<input type='hidden' id='team_" + id + "' value='" + equipo + "'/>"
            }

        }
        var cat = cats[urlParams.get('type')]
        var enlace = document.getElementById('league_tab_schedule');
        var href = enlace.href;
        var url = new URL(href);
        var league_id = url.searchParams.get('sid');



        ///DIV PROGRESS
        setTimeout(function () {


            if (idProgress != "noProgress") {
                (function (currentId, currentLSport, lang) {
                    document.getElementById("divProgress").addEventListener('click', function () {

                        var link = "https://statsxente.com/MZ1/Graficos/graficoProgresoDivision.php?idLiga=" + currentId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") + "&deporte=" + currentLSport;
                        openWindow(link, 0.95, 1.25);
                    });
                })(league_id, window.lsport, window.lang);

            }


            (function () {
                document.getElementById("moreInfo").addEventListener('click', function () {
                    document.getElementById("moreInfo").classList.toggle('active');

                    if (document.getElementById("moreInfo").classList.contains("active")) {
                        document.getElementById("line2").style.transform = 'rotateZ(0deg)';
                        document.getElementById("line1").style.transform = 'rotateZ(180deg)';
                        document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
                        $('#separatorTd').fadeOut(1);
                        document.getElementById("separatorTd").style.paddingTop = "5px";
                        $('#show3').fadeIn('slow');
                    } else {
                        document.getElementById("line2").style.transform = 'rotateZ(45deg)';
                        document.getElementById("line1").style.transform = 'rotateZ(-45deg)';
                        document.getElementById("moreInfo").style.transform = 'rotateZ(45deg)';
                        $('#separatorTd').fadeIn(1);
                        $('#show3').fadeOut('slow');
                    }



                });
            })();

            (function (currentId, currentLSport, lang, currentCat) {
                document.getElementById("detailDivision").addEventListener('click', function () {
                    var url_ = "https://statsxente.com/MZ1/Functions/lecturaStatsDivisionesHistorico2.0.php"
                    if (window.sport == "hockey") {
                        url_ = "https://statsxente.com/MZ1/Functions/lecturaStatsDivisionesHockeyHistorico.php"
                    }

                    var link = url_ + "?tamper=yes&modal=yes&idLiga=" + currentId + "&idioma=" + lang + "&categoria=" + currentCat + "&season=75&season_actual=75";
                    openWindow(link, 0.95, 1.25);
                });
            })(league_id, window.lsport, window.lang, cat);

            (function (currentId, sport, lang, currentCat) {
                document.getElementById("topPlayersDivision").addEventListener('click', function () {
                    var url_ = "https://statsxente.com/MZ1/Functions/tamper_top_players_division.php"
                    if (window.sport == "hockey") {
                        url_ = "https://statsxente.com/MZ1/Functions/tamper_top_players_division_hockey.php"
                    }
                    var link = url_ + "?league_id=" + currentId + "&sport=" + sport + "&category=" + cat + "&idioma=" + lang;
                    openWindow(link, 0.95, 1.25);
                });
            })(league_id, window.sport, window.lang, cat);

            (function (currentId, currentLSport, lang, currentCat) {
                document.getElementById("graphDivision").addEventListener('click', function () {
                    var url_sport = ""
                    if (window.sport == "hockey") {
                        url_sport = "Hockey"
                    }
                    var link = "https://statsxente.com/MZ1/View/filtroGraficoLinealDivisiones" + url_sport + ".php?tamper=yes&idLiga=" + currentId + "&idioma=" + lang + "&categoria=" + currentCat + "&season=75&season_actual=75&modal=yes&valor=nota";
                    openWindow(link, 0.95, 1.25);
                });
            })(league_id, window.lsport, window.lang, cat);


        }, 200);


        console.log("https://statsxente.com/MZ1/Functions/tamper_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds)
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                var cat = window.cats[urlParams.get('type')]
                var jsonResponse = JSON.parse(response.responseText);
                teams_data = jsonResponse;
                var filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                for (var i = 0; i < filasDatos.length; i++) {
                    if (checkClassNameExists(filasDatos[i], searchClassName)) {
                        var celda = filasDatos[i].cells[1];
                        var equipo = celda.textContent.trim()
                        var iniIndex = celda.innerHTML.indexOf("tid=");
                        var lastIndex = celda.innerHTML.indexOf("\">", iniIndex + 4);
                        var data = String(celda.innerHTML)
                        var id = data.substring(iniIndex + 4, lastIndex)
                        var nuevaColumna = document.createElement("td");
                        var valor = 0;

                        if (jsonResponse[id] && jsonResponse[id][initialValues[urlParams.get('type')]] !== undefined) {
                            valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[id][initialValues[urlParams.get('type')]]))
                        }
                        nuevaColumna.innerHTML = valor
                        nuevaColumna.style.textAlign = 'center';
                        filasDatos[i].appendChild(nuevaColumna);

                        var eloType = 1

                        if (window.sport == "soccer") { eloType = 2 }
                        if (cat.includes("SUB")) { eloType = 3 }
                        var cats_elo = {}
                        cats_elo["senior"] = "SENIOR";
                        cats_elo["seniorw"] = "SENIOR";
                        cats_elo["SUB23"] = "U23";
                        cats_elo["SUB21"] = "U21";
                        cats_elo["SUB18"] = "U18";
                        cats_elo["SUB23w"] = "U23";
                        cats_elo["SUB21w"] = "U21";
                        cats_elo["SUB18w"] = "U18";

                        var flagSenior = 0, flagSub23 = 0, flagSub21 = 0, flagSub18 = 0;
                        if (jsonResponse[id]["elo"] > 0) { flagSenior = 1 }
                        if (jsonResponse[id]["elo23"] > 0) { flagSub23 = 1 }
                        if (jsonResponse[id]["elo21"] > 0) { flagSub21 = 1 }
                        if (jsonResponse[id]["elo18"] > 0) { flagSub18 = 1 }

                        var buttonDisplay = "display:block;";
                        nuevaColumna = document.createElement("td");
                        var iner = "<center><img src='https://statsxente.com/MZ1/View/Images/detail.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but" + id + "' style='cursor:pointer;'/>";
                        if (GM_getValue("league_graph_button") == "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += "<img src='https://statsxente.com/MZ1/View/Images/graph.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but1" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";

                        if (GM_getValue("league_report_button") == "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += "<img src='https://statsxente.com/MZ1/View/Images/report.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but2" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";

                        if (GM_getValue("league_calendar_button") == "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += " <img src='https://statsxente.com/MZ1/View/Images/calendar.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but3" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";
                        iner += "</center>";
                        cat = cats[urlParams.get('type')]
                        nuevaColumna.innerHTML = iner
                        filasDatos[i].appendChild(nuevaColumna);
                        nuevaColumna = document.createElement("td");


                        (function (currentId, currentLSport, lang) {
                            document.getElementById("but1" + currentId).addEventListener('click', function () {
                                var link = "https://statsxente.com/MZ1/Graficos/graficoProgresoEquipo.php?idEquipo=" + currentId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") + "&deporte=" + currentLSport;
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, window.lsport, window.lang);

                        (function (currentId, currentLSport, lang, currentCat) {
                            document.getElementById("but2" + currentId).addEventListener('click', function () {
                                var src = "filtroGraficoEquiposHistoricoHockey";
                                if (currentLSport == "F") {
                                    src = "filtroGraficoLinealEquiposHistorico";
                                }
                                var link = "https://statsxente.com/MZ1/View/" + src + ".php?tamper=yes&categoria=" + cat + "&idEquipo=" + currentId + "&idioma=" + lang + "&modal=yes&valor=nota&season=75&season_actual=75&equipo=-"
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, window.lsport, window.lang, cat);

                        (function (currentId, currentEquipo, currentCat, currentSport, lang) {
                            document.getElementById("but" + currentId).addEventListener('click', function () {

                                var link = "https://statsxente.com/MZ1/View/filtroStatsEquiposHistorico.php?tamper=no&idEquipo=" + currentId + "&idioma=" + lang + "&modal=yes&deporte=" + currentSport + "&season=77&season_actual=77&categoria=" + currentCat + "&equipo=" + currentEquipo + "&cerrar=no";
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, equipo, cat, window.sport, window.lang);

                        (function (currentId, type, currentCat, currentSport, lang, flagS, flagS23, flagS21, flagS18) {
                            document.getElementById("but3" + currentId).addEventListener('click', function () {
                                var link = "https://statsxente.com/MZ1/Graficos/graficoRachaEquipoELO.php?tamper=yes&team_id=" + currentId + "&idioma=" + lang + "&deporte=" + currentSport + "&type=" + type + "&cat=" + currentCat + "&flagSenior=" +
                                    flagS + "&flagSub23=" + flagS23 + "&flagSub21=" + flagS21 + "&flagSub18=" + flagS18;
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, eloType, cats_elo[cat], window.sport, window.lang, flagSenior, flagSub23, flagSub21, flagSub18);

                    }

                }

                var thead = document.getElementsByClassName("seriesHeader")[0]
                var ths = thead.querySelectorAll("th");
                ths.forEach(function (th, index) {
                    th.addEventListener("click", function () {
                        if (index == 1) {
                            ordenarTablaText(index, true, "nice_table",true);
                        } else {
                            ordenarTabla(index, true, "nice_table",true);
                        }

                    });
                });
            }
        });
    }
    //Clash leagues page
    function clashLeagues() {

        var urlParams = new URLSearchParams(window.location.search);

        document.getElementById("division-select").addEventListener('change', function () {
            setTimeout(function () {
                clashLeagues();
            }, 2000);
        });


        document.getElementById("season-select").addEventListener('change', function () {
            setTimeout(function () {
                clashLeagues();
            }, 2000);
        });




        var elems = document.getElementsByClassName("nice_table");
        var tabla = elems[0]
        var thSegundo = tabla.querySelector("thead th:nth-child(2)");
        thSegundo.style.width = "250px";
        var values = new Map();
        values.set('valueLM', 'LM Value');
        values.set('elo', 'ELO Score');
        values.set('teams_count', 'Number of teams');
        values.set('table_index', 'Rank Position');

        var contenidoNuevo = '<div id=testClick><center>'
        getNativeTableStyles();
        var idProgress = "noProgress";
        if (urlParams.get('type') == "senior") {
            idProgress = "divProgress"
        }

        ///MENU TABLE
        contenidoNuevo += "<center><table id=showMenu border=1><thead style='background-color:" + GM_getValue("bg_native") + "; color:" + GM_getValue("color_native") + ";'><tr>";
        contenidoNuevo += '<th align=center style="padding:4px;" colspan="3">Values</th></tr></thead>';
        contenidoNuevo += "<tr>";
        contenidoNuevo += "</tr></table></center>";
        contenidoNuevo += '<table id=show3 border="0"><tr><td><label>';
        contenidoNuevo += '<input class="statsxente" type="checkbox" checked id="value" value="Value">Value</label></td>';


        values.forEach(function (valor, clave) {
            contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
        });
        contenidoNuevo += "</tr></table></center>"
        contenidoNuevo += "</div></br>";

        values.set('value', 'Value');
        elems = document.getElementsByClassName("nice_table");
        tabla = elems[0]
        tabla.insertAdjacentHTML('beforebegin', contenidoNuevo);



        values.forEach(function (valor, clave) {

            var elemento = document.getElementById(clave);
            elemento.addEventListener('click', handleClickClash);

        });
        var nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = "Value";
        nuevaCeldaEncabezado.style.textAlign = 'center';
        var ser = document.getElementsByClassName("seriesHeader")
        document.getElementsByClassName("nice_table")[0].querySelector('thead').querySelector('tr').appendChild(nuevaCeldaEncabezado);

        nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = "Stats Xente";
        nuevaCeldaEncabezado.style.textAlign = 'center';
        document.getElementsByClassName("nice_table")[0].querySelector('thead').querySelector('tr').appendChild(nuevaCeldaEncabezado);


        var contIds = 0
        var linkIds = ""
        var filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        for (var i = 0; i < filasDatos.length; i++) {
            var celda = tabla.rows[i + 1].cells[1];
            var imagen = celda.querySelector('img');
            var url = new URL(imagen.src);
            var id = url.searchParams.get('fid');
            linkIds += "&id" + contIds + "=" + id
            contIds++
        }


        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_federations.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                var jsonResponse = JSON.parse(response.responseText);
                teams_data = jsonResponse;
                var filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                for (var i = 0; i < filasDatos.length; i++) {
                    var celda = tabla.rows[i + 1].cells[1];
                    var imagen = celda.querySelector('img');
                    var url = new URL(imagen.src);
                    var id = url.searchParams.get('fid');
                    var nuevaColumna = document.createElement("td");
                    var valor = 0

                    valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[id]["value"]))
                    nuevaColumna.innerHTML = valor
                    nuevaColumna.style.textAlign = 'center';
                    filasDatos[i].appendChild(nuevaColumna);


                    nuevaColumna = document.createElement("td");
                    var iner = "<center><img src='https://statsxente.com/MZ1/View/Images/detail.png' width='20px' height='20px' id='but" + id + "' style='cursor:pointer;'/>";
                    iner += "</center>";
                    var cat = cats[urlParams.get('type')]
                    nuevaColumna.innerHTML = iner
                    filasDatos[i].appendChild(nuevaColumna);


                    (function (currentId, currentSport, lang) {
                        document.getElementById("but" + currentId).addEventListener('click', function () {

                            var link = "https://statsxente.com/MZ1/Functions/loadClashFederationDetail.php?tamper=yes&idioma=" +
                                lang + "&modal_to_close=myModal&divisa=" + GM_getValue("currency") + "&fid=" + currentId + "&sport=" + currentSport + "&modal=yes";
                            openWindow(link, 0.95, 1.25);
                        });
                    })(id, window.sport, window.lang);

                }
            }
        });

        var thead = document.getElementsByClassName("nice_table")[0].querySelector('thead')
        var ths = thead.querySelectorAll("th");
        ths.forEach(function (th, index) {
            th.addEventListener("click", function () {
                ordenarTabla(index, true, "nice_table",true);
            });
        });
    }
    //Cups and FL's page
    async function friendlyCupsAndLeagues() {
        var urlParams = new URLSearchParams(window.location.search);
        var age_restriction = "none"
        var link = "https://www.managerzone.com" + document.getElementById("ui-id-1").getAttribute('href')
        if (urlParams.get('fsid')) {
            age_restriction = await fetchAgeRestriction(link);
        } else {
            age_restriction = await fetchCupAgeRestriction(link);
        }

        var detected_cat = "senior"

        if (age_restriction !== "none") {


            switch (age_restriction) {
                case "U23":
                    detected_cat = "u23"
                    break;
                case "U21":
                    detected_cat = "u21"
                    break;
                case "U18":
                    detected_cat = "u18"
                    break;
            }

        }



        var initialValues = {};
        initialValues["senior"] = GM_getValue("league_default_senior");
        initialValues["world"] = GM_getValue("league_default_senior");
        initialValues["u23"] = GM_getValue("league_default_u23");
        initialValues["u21"] = GM_getValue("league_default_u21");
        initialValues["u18"] = GM_getValue("league_default_u18");
        initialValues["u23_world"] = GM_getValue("league_default_u23");
        initialValues["u21_world"] = GM_getValue("league_default_u21");
        initialValues["u18_world"] = GM_getValue("league_default_u18");;

        var linkIds = ""
        var elems = document.getElementsByClassName("nice_table");
        var tabla = elems[0]
        var thSegundo = tabla.querySelector("thead th:nth-child(2)");
        thSegundo.style.width = "250px";


        var values = new Map();
        values.set('valor23', 'U23 Value');
        values.set('valor21', 'U21 Value');
        values.set('valor18', 'U18 Value');
        values.set('salario', 'Salary');
        values.set('valorUPSenior', 'LM Value');
        values.set('valorUPSUB23', 'U23 LM Value');
        values.set('valorUPSUB21', 'U21 LM Value');
        values.set('valorUPSUB18', 'U18 LM Value');
        values.set('edad', 'Age');
        if (window.sport == "soccer") {
            values.set('valor11', 'TOP 11');
            values.set('valor11_23', 'U23 TOP 11');
            values.set('valor11_21', 'U21 TOP 11');
            values.set('valor11_18', 'U18 TOP 11');
        } else {
            values.set('valor11', 'TOP 21');
            values.set('valor11_23', 'U23 TOP 21');
            values.set('valor11_21', 'U21 TOP 21');
            values.set('valor11_18', 'U18 TOP 21');
        }

        values.set('noNac', 'Foreigners');
        values.set('elo', 'ELO Score');
        values.set('elo23', 'U23 ELO Score');
        values.set('elo21', 'U21 ELO Score');
        values.set('elo18', 'U18 ELO Score');
        values.set('numJugadores', 'Number of players');
        values.set('leagues', 'Leagues');
        values.set('world_leagues_all', 'World Leagues');
        values.set('youth_leagues_all', 'Youth Leagues');
        values.set('world_youth_leagues_all', 'Youth World Leagues');
        values.set('federation_leagues', 'Federation Leagues');
        values.set('cup', 'Cups');
        values.set('cup_u23', 'U23 Cups');
        values.set('cup_u21', 'U21 Cups');
        values.set('cup_u18', 'U18 Cups');
        values.set('special_cup', 'Special Cups');

        var contenidoNuevo = '<div id=testClick><center>'


        getNativeTableStyles();

        var idProgress = "noProgress";
        if (urlParams.get('type') == "senior") {
            idProgress = "divProgress"
        }


        var widthTable = "1.5em"
        ///MENU TABLE
        contenidoNuevo += "<center><table id=showMenu border=0><thead style='background-color:" + GM_getValue("bg_native") + "; color:" + GM_getValue("color_native") + ";'><tr>";
        contenidoNuevo += '<th align=center style="padding:4px;" colspan="4">Stats Xente</th>';
        contenidoNuevo += "</tr></thead>";
        var styleTable = " style='display:none;'";
        var styleIcon = ""
        var styleSep = "style='padding-top:5px;'";

        if (GM_getValue("show_league_selects") == true) {
            styleTable = "";
            styleIcon = " active"
            styleSep = " style='display:none;'";

        }


        contenidoNuevo += "<tr><td></td><td style='padding-top:5px' colspan='2'>";

        contenidoNuevo += '<center><div id="moreInfo" class="expandable-icon' + styleIcon + '" style="cursor:pointer; background-color:' + GM_getValue("bg_native") + ';"><div id="line1" class="line"></div><div  id="line2" class="line"></div></div></center>';

        contenidoNuevo += "</td><td></td></tr>";

        contenidoNuevo += "<tr><td colspan='5' id='separatorTd'" + styleSep + "></td></tr>";



        contenidoNuevo += "</table></center>";



        contenidoNuevo += '<table id=show3 border="0"' + styleTable + '><tr><td><label>';

        if ((urlParams.get('type') == 'senior') || (urlParams.get('type') == 'world')) {
            if ("valor" == initialValues[detected_cat]) {
                contenidoNuevo += '<input class="statsxente" type="checkbox" checked id="valor" value="Value">Value</label></td>';
            } else {
                contenidoNuevo += '<input class="statsxente" type="checkbox" id="valor" value="Value">Value</label></td>';
            }
        } else {
            contenidoNuevo += '<input class="statsxente" type="checkbox" id="valor" value="Value">Value</label></td>';
        }

        values.forEach(function (valor, clave) {

            if (clave == "valorUPSenior") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave == "valor11") {
                contenidoNuevo += "</tr><tr>";
            }
            if (clave == "elo") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave == "leagues") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave == "leagues_all") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave == "cup") {
                contenidoNuevo += "</tr><tr>";
            }

            if (clave == initialValues[detected_cat]) {
                contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" checked value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
            } else {
                contenidoNuevo += '<td><label><input class="statsxente" type="checkbox" value="' + valor + '" id="' + clave + '">' + valor + '</label></td>';
            }
        });
        contenidoNuevo += "</tr></table></center>"
        contenidoNuevo += "</div></br>";


        values.set('valor', 'Value');

        elems = document.getElementsByClassName("nice_table");
        tabla = elems[0]


        tabla.insertAdjacentHTML('beforebegin', contenidoNuevo);

        if (GM_getValue("show_league_selects") == true) {

            document.getElementById("line2").style.transform = 'rotateZ(0deg)';
            document.getElementById("line1").style.transform = 'rotateZ(180deg)';
            document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
        }


        values.forEach(function (valor, clave) {

            var elemento = document.getElementById(clave);
            elemento.addEventListener('click', handleClick);

        });
        var nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = values.get(initialValues[detected_cat]);
        nuevaCeldaEncabezado.style.textAlign = 'center';
        nuevaCeldaEncabezado.style.maxWidth = '7.5em';
        nuevaCeldaEncabezado.style.width = '7.5em';
        nuevaCeldaEncabezado.style.whiteSpace = 'nowrap';
        nuevaCeldaEncabezado.style.overflow = 'hidden';
        nuevaCeldaEncabezado.style.textOverflow = 'ellipsis';

        var ser = document.getElementsByClassName("seriesHeader")


        var table_index = 0;
        for (var kl = 0; kl < ser.length; kl++) {
            if (document.getElementsByClassName("seriesHeader")[kl].parentNode.parentNode.className == "nice_table") {
                table_index = kl
            }


        }

        document.getElementsByClassName("seriesHeader")[table_index].cells[1].style.width = "180px"
        document.getElementsByClassName("seriesHeader")[table_index].appendChild(nuevaCeldaEncabezado);

        nuevaCeldaEncabezado = document.createElement("th");
        nuevaCeldaEncabezado.textContent = "Stats Xente";
        nuevaCeldaEncabezado.style.textAlign = 'center';
        ser = document.getElementsByClassName("seriesHeader")
        document.getElementsByClassName("seriesHeader")[table_index].appendChild(nuevaCeldaEncabezado);


        if (tabla.getElementsByTagName("tbody")[0].innerHTML.includes("mazyar")) {
            searchClassName = "responsive-hide"
        }

        var contIds = 0
        var filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        for (var i = 0; i < filasDatos.length; i++) {
            if (checkClassNameExists(tabla.rows[i + 1], searchClassName)) {
                var celda = tabla.rows[i + 1].cells[1];
                var equipo = celda.textContent.trim()
                var iniIndex = celda.innerHTML.indexOf("tid=");
                var lastIndex = celda.innerHTML.indexOf("\">", iniIndex + 4);
                var data = String(celda.innerHTML)
                var id = data.substring(iniIndex + 4, lastIndex)
                linkIds += "&idEquipo" + contIds + "=" + id
                contIds++
                celda.innerHTML += "<input type='hidden' id='team_" + id + "' value='" + equipo + "'/>"
            }

        }



        ///DIV PROGRESS
        setTimeout(function () {


            (function () {
                document.getElementById("moreInfo").addEventListener('click', function () {
                    document.getElementById("moreInfo").classList.toggle('active');

                    if (document.getElementById("moreInfo").classList.contains("active")) {
                        document.getElementById("line2").style.transform = 'rotateZ(0deg)';
                        document.getElementById("line1").style.transform = 'rotateZ(180deg)';
                        document.getElementById("moreInfo").style.transform = 'rotateZ(0deg)';
                        $('#separatorTd').fadeOut(1);
                        document.getElementById("separatorTd").style.paddingTop = "5px";
                        $('#show3').fadeIn('slow');
                    } else {
                        document.getElementById("line2").style.transform = 'rotateZ(45deg)';
                        document.getElementById("line1").style.transform = 'rotateZ(-45deg)';
                        document.getElementById("moreInfo").style.transform = 'rotateZ(45deg)';
                        $('#separatorTd').fadeIn(1);
                        $('#show3').fadeOut('slow');
                    }



                });
            })();

        }, 200);

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                var jsonResponse = JSON.parse(response.responseText);
                teams_data = jsonResponse;
                var filasDatos = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                for (var i = 0; i < filasDatos.length; i++) {
                    if (checkClassNameExists(filasDatos[i], searchClassName)) {
                        var celda = filasDatos[i].cells[1]
                        var equipo = celda.textContent.trim()
                        var iniIndex = celda.innerHTML.indexOf("tid=");
                        var lastIndex = celda.innerHTML.indexOf("\">", iniIndex + 4);
                        var data = String(celda.innerHTML)
                        var id = data.substring(iniIndex + 4, lastIndex)
                        var nuevaColumna = document.createElement("td");
                        var valor = 0;

                        if (jsonResponse[id] && jsonResponse[id][initialValues[detected_cat]] !== undefined) {
                            valor = new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[id][initialValues[detected_cat]]))
                        }
                        nuevaColumna.innerHTML = valor
                        nuevaColumna.style.textAlign = 'center';
                        filasDatos[i].appendChild(nuevaColumna);

                        var eloType = 1
                        if (window.sport == "soccer") { eloType = 2 }
                        var cats_elo = {}
                        cats_elo["senior"] = "SENIOR";
                        cats_elo["seniorw"] = "SENIOR";
                        cats_elo["SUB23"] = "U23";
                        cats_elo["SUB21"] = "U21";
                        cats_elo["SUB18"] = "U18";
                        cats_elo["SUB23w"] = "U23";
                        cats_elo["SUB21w"] = "U21";
                        cats_elo["SUB18w"] = "U18";

                        var cat = cats[detected_cat]


                        var flagSenior = 0, flagSub23 = 0, flagSub21 = 0, flagSub18 = 0;
                        if (jsonResponse[id]["elo"] > 0) { flagSenior = 1 }
                        if (jsonResponse[id]["elo23"] > 0) { flagSub23 = 1 }
                        if (jsonResponse[id]["elo21"] > 0) { flagSub21 = 1 }
                        if (jsonResponse[id]["elo18"] > 0) { flagSub18 = 1 }

                        var buttonDisplay = "display:block;";
                        nuevaColumna = document.createElement("td");
                        var iner = "<center><img src='https://statsxente.com/MZ1/View/Images/detail.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but" + id + "' style='cursor:pointer;'/>";
                        if (GM_getValue("league_graph_button") == "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += "<img src='https://statsxente.com/MZ1/View/Images/graph.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but1" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";

                        if (GM_getValue("league_report_button") == "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += "<img src='https://statsxente.com/MZ1/View/Images/report.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but2" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";

                        if (GM_getValue("league_calendar_button") == "checked") {
                            buttonDisplay = ""
                        } else {
                            buttonDisplay = "display:none;";
                        }
                        iner += " <img src='https://statsxente.com/MZ1/View/Images/calendar.png' width='" + GM_getValue("league_image_size") + "px' height='" + GM_getValue("league_image_size") + "px' id='but3" + id + "' style='cursor:pointer; " + buttonDisplay + "'/>";
                        iner += "</center>";

                        nuevaColumna.innerHTML = iner
                        filasDatos[i].appendChild(nuevaColumna);
                        nuevaColumna = document.createElement("td");
                        (function (currentId, currentLSport, lang) {
                            document.getElementById("but1" + currentId).addEventListener('click', function () {
                                var link = "https://statsxente.com/MZ1/Graficos/graficoProgresoEquipo.php?idEquipo=" + currentId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") + "&deporte=" + currentLSport;
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, window.lsport, window.lang);


                        (function (currentId, currentLSport, lang, currentCat) {
                            document.getElementById("but2" + currentId).addEventListener('click', function () {
                                var src = "filtroGraficoEquiposHistoricoHockey";
                                if (currentLSport == "F") {
                                    src = "filtroGraficoLinealEquiposHistorico";
                                }

                                var link = "https://statsxente.com/MZ1/View/" + src + ".php?tamper=yes&categoria=" + currentCat + "&idEquipo=" + currentId + "&idioma=" + lang + "&modal=yes&valor=nota&season=75&season_actual=75&equipo=-"
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, window.lsport, window.lang, cat);


                        (function (currentId, currentEquipo, currentCat, currentSport, lang) {
                            document.getElementById("but" + currentId).addEventListener('click', function () {
                                var link = "https://statsxente.com/MZ1/View/filtroStatsEquiposHistorico.php?tamper=no&idEquipo=" + currentId + "&idioma=" + lang + "&modal=yes&deporte=" + currentSport + "&season=77&season_actual=77&categoria=" + currentCat + "&equipo=" + currentEquipo + "&cerrar=no";
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, equipo, cat, window.sport, window.lang);




                        (function (currentId, type, currentCat, currentSport, lang, flagS, flagS23, flagS21, flagS18) {
                            document.getElementById("but3" + currentId).addEventListener('click', function () {
                                var link = "https://statsxente.com/MZ1/Graficos/graficoRachaEquipoELO.php?tamper=yes&team_id=" + currentId + "&idioma=" + lang + "&deporte=" + currentSport + "&type=" + type + "&cat=" + currentCat + "&flagSenior=" +
                                    flagS + "&flagSub23=" + flagS23 + "&flagSub21=" + flagS21 + "&flagSub18=" + flagS18;
                                openWindow(link, 0.95, 1.25);
                            });
                        })(id, eloType, cats_elo[cat], window.sport, window.lang, flagSenior, flagSub23, flagSub21, flagSub18);

                    }

                }
                var thead = document.getElementsByClassName("seriesHeader")[table_index]
                var ths = thead.querySelectorAll("th");
                ths.forEach(function (th, index) {
                    th.addEventListener("click", function () {
                        ordenarTabla(index, true, "nice_table",true);
                    });
                });
            }
        });


    }
    //Match page
    async function match() {
        var team_div = document.getElementsByClassName("flex-grow-0 textCenter team-table block")
        if (team_div.length==0){
            team_div = document.getElementsByClassName("flex-grow-0 textCenter team-table no-match-buttons block")
        }
        var teams_ = []





        var linkIds=""
        var contIds=0
        for (var x = 0; x < 2; x++) {
            var as = team_div[x].getElementsByTagName("a")
            var urlObj = new URL("https://www.managerzone.com/" + as[0].getAttribute('href'));
            var params = new URLSearchParams(urlObj.search);
            var tidValue = params.get('tid');
            teams_[x] = { "team_name": as[0].innerHTML, "team_id": tidValue, "inserted": "" }
            linkIds += "&idEquipo" + contIds + "=" + tidValue
            contIds++
        }



        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport + linkIds,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {

                var jsonResponse = JSON.parse(response.responseText);

                const divs = document.querySelectorAll('div'); // Selecciona todos los divs
                const divsConAltura15px = Array.from(divs).filter(div => {
                    const computedStyle = window.getComputedStyle(div);
                    return computedStyle.height === '15px' && div.innerHTML === "";
                });


                for(var m=0;m<2;m++){

                    var aux=teams_[m]['team_id']

                    var top="TOP 11"

                    if(window.sport=="hockey"){
                        top="TOP 21"
                    }

                    var teamTable='<div style="display: flex;flex-direction: column;justify-content: center;align-items: center;flex-wrap: wrap;max-height: 100%;">'
                    teamTable+='<table class="matchValuesTable"><thead><tr>'
                    teamTable+='<th id=thTransparent'+m+' style="background-color:transparent; border:0px;"></th>'
                    teamTable+='<th style="border-top-left-radius: 5px;">Value</th><th>LM Value</th>'
                    teamTable+='<th >'+top+'</th><th style="border-top-right-radius: 5px;">ELO</th></tr></thead><tbody>'
                    var valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor']))
                    var valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSenior']))
                    var valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11']))
                    var elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo']))
                    teamTable+='<tr><th style="border-top-left-radius: 5px;">Senior</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td style="border-right:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td></tr>'

                    valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor23']))
                    valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB23']))
                    valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_23']))
                    elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo23']))
                    teamTable+='<tr><th>U23</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td style="border-right:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td></tr>'


                    valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor21']))
                    valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB21']))
                    valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_21']))
                    elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo21']))
                    teamTable+='<tr><th>U21</th><td>'+valor+'</td><td>'+valorLM+'</td><td>'+valor11+'</td><td style="border-right:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td></tr>'

                    valor=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor18']))
                    valorLM=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valorUPSUB18']))
                    valor11=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['valor11_18']))
                    elo=new Intl.NumberFormat(window.userLocal).format(Math.round(jsonResponse[aux]['elo18']))
                    teamTable+='<tr><th style="border-bottom-left-radius: 5px;">U18</th><td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valor+'</td>'
                    teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';">'+valorLM+'</td>'
                    teamTable+='<td style="border-bottom:1px solid '+GM_getValue("bg_native")+';;">'+valor11+'</td>'
                    teamTable+='<td style="border-radius: 0 0 10px 0; border-bottom:1px solid '+GM_getValue("bg_native")+'; border-right:1px solid '+GM_getValue("bg_native")+';">'+elo+'</td></tr>'


                    teamTable+='</tbody></table></div>'

                    divsConAltura15px[m].insertAdjacentHTML('afterend',teamTable)



                }


                const thElements = document.querySelectorAll('table.matchValuesTable th');

// Cambia el color de fondo de cada <th>
                thElements.forEach(th => {
                    th.style.backgroundColor = GM_getValue("bg_native");
                    th.style.color = GM_getValue("color_native");

                });
                document.getElementById("thTransparent0").style.backgroundColor="transparent";
                document.getElementById("thTransparent1").style.backgroundColor="transparent";




            }
        });



        var elems = document.getElementsByClassName("hitlist " + window.sport + " statsLite marker tablesorter");
        for (x = 0; x < 2; x++) {
            var linkIds = ""
            var contIds = 0;
            var tabla = elems[x]
            var filas = tabla.getElementsByTagName("tr");
            var fila = filas[1];

            for (var i = 2; i < filas.length - 1; i++) {

                fila = filas[i];
                var tds = fila.getElementsByTagName("td");
                var as_ = tds[2].getElementsByTagName("a");
                urlObj = new URL("https://www.managerzone.com/" + as_[0].getAttribute("href"));
                params = new URLSearchParams(urlObj.search);
                var pid = params.get('pid');

                linkIds += "&id" + contIds + "=" + pid
                contIds++;
            }

            link = "http://statsxente.com/MZ1/Functions/tamper_check_stats_player.php?sport=" + window.sport + linkIds
            var inserted = await fetchExistPlayers(link);
            teams_[x]["inserted"]= inserted;

        }


        elems = document.getElementsByClassName("hitlist " + window.sport + " statsLite marker tablesorter");
        for (x = 0; x < 2; x++) {
            if (teams_[x]['inserted']['total'] > 0) {
                tabla = elems[x]
                var firstTrThead = tabla.querySelector('thead td');
                var currentColspan = firstTrThead.getAttribute('colspan');
                currentColspan = parseInt(currentColspan, 10) + 1;
                firstTrThead.setAttribute('colspan', currentColspan);
                var secondTrThead = tabla.querySelector('thead tr:nth-of-type(2)')
                var newTd = document.createElement('td');
                newTd.textContent = '';
                secondTrThead.appendChild(newTd);
                filas = tabla.getElementsByTagName("tr");
                fila = filas[1];
                var dato = document.createElement("td");
                var tfoot = tabla.querySelector("tfoot");
                var primeraFilaTfoot = tfoot.querySelector("tr");
                var primerTDTfoot = primeraFilaTfoot.querySelector("td");
                primerTDTfoot.setAttribute("colspan", "9");

                var elems2 = document.getElementsByClassName("listHeadColor");
                var lista = elems2[0]

                var nuevoElementoDD = document.createElement("dd");
                nuevoElementoDD.textContent = "Nuevo elemento";
                nuevoElementoDD.className = "c6"
                lista.appendChild(nuevoElementoDD);

                var id = 1516;
                for (i = 2; i < filas.length - 1; i++) {
                    fila = filas[i];

                    tds = fila.getElementsByTagName("td");
                    as_ = tds[2].getElementsByTagName("a");
                    urlObj = new URL("https://www.managerzone.com/" + as_[0].getAttribute("href"));
                    params = new URLSearchParams(urlObj.search);
                    pid = params.get('pid');
                    if (teams_[x]['inserted'][pid] == "yes") {
                        dato = document.createElement("td");
                        var iner = "<img src='https://statsxente.com/MZ1/View/Images/etiqueta_bota.png' width='20px' height='20px' id='but" + pid + "' style='cursor:pointer;'/>";
                        dato.innerHTML = iner
                        fila.appendChild(dato);



                        (function (currentId, currentTeamId, currentSport, lang, team_name, player_name) {
                            document.getElementById("but" + currentId).addEventListener('click', function () {

                                var link = "http://statsxente.com/MZ1/Functions/tamper_player_stats.php?sport=" + currentSport
                                    + "&player_id=" + currentId + "&team_id=" + currentTeamId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") +
                                    "&team_name=" + encodeURIComponent(team_name) + "&player_name=" + encodeURIComponent(player_name)
                                openWindow(link, 0.95, 1.25);
                            });
                        })(pid, teams_[x]['team_id'], window.sport, window.lang, teams_[x]['team_name'], as_[0].innerHTML);


                    }
                }
            }
        }
    }
    //Players page
    async function playersPage() {
        setTimeout(function () {
            var elementos = document.getElementsByClassName('playerContainer');

            var player_values = {}
            var tactics_list = []

            var urlParams = new URLSearchParams(window.location.search);
            var flagStats = true
            if (urlParams.has('tid')) {
                flagStats = false
            }

            if (flagStats) {
                var habil_container = elementos[0].getElementsByClassName("player_skills")
                var habil = habil_container[0].getElementsByClassName("clippable")

                if (window.sport == "hockey") {
                    for (var q = 1; q < habil.length; q++) {
                        skills_names.push(habil[q].textContent)
                    }
                } else {

                    for (q = 0; q < habil.length - 1; q++) {
                        skills_names.push(habil[q].textContent)
                    }

                    var player_images = document.getElementsByClassName("player-image soccer")

                }
            }

            var ids_ = []

            for (var i = 0; i < elementos.length; i++) {
                var ids = elementos[i].getElementsByClassName('player_id_span');

                var elementos_ = elementos[i].getElementsByClassName('p_sublinks');

                var subheaders = elementos[i].getElementsByClassName('subheader clearfix');


                var enlace = subheaders[0].querySelector('.subheader a');
                var urlObj = new URL("https://www.managerzone.com/" + enlace.getAttribute('href'));
                var params = new URLSearchParams(urlObj.search);
                var tid = params.get('tid');
                var playerName = enlace.querySelector('.player_name').textContent

                ids_.push({ "id": ids[0].textContent, "name": playerName });


                var txt = '<span id=but' + ids[0].textContent + ' class="player_icon_placeholder"><a href="#" onclick="return false"'
                txt += 'title="Stats Xente" class="player_icon"><span class="player_icon_wrapper">'
                txt += '<span class="player_icon_image" style="background-image: url(\'https://www.statsxente.com/MZ1/View/Images/etiqueta_bota_mini.png\'); width: 21px; height: 20px; background-size: auto;'
                txt += 'z-index: 0;"></span><span class="player_icon_text"></span></span></a></span>'

                elementos_[0].innerHTML += txt;

                if (flagStats) {
                    var flag_gk = false;
                    var age_div = elementos[i].getElementsByClassName('dg_playerview_info');
                    var age_table = age_div[0].getElementsByTagName('table')[0];

                    var ini_age = age_table.getElementsByTagName('td')[0].textContent.indexOf(":")
                    var age = age_table.getElementsByTagName('td')[0].textContent.substring(ini_age + 2, ini_age + 4);


                    if ((window.sport == "soccer") && (player_images[i].innerHTML.includes("gk=1"))) {
                        flag_gk = true
                    }

                    var tactics = elementos[i].getElementsByClassName('player_tactic gradientSunriseIcon');

                    player_values = {
                        "id": ids[0].textContent,
                        "skills": [],
                        "lines": [],
                        "tactics-position": {},
                        "tactics": [],
                        "age": parseInt(age)
                    }

                    for (var j = 0; j < tactics.length; j++) {
                        var fin = 0;
                        var line = ""
                        var ini = tactics[j].textContent.indexOf('(');
                        var tactic = tactics[j].textContent.substring(0, ini - 1);

                        if (window.sport == "hockey") {

                            if (!tactics[j].textContent.includes(":")) {
                                ini = tactics[j].textContent.indexOf('(');
                                fin = tactics[j].textContent.indexOf(')');
                                line = tactics[j].textContent.substring(ini + 2, fin - 1);
                                gk_line = line;
                            } else {
                                ini = tactics[j].textContent.indexOf('(');
                                fin = tactics[j].textContent.indexOf(':');
                                line = tactics[j].textContent.substring(ini + 2, fin);
                            }

                        } else {
                            ini = tactics[j].textContent.indexOf('(');
                            fin = tactics[j].textContent.indexOf(')');
                            line = tactics[j].textContent.substring(ini + 2, fin - 1);
                            if (flag_gk) {
                                gk_line = line;
                            }
                            if (tactics[j].textContent.includes(",")) {
                                ini = tactics[j].textContent.indexOf('(');
                                fin = tactics[j].textContent.indexOf(',');
                                su_line = tactics[j].textContent.substring(ini + 2, fin);
                            }
                        }

                        if (!player_values['lines'].includes(line)) {
                            player_values['lines'].push(line);
                        }
                        if (!player_values['tactics'].includes(tactic)) {
                            player_values['tactics'].push(tactic);
                        }

                        player_values['tactics-position'][tactic] = line

                        if ((!lines.includes(line))) {
                            lines.push(line);
                        }

                        if (!tactics_list.includes(tactic)) {
                            tactics_list.push(tactic);
                        }


                    }
                    var skills = elementos[i].getElementsByClassName('skillval');
                    if (window.sport == "hockey") {

                        for (j = 1; j < skills.length; j++) {
                            var cleanedText = skills[j].textContent.replace(')', '');
                            cleanedText = cleanedText.replace('(', '');
                            let number = parseInt(cleanedText, 10);
                            player_values['skills'].push(number);
                        }

                    } else {
                        for (j = 0; j < skills.length - 1; j++) {
                            cleanedText = skills[j].textContent.replace(')', '');
                            cleanedText = cleanedText.replace('(', '');
                            let number = parseInt(cleanedText, 10);
                            player_values['skills'].push(number);
                        }
                    }
                    players.push(player_values)
                }
            }

            if (flagStats) {
                const container = document.getElementById("squad-search-toggle")
                var contenidoNuevo = "<div id='containerTactics' style='background-color: #e3e3e3;'></br><center>"
                contenidoNuevo += "<div id=selectDiv>Choose Tactic: <select id=tactics_select>"
                contenidoNuevo += "<option value='All Team'>All Team</option>"
                for (var x = 0; x < tactics_list.length; x++) {
                    var selected = ""
                    if (x == 0) {
                        selected = "selected=''";
                    }
                    contenidoNuevo += "<option " + selected + " value='" + tactics_list[x] + "'>" + tactics_list[x] + "</option>"
                }
                contenidoNuevo += "</select></div></br><div id=divMenu></div></center></div>"
                container.innerHTML = contenidoNuevo + container.innerHTML;
                skillDistrib(tactics_list[0]);
                document.getElementById("tactics_select").addEventListener('change', function () {
                    var select = document.getElementById('tactics_select');
                    var valorSeleccionado = select.value;
                    document.getElementById("divMenu").innerHTML = ""
                    skillDistrib(valorSeleccionado)
                });
            }




            for (i = 0; i < ids_.length; i++) {
                (function (currentId, currentTeamId, currentSport, lang, team_name, player_name) {
                    document.getElementById("but" + currentId).addEventListener('click', function () {
                        var link = "http://statsxente.com/MZ1/Functions/tamper_player_stats.php?sport=" + currentSport
                            + "&player_id=" + currentId + "&team_id=" + currentTeamId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") +
                            "&team_name=" + encodeURIComponent(team_name) + "&player_name=" + encodeURIComponent(player_name)
                        openWindow(link, 0.95, 1.25);
                    });
                })(ids_[i]['id'], tid, window.sport, window.lang, "[undefined]", ids_[i]['name'],);
            }



        }, 1000);
    }
    function skillDistrib(tactic) {
        var t = tactic
        if (window.sport == "hockey") {
            var l = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        } else {
            l = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }

        var li_t = {}
        for (var i = 0; i < lines.length; i++) {
            li_t[lines[i]] = [...l];
        }

        var no_gk_line = "Tactic -(" + gk_line + ")"
        li_t["Team"] = [...l];
        li_t["U23"] = [...l];
        li_t["U21"] = [...l];
        li_t["U18"] = [...l];
        li_t["Tactic"] = [...l];
        li_t[no_gk_line] = [...l];



        for (i = 0; i < players.length; i++) {
            if (players[i]['tactics'].includes(t)) {
                for (var j = 0; j < players[i]['skills'].length; j++) {
                    li_t[players[i]['tactics-position'][t]][j] += players[i]['skills'][j]
                    li_t['Tactic'][j] += players[i]['skills'][j]
                    if (players[i]['tactics-position'][t] != "Po") {
                        li_t[no_gk_line][j] += players[i]['skills'][j]
                    }
                }
                li_t[players[i]['tactics-position'][t]][j] += 1
                li_t['Tactic'][j] += 1
                if (players[i]['tactics-position'][t] != "Po") {
                    li_t[no_gk_line][j] += 1
                }
            } else {

                for (j = 0; j < players[i]['skills'].length; j++) {
                    if (players[i]['age'] <= 23) {
                        li_t['U23'][j] += players[i]['skills'][j]
                    }
                    if (players[i]['age'] <= 23) {
                        li_t['U21'][j] += players[i]['skills'][j]
                    }
                    if (players[i]['age'] <= 23) {
                        li_t['U18'][j] += players[i]['skills'][j]
                    }
                    li_t['Team'][j] += players[i]['skills'][j]
                }

                if (players[i]['age'] <= 23) {
                    li_t['U23'][li_t["U23"].length - 1] += 1
                }

                if (players[i]['age'] <= 21) {
                    li_t['U21'][li_t["U21"].length - 1] += 1
                }
                if (players[i]['age'] <= 18) {
                    li_t['U18'][li_t["U18"].length - 1] += 1
                }
                li_t['Team'][li_t["Team"].length - 1] += 1
            }
        }



        const container = document.getElementById("divMenu")
        var contenidoNuevo = "<center><table id=showMenu border=1 style='width:95%;font-size:13px;'><thead style='background-color:" + GM_getValue("bg_native") + "; color:" + GM_getValue("color_native") + ";'><tr>";
        contenidoNuevo += '<th align=center style="padding:4px;">Line</th>'
        for (var q = 0; q < skills_names.length; q++) {
            contenidoNuevo += '<th align=center style="padding:4px;">' + skills_names[q] + '</th>'
        }
        contenidoNuevo += '</tr></thead>';
        var l_aux = lines
        l_aux = l_aux.filter(item => item !== gk_line);
        l_aux.sort((a, b) => {
            let numA = parseInt(a.substring(1), 10);
            let numB = parseInt(b.substring(1), 10);
            return numA - numB;
        });

        l_aux.unshift(gk_line);
        l_aux.push("Tactic");
        l_aux.push(no_gk_line);

        if (window.sport == "hockey") {
            if (li_t["L4"][10] == 0) {
                let index = l_aux.indexOf('L4');
                if (index !== -1) {
                    l_aux.splice(index, 1);
                }
            }
        }

        if (t == "All Team") {
            l_aux = ["Team", "U23", "U21", "U18"]
        }

        l_aux = l_aux.filter(item => !item.includes(su_line));

        for (var w = 0; w < l_aux.length; w++) {
            var key = l_aux[w]
            if (li_t.hasOwnProperty(key)) {
                contenidoNuevo += "<tr>";
                contenidoNuevo += "<td align=center style='padding:2px;'><strong>" + key + "</strong></td>";
                for (var x = 0; x < li_t[key].length - 1; x++) {
                    contenidoNuevo += "<td align=center style='padding:2px;'>" + Math.round(li_t[key][x] / li_t[key][li_t[key].length - 1] * 100) / 100 + "</td>";
                }
                contenidoNuevo += "</tr>";

            }
        }
        container.innerHTML += contenidoNuevo;
    }
    //Players links to stats
    async function playersPageStats() {
        var element = document.getElementById('thePlayers_0');
        var elementos_ = element.getElementsByClassName('p_sublinks');
        var subheaders = element.getElementsByClassName('subheader clearfix');
        var enlace = subheaders[0].querySelector('.subheader a');
        var urlObj = new URL("https://www.managerzone.com/" + enlace.getAttribute('href'));
        var params = new URLSearchParams(urlObj.search);
        var tid = params.get('tid');
        var playerName = enlace.querySelector('.player_name').textContent
        var ids = element.getElementsByClassName('player_id_span');
        var txt = '<span id=but' + ids[0].textContent + ' class="player_icon_placeholder"><a href="#" onclick="return false"'
        txt += 'title="Stats Xente" class="player_icon"><span class="player_icon_wrapper">'
        txt += '<span class="player_icon_image" style="background-image: url(\'https://www.statsxente.com/MZ1/View/Images/etiqueta_bota_mini.png\'); width: 21px; height: 20px; background-size: auto;'
        txt += 'z-index: 0;"></span><span class="player_icon_text"></span></span></a></span>'
        elementos_[0].innerHTML += txt;
        (function (currentId, currentTeamId, currentSport, lang, team_name, player_name) {
            document.getElementById("but" + currentId).addEventListener('click', function () {
                var link = "http://statsxente.com/MZ1/Functions/tamper_player_stats.php?sport=" + currentSport
                    + "&player_id=" + currentId + "&team_id=" + currentTeamId + "&idioma=" + lang + "&divisa=" + GM_getValue("currency") +
                    "&team_name=" + encodeURIComponent(team_name) + "&player_name=" + encodeURIComponent(player_name)
                openWindow(link, 0.95, 1.25);
            });
        })(ids[0].textContent, tid, window.sport, window.lang, "[undefined]", playerName);
    }
    //Country ranking page
    function countryRank() {
        var table_values = ["players", "age", "value", "top11", "salary", "elo", "elo21", "lm", "lmu21"]
        var newContent = "<center><div>";
        newContent += '<label><input class="statsxente" type="checkbox" checked id="value" value="Value">Value</label>';
        if (window.sport == "soccer") {
            newContent += '<label><input class="statsxente" type="checkbox" id="top11" value="TOP 11">TOP 11</label>';
        } else {
            newContent += '<label><input class="statsxente" type="checkbox" id="top11" value="TOP 21">TOP 21</label>';
        }

        newContent += '<label><input class="statsxente" type="checkbox" id="players" value="Players">Players</label>';
        newContent += '<label><input class="statsxente" type="checkbox" id="salary" value="Salary">Salary</label>';
        newContent += '<label><input class="statsxente" type="checkbox" id="age" value="Age">Age</label>';
        newContent += '<label><input class="statsxente" type="checkbox" checked id="elo" value="Elo">ELO</label>';
        newContent += '<label><input class="statsxente" type="checkbox" checked id="elo21" value="U21 ELO">U21 ELO</label>';
        newContent += '<label><input class="statsxente" type="checkbox" checked id="lm" value="LM">LM</label>';
        newContent += '<label><input class="statsxente" type="checkbox" checked id="lmu21" value="U21 LM">U21 LM</label>';

        var contenedor = document.getElementById('countryRankTable');
        contenedor.insertAdjacentHTML('beforebegin', newContent);

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_national_teams.php?currency=" + GM_getValue("currency") + "&sport=" + window.sport,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                var jsonResponse = JSON.parse(response.responseText);
                var data = jsonResponse;

                var type = 1;
                if (window.sport == "soccer") {
                    type = 2
                }
                var table = document.getElementById('countryRankTable');
                for (var i = 0; i < table.rows.length; i++) {
                    var row = table.rows[i];
                    var insertIndex = row.cells.length - 1;
                    var raw_str = row.cells[3].innerHTML
                    row.deleteCell(3);
                    var cell_name = row.cells[2]
                    if (i > 0) {
                        cell_name.innerHTML = raw_str + " " + cell_name.innerHTML
                    }
                    var index = 0;
                    var cell0 = row.insertCell(insertIndex + index);
                    index++;
                    var cell1 = row.insertCell(insertIndex + index);
                    index++;
                    var cell2 = row.insertCell(insertIndex + index);
                    index++;
                    var cell3 = row.insertCell(insertIndex + index);
                    index++;
                    var cell4 = row.insertCell(insertIndex + index);
                    index++;
                    var cell5 = row.insertCell(insertIndex + index);
                    index++;
                    var cell6 = row.insertCell(insertIndex + index);
                    index++;
                    var cell7 = row.insertCell(insertIndex + index);
                    index++;
                    var cell8 = row.insertCell(insertIndex + index);
                    index++;
                    var cell9 = row.insertCell(insertIndex + index);



                    if (i === 0) {
                        cell0.outerHTML = "<th id='players_th' style='display:none;' class='header'><a href='#'>Players</a></th>";
                        cell1.outerHTML = "<th id='age_th' class='header' style='display:none;'><a href='#'>Age</a></th>";
                        cell2.outerHTML = "<th id='value_th' class='header' style='display:table-cell;'><a href='#'>Value</a></th>";
                        cell3.outerHTML = "<th id='top11_th' class='header' style='display:none;'><a href='#'>Top11</a></th>";
                        cell4.outerHTML = "<th id='salary_th' class='header' style='display:none;'><a href='#'>Salary</a></th>";
                        cell5.outerHTML = "<th id='elo_th' class='header' style='display:table-cell;'><a href='#'>ELO</a></th>";
                        cell6.outerHTML = "<th id='elo21_th' class='header' style='display:table-cell;'><a href='#'>U21 ELO</a></th>";
                        cell7.outerHTML = "<th id='lm_th' class='header' style='display:table-cell;'><a href='#'>LM</a></th>";
                        cell8.outerHTML = "<th id='lmu21_th' class='header' style='display:table-cell;'><a href='#'>U21 LM</a></th>";
                        cell9.outerHTML = "<th id='image' class='header' style='display:table-cell;'><a href='#'></a></th>";
                    } else {
                        var ini = raw_str.indexOf("s_");
                        var fin = raw_str.indexOf(".", ini + 1);
                        var c_code = raw_str.substring(ini + 2, fin)
                        cell0.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["numJugadores"]))
                        cell0.className = "players"
                        cell0.style.display = "none"

                        cell1.innerHTML = new Intl.NumberFormat(window.userLocal, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[c_code]["edad"])
                        cell1.className = "age"
                        cell1.style.display = "none"

                        cell2.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["valor"]))
                        cell2.className = "value"
                        cell2.style.display = "table-cell"

                        cell3.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["valor11"]))
                        cell3.className = "top11"
                        cell3.style.display = "none"

                        cell4.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["salario"]))
                        cell4.className = "salary"
                        cell4.style.display = "none"

                        cell5.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["elo"]))
                        cell5.className = "elo"
                        cell5.style.display = "table-cell"

                        cell6.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["elo21"]))
                        cell6.className = "elo21"
                        cell6.style.display = "table-cell"

                        cell7.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["valorLM"]))
                        cell7.className = "lm"
                        cell7.style.display = "table-cell"

                        cell8.innerHTML = new Intl.NumberFormat(window.userLocal).format(Math.round(data[c_code]["valorLM21"]))
                        cell8.className = "lmu21"
                        cell8.style.display = "table-cell"

                        cell9.innerHTML = '<img style="cursor:pointer;" src="https://statsxente.com/MZ1/View/Images/calendar.png" width="20" height="20">'
                        var actual_id = "image" + i
                        cell9.id = actual_id
                        cell9.style.display = "table-cell";


                        (function (id, code, type_) {
                            document.getElementById(id).addEventListener('click', function () {
                                var link = "https://www.statsxente.com/MZ1/Graficos/graficoRachaEquipoELONT.php?tamper=yes&team_id=" + data[code]["idSenior"] +
                                    "&team_id_u21=" + data[code]["idSub21"] + "&idioma=" + window.lang + "&type=" + type_ + "&cat=SENIOR&sport=" + window.sport;
                                openWindow(link, 0.95, 1.25);
                            });
                        })(actual_id, c_code, type);
                    }
                }

                setTimeout(function () {
                    for (var f = 0; f < table_values.length; f++) {

                        (function (actual_value, f) {

                            document.getElementById(actual_value + "_th").addEventListener('click', function () {
                                if (document.getElementById(actual_value + "_th").className == "header") {
                                    document.getElementById(actual_value + "_th").className = "header headerSortDown";
                                } else {

                                    if (document.getElementById(actual_value + "_th").className == "header headerSortDown") {
                                        document.getElementById(actual_value + "_th").className = "header headerSortUp";
                                    } else {
                                        document.getElementById(actual_value + "_th").className = "header headerSortDown";
                                    }

                                }
                                var index_ = 3 + f
                                ordenarTabla(index_, false, "countryRankTable",false)
                            });
                            document.getElementById(actual_value).addEventListener('click', function () {
                                var display = "table-cell"
                                if (document.getElementById(actual_value + "_th").style.display == "table-cell") {
                                    display = "none"
                                }
                                var elementos = document.getElementsByClassName(actual_value)
                                Array.prototype.forEach.call(elementos, function (elemento) {
                                    var aux_display = "table-cell"
                                    if (document.getElementById(actual_value + "_th").style.display == "table-cell") {
                                        aux_display = "none"
                                    }
                                    elemento.style.display = aux_display;
                                });
                                document.getElementById(actual_value + "_th").style.display = display
                            });
                        })(table_values[f], f);
                    }
                }, 1000);
            }
        });
    }
    //Stats Xente competitions matches
    function StatsXenteNextMatchesClubhouse() {
        var h1Elements = document.querySelectorAll('h1.box_dark');
        var team_name = h1Elements[0].innerText
        var team_id = document.getElementById("tid1").value;

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://statsxente.com/MZ1/Functions/tamper_user_next_matches.php?team_id=" + team_id,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function (response) {
                var jsonResponse = JSON.parse(response.responseText);
                var data = jsonResponse;
                if (data.length > 0) {


                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://www.managerzone.com/xml/team_matchlist.php?sport_id=" + window.sport_id + "&team_id=" + team_id + "&match_status=2&limit=100",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: function (response) {

                            var matchesDate = []
                            var parser = new DOMParser();
                            var xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                            var matches = xmlDoc.getElementsByTagName("Match");

                            var last_date = ""


                            for (var i = 0; i < matches.length; i++) {
                                var dateOnly = matches[i].getAttribute("date").split(" ")[0];
                                last_date = dateOnly
                                var teams = matches[i].getElementsByTagName("Team");

                                for (var j = 0; j < teams.length; j++) {
                                    if (teams[j].getAttribute("teamId") != team_id) {
                                        matchesDate.push(teams[j].getAttribute("teamId") + "-" + dateOnly)

                                    }
                                }


                            }




                            var newContent = `
    <div id="tour-container" class="widgets-container">
        <div class="flex-wrap hub-widget-container">
            <div class="flex-grow-1 box_dark">
                <div id="clubhouse-widget-tour" class="widget-content clearfix">
                    <i class="fa minimize-button fa-minus-square" aria-hidden="true" data-time="1722549599"></i>
                    <span class="fa fa-stack fa-2x floatRight">
                        <i class="fa fa-circle fa-stack-2x fa-inverse"></i>
                        <i class="fa fa-thumbs-up fa-stack-1x green" aria-hidden="true"></i>
                </span>
                <h3 style="background-image: url('https://www.statsxente.com/MZ1/View/Images/etiqueta_bota.png');">Stats Xente</h3>
                <div class="widget-content-wrapper">
                    <div class="flex-wrap" style="margin-bottom: 35px;">
                        <div class="flex-grow-0" style="margin: 0 auto">
                            <img src="https://www.statsxente.com/MZ1/View/Images/etiqueta_bota.png" alt="" width="114" height="127">
                        </div>
                        <div class="flex-grow-1 textLeft">`

                            data.forEach(function (match_data) {

                                var dateObj1 = new Date(last_date);
                                var dateObj2 = new Date(match_data['fecha']);


                                var icon_ = "fa-check-square"
                                var style_ = ""
                                var flagFriendly = false;
                                if (dateObj1 < dateObj2) {
                                    icon_ = "fa-calendar-minus-o"
                                    style_ = "style='color:#e5ac00;'"
                                    flagFriendly = true;
                                } else {

                                    if (matchesDate.includes(match_data['rival_id'] + "-" + match_data['fecha'])) {
                                        if (window.sport == "hockey") {
                                            style_ = "style='color:#6d93fd;'"
                                        }
                                    } else {
                                        icon_ = "fa-times-square"
                                        style_ = "style='color:#AD4039;'"
                                        flagFriendly = true;


                                    }

                                }


                                var match = '<img src="https://www.managerzone.com/dynimg/badge.php?team_id=' + match_data['idEquipoLocal'] + '&sport="' + window.sport + ' width="15px" height="15px"/> '
                                    + team_name + ' - ' + match_data['rival_name'] + ' <img src="https://www.managerzone.com/dynimg/badge.php?team_id=' + match_data['idEquipoVisitante'] + '&sport="' + window.sport + ' width="15px" height="15px"/>'
                                if (match_data['field'] == "away") {
                                    match = '<img src="https://www.managerzone.com/dynimg/badge.php?team_id=' + match_data['idEquipoLocal'] + '&sport="' + window.sport + ' width="15px" height="15px"/> '
                                        + match_data['rival_name'] + ' - ' + team_name + ' <img src="https://www.managerzone.com/dynimg/badge.php?team_id=' + match_data['idEquipoVisitante'] + '&sport="' + window.sport + ' width="15px" height="15px"/>'
                                }


                                newContent += '<fieldset class="grouping self box_light_on_dark flex-nowrap" style="max-width: 555px; margin-left: 10px;">'
                                newContent += '<legend>' + match_data['clash_name'] + '</legend>'
                                newContent += '<div class="flex-grow-0 mission-icon">'
                                newContent += '<i class="fa ' + icon_ + ' green fa-2x t-checked" aria-hidden="true" ' + style_ + '></i>'
                                newContent += '</div>'
                                newContent += '<div class="flex-grow-1 mission">'

                                var link = "CompAmis_CALENDAR_View.php?" + 'id=' + match_data['idComp']
                                if (match_data['comp'] == "cup") {
                                    link = 'CompAmis_Cup_CALENDAR_View.php?grupo=' + match_data['grupo'] + '&id=' + match_data['idComp']
                                }


                                newContent += '<p><b><a href="https://www.statsxente.com/MZ1/View/' + link + '" target="_blank">' + match + '</a></b>'
                                newContent += "</br></p>"
                                newContent += 'Date: ' + match_data['fecha']
                                if (flagFriendly) {
                                    newContent += "<a href='https://www.managerzone.com/?p=challenges&challenge-tid=" + match_data['rival_id'] + "'><i class='fa fa-thumbs-up fa-lg challenge-thumb' aria-hidden='true'></i></a>"
                                }


                                newContent += '</p>'
                                newContent += '</div>'
                                newContent += '</fieldset>'
                            });




                            newContent += `</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;




                            var contenedor = document.getElementById('tour-container');
                            if (data.length > 0) {
                                contenedor.insertAdjacentHTML('beforebegin', newContent);

                            }


                        }

                    });

                }


            }
        });

    }


    //HANDLERS FUNCTIONS
    function handleClick(event) {
        var urlParams = new URLSearchParams(window.location.search);
        var elems = document.getElementsByClassName("nice_table");
        var tabla = elems[0]
        var filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        var thSegundo = tabla.querySelector("thead th:nth-child(2)");

        if (urlParams.get('fsid')) {
            thSegundo.style.width = "180px";
        } else {
            thSegundo.style.width = "250px";
        }






        for (var i = 0; i < filas.length; i++) {
            if (checkClassNameExists(filas[i], searchClassName)) {
                var celda = filas[i].cells[1];
                var equipo = celda.textContent.trim()
                var iniIndex = celda.innerHTML.indexOf("tid=");
                var lastIndex = celda.innerHTML.indexOf("\">", iniIndex + 4);
                var data = String(celda.innerHTML)
                var id = data.substring(iniIndex + 4, lastIndex)
                var celdas = filas[i].getElementsByTagName("td");
                var ultimaCelda = celdas[celdas.length - 2];
                var selects = document.getElementsByTagName('select');
                var index_select = 1;
                if (selects[index_select] === undefined) {
                    index_select = 0;
                }


                var selectedIndex = selects[index_select].selectedIndex;
                var selectedOption = selects[index_select].options[selectedIndex];
                var selectedText = selectedOption.text;



                var key_actual_league = "Top";
                if (selectedText.includes(".")) {
                    key_actual_league = selectedText.substring(0, 4)
                }

                var valor = 0;

                if (teams_data[id] === undefined) {
                    valor = 0
                } else {

                    var table_key = "";
                    var agg_value = 0;

                    switch (event.target.id) {
                        case 'edad':
                            valor = new Intl.NumberFormat(window.userLocal, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(teams_data[id][event.target.id])
                            break;
                        case "leagues":
                            table_key = "league"
                            agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            valor = "(" + teams_data[id]['league_' + key_actual_league] + '/' + agg_value + ")"
                            break;

                        case "world_leagues":
                            table_key = "world_league"
                            agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            valor = "(" + teams_data[id][table_key + '_' + key_actual_league] + '/' + agg_value + ")"
                            break;

                        case "youth_leagues":
                            var cat = GM_getValue("actual_league_cat").toLowerCase()
                            table_key = "league_" + cat
                            agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            valor = "(" + teams_data[id][table_key + '_' + key_actual_league] + '/' + agg_value + ")"
                            break;

                        case "world_youth_leagues":
                            cat = GM_getValue("actual_league_cat").toLowerCase()
                            table_key = "world_league_" + cat
                            agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            valor = "(" + teams_data[id][table_key + '_' + key_actual_league] + '/' + agg_value + ")"
                            break;

                        case "leagues_all":
                            table_key = "league"
                            valor = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            break;


                        case "world_leagues_all":
                            table_key = "world_league"
                            valor = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            break;

                        case "youth_leagues_all":
                            table_key = "league_u23"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            table_key = "league_u21"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            table_key = "league_u18"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            break;

                        case "world_youth_leagues_all":
                            table_key = "world_league_u23"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            table_key = "world_league_u21"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            table_key = "world_league_u18"
                            valor += teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            break;

                        case "federation_leagues":
                            table_key = "federation_league"
                            agg_value = teams_data[id][table_key + '_Top'] + teams_data[id][table_key + '_div1'] + teams_data[id][table_key + '_div2'] + teams_data[id][table_key + '_div3'] + teams_data[id][table_key + '_div4'] + teams_data[id][table_key + '_div5']
                            valor = agg_value
                            break;


                        default:
                            valor = new Intl.NumberFormat(window.userLocal).format(Math.round(teams_data[id][event.target.id]))
                            break;


                    }
                }

                ultimaCelda.innerHTML = valor;
            }
        }
        var checkboxes = document.querySelectorAll('.statsxente');
        var thead = tabla.querySelector('thead');
        var tr = thead.querySelectorAll('tr');
        var td = tr[0].querySelectorAll('th');
        var ultimaCeldaEncabezado = td[td.length - 2];
        td[td.length - 2].textContent = event.target.value;
        checkboxes.forEach(function (checkbox) {
            if (checkbox.id !== event.target.id) {
                checkbox.checked = false;
            }
        });
    }
    function handleClickClash(event) {
        var elems = document.getElementsByClassName("nice_table");
        var tabla = elems[0]
        var filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        var thSegundo = tabla.querySelector("thead th:nth-child(2)");
        thSegundo.style.width = "250px";
        for (var i = 0; i < filas.length; i++) {
            var celda = tabla.rows[i + 1].cells[1];
            var imagen = celda.querySelector('img');
            var url = new URL(imagen.src);
            var id = url.searchParams.get('fid');


            var celdas = filas[i].getElementsByTagName("td");
            var ultimaCelda = celdas[celdas.length - 2];

            var valor = 0;

            if (teams_data[id] === undefined) {
                valor = 0
            } else {
                if (event.target.id == "edad") {
                    valor = new Intl.NumberFormat(window.userLocal, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(teams_data[id][event.target.id])
                } else {
                    valor = new Intl.NumberFormat(window.userLocal).format(Math.round(teams_data[id][event.target.id]))
                }

            }

            ultimaCelda.innerHTML = valor;
        }
        var checkboxes = document.querySelectorAll('.statsxente');
        var thead = tabla.querySelector('thead');
        var tr = thead.querySelectorAll('tr');
        var td = tr[0].querySelectorAll('th');
        td[td.length - 2].textContent = event.target.value;
        checkboxes.forEach(function (checkbox) {
            if (checkbox.id !== event.target.id) {
                checkbox.checked = false;
            }
        });
        var columna = 12
    }

    //FETCH FUNCTIONS
    function fetchAgeRestriction(url) {
        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(response.responseText, "text/html");
                    var strongElements = doc.getElementsByTagName("b");
                    var nextElement = strongElements[1].nextElementSibling;
                    var nextSibling = strongElements[1].nextSibling;
                    try {
                        while (nextSibling && nextSibling.nodeName === "BR") {
                            nextSibling = nextSibling.nextSibling;
                        }

                        if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
                            var age_restriction = nextSibling.textContent.trim();
                            resolve(age_restriction);
                        } else {
                            resolve("none");
                        }
                    } catch (error) {
                        reject("none");
                    }
                },
                onerror: function (error) {
                    reject("none");
                }
            });
        });
    }
    function fetchCupAgeRestriction(url) {
        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    var parser = new DOMParser();
                    try {
                        var doc = parser.parseFromString(response.responseText, "text/html")
                        var tables = doc.getElementsByTagName("table");
                        var table = tables[1]
                        var tds = table.getElementsByTagName("td");
                        resolve(tds[5].innerHTML)
                    } catch (error) {
                        reject("none");
                    }
                },
                onerror: function (error) {
                    reject("none");
                }
            });
        });
    }
    function fetchExistTeam(url) {
        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    var jsonResponse = JSON.parse(response.responseText);
                    resolve(jsonResponse['inserted'])
                },
                onerror: function (error) {
                    reject("no");
                }
            });
        });
    }
    function fetchExistPlayers(url) {
        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {
                    var jsonResponse = JSON.parse(response.responseText);
                    resolve(jsonResponse)
                },
                onerror: function (error) {
                    reject("no");
                }
            });
        });
    }

    //UTILS FUNCTIONS
    function waitToDOM(function_to_execute, classToSearch, elementIndex) {
        let interval = setInterval(function () {
            let elements = document.querySelectorAll(classToSearch);
            if (elements.length > 0 && elements[elementIndex]) {
                clearInterval(interval);
                clearTimeout(timeout);
                function_to_execute();
            }
        }, 100);


        let timeout = setTimeout(function () {
            clearInterval(interval);
        }, 10000);
    }
    function openWindow(link, porAncho, porAlto) {
        var ventanaAncho = (window.innerWidth) * porAncho
        var ventanaAlto = (window.innerHeight) * porAlto
        var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
        var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
        var opcionesVentana = "width=" + ventanaAncho +
            ",height=" + ventanaAlto +
            ",left=" + ventanaIzquierda +
            ",top=" + ventanaArriba;

        if ((GM_getValue("tabsConfig") == false) && (GM_getValue("windowsConfig") == true)) {
            window.open(link, "_blank", opcionesVentana);
        }
        if ((GM_getValue("tabsConfig") == true) && (GM_getValue("windowsConfig") == false)) {
            window.open(link, "_blank");
        }
    }
    function ordenarTabla(col, byClassName, param,putSortIconFlag) {
        if (byClassName) {
            var elems = document.getElementsByClassName(param);
            var table = elems[0]
        } else {
            table = document.getElementById(param)
        }
        if(putSortIconFlag){putSortIcon(col, table)}
        var rows = Array.from(table.tBodies[0].rows);
        var isAsc = document.getElementById("ord_table").value === "ascendente";
        rows.sort(function (a, b) {
            var aNum = parseFloat(a.cells[col].textContent.trim().replace(/\./g, '').replace(/\,/g, '')) || 0;
            var bNum = parseFloat(b.cells[col].textContent.trim().replace(/\./g, '').replace(/\,/g, '')) || 0;
            return isAsc ? aNum - bNum : bNum - aNum;
        });

        rows.forEach(function (row) {
            table.tBodies[0].appendChild(row);
        });

        if (isAsc) {
            document.getElementById("ord_table").value = "descendente";
        } else {
            document.getElementById("ord_table").value = "ascendente";
        }

        var filas = table.getElementsByTagName("tr");
        for (var i = 1; i < filas.length; i++) {
            var primeraCelda = filas[i].getElementsByTagName("td")[0];
            primeraCelda.textContent = i;
        }


    }
    function ordenarTablaText(col, byClassName, param,putSortIconFlag) {
        if (byClassName) {
            var elems = document.getElementsByClassName(param);
            var table = elems[0]
        } else {
            table = document.getElementById(param)
        }
        var rows = Array.from(table.tBodies[0].rows);
        var isAsc = document.getElementById("ord_table").value === "ascendente";
        if(putSortIconFlag){putSortIcon(col, table)}
        rows.sort(function (a, b) {
            var aText = a.cells[col].textContent.toLowerCase().trim();
            var bText = b.cells[col].textContent.toLowerCase().trim();
            if (aText < bText) {
                return isAsc ? -1 : 1;
            }
            if (aText > bText) {
                return isAsc ? 1 : -1;
            }
            return 0;
        });

        rows.forEach(function (row) {
            table.tBodies[0].appendChild(row);
        });

        if (isAsc) {
            document.getElementById("ord_table").value = "descendente";
        } else {
            document.getElementById("ord_table").value = "ascendente";
        }


        var filas = table.getElementsByTagName("tr");
        for (var i = 1; i < filas.length; i++) {
            var primeraCelda = filas[i].getElementsByTagName("td")[0];
            primeraCelda.textContent = i;
        }

    }
    function checkClassNameExists(element, className) {

        if (className == "") {
            return true;
        } else {
            return element.classList.contains(className);
        }
        return false;

    }
    function getCookie(nombre) {
        var regex = new RegExp("(?:(?:^|.*;\\s*)" + nombre + "\\s*\\=\\s*([^;]*).*$)|^.*$");
        var valorCookie = document.cookie.replace(regex, "$1");
        return decodeURIComponent(valorCookie);
    }
    function generateValuesSelect(cat) {


        var defaults = new Map();
        defaults.set('senior', 'valor');
        defaults.set('u23', 'valor23');
        defaults.set('u21', 'valor21');
        defaults.set('u18', 'valor18');

        var values = new Map();
        values.set('valor', 'Value');
        values.set('valor23', 'U23 Value');
        values.set('valor21', 'U21 Value');
        values.set('valor18', 'U18 Value');
        values.set('salario', 'Salary');
        values.set('valorUPSenior', 'LM Value');
        values.set('valorUPSUB23', 'U23 LM Value');
        values.set('valorUPSUB21', 'U21 LM Value');
        values.set('valorUPSUB18', 'U18 LM Value');
        values.set('edad', 'Age');
        values.set('valor11', 'TOP 11/21');
        values.set('valor11_23', 'U23 TOP 11/21');
        values.set('valor11_21', 'U21 TOP 11/21');
        values.set('valor11_18', 'U18 TOP 11/21');
        values.set('noNac', 'Foreigners');
        values.set('elo', 'ELO Score');
        values.set('elo23', 'U23 ELO Score');
        values.set('elo21', 'U21 ELO Score');
        values.set('elo18', 'U18 ELO Score');
        values.set('numJugadores', 'Number of players');


        var default_value = GM_getValue("league_default_" + cat, defaults.get(cat))
        GM_setValue("league_default_" + cat, default_value)

        var select = "<select id='league_default_select_" + cat + "' style='width:9em;'>";
        values.forEach((valor, clave, mapa) => {
            var checked = ""
            if (clave == default_value) {
                checked = "selected"
            }
            select += "<option " + checked + " value='" + clave + "'>" + valor + "</option>";
        });
        select += "</select>"
        return select;

    }
    function createLeagueConfigOptionsListeners() {

        var defaults = new Map();
        defaults.set('senior', 'valor');
        defaults.set('u23', 'valor23');
        defaults.set('u21', 'valor21');
        defaults.set('u18', 'valor18');



        defaults.forEach((valor, clave, mapa) => {



            document.getElementById("league_default_select_" + clave).addEventListener('change', function () {

                var selectElement = document.getElementById("league_default_select_" + clave);
                GM_setValue("league_default_" + clave, selectElement.value)
            });

        });
        document.getElementById("league_graph_check").addEventListener('click', function () {

            if (document.getElementById("league_graph_check").checked) {
                GM_setValue("league_graph_button", "checked")
            } else {
                GM_setValue("league_graph_button", "")
            }


        });


        document.getElementById("league_report_check").addEventListener('click', function () {

            if (document.getElementById("league_report_check").checked) {
                GM_setValue("league_report_button", "checked")
            } else {
                GM_setValue("league_report_button", "")
            }


        });

        document.getElementById("league_calendar_check").addEventListener('click', function () {

            if (document.getElementById("league_calendar_check").checked) {
                GM_setValue("league_calendar_button", "checked")
            } else {
                GM_setValue("league_calendar_button", "")
            }


        });






    }
    function createModalMenu() {
        var newElement = document.createElement("div");
        newElement.id = "legendDiv";
        newElement.className = "stx_legend";
        var txtToInsert= '<div style="writing-mode: tb-rl;-webkit-writing-mode: vertical-rl;"><center>'
        if(GM_getValue("avaliable_new_version")=="yes"){
            txtToInsert+='<img src="https://statsxente.com/MZ1/View/Images/alert.png" style="width:15px;height:15px;"/>'
        }
        txtToInsert+='<img src="https://statsxente.com/MZ1/View/Images/etiqueta_bota.png" style="width:25px;height:25px;"/>'
        txtToInsert+='</center></div>';
        newElement.innerHTML=txtToInsert;
        var body = document.body;
        body.appendChild(newElement);

        var newModalElement = document.createElement('div');
        newModalElement.innerHTML = '<center><div id="snackbar_stx">aaa</div></center><div id="myModal_cargando" class="modal_cargando"><div class="modal-content_cargando"  id="modal_content_div_cargando"><div id="contenido_modal_cargando" style="overflow-x:auto; background-color:#f2f2f200;"></div></div></div>'
        body.insertBefore(newModalElement, body.firstChild);

        if (GM_getValue("leagueFlag") === undefined) {
            GM_setValue("leagueFlag", true)
        }

        if (GM_getValue("matchFlag") === undefined) {
            GM_setValue("matchFlag", true)
        }

        if (GM_getValue("federationFlag") === undefined) {
            GM_setValue("federationFlag", true)
        }

        if (GM_getValue("playersFlag") === undefined) {
            GM_setValue("playersFlag", true)
        }

        if (GM_getValue("countryRankFlag") === undefined) {
            GM_setValue("countryRankFlag", true)
        }


        if (GM_getValue("league_graph_button") === undefined) {
            GM_setValue("league_graph_button", "checked")
        }

        if (GM_getValue("league_report_button") === undefined) {
            GM_setValue("league_report_button", "checked")
        }

        if (GM_getValue("league_calendar_button") === undefined) {
            GM_setValue("league_calendar_button", "checked")
        }

        if (GM_getValue("windowsConfig") === undefined) {
            GM_setValue("windowsConfig", true)
        }

        if (GM_getValue("tabsConfig") === undefined) {
            GM_setValue("tabsConfig", false)
        }

        if (GM_getValue("show_league_selects") === undefined) {
            GM_setValue("show_league_selects", true)
        }

        if (GM_getValue("league_image_size") === undefined) {
            GM_setValue("league_image_size", 20)
        }







        var leagueFlag = "", matchFlag = "", federationFlag = "", playersFlag = "", countryRankFlag = ""

        if (GM_getValue("federationFlag")) federationFlag = "checked"
        if (GM_getValue("matchFlag")) matchFlag = "checked"
        if (GM_getValue("leagueFlag")) leagueFlag = "checked"
        if (GM_getValue("playersFlag")) playersFlag = "checked"
        if (GM_getValue("countryRankFlag")) countryRankFlag = "checked"
        var newContent = '<center><img id="closeButton" src="https://statsxente.com/MZ1/View/Images/error.png" style="width:40px; height:40px; cursor:pointer;"/></br></br><div id=alert_tittle class="caja_mensaje_50">Config</div><div id="div1" class="modal_div_content_main"  style="display: flex; flex-direction: column; overflow: auto; max-width: 100%;">'
        newContent +='</br><center><table border=0 style="width:75%"><tbody><tr>';
        newContent += '<td><label class="containerPeqAmarillo">League<input type="checkbox" id="leagueSelect" ' + leagueFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">Federation<input type="checkbox" id="federationSelect" ' + federationFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">Match<input type="checkbox" id="matchSelect" ' + matchFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">Players<input type="checkbox" id="playersSelect" ' + playersFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += '<td><label class="containerPeqAmarillo">Country Rank<input type="checkbox" id="countryRankSelect" ' + countryRankFlag + '><span class="checkmarkPeqAmarillo"></span></td>'
        newContent += "</tr></tbody></table></center>"

        newContent += "<hr>"
        newContent += "<h3 style='text-align: left; padding-left:7px;'>Leagues Config</h3>"

        newContent += "<table border='0'><tr>"
        newContent += "<td>Default Senior Param: <td>" + generateValuesSelect('senior') + "</td>";
        newContent += "<td>Default U23 Param: <td>" + generateValuesSelect('u23') + "</td>";
        newContent += "<td>Default U21 Param: <td>" + generateValuesSelect('u21') + "</td>";
        newContent += "<td>Default U18 Param: <td>" + generateValuesSelect('u18') + "</td>";

        newContent += "</tr><tr>"


        var checked_graph = GM_getValue("league_graph_button")
        var checked_report = GM_getValue("league_report_button")
        var checked_calendar = GM_getValue("league_calendar_button")

        newContent += "<td colspan='8'><center><table><tr><td><label><input " + checked_graph + " type='checkbox' value='graph' class='textMiddle' id='league_graph_check'><img class='textMiddle' src='https://statsxente.com/MZ1/View/Images/graph.png' width='20px' height='20px'/> <span class='textMiddle'>Progress</span></label></td>"
        newContent += "<td><center><label><input " + checked_report + " type='checkbox' value='graph' id='league_report_check' class='textMiddle'><img class='textMiddle' src='https://statsxente.com/MZ1/View/Images/report.png' width='20px' height='20px'/> <span class='textMiddle'>Graph</span></label></td>"

        newContent += "<td><center><label><input " + checked_calendar + " type='checkbox' value='graph' id='league_calendar_check' class='textMiddle'><img  class='textMiddle' src='https://statsxente.com/MZ1/View/Images/calendar.png' width='20px' height='20px'/> <span class='textMiddle'>ELO Matches</span></label></td></tr></table></td>"

        newContent += '</tr><tr>';

        newContent += '<td colspan="4"><center><label><span class="textMiddle">Icons Size</span> <input class="textMiddle" id="slider_input" class="range-slider_input" type="range" value="' + GM_getValue("league_image_size") + '" min="10" max="30">'
        newContent += '<img class="textMiddle" id="testImage" src="https://statsxente.com/MZ1/View/Images/calendar.png" width="20px" height="20px"/>'
        newContent += '<span class="textMiddle" style="padding-left:10px;" id="sizeImageLeagueSpan"> (' + GM_getValue("league_image_size") + ')</span></label></center></td>'



        var checkedLeagueSelects = ""
        if (GM_getValue("show_league_selects")) {
            checkedLeagueSelects = "checked"
        }

        newContent += '<td colspan="4"><center><label class="textMiddle"><input ' + checkedLeagueSelects + ' type="checkbox" class="textMiddle" value="graph" id="show_league_checkbox">Show selects</label></center></td>'
        newContent += "</tr></table>"
        newContent += "<hr>"
        newContent += "<h3 style='text-align: left; padding-left:7px;'>Tabs Config</h3>"
        newContent += "<table style='display:flex;'><tr><td>"

        var checkedTab = ""
        if (GM_getValue("tabsConfig")) {
            checkedTab = "checked"
        }

        var checkedWin = ""
        if (GM_getValue("windowsConfig")) {
            checkedWin = "checked"
        }


        newContent += "<label><input type='checkbox' id='windowsConfig' " + checkedWin + ">Windows</label>";
        newContent += "<label><input type='checkbox' id='tabsConfig' " + checkedTab + ">Tabs</label>";
        newContent += "</td></tr></table></br></br>"

        newContent += '<div style=padding-bottom:10px;><h2>New vesion avaliable: '+GM_getValue("stx_latest_version")+'</h2>'
        newContent += '<button class="btn-update" id="updateButton"><i class="bi bi-arrow-down-circle-fill" style="font-style:normal;"> Update</i></button></div>'





        newContent += '<div style=padding-bottom:10px;><button class="btn-save" id="saveButton"><i class="bi bi-house-door-fill" style="font-style:normal;">Save</i></button><button id="deleteButton"class="btn-delete" style="margin-left:10px;"><i class="bi bi-trash-fill" style="font-style:normal;">Reset</i></button></div>'
        newContent += '</div></center></br></br>';
        document.getElementById("contenido_modal_cargando").innerHTML = newContent
        createLeagueConfigOptionsListeners();
        document.getElementById("contenido_modal_cargando").style.width = "75%";
        document.getElementById("myModal_cargando").style.display = "none"
        getNativeTableStyles()

        document.getElementById("alert_tittle").style.backgroundColor = GM_getValue("bg_native")

        document.getElementById("updateButton").addEventListener('click', function () {
            window.open("https://update.greasyfork.org/scripts/491442/Stats%20Xente%20Script.user.js", "_blank");
        });





        document.getElementById("legendDiv").addEventListener('click', function () {

            if (document.getElementById("myModal_cargando").style.display == "none") {
                document.getElementById("myModal_cargando").style.display = "flex";
            } else {
                document.getElementById("myModal_cargando").style.display = "none";
            }

        });


        document.getElementById("closeButton").addEventListener('click', function () {
            document.getElementById("myModal_cargando").style.display = "none";
        });


        document.getElementById("saveButton").addEventListener('click', function () {
            window.location.reload();
        });




        (function () {
            document.getElementById("deleteButton").addEventListener('click', function () {
                var keys = GM_listValues();
                keys.forEach(function (key) {
                    GM_deleteValue(key);
                });
                window.location.reload();
            });
        })();





        // }, 3000);

    }
    function getNativeTableStyles() {
        var elemento = document.querySelector('.subheader.clearfix');
        if (elemento) {
            var estilo = getComputedStyle(elemento);
            var bg = estilo.backgroundColor
            var color = "white"
            if (estilo.backgroundColor == "rgba(0, 0, 0, 0)") {
                bg = "#a9b0b4"
            }
            GM_setValue("bg_native", bg)
            GM_setValue("color_native", color)
        }


    }
    function createModalEventListeners() {
        setTimeout(function () {


            document.getElementById('leagueSelect').addEventListener('click', function () {
                GM_setValue("leagueFlag", !GM_getValue("leagueFlag"))
            });


            document.getElementById('federationSelect').addEventListener('click', function () {
                GM_setValue("federationFlag", !GM_getValue("federationFlag"))
            });

            document.getElementById('matchSelect').addEventListener('click', function () {
                GM_setValue("matchFlag", !GM_getValue("matchFlag"))
            });

            document.getElementById('playersSelect').addEventListener('click', function () {
                GM_setValue("playersFlag", !GM_getValue("playersFlag"))
            });

            document.getElementById('countryRankSelect').addEventListener('click', function () {
                GM_setValue("countryRankFlag", !GM_getValue("countryRankFlag"))
            });




            document.getElementById('show_league_checkbox').addEventListener('click', function () {
                GM_setValue("show_league_selects", !GM_getValue("show_league_selects"))
            });



            document.getElementById('windowsConfig').addEventListener('click', function () {

                if (document.getElementById('windowsConfig').checked) {
                    document.getElementById('tabsConfig').checked = false;
                } else {
                    document.getElementById('tabsConfig').checked = true;
                }

                GM_setValue("windowsConfig", !GM_getValue("windowsConfig"))
                GM_setValue("tabsConfig", !GM_getValue("tabsConfig"))


            });


            document.getElementById('tabsConfig').addEventListener('click', function () {
                if (document.getElementById('tabsConfig').checked) {
                    document.getElementById('windowsConfig').checked = false;
                } else {
                    document.getElementById('windowsConfig').checked = true;
                }
                GM_setValue("windowsConfig", !GM_getValue("windowsConfig"))
                GM_setValue("tabsConfig", !GM_getValue("tabsConfig"))


            });





            (function () {
                document.getElementById("slider_input").addEventListener('input', function () {
                    document.getElementById("testImage").style.width = document.getElementById("slider_input").value + "px";
                    document.getElementById("testImage").style.height = document.getElementById("slider_input").value + "px";

                    document.getElementById("sizeImageLeagueSpan").innerText = "(" + document.getElementById("slider_input").value + ")"


                    GM_setValue("league_image_size", document.getElementById("slider_input").value)


                });
            })();




        }, 5000);

    }
    function setLangSportCats() {

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
        if (langs.has(lanCookie)) {
            window.lang = langs.get(lanCookie);
        } else {
            window.lang = "ENGLISH";
        }

        var sportCookie = getCookie("MZSPORT");
        var lsport = "F"
        var sport_id = 1;
        if (sportCookie == "hockey") {
            lsport = "H";
            sport_id = 2;
        }

        var cats = {};
        cats["senior"] = "senior";
        cats["world"] = "seniorw";
        cats["u23"] = "SUB23";
        cats["u21"] = "SUB21";
        cats["u18"] = "SUB18";
        cats["u23_world"] = "SUB23w";
        cats["u21_world"] = "SUB21w";
        cats["u18_world"] = "SUB18w";


        window.cats = cats;
        window.sport = sportCookie;
        window.lsport = lsport;
        window.sport_id = sport_id;
        window.userLocal = navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language;

    }
    function getUsernameData() {
        if ((GM_getValue("currency") === undefined) || (GM_getValue("currency") == "")
            ||(GM_getValue("soccer_team_id") === undefined) || (GM_getValue("soccer_team_id") == "")
            ||(GM_getValue("hockey_team_id") === undefined) || (GM_getValue("hockey_team_id") == "")) {
            var username = document.getElementById("header-username").innerText
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://www.managerzone.com/xml/manager_data.php?sport_id=" + window.sport_id + "&username=" + username,
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function (response) {

                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                    var userTeamsData = xmlDoc.getElementsByTagName("Team");
                    var index = 1;

                    if (userTeamsData[0].getAttribute("sport")=="soccer"){
                        GM_setValue("soccer_team_id", userTeamsData[0].getAttribute("teamId"))
                    }
                    if (userTeamsData[0].getAttribute("sport")=="hockey"){
                        GM_setValue("hockey_team_id", userTeamsData[0].getAttribute("teamId"))
                    }


                    if (userTeamsData[1].getAttribute("sport")=="soccer"){
                        GM_setValue("soccer_team_id", userTeamsData[1].getAttribute("teamId"))
                    }
                    if (userTeamsData[1].getAttribute("sport")=="hockey"){
                        GM_setValue("hockey_team_id", userTeamsData[1].getAttribute("teamId"))
                    }



                    if (userTeamsData[0].getAttribute("sport") == window.sport) {
                        index = 0;
                    }
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://www.managerzone.com/xml/team_playerlist.php?sport_id=" + window.sport_id + "&team_id=" + userTeamsData[index].getAttribute("teamId"),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        onload: function (response) {

                            var parser = new DOMParser();
                            var xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                            var team_data = xmlDoc.getElementsByTagName("TeamPlayers");
                            GM_setValue("currency", team_data[0].getAttribute("teamCurrency"))
                        }
                    });





                }
            });

        }


    }
    function getActualDate(){
        const fechaActual = new Date();
        const year = fechaActual.getFullYear();
        const month = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const day = String(fechaActual.getDate()).padStart(2, '0');
        const fechaFormateada = `${year}-${month}-${day}`;
        return fechaFormateada;
    }
    function compareVersions(installedVersion, latestVersion) {
        const installedParts = installedVersion.split('.').map(Number);
        const latestParts = latestVersion.split('.').map(Number);
        for (let i = 0; i < Math.max(installedParts.length, latestParts.length); i++) {
            const installed = installedParts[i] || 0;
            const latest = latestParts[i] || 0;
            if (installed < latest) {
                GM_setValue("avaliable_new_version","yes")
            }else{
                GM_setValue("avaliable_new_version","no")
            }
        }

    }
    function notifySnackBarNewVersion(){
        console.log(GM_getValue("stx_notified_version")+" "+GM_getValue("stx_latest_version"))
        if(GM_getValue("stx_notified_version")!=GM_getValue("stx_latest_version")){
            GM_setValue("stx_notified_version",GM_getValue("stx_latest_version"))
            var x = document.getElementById("snackbar_stx");
            var txt = "<img src=https://statsxente.com/MZ1/View/Images/etiqueta_bota.png width=15  heigth=15> <font style=\"color:#2da8ef; font-size: 17px;\">Stats Xente Script: </font>New version avaliable</br></br>"
            txt+="<button type='button' id='button-snackbar-update'>UPDATE</button>"
            x.innerHTML = txt;
            x.className = "showSnackBar_stx";
            document.getElementById("button-snackbar-update").addEventListener('click', function () {
                window.open("https://update.greasyfork.org/scripts/491442/Stats%20Xente%20Script.user.js", "_blank");
            });
            setTimeout(function () { x.className = x.className.replace("showSnackBar_stx", ""); }, 8000);
        }
    }
    async function checkScriptVersion(){
        const actual_date=getActualDate()
        if(actual_date!=GM_getValue("date_checked_version")){
            console.log("eo")
            notifySnackBarNewVersion()
            GM_setValue("date_checked_version", actual_date)
            const greasyForkURL = 'https://greasyfork.org/es/scripts/491442-stats-xente-script';
            fetch(greasyForkURL)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const versionElement = doc.querySelector('dd.script-show-version');
                    const latestVersion = versionElement ? versionElement.textContent.trim() : 'No se encontró versión';
                    const installedVersion = GM_info.script.version;
                    GM_setValue("stx_latest_version",latestVersion)
                    compareVersions(installedVersion, latestVersion);
                })
                .catch(error => {
                    console.error('Error al obtener la versión del script:', error);
                });

        }

    }
    function putSortIcon(a, tabla_) {
        var filaEncabezado = tabla_.querySelector('thead tr');
        var celdas = filaEncabezado.getElementsByTagName('th');
        if (celdas.length == 0) {
            celdas = filaEncabezado.getElementsByTagName('td');
        }
        var elementos = tabla_.querySelectorAll('.bi.bi-arrow-down-short');
        elementos.forEach(function (elemento) {
            elemento.remove();
        })

        elementos = tabla_.querySelectorAll('.bi.bi-arrow-up-short');
        elementos.forEach(function (elemento) {
            elemento.remove();
        })


        var iconDesc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"/></svg>'
        var iconAsc = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"/></svg>'


        iconAsc = '<svg class="bi bi-arrow-up-short" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="12" height="12" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"/></svg>'
        iconDesc = '<svg class="bi bi-arrow-down-short" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="12" height="12" viewBox="0 0 320 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"/></svg>'

        var icon = iconAsc;
        if (document.getElementById("ord_table").value == "descendente") {
            icon = iconDesc;
        }


        celdas[a].innerHTML = icon + celdas[a].innerHTML;
    }
    function ordenarTablaq(columna, byClassName, param) {
        if (byClassName) {
            var elems = document.getElementsByClassName(param);
            var tabla = elems[0]
        } else {
            tabla = document.getElementById(param)
        }
        var filas, switching, i, x, y, debeCambiar, direccion, cambioRealizado;
        switching = true;
        direccion = document.getElementById("ord_table").value
        while (switching) {
            switching = false;
            filas = tabla.rows;
            for (i = 1; i < (filas.length - 1); i++) {
                debeCambiar = false;
                x = filas[i].getElementsByTagName("td")[columna];
                y = filas[i + 1].getElementsByTagName("td")[columna];
                var xValue = parseFloat(x.innerHTML.replace(/\./g, "").replace(/[^0-9,-]+/g, "").replace(",", "."));
                var yValue = parseFloat(y.innerHTML.replace(/\./g, "").replace(/[^0-9,-]+/g, "").replace(",", "."));
                if (direccion == "ascendente") {
                    if (isNaN(xValue)) {
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            debeCambiar = true;
                            break;
                        }
                    } else {
                        if (xValue > yValue) {
                            debeCambiar = true;
                            break;
                        }
                    }
                } else if (direccion == "descendente") {
                    if (isNaN(xValue)) {
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            debeCambiar = true;
                            break;
                        }
                    } else {
                        if (xValue < yValue) {
                            debeCambiar = true;
                            break;
                        }
                    }
                }
            }



            if (debeCambiar) {
                filas[i].parentNode.insertBefore(filas[i + 1], filas[i]);
                switching = true;
                cambioRealizado = true;
            } else {
                if (!cambioRealizado && direccion == "descendente") {
                    //direccion = "ascendente";
                    switching = true;
                }
            }
        }

        if (document.getElementById("ord_table").value == "descendente") {
            document.getElementById("ord_table").value = "ascendente";
        } else {
            document.getElementById("ord_table").value = "descendente";
        }


        filas = tabla.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        for (i = 0; i < filas.length; i++) {
            var primerTd = filas[i].querySelector("td");
            primerTd.innerHTML = (i + 1);
        }
    }
    function setCSSStyles(){
        var link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css?family=Roboto&display=swap';
        link.rel = 'stylesheet';

        var link1 = document.createElement('link');
        link1.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css';
        link1.rel = 'stylesheet';
        document.head.appendChild(link)
        document.head.appendChild(link1)

        var inputHidden = document.createElement('input');
        inputHidden.type = 'hidden';
        inputHidden.id = 'ord_table';
        inputHidden.value = 'ascendente';
        document.body.appendChild(inputHidden);
    GM_addStyle(`#snackbar_stx {
  visibility: hidden;
  position: fixed;
  /*display: flex;*/
  align-items: center;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 350px;
  background-color: #323232;
  color: #ffffffb3;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  z-index: 1;
  bottom: 30px;
  font-size: 17px;
  border-radius: 5px;
  box-shadow: 0 3px 5px -1px #0003, 0 6px 10px #00000024, 0 1px 18px #0000001f;
}

#snackbar_stx.showSnackBar_stx {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 8s forwards;
  animation: fadein 0.5s, fadeout 0.5s 8s forwards;
}

@-webkit-keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}


.divAlert {
  width: 75%;
  padding: 4px 3px;
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  font-size: 13px;
    background-color: #ffc107;
    color: #161515;
    border-color: #ffffff;
    font-weight: bold;
    text-shadow: 1px 1px #ffffff;
}.modal_cargando {
        display: none;
        /* Hidden by default */
        position: fixed;
        /* Stay in place */
        z-index: 150;
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
        justify-content: center;
        align-items: center;
    }

    .modal-content_cargando {
    position:relative;
border-radius:7px;
        background-color: #fefefe00;
        width: 90%;
        height: 40%;
        display: flex;
        justify-content: center;
        align-items: center;
    }


.btn-save{
width:8em;
border-color:transparent;
border-radius: 3px;
  display: inline-block;
  padding: 10px 5px;
  text-shadow: 0 1px 0 rgba(255,255,255,0.3);
  box-shadow: 0 1px 1px rgba(0,0,0,0.3);
  cursor:pointer;
  color: white;
  font-family: 'Roboto', sans-serif;
  background-color: #3CC93F;/*Color de fondo*/
}
.btn-save:hover{
  background-color: #37B839;/*Color de fondo*/
}
.btn-save:active{
  background-color: #29962A;/*Color de fondo*/
}


.btn-update{
width:8em;
border-color:transparent;
border-radius: 3px;
  display: inline-block;
  padding: 10px 5px;
  text-shadow: 0 1px 0 rgba(255,255,255,0.3);
  box-shadow: 0 1px 1px rgba(0,0,0,0.3);
  cursor:pointer;
  color: white;
  font-family: 'Roboto', sans-serif;
  background-color: #2da8ef;/*Color de fondo*/
}
.btn-update:hover{
  background-color: #2187c2;/*Color de fondo*/
}
.btn-update:active{
  background-color: #2187c2;/*Color de fondo*/
}

.btn-delete{
width:8em;
border-color:transparent;
border-radius: 3px;
  display: inline-block;
  padding: 10px 5px;
  text-decoration: none;
  text-shadow: 0 1px 0 rgba(255,255,255,0.3);
  box-shadow: 0 1px 1px rgba(0,0,0,0.3);
  cursor:pointer;
  color: white;
  font-family: 'Roboto', sans-serif;
  background-color: #e6413e;/*Color de fondo*/
}
.btn-delete:hover{
  background-color: #C93832;/*Color de fondo*/
}
.btn-delete:active{
  background-color: #ad2a24;/*Color de fondo*/
}

    .cerrar {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
    cursor: pointer;
    color: #fff;
  }

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
    }.stx_legend {
    z-index:300;
    position: fixed;
    bottom: 60%;
    right: 1px;
    border: 1px solid #2bacf5;
  padding-right: 13px;
    padding-left: 3px;
    padding-top: 3px;
     padding-bottom: 3px;
    width: 14px;
    font-size: 13px;
    border-radius: 4px;
    text-shadow: 1px 1px 3px #676767;
    background-color: #246355;
    color: #246355;
    cursor: default;
         cursor: pointer;
}.loader {
  width: 100%;
  height: 15px;
  border-radius: 40px;
  color: #ffc107;
  border: 2px solid;
  position: relative;
  overflow: hidden;
}
.loader::before {
  content: "";
  position: absolute;
  margin: 2px;
  width: 14px;
  top: 0;
  bottom: 0;
  left: -20px;
  border-radius: inherit;
  background: currentColor;
  box-shadow: -10px 0 12px 3px currentColor;
  clip-path: polygon(0 5%, 100% 0,100% 100%,0 95%,-30px 50%);
  animation: l14 1s infinite linear;
}
@keyframes l14 {
  100% {left: calc(100% + 20px)}
}
.containerPeqAmarillo {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  font-size:medium;
  padding-top:5px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Hide the browser's default checkbox */
.containerPeqAmarillo input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmarkPeqAmarillo {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.containerPeqAmarillo:hover input ~ .checkmarkPeqAmarillo {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.containerPeqAmarillo input:checked ~ .checkmarkPeqAmarillo {
  background-color: #FFCC00;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmarkPeqAmarillo:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.containerPeqAmarillo input:checked ~ .checkmarkPeqAmarillo:after {
  display: block;
}

/* Style the checkmark/indicator */
.containerPeqAmarillo .checkmarkPeqAmarillo:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
#showMenu {
    text-align: left;
    border-collapse: collapse;
    width: 75%;
    font-size: 14px;
    font-family: 'Roboto', sans-serif
  }

 /* #showMenu th,td {
    padding: 4px;
  }*/

  #showMenu td {
    background-color: white;
  }

  #showMenu thead {
    background-color: #246355;
    border-bottom: solid 2px #0F362D;
    color: white;
  }

  #showMenu tfoot {
    font-family: 'Righteous', cursive;
    background-color: #246355;
    border-bottom: solid 5px #0F362D;
    font-size: 13px;
    color: white;
  }



  #showMenu tr td,
  th {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  #showMenu th:first-child {
    border-top-left-radius: 5px;
  }

  #showMenu th:last-child {
    border-top-right-radius: 5px;
  }

  #showMenu tr {
    background-color: transparent;
    border-color: transparent;
    font-family: 'Roboto';
  }

  #show3{

  width: 75%;
  background-color: transparent;
      border-collapse: separate;
    border-spacing: 0;
  }



  #show3 td {
    background-color: white;
  }

 #show3 tr:last-child td:last-child {
    border-bottom-right-radius: 5px;
}


#show3 tr:last-child td:first-child {
    border-bottom-left-radius: 5px;
}

.caja_mensaje_50 {
    font-family: 'Roboto', sans-serif;
    background: #98D398;
    color: #FFFFFF;
    font-weight: bold;
    padding: 4px;
    text-align: center;
    width: 50%;
    font-size: 2.0em;
    border-radius: 5px;
}

.modal_div_content_main{
width: 100%;
background-color: #f2f2f2;
    min-height: 115px;
    border-radius: 5px;
}




  .expandable-icon {
    right: 0px;
    top: 0px;
    transform: rotateZ(45deg);
    border-radius: 5px;
    width: 20px;
    height: 20px;
    background: rgb(12, 47, 94);
    transition: all .3s;
  }

.expandable-item.active .expandable-icon{
  transform: rotateZ(0);
}

  .expandable-icon .line {
    width: 15px;
    height: 2px;
    background: white;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    transition: all .4s;
  }

  .expandable-icon .line:nth-child(1) {
    transform: rotateZ(45deg);
  }

  .expandable-icon .line:nth-child(2) {
    transform: rotateZ(-45deg);
  }


    .imgMiddle {
      display: inline-block;
      vertical-align: middle;
    }

    .textMiddle {
      display: inline-block;
      vertical-align: middle;
    }


     table.matchValuesTable {
        border-collapse: collapse;
        width: 80%;
        margin: 5px 0;
        z-index:15;

    }
    table.matchValuesTable th, table.matchValuesTable td {
        border: 1px solid #ddd;
        text-align: center;
        padding: 6px;
         border: 0px;
    }
    table.matchValuesTable th {
        background-color: #e4c800;
        color: white;
         border: 0px;
    }

    table.matchValuesTable th:first-child {
  border-top: none; /* Quita el borde superior de la primera celda del encabezado */
}


#button-snackbar-update{
color: #2da8ef;
background-color: transparent;
border: 1px solid #2da8ef;
padding: .15rem .50rem;
font-size: 0.90rem;
line-height: 1.5;
border-radius: .25rem;
cursor:pointer;
}

#button-snackbar-update:hover{
color: white;
background-color: #2da8ef;
border: 1px solid #2da8ef;
padding: .15rem .50rem;
font-size: 0.90rem;
line-height: 1.5;
border-radius: .25rem;
cursor:pointer;
}
  `)

}

})();
