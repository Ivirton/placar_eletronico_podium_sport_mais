import sqlite3
from settings import Settings
class Conexao:
    def __init__(self):
        self.__database = Settings.diretorio_database
        self.__conn = None
    def __conectar(self):
        try:
            self.__conn = sqlite3.connect(self.__database)
            return self.__conn
        except sqlite3.Error as e:
            print("Erro ao conectar no database",e)
            return None
    def desconectar(self):
        if self.__conn: 
            self.__conn.close()
    def adicionar_registro(self, nome_tabela, valores:dict):
        try:
            self.__conectar()
            cur = self.__conn.cursor()
            colunas = ', '.join(valores.keys())
            placeholders = ', '.join(['?' for _ in valores.values()])
            sql_criar_registro = f"INSERT OR IGNORE INTO {nome_tabela} ({colunas}) VALUES ({placeholders})"
            cur.execute(sql_criar_registro, tuple(valores.values()))
            self.__conn.commit()
        except sqlite3.Error as e:
            print(e)
        finally:
            
            self.desconectar()
    def execultar_commit(self,sql):
        try:
            self.__conectar()
            cur = self.__conn.cursor()
            cur.execute(sql)
            self.__conn.commit()
        except sqlite3.Error as e:
            print(e)
        finally:
            self.desconectar()
    def executar_select(self, sql_comandline):
        try:
            self.__conectar()
            cursor = self.__conn.cursor()
            cursor.execute(sql_comandline)
            return cursor.fetchall()
        except sqlite3.Error as e:
            print("Erro ao executar a consulta:", e)
            return None
        finally:
            self.desconectar()