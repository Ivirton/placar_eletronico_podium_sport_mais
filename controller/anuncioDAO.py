from controller.entidades import Anuncio
import os
class AnuncioDAO():
    def __init__(self,conexao):
        self.__nome_tabela = "anuncios"
        self.__primary_key = "nome"
        self.__conexao =  conexao
        self.criar_tabela()
    def criar_tabela(self):
        sql = f'CREATE TABLE IF NOT EXISTS {self.__nome_tabela} ({self.__primary_key} TEXT PRIMARY KEY, url TEXT, ativo BOOLEAN, tempoExibicao INTEGER)'
        self.__conexao.execultar_commit(sql)
    def adicionar_registro(self,anuncio:Anuncio):
        self.__conexao.adicionar_registro(self.__nome_tabela,anuncio.__dict__)
    def buscar_registro(self,valor = None):
        if(valor == None):
            resultado  =  self.__conexao.executar_select(f"SELECT * FROM {self.__nome_tabela}")
            return resultado
        else:
            resultado = self.__conexao.executar_select(f"SELECT * FROM {self.__nome_tabela} WHERE {self.__primary_key} = '{valor}'")
            return(resultado)
    def atualizar_registro(self,coluna,registro,idice):
        sql = f"UPDATE {self.__nome_tabela} SET {coluna}='{registro}' WHERE {self.__primary_key}='{idice}'"
        self.__conexao.execultar_commit(sql)
    def excluir_registro(self,indice ):
        sql = (f"DELETE FROM {self.__nome_tabela} WHERE {self.__primary_key}='{indice}'")
        self.__conexao.execultar_commit(sql)
    def desconectar(self):
        self.__conexao.desconectar()
    def remover_arquivo(self, nome):
            if os.path.exists("static/imagens/anuncios/"+nome):
                self.excluir_registro(nome)
                os.remove("static/imagens/anuncios/"+nome)
                print(f"Arquivo {nome} removido com sucesso.")
                
            else:
                print(f"O arquivo {nome} não existe.")
                return False
        
