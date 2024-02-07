class Node {
    constructor(dados) {
        this.dados = dados;
        this.proximo = null;
    }
}
class ListaEncadeada {
    constructor() {
        this.cabeca = null;
        this.contador = 0;
        this.length = 0;
        this.elemento = document.getElementById('imagem');
        this.tempoAtual = 0;
        this.temporizador = null;
        this.noAtual = new Node()
    }
    adicionar(dados) {

        const novoNo = new Node(dados);
        if (!this.cabeca) {
            this.cabeca = novoNo;
            novoNo.proximo = this.cabeca;
        } else {
            novoNo.proximo = this.cabeca;
            let atual = this.cabeca;
            while (atual.proximo !== this.cabeca) {
                atual = atual.proximo;
            }
            atual.proximo = novoNo;
        }
        this.length++;

    }
    limpar() {
        this.cabeca = null;
        this.contador = 0
        this.length = 0
        console.clear()
    }
    setAnuncio(url) {
        this.elemento.setAttribute("src", url)
    }
    proximo() {

        lista.elemento.setAttribute("alt", lista.tempoAtual)
        lista.tempoAtual++;
        if ((lista.contador - 1) === lista.length) {
            clearInterval(lista.temporizador)
            setApi()
        } else if (noAtual.dados.tempoExibicao === lista.tempoAtual) {
            noAtual = noAtual.proximo
            lista.tempoAtual = 0
            console.log(noAtual.dados)
            lista.setAnuncio(noAtual.dados.url)
            lista.contador++;
        }


    }

}
let lista = new ListaEncadeada();
let noAtual = new Node()
function setApi() {
    fetch("/list_anuncios")
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            lista.limpar()
            for (key in data) {
                if (data[key].ativo != 0) {
                    lista.adicionar(data[key])
                }
            }
            if (lista.length > 0) {
                console.log("atualizado")
                noAtual = lista.cabeca
                lista.setAnuncio(noAtual.dados.url)
                console.log(lista)
                lista.contador++
                lista.temporizador = setInterval(proximo, 1000)
            } else {
                lista.setAnuncio("")
            }

        });
}


function proximo() {

    lista.elemento.setAttribute("alt", lista.tempoAtual)
    lista.tempoAtual++;
    if ((lista.contador - 1) === lista.length) {
        clearInterval(lista.temporizador)
        setApi()
    } else if (noAtual.dados.tempoExibicao === lista.tempoAtual) {
        noAtual = noAtual.proximo
        lista.tempoAtual = 0
        console.log(noAtual.dados)
        lista.setAnuncio(noAtual.dados.url)
        lista.contador++;
    }


}

setApi()
