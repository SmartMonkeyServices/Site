import mysql.connector

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
valores = ("12345678900", "Exemplo LTDA", "Exemplo", "exemplo@exemplo.com", "99999999", "999999999", "12345678", "Rua Exemplo", "Apt. 123", "123", "Exemplo", "São Paulo", "SP", "Brasil")

# Executa a consulta SQL
try:
    # Executa a consulta SQL
    cursor.execute(sql, valores)

    # Salva as alterações no banco de dados
    conexao.commit()

    print("Dados inseridos com sucesso!")

except Exception as e:
    print("Erro ao inserir dados:", e)

finally:
    # Fecha a conexão com o banco de dados
    conexao.close()