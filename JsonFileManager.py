import json

class JsonFileManager:
    def __init__(self, nome_arquivo):
        self.nome_arquivo = nome_arquivo

    def escrever_json(self, dados):
        with open(self.nome_arquivo, 'w') as arquivo:
            json.dump(dados, arquivo, indent=4)

    def ler_json(self):
        try:
            with open(self.nome_arquivo, 'r') as arquivo:
                dados = json.load(arquivo)
            return dados
        except FileNotFoundError:
            print(f"O arquivo {self.nome_arquivo} não foi encontrado.")
            return None
