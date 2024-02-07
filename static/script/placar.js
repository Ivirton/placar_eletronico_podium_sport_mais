// Criar uma classe para encapsular a lógica do placar

class Placar {
		constructor() {
				this.elemento = document.querySelector('#placar');
		}

		atualizarDados(dados) {
				document.querySelector('#time1').innerText = dados.time1;
				document.querySelector('#time2').innerText = dados.time2;
				document.querySelector('#pontos1').innerText = dados.pontos1;
				document.querySelector('#pontos2').innerText = dados.pontos2;
				document.querySelector('#partida').innerText = dados.partida + "°";
				document.querySelector('#infor').innerText = dados.infor;
				this.atualizarStatus(dados.status);
		}

		atualizarStatus(status) {
				if (status === "on") {
						this.elemento.className = "placar_on";
				} else {
						this.elemento.className = "placar_off";
				}
		}
}
// Criar uma classe para encapsular a lógica do cronômetro
class Cronometro {
		constructor() {
				this.elemento = document.getElementById('relogio');
				this.minutos = 0;
				this.segundos = 0;
				this.duracao = 0;
				this.intervalo = null;
		}
		salvarCronometro(cmd) {
				fetch(cmd)
						.then((response) => response.json())
						.then((dados) => {

						})
						.catch(console.error);
		}
		restaurarDados() {
				fetch(`/cronometro`)
						.then((response) => response.json())
						.then((cronometro) => {
								this.minutos = parseInt(cronometro.minutos)
								this.segundos = parseInt(cronometro.segundos)
								this.duracao = parseInt(cronometro.duracao)
								this.setCronometro()
						})
						.catch(console.error);
		}
		atualizarStatus(status) {
				this.duracao = status.duracao
				if (status.play === true) {
						this.iniciar()

				} else if (status.pause === true) {
						this.parar()
				} if (status.reset === true) {
						this.zerar()
				}
		}
		atualizarTempo() {
				this.segundos++;
				// this.salvarCronometro(`/cronometro?minutos=${this.minutos}&segundos=${this.segundos}&duracao=${this.duracao}`)
				if (this.segundos >= 60) {
						this.minutos++;
						this.segundos = 0;

				}
				if (this.minutos === this.duracao  ){
					this.elemento.style.color = "red"
				}
				if (this.minutos >= this.duracao) {
						this.parar()

						database.cronometro.icone = "play"
						database.cronometro.play = false
						database.cronometro.pause = true
						database.cronometro.reset = false
						this.minutos = 0;
						this.segundos = 0;
						// this.salvarCronometro(`/cronometro?minutos=${this.minutos}&segundos=${this.segundos}&duracao=${this.duracao}`)
						socket_strem()
				}

				this.setCronometro()
		}
		setCronometro() {
				const minutosFormatados = this.minutos.toString().padStart(2, '0');
				const segundosFormatados = this.segundos.toString().padStart(2, '0');
				this.elemento.innerText = `${minutosFormatados}:${segundosFormatados}`;

		}

		iniciar() {
				if (!this.intervalo && this.minutos < this.duracao) {
						this.intervalo = setInterval(() => {
								this.atualizarTempo();
								this.elemento.style.color = "white"
						}, 1000);
				}
		}

		parar() {
				clearInterval(this.intervalo);
				this.intervalo = null;
				database.pause = true
				database.play = false
				database.reset = false
				database.cronometro.icone = "play"
		}

		zerar() {
				this.parar();
				this.minutos = 0;
				this.segundos = 0;
				this.elemento.innerText = '00:00';
				database.reset = true
				// this.salvarCronometro(`/cronometro?minutos=${this.minutos}&segundos=${this.segundos}&duracao=${this.duracao}`)

		}
}


const placar = new Placar();
const cronometro = new Cronometro();
let database = {}
const socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
function inicializar() {
		fetch('/database')
				.then((response) => response.json())
				.then((dados) => {
						database = dados
						placar.atualizarDados(dados.placar);
						cronometro.atualizarStatus(dados.cronometro)
						// cronometro.restaurarDados()


				})
				.catch(console.error);
}
socket.on('connect', () => {
		socket.on('message', (message) => {
				const dados = JSON.parse(message);
				database = dados
				console.log(dados)
				placar.atualizarDados(dados.placar);
				cronometro.atualizarStatus(dados.cronometro)


		});
});
function socket_strem() {
		if (database != null) {
				console.log("dados atualizados")
				let jsonMessage = JSON.stringify(database);
				socket.emit('message', jsonMessage);
				return
		}
}
inicializar();
