from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import OrderedDict
import mysql.connector

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "headers":"*"}}, supports_credentials=True)
@app.route("/inserir-dados", methods=["POST"])
def inserir_dados():
    data = request.get_json(force=True)
    cpf_cnpj = data["cpf_cnpj"]
    nome_razao_social = data["nome"]
    nome_fantasia = data.get("fantasia", "")
    email = data.get("email", "")
    telefone = data.get("telefone", "")
    celular = data.get("celular", "")
    servicos = data.get("servicos", "")
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
    sql = "INSERT INTO clientes (cpf_cnpj, nome_razao_social, nome_fantasia, email, telefone, celular, servicos, cep, logradouro, complemento, numero, bairro, cidade, estado, pais) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

    # Define os valores para os campos da tabela
    valores = (cpf_cnpj, nome_razao_social, nome_fantasia, email, telefone, celular, servicos, cep, logradouro, complemento, numero, bairro, cidade, estado, pais)

    try:
        # Executa a consulta SQL
        cursor.execute(sql, valores)

        # Salva as alterações no banco de dados
        conexao.commit()

        return "Cliente cadastrado com sucesso"

    except Exception as e:
        return "CPF já cadastrado" + f"Erro ao inserir dados: {str(e)}"
        #return f"Erro ao inserir dados: {str(e)}"

    finally:
        # Fecha a conexão com o banco de dados
        conexao.close()

@app.route("/delete-dados", methods=["DELETE"])
def delete_dados():
    data = request.get_json(force=True)
    cpf_cnpj = data["cpf_cnpj"]
    
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
    sql = "DELETE FROM clientes WHERE cpf_cnpj = %s"

    # Define os valores para os campos da tabela
    valores = (cpf_cnpj,)

    try:
        # Executa a consulta SQL
        cursor.execute(sql, valores)

        if cursor.rowcount == 0:
            return "CPF não encontrado"
        
        else:
        # Salva as alterações no banco de dados
            conexao.commit()
            return "Cliente excluído com sucesso"

    except Exception as e:
        return f"Erro ao deletar dados: {str(e)}"

    finally:
        # Fecha a conexão com o banco de dados
        conexao.close()

@app.route("/consulta-dados", methods=["POST"])
def consulta_dados():
    data = request.get_json(force=True)
    cpf_cnpj = data["cpf_cnpj"]
    
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
    sql = "SELECT * FROM clientes WHERE cpf_cnpj = %s"

    # Define os valores para os campos da tabela
    valores = (cpf_cnpj,)

    try:
        # Executa a consulta SQL
        cursor.execute(sql, valores)
        
        # Obtém todas as linhas da consulta
        resultados = cursor.fetchall()

        if resultados:
            # Obtém as informações das colunas selecionadas na consulta
            colunas = [col[0] for col in cursor.description]

            # Cria uma lista de dicionários com os resultados da consulta
            dados = [dict(zip(colunas, linha)) for linha in resultados]

            # Retorna os resultados da consulta em formato JSON
            return jsonify(dados)
        else:
            return "CPF não encontrado"

    except Exception as e:
        return "CPF não encontrado"
        #return f"Erro ao inserir dados: {str(e)}"

    finally:
        # Fecha a conexão com o banco de dados
        conexao.close()
@app.route("/atualiza-dados", methods=["POST"])
def atualiza_dados():
    data = request.get_json(force=True)
    cpf_cnpj = data["cpf_cnpj"]
    nome_razao_social = data["nome"]
    nome_fantasia = data.get("fantasia", "")
    email = data.get("email", "")
    telefone = data.get("telefone", "")
    celular = data.get("celular", "")
    servicos = data.get("servicos", "")
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
    sql = "UPDATE clientes SET nome_razao_social=%s, nome_fantasia=%s, email=%s, telefone=%s, celular=%s, servicos=%s, cep=%s, logradouro=%s, complemento=%s, numero=%s, bairro=%s, cidade=%s, estado=%s, pais=%s WHERE cpf_cnpj=%s"

    # Define os valores para os campos da tabela
    valores = (nome_razao_social, nome_fantasia, email, telefone, celular, servicos, cep, logradouro, complemento, numero, bairro, cidade, estado, pais, cpf_cnpj)

    try:
        # Executa a consulta SQL
        cursor.execute(sql, valores)

        # Salva as alterações no banco de dados
        conexao.commit()

        return "Cliente atualizado com sucesso"

    except Exception as e:
        return f"Erro ao atualizar dados: {str(e)}"

    finally:
        # Fecha a conexão com o banco de dados
        conexao.close()

#Contas a Receber
@app.route("/consulta-nome", methods=["POST"])
def consulta_nome():
    data = request.get_json(force=True)
    cpf_cnpj = data["cpf_cnpj"]
    
    conexao = mysql.connector.connect(
        host="localhost",
        user="wesley",
        password="waa123",
        database="banco_smart_monkey"
    )

    cursor = conexao.cursor()
    sql = "SELECT nome_razao_social FROM clientes WHERE cpf_cnpj = %s"
    valores = (cpf_cnpj,)

    try:
        # Executa a consulta SQL
        cursor.execute(sql, valores)
        
        # Obtém todas as linhas da consulta
        resultados = cursor.fetchall()

        if resultados:
            # Obtém as informações das colunas selecionadas na consulta
            colunas = [col[0] for col in cursor.description]

            # Cria uma lista de dicionários com os resultados da consulta
            dados = [dict(zip(colunas, linha)) for linha in resultados]

            # Retorna os resultados da consulta em formato JSON
            return jsonify(dados)
        else:
            return "CPF não encontrado"

    except Exception as e:
        return "CPF não encontrado"
        #return f"Erro ao inserir dados: {str(e)}"

    finally:
        # Fecha a conexão com o banco de dados
        conexao.close()

@app.route("/consulta-servicos", methods=["POST"])
def consulta_servico():
    conexao = mysql.connector.connect(
        host="localhost",
        user="wesley",
        password="waa123",
        database="banco_smart_monkey"
    )
    # Cria um cursor para executar comandos SQL
    cursor = conexao.cursor()

    # Define a consulta SQL para inserir dados na tabela "clientes"
    sql = "SELECT * FROM servicos"

    try:
        # Executa a consulta SQL
        if request.get_data():
            data = request.get_json(force=True)
            servico = data["servico"]
            sql += " WHERE id = %s"
            valores = (servico,)
            cursor.execute(sql, valores)
        else:
            cursor.execute(sql)

        resultados = cursor.fetchall()

        if resultados:
            colunas = [col[0] for col in cursor.description]
            dados = [dict(zip(colunas, linha)) for linha in resultados]

            return jsonify(dados)
        else:
            return "Nenhum serviço cadastrado"

    except Exception as e:
        #return "CPF não encontrado"
        return f"Erro ao consultar dados: {str(e)}"

    finally:
        conexao.close()

@app.route("/inserir-servicos", methods=["POST"])
def inserir_servicos():
    data = request.get_json(force=True)
    servico = data["servico"]

    conexao = mysql.connector.connect(
        host="localhost",
        user="wesley",
        password="waa123",
        database="banco_smart_monkey"
    )

    cursor = conexao.cursor()
    consulta = "SELECT servico from servicos WHERE servico = %s"

    sql = "INSERT INTO servicos (servico) VALUES (%s)"
    valores = (servico,)

    cursor.execute(consulta, valores)
    resultados = cursor.fetchall()
    if resultados:
        return "Serviço com mesmo nome já cadastrado"
    
    try:
        cursor.execute(sql, valores)
        conexao.commit()

        return "Serviço cadastrado com sucesso"

    except Exception as e:
        return "Serviço" + f"Erro ao inserir dados: {str(e)}"
        #return f"Erro ao inserir dados: {str(e)}"

    finally:
        # Fecha a conexão com o banco de dados
        conexao.close()

@app.route("/inserir-receber", methods=["POST"])
def inserir_contas_receber():
    data = request.get_json(force=True)
    cpf_cnpj = data["cpf_cnpj"]
    valor = data["valor"]
    data_emissao = data.get("data_emissao")
    data_vencimento = data.get("data_vencimento")
    servicos_id = data.get("servico")

    conexao = mysql.connector.connect(
        host="localhost",
        user="wesley",
        password="waa123",
        database="banco_smart_monkey"
    )
    cursor = conexao.cursor()
    sql = "INSERT INTO contas_receber (cpf_cnpj, valor, data_emissao, data_vencimento, servicos_id) VALUES (%s, %s, %s, %s, %s)"
    valores = (cpf_cnpj, valor, data_emissao, data_vencimento, servicos_id)

    try:
        cursor.execute(sql, valores)
        conexao.commit()

        return "Conta cadastrada com sucesso"

    except Exception as e:
        return "" + f"Erro ao inserir dados: {str(e)}"
        #return f"Erro ao inserir dados: {str(e)}"

    finally:
        conexao.close()
@app.route("/consulta-receber", methods=["POST"])
def consulta_receber():
    data = request.get_json(force=True)
    
    conexao = mysql.connector.connect(
        host="localhost",
        user="wesley",
        password="waa123",
        database="banco_smart_monkey"
    )

    cursor = conexao.cursor()
    

    try:
        if data.get("cpf_cnpj") is not None:
            cpf_cnpj = data["cpf_cnpj"]
            sql = "SELECT * FROM contas_receber WHERE cpf_cnpj = %s ORDER BY id"
            valores = (cpf_cnpj,)
            cursor.execute(sql, valores)

        elif data.get("id") is not None:
            id = data["id"]
            sql = "SELECT * FROM contas_receber WHERE id = %s"
            valores = (id,)
            cursor.execute(sql, valores)

        else:
            sql = "SELECT * FROM contas_receber ORDER BY id"
            cursor.execute(sql)

        resultados = cursor.fetchall()

        if resultados:
            colunas = [col[0] for col in cursor.description]
            dados = [dict(zip(colunas, linha)) for linha in resultados]
            return jsonify(dados)
        else:
            return "Nenhum conta a receber encontrada"

    except Exception as e:
        #return "CPF não encontrado"
        return f"Erro ao consultar dados: {str(e)}"

    finally:
        # Fecha a conexão com o banco de dados
        conexao.close()

@app.route("/atualiza-receber", methods=["POST"])
def atualiza_receber():
    data = request.get_json(force=True)
    cpf_cnpj = data["cpf_cnpj"]
    valor = data["valor"]
    data_emissao = data["data_emissao"]
    data_vencimento = data["data_vencimento"]
    servico = data["servico"]
    status = data["status"]    
    id = data["id"]
    sql = "UPDATE contas_receber set cpf_cnpj = %s, valor = %s, data_emissao = %s, data_vencimento = %s, servicos_id = %s, status = %s WHERE id = %s"
    valores = (cpf_cnpj, valor, data_emissao, data_vencimento, servico, status, id)

    conexao = mysql.connector.connect(
        host="localhost",
        user="wesley",
        password="waa123",
        database="banco_smart_monkey"
    )

    cursor = conexao.cursor()
    

    try:
    
        cursor.execute(sql, valores)
        conexao.commit()
        return "Conta atualizada com sucesso"

    except Exception as e:
        return f"Erro ao atualizar dados: {str(e)}"

    finally:
        conexao.close()

@app.route("/delete-conta", methods=["DELETE"])
def delete_conta():
    data = request.get_json(force=True)
    id = data["id"]
    conexao = mysql.connector.connect(
        host="localhost",
        user="wesley",
        password="waa123",
        database="banco_smart_monkey"
    )
    cursor = conexao.cursor()

    sql = "DELETE FROM contas_receber WHERE id = %s"
    valores = (id,)

    try:
        cursor.execute(sql, valores)
        conexao.commit()
        return "Conta excluído com sucesso"
    

    except Exception as e:
        return f"Erro ao deletar dados: {str(e)}"

    finally:
        conexao.close()

if __name__ == "__main__":
    app.run(debug=True)