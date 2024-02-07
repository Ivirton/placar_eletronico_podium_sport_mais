const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
const relogioElement = document.getElementById('relogio');
const startButton = document.getElementById('start');
const stopButton = document.getElementById("stop");
const toggleIcon = document.getElementById('toggleIcon');
const urlDatabase = "/database";
var json_database = {}
//busca dados armazenados 
function updateDatabase() {
    fetch(urlDatabase)
        .then((response) => response.json())
        .then((data) => {
            json_database = data
            inicializar()
        })
        .catch(console.error);
}
updateDatabase()
//Envia os dados via socket
function socket_strem() {
    if (json_database != null) {
        console.log("dados atualizados")
        let jsonMessage = JSON.stringify(json_database);
        socket.emit('message', jsonMessage);
        return
    }
}
socket.on('connect', () => {
    socket.on('message', (message) => {
        let jsonMessage = JSON.parse(message);
        json_database = jsonMessage
        inicializar()
    });
});
function status_placar() {
     if (json_database.placar.status == "on") toggleIcon.className = "fa-solid fa-toggle-on fa-2xl active-icon"
     else toggleIcon.className = "fa-solid fa-toggle-off fa-2xl active-icon"
}
function status_cronometro() {
    
    if (json_database.cronometro.icone == "play" || json_database.cronometro.icone == "reset") {
        startButton.setAttribute("status", "play")
        
        startButton.className = "fa-solid fa-play"
       
    }

    else if (json_database.cronometro.icone == "pause") {
        startButton.className = "fa-solid fa-pause"
        startButton.setAttribute("status", "pause")
    }
}


//atualiza todos os campos
function inicializar() {
   
    console.log(json_database)
    document.querySelector('#time1').value = json_database.placar.time1;
    document.querySelector('#time2').value = json_database.placar.time2;
    document.querySelector('#pontos1').value = json_database.placar.pontos1;
    document.querySelector('#pontos2').value = json_database.placar.pontos2;
    document.querySelector('#infor').value = json_database.placar.infor;
    document.querySelector('#duracao').value = json_database.cronometro.duracao
    toggleIcon.setAttribute("ativo", json_database.placar.status)
    status_placar()
    status_cronometro()
    
}
// switch placar
toggleIcon.addEventListener('click', function () {
    if (toggleIcon.attributes.ativo.value == "on") {
        toggleIcon.className = "fa-solid fa-toggle-off fa-2xl active-icon"
        toggleIcon.setAttribute("ativo", "off")
        json_database.placar.status = "off"
        socket_strem()
        return
    } else if (toggleIcon.attributes.ativo.value == "off") {
        toggleIcon.className = "fa-solid fa-toggle-on fa-2xl active-icon"
        toggleIcon.setAttribute("ativo", "on")
        json_database.placar.status = "on"
        socket_strem()
        return
    }

});

// switch play e pause
startButton.addEventListener('click', function () {
    console.log(startButton.attributes.status.value)

    if (startButton.attributes.status.value == "play") {
        startButton.className = "fa-solid fa-pause"
        startButton.setAttribute("status", "pause")
        json_database.cronometro.icone = "pause"
        json_database.cronometro.play = true;
        json_database.cronometro.pause = false;
        json_database.cronometro.reset = false;
        socket_strem()
        
        return
    } else if (startButton.attributes.status.value == "pause") {
        startButton.className = "fa-solid fa-play"
        startButton.setAttribute("status", "play")
        json_database.cronometro.icone = "play"
        json_database.cronometro.pause = true;
        json_database.cronometro.play = false;
        socket_strem()
        return
    }

});
//stop
stopButton.addEventListener('click', function () {
    console.log(json_database.cronometro.play)
    if(json_database.cronometro.play === true || json_database.cronometro.pause == true){
        json_database.cronometro.play = false;
        json_database.cronometro.icone = "play";
        json_database.cronometro.reset = true;
        startButton.setAttribute("status", "play")
        startButton.className = "fa-solid fa-play";
        socket_strem()
    }
});
document.querySelector('#send').addEventListener('click', () => {
    if (json_database != undefined) {
        json_database.placar.time1 = document.querySelector('#time1').value;
        json_database.placar.pontos1 = document.querySelector('#pontos1').value
        json_database.placar.time2 = document.querySelector('#time2').value
        json_database.placar.pontos2 = document.querySelector('#pontos2').value
      
	json_database.cronometro.duracao = parseInt(document.querySelector('#duracao').value)
        json_database.placar.infor = document.querySelector('#infor').value
       
        socket_strem()
    }
});



