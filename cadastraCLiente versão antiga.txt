from flask import Flask, request
import mysql.connector
import json

app = Flask(__name__)

@app.route("/inserir-dados", methods=["POST", "OPTIONS"])
def inserir_dados():
    # Obtém os dados do JSON enviado pelo JavaScript
    data = json.loads(request.data)
    cpf_cnpj = data["cpf_cnpj"]
    nome_razao_social = data["nome"]
    nome_fantasia = data.get("fantasia", "")
    email = data.get("email", "")
    telefone = data.get("telefone", "")
    celular = data.get("celular", "")
    cep = data["CEP"]
    logradouro = data["logradouro"]
    complemento = data.get("complemento", "")
    numero = data["numero"]
    bairro = data["bairro"]
    cidade = data["cidade"]
    estado = data["estado"]
    pais = data["pais"]

    # Conecta ao banco de dados
    conexao = mysql.connector.connect(
        host="localhost",
        user="wesley",
        password="waa123",
        database="banco_smart_monkey"
    )

    # Cria um cursor para executar comandos SQL
    cursor = conexao.cursor()

    # Define a consulta SQL para inserir dados na tabela "clientes"
    sql = "INSERT INTO clientes (cpf_cnpj, nome_razao_social, nome_fantasia, email, telefone, celular, cep, logradouro, complemento, numero, bairro, cidade, estado, pais) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

    # Define os valores para os campos da tabela
    valores = (cpf_cnpj, nome_razao_social, nome_fantasia, email, telefone, celular, cep, logradouro, complemento, numero, bairro, cidade, estado, pais)

    try:
        # Executa a consulta SQL
        cursor.execute(sql, valores)

        # Salva as alterações no banco de dados
        conexao.commit()

        return "Dados inseridos com sucesso!"

    except Exception as e:
        return f"Erro ao inserir dados: {str(e)}"

    finally:
        # Fecha a conexão com o banco de dados
        conexao.close()

if __name__ == "__main__":
    app.run()
