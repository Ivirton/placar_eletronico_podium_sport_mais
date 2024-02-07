const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
let placar = document.querySelector('#placar')
const urlDatabase = "/database"
let minutos = 0;
let segundos = 0;
let cronometroRodando = false;
let intervalo;
var json_database = {}

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
function status_placar() {
    if (json_database.placar.status == "on") placar.className = "placar_on"
    else placar.className = "placar_off"
}
function status_cronometro(){
    if(json_database.cronometro.reset === true){
        zerarCronometro()
        
    }
    if(json_database.cronometro.play === true){
        iniciarCronometro()
        
    }if(json_database.cronometro.pause === true){
        pararCronometro()
        
    } 
   
}
function inicializar() {
    console.log(json_database)
    document.querySelector('#time1').innerText = json_database.placar.time1;
    document.querySelector('#time2').innerText = json_database.placar.time2;
    document.querySelector('#pontos1').innerText = json_database.placar.pontos1;
    document.querySelector('#pontos2').innerText = json_database.placar.pontos2;
    document.querySelector('#infor').innerText = json_database.placar.infor;
    status_cronometro()
    status_placar()  
}
socket.on('connect', () => {
    socket.on('message', (message) => {
        let jsonMessage = JSON.parse(message);
        json_database = jsonMessage
        inicializar()
    });
});

function socket_strem() {
    if (json_database != null) {
        json_database.cronometro.relogio.minutos = minutos
        json_database.cronometro.relogio.segundos = segundos
        console.log("dados atualizados")
        let jsonMessage = JSON.stringify(json_database);
        socket.emit('message', jsonMessage);
        
    }
}
//cronometro



function atualizarCronometro() {
    segundos++;
    if (segundos === 60) {
        minutos++;
        segundos = 0;
    }
    
    if (minutos >= json_database.cronometro.duracao) {
        pararCronometro()
    }
    const minutosFormatados = minutos.toString().padStart(2, '0');
    const segundosFormatados = segundos.toString().padStart(2, '0');
    document.getElementById('relogio').innerText = `${minutosFormatados}:${segundosFormatados}`;
    
}
function iniciarCronometro() {
    if (!cronometroRodando && minutos < 45) {
        cronometroRodando = true;
        intervalo = setInterval(atualizarCronometro, 1000);
    }
}
function pararCronometro() {
    clearInterval(intervalo);
    cronometroRodando = false;
    json_database.cronometro.icone = "play"
    json_database.cronometro.play = false;
    json_database.cronometro.pause = true;
    json_database.cronometro.play = false;
    
}
function zerarCronometro() {
    pararCronometro();
    minutos = 0;
    segundos = 0;
    document.getElementById('relogio').innerText = '00:00';
}