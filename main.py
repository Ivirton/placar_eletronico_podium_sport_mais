from flask import Flask, request, jsonify,render_template
from flask_socketio import SocketIO, emit
import os
from flask_wtf import FlaskForm
from wtforms import FileField, SubmitField
from werkzeug.utils import secure_filename
from wtforms.validators import InputRequired
import json
from JsonFileManager import JsonFileManager
from conexao import Conexao
from controller.anuncioDAO import AnuncioDAO,Anuncio
from controller.cronometroDAO import CronometroDAO,Cronometro

con = Conexao()
anuncio_manager = AnuncioDAO(con)
cronometro_manager = CronometroDAO(con)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecretkey'
socketio = SocketIO(app)
json_manager = JsonFileManager('model/data.json')
@app.route('/imagens')
def imagens():
    linhas =  anuncio_manager.buscar_registro()
    json_anuncios = {}
    for linha in linhas:
        anuncio = Anuncio(linha[0],linha[1],linha[2],linha[3])
        json_anuncios[anuncio.nome] = anuncio.__dict__

    return render_template('imagens.html',anuncios=json_anuncios)

@app.route('/')
def index():
    dados = json_manager.ler_json()
    return render_template('index.html',dados=dados)

@app.route('/placar_futebol')
def placar():
    dados = json_manager.ler_json()
    return render_template('placar_futebol.html',dados=dados)
	
@socketio.on('message')
def handle_message(message):
    json_manager.escrever_json(json.loads(message))
    emit('message', message, broadcast=True)

##carregarimagem
app.config['UPLOAD_FOLDER'] = 'static/imagens/anuncios'
class UploadFileForm(FlaskForm):
    file = FileField("File", validators=[InputRequired()])
    submit = SubmitField("Upload File")
@app.route('/upload', methods=['GET',"POST"])
@app.route('/upload', methods=['GET',"POST"])
def home():
    form = UploadFileForm()    
    if form.validate_on_submit():
        tempoExibicao = request.form.get('tempoExibicao')   
        ativo = request.form.get('ativo')   
        if(ativo == "on"):
            ativo = True
        else : 
            ativo = False
        file = form.file.data 
        anuncio = Anuncio(file.filename,f"static/imagens/anuncios/{file.filename}",bool(int(ativo)),int(tempoExibicao))
        anuncio_manager.adicionar_registro(anuncio)
        print(file.filename)
        file.save(os.path.join(os.path.abspath(os.path.dirname(__file__)),app.config['UPLOAD_FOLDER'],secure_filename(file.filename))) # Then save the file

    # Obtém a lista de arquivos já enviados
    uploaded_files = os.listdir(app.config['UPLOAD_FOLDER'])
    linhas =  anuncio_manager.buscar_registro()
    json_anuncios = []
    for linha in linhas:
        anuncio = Anuncio(linha[0],linha[1],int(linha[2]),linha[3])
        json_anuncios.append(anuncio)
    return render_template('upload.html', form=form,anuncios=json_anuncios)
##
@app.route('/remove', methods=['GET'])
def remove_file():
    nome = request.args.get('nome')
    print(nome)
    if nome:
       anuncio_manager.remover_arquivo(nome)
@app.route('/database', methods=['GET'])
def get_data():
    dados = json_manager.ler_json()
    return jsonify(dados)
@app.route('/add_anuncio', methods=['GET'])
def add_anuncio():
    nome = request.args.get('nome')
    url = request.args.get('url')
    ativo = request.args.get('ativo')
    tempoExibicao = request.args.get('tempoExibicao')
    print(request)
    #add_anuncio?nome=MeuAnuncio&url=anuncio.jpg&ativo=1&tempoExibicao=10
    if nome and url and ativo is not None and tempoExibicao:
        try:
            anuncio = Anuncio(nome,f"static/imagens/anuncios/{url}",bool(int(ativo)),int(tempoExibicao))
            anuncio_manager.adicionar_registro(anuncio)
            return 'Anúncio adicionado com sucesso', 201
        except ValueError:
            anuncio_manager.excluir_registro()
            return 'Valores inválidos', 400
    else:
        return 'Requisição inválida', 400
@app.route('/list_anuncios', methods=['GET'])
def list_anuncios():
    linhas =  anuncio_manager.buscar_registro()
    json_anuncios = {}
    for linha in linhas:
        anuncio = Anuncio(linha[0],linha[1],linha[2],linha[3])
        json_anuncios[anuncio.nome] = anuncio.__dict__
    return jsonify(json_anuncios)

@app.route('/cronometro', methods=['GET'])
def cronometro():
		# /cronometro?minutos=6&segundos=2&duracao=7
		minutos = request.args.get('minutos')
		segundos = request.args.get('segundos')
		duracao = request.args.get('duracao')

		if minutos and segundos and duracao:
			
				cronometro_manager.update(Cronometro(minutos, segundos, duracao))

		dados = cronometro_manager.get()
		return jsonify(dados)
@app.route('/update_ativo', methods=['GET'])
def update_ativo():
    nomeAnuncio = request.args.get('nomeAnuncio')
    ativo = request.args.get('ativo')

    if nomeAnuncio and ativo is not None:
        try:
            #update_ativo?ativo=1&nomeAnuncio=ivirton
            anuncio_manager.atualizar_registro("ativo",int(ativo),nomeAnuncio)
            return 'Estado do anúncio atualizado com sucesso', 200
        except ValueError:
            return 'Valores inválidos', 400
    else:
        return 'Requisição inválida', 400

app.run(host='0.0.0.0', port=80)

