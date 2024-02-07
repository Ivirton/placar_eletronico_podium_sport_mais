from controller.entidades import Cronometro
class CronometroDAO():
    def __init__(self,conexao):
        self.__nome_tabela = "cronometro"
        self.__primary_key = ""
        self.__conexao =  conexao
        self.cronometro = None
        self.criar_tabela()
    def criar_tabela(self):
        sql = f'CREATE TABLE IF NOT EXISTS {self.__nome_tabela} (minutos  INTEGER,segundos INTEGER, duracao INTEGER,icone TEXT,pause BLOB,play BLOB,reset BLOB)'
        self.__conexao.execultar_commit(sql)
    # def adicionar_registro(self,anuncio:Anuncio):
    #     self.__conexao.adicionar_registro(self.__nome_tabela,anuncio.__dict__)
    def get(self):
        row  =  self.__conexao.executar_select(f"SELECT * FROM {self.__nome_tabela}")
        self.cronometro = Cronometro(row[0][0],row[0][1],row[0][2])
        return self.cronometro.__dict__
    def update(self,cronometro:Cronometro):
        sql = f"UPDATE {self.__nome_tabela} SET minutos ='{cronometro.minutos}'"
        self.__conexao.execultar_commit(sql)
        sql = f"UPDATE {self.__nome_tabela} SET segundos ='{cronometro.segundos}'"
        self.__conexao.execultar_commit(sql)
        sql = f"UPDATE {self.__nome_tabela} SET duracao ='{cronometro.duracao}'"
        self.__conexao.execultar_commit(sql)
    # def excluir_registro(self,indice ):
    #     sql = (f"DELETE FROM {self.__nome_tabela} '")
    #     self.__conexao.execultar_commit(sql)
    def desconectar(self):
        self.__conexao.desconectar()
        
