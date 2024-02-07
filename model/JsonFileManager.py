import json
import os
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
    def remover_arquivo(self, caminho_arquivo):
        try:
            # Verifica se o arquivo existe antes de tentar removê-lo
            if os.path.exists(caminho_arquivo):
                os.remove(caminho_arquivo)
                print(f"Arquivo {caminho_arquivo} removido com sucesso.")
            else:
                print(f"O arquivo {caminho_arquivo} não existe.")
        except Exception as e:
            print(f"Erro ao remover o arquivo {caminho_arquivo}: {str(e)}")
