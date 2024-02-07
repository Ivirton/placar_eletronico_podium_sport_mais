class Anuncio():
	def __init__(self,nome,url,ativo,tempoExibicao):
		self.nome = nome
		self.url = url
		self.ativo = ativo
		self.tempoExibicao = tempoExibicao
class Time:
    def __init__(self,nome,pontos):
        self.nome = nome
        self.pontos = pontos
class Placar():
    def __init__(self,time1:Time,time2:Time,informacao,status):
        self.time1 = time1
        self.time2 = time2
        self.informacao = informacao
        self.status = status
class Competicao:
    def __init__(self,tipo):
        pass
class Relogio:
    def __init__(self,minutos,segundos,duracao):
        self.minutos = minutos
        self.segundos = segundos
        self.duracao = duracao
class Cronometro:
    def __init__(self,minutos,segundos,duracao):
        self.minutos = minutos
        self.segundos = segundos
        self.duracao = duracao
    def get(self):
        return self.__dict__
       