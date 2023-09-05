function formatarMoeda(valor) {
    if (valor == null) {
        var input = document.getElementById("valor");
        var valor = input.value;
    }

    valor = valor.replace(/\D/g, '');
    valor = parseFloat(valor) / 100.0;
    valor = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (input != null) {
        input.value = valor;
    }
    else {
        return valor;
    }
}

function formatarTextoUpper(string) {
    const palavras = string.split(" ");
    for (var i = 0; i < palavras.length; i++) {
        palavras[i] = palavras[i][0].toUpperCase() + palavras[i].substr(1);
    }
    return palavras.join(" ");

}

function abrirFecharAba() {
    var aba = document.getElementById("aba");
    if (aba.style.display == "none" || aba.style.display == "") {
        aba.style.display = "block";
    }
    else {
        aba.style.display = "none";
    }
}

function limparContas() {
    document.getElementById("limparContas").style.display = "none";
    document.getElementById("resultadoConta").style.display = "none";
}
function onloadData() {
    const data = new Date();
    const fusoHorario = data.getTimezoneOffset() / 60; // Obtém o deslocamento de tempo em horas
    data.setHours(data.getHours() - fusoHorario); // Ajusta para o fuso horário local
    const dataFormatada = data.toISOString().split('T')[0];
    document.getElementById("data_emissao").value = dataFormatada;

}

function formataData(data) {
    data = new Date(data);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const dataFormatada = `${dia}/${mes}/${ano}`;
    return dataFormatada
}


function validaCPF(cpf) {
    var rep = 0;
    for (var g = 1; g > 11; g++) {
        if (cpf[0] == cpf[g])
            rep++
    }
    if (rep == 10) {
        return false
    }
    var mult = 11
    var soma1Digito = 0
    var soma2Digito = 0
    for (var i = 0; i < 10; i++) {
        if (i < 9) {
            soma1Digito += cpf[i] * (mult - 1)
        }
        soma2Digito += cpf[i] * mult
        mult--
    }
    var resto = (soma1Digito * 10) % 11
    var resto2 = (soma2Digito * 10) % 11
    if (resto == 10) {
        resto = 0
    }
    if (resto == cpf[9] && resto2 == cpf[10]) {
        return true
    }
    else {
        return false
    }
}

function validaCNPJ(cnpj) {

    if (cnpj.length !== 14) {
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 12; i++) {
        soma += parseInt(cnpj.charAt(i)) * (i < 4 ? 5 - i : 13 - i);
    }
    let digito1 = (11 - soma % 11) % 10;

    soma = 0;
    for (let i = 0; i < 13; i++) {
        soma += parseInt(cnpj.charAt(i)) * (i < 5 ? 6 - i : 14 - i);
    }
    let digito2 = (11 - soma % 11) % 10;

    return (parseInt(cnpj.charAt(12)) === digito1 && parseInt(cnpj.charAt(13)) === digito2);
}

function onloadServicos() {
    var selectElement = document.getElementById("servicos");
    while (selectElement.options.length > 0) {
        selectElement.remove(0);
    }
    // var data = JSON.stringify({cpf_cnpj: pesquisar.value});

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            if (this.responseText != "Nenhum serviço cadastrado") {
                jsonResponse = JSON.parse(this.responseText)
                jsonResponse.forEach(function (opcao) {
                    var optionElement = document.createElement("option");
                    optionElement.value = opcao.id;
                    optionElement.textContent = opcao.id + " - " + opcao.servico;
                    selectElement.appendChild(optionElement);
                });

            }
            else {
                alert(this.responseText);
            }

        }
    });
    xhr.open("POST", "http://127.0.0.1:5000/consulta-servicos", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.send();


}

async function onchangeCliente(validacao) {
    var pesquisar;
    var pesquisarElement;
    var nomeCliente = document.getElementById("nomeCliente");
    nomeCliente.innerText = "Cliente: ";
    if (validacao != null) {
        if (typeof validacao.value != "undefined") {
            pesquisarElement = validacao;
            pesquisar = pesquisarElement.value;
        }
        else {
            pesquisar = validacao;
        }
    } else {
        pesquisarElement = document.getElementById("clienteCPF_CNPJ");
        pesquisar = pesquisarElement.value;

    }

    pesquisar = pesquisar.replace(/\D/g, "")
    if (pesquisar.length == 11) {
        if (validaCPF(pesquisar)) {
            pesquisar = pesquisar.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            retornoNome = await pesquisarNomePorCPF_CNPJ(pesquisar);
            if (validacao == null) {
                nomeCliente.value = retornoNome;
            }
            else {
                nomeCliente.innerText += retornoNome;
            }
        }
        else {
            alert("CPF inválido")
            nomeCliente.value = "";
            pesquisarElement.focus();
            return
        }

    }
    else if (pesquisar.length == 14) {
        if (validaCNPJ(pesquisar)) {
            pesquisar = pesquisar.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
            retornoNome = await pesquisarNomePorCPF_CNPJ(pesquisar);
            if (validacao == null) {
                nomeCliente.value = retornoNome;
            }
            else {
                nomeCliente.innerText += retornoNome;
            }
        }
        else {
            nomeCliente.value = "";
            alert("CNPJ inválido")
            pesquisarElement.focus();
            return
        }
    }
    else {
        alert("Digite um CNPJ ou CPF")
        nomeCliente.value = "";
        pesquisarElement.focus();
        return
    }
    return { sucess: true, pesquisar: pesquisar }

}

function pesquisarNomePorCPF_CNPJ(cpf_cnpj) {
    return new Promise(function (resolve, reject) {
        var data = JSON.stringify({ cpf_cnpj: cpf_cnpj });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                if (this.responseText != "CPF não encontrado") {
                    jsonResponse2 = JSON.parse(this.responseText)
                    resolve(jsonResponse2[0].nome_razao_social);


                }
                else {

                    alert(this.responseText);
                }

            }
        });
        xhr.open("POST", "http://127.0.0.1:5000/consulta-nome", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

        xhr.send(data);
    });

}

function salvarServico() {

    // Cria um objeto com os valores do formulário

    var novoServico = document.getElementById("novoServico").value;

    // WARNING: For POST requests, body is set to null by browsers.
    var data = JSON.stringify({
        servico: novoServico,
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            alert(this.responseText);
            onloadServicos();

        }
    });
    xhr.open("POST", "http://127.0.0.1:5000/inserir-servicos", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.send(data);
    abrirFecharAba();


}

function consultaServico(id) {
    return new Promise(function (resolve, reject) {
        var data = JSON.stringify({
            servico: id,
        });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.log(this.responseText);
                    var jsonResponse = JSON.parse(this.responseText);
                    var servico = jsonResponse[0].servico;
                    resolve(servico);
                } else {
                    reject(new Error("Falha na solicitação: " + this.statusText));
                }
            }
        });

        xhr.open("POST", "http://127.0.0.1:5000/consulta-servicos", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

        xhr.send(data);
    });
}
async function consultaAsyncServico(id) {
    try {
        const servico = await consultaServico(id);
        console.log("Serviço retornado:", servico);
        return servico;
    } catch (error) {
        console.error("Erro na consulta:", error);
    }
}

function deletaCliente() {

    // Cria um objeto com os valores do formulário
    if (confirm("Confirma a exclusão?")) {
        var cpf_cnpj = document.getElementById("rCpf_cnpj").value;
        var data = JSON.stringify({ cpf_cnpj: cpf_cnpj });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                alert(this.responseText);
            }
        });
        xhr.open("DELETE", "http://127.0.0.1:5000/delete-dados", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

        xhr.send(data);
        divResultado.style.display = "none";
    }



}



function atualizaDados() {

    var cpf_cnpj = document.getElementById("rCpf_cnpj").value;
    var nome = document.getElementById("rNomeRazao").value;
    var fantasia = document.getElementById("rNomeFantasia").value;
    var email = document.getElementById("rEmail").value;
    var telefone = document.getElementById("rTelefone").value;
    var celular = document.getElementById("rCelular").value;
    var servicos = document.getElementById("rServicos").value;
    var CEP = document.getElementById("rCep").value;
    var logradouro = document.getElementById("rLogradouro").value;
    var complemento = document.getElementById("rComplemento").value;
    var numero = document.getElementById("rNumero").value;
    var bairro = document.getElementById("rBairro").value;
    var cidade = document.getElementById("rCidade").value;
    var estado = document.getElementById("rEstado").value;
    var pais = document.getElementById("rPais").value;

    var data = JSON.stringify({
        cpf_cnpj: cpf_cnpj,
        nome: nome,
        fantasia: fantasia,
        email: email,
        telefone: telefone,
        celular: celular,
        servicos: servicos,
        CEP: CEP,
        logradouro: logradouro,
        complemento: complemento,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        pais: pais
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            var status = xhr.status;
            alert(this.responseText);

        }
    });
    xhr.open("POST", "http://127.0.0.1:5000/atualiza-dados", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.send(data);

}



document.querySelector('form').addEventListener('submit', validarFormulario);
function validarFormulario(event) {
    var input = document.getElementById("valor");
    if (input.value == "R$ 0,00") {
        alert("Insira um valor válido")
        input.setFocus();
    }
    event.preventDefault();
    // previne o envio automático do formulário

    // valida os campos do formulário aqui
    // por exemplo, você pode verificar se os campos estão preenchidos corretamente, se o CPF/CNPJ é válido, etc.

    inserirConta(); // se o formulário estiver válido, envia os dados
}

function inserirConta() {
    var cpf_cnpj = document.getElementById("clienteCPF_CNPJ").value;
    var valor = document.getElementById("valor").value.replace("R$ ", "").replace(".", "").replace(",", ".").replace(" ", "");
    var data_emissao = document.getElementById("data_emissao").value;
    var data_vencimento = document.getElementById("data_vencimento").value;
    var servico = document.getElementById("servicos").selectedOptions[0].value;

    var data = JSON.stringify({
        cpf_cnpj: cpf_cnpj,
        valor: valor,
        data_emissao: data_emissao,
        data_vencimento: data_vencimento,
        servico: servico
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            alert(this.responseText);
            var elementos = document.getElementsByTagName("input");
            for (var i = 0; i < elementos.length; i++) {
                elementos[i].value = "";

            }
            onloadData();

        }
    });
    xhr.open("POST", "http://127.0.0.1:5000/inserir-receber", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.send(data);
}

async function pesquisarConta() {
    var pesquisar = document.getElementById("pesquisarConta");
    var tableElement = document.getElementById("tableResultado");
    var divResultadoConta = document.getElementById("resultadoConta");
    divResultadoConta.style.display = "none";
    var trElements = tableElement.getElementsByTagName("tr");
    var limparBotao = document.getElementById("limparContas");
    limparBotao.style.display = "none";
    while (trElements.length > 2) {
        tableElement.removeChild(trElements[2]);
    }
    pesquisar.value = pesquisar.value.replace(/\D/g, "")
    if (pesquisar.value == null || pesquisar.value == "") {
        alert("Insira algum termo para pesquisa")
        return
    }
    if (pesquisar.value.length == 11 || pesquisar.value.length == 14) {
        var validaCliente = await onchangeCliente(pesquisar);
        if (validaCliente.sucess == true) {
            var data = JSON.stringify({ cpf_cnpj: validaCliente.pesquisar });
        }

    }
    else {
        var data = JSON.stringify({ id: pesquisar.value });
    }



    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            if (this.responseText != "Nenhum conta a receber encontrada") {
                divResultadoConta.style.display = "flex";
                limparBotao.style.display = "block";
                jsonResponse = JSON.parse(this.responseText)
                onchangeCliente(jsonResponse[0].cpf_cnpj);
                jsonResponse.forEach(async function (registro) {
                    registro = {
                        "id": registro.id,
                        "cpf_cnpj": registro.cpf_cnpj,
                        "data_emissao": formataData(registro.data_emissao),
                        "data_vencimento": formataData(registro.data_vencimento),
                        "servicos_contratados": await consultaAsyncServico(registro.servicos_id),
                        "valor": formatarMoeda(registro.valor),
                        "status": formatarTextoUpper(registro.status)
                    }
                    var trElement = document.createElement("tr");
                    for (var propriedade in registro) {
                        if (registro.hasOwnProperty(propriedade)) {
                            var tdElement = document.createElement("td");
                            if (propriedade == "id") {
                                tdElement.onclick = ""
                            }
                            tdElement.innerText = registro[propriedade];
                            trElement.appendChild(tdElement);
                        }
                    }
                    tableElement.appendChild(trElement);
                    //tableElement.className ="table";

                });




            }
            else {
                divResultadoConta.style.display = "none";
                alert(this.responseText);
            }

        }
    });
    xhr.open("POST", "http://127.0.0.1:5000/consulta-receber", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.send(data);


}

function pesquisarContaPorID(id) {
    return new Promise(function (resolve, reject) {
    var data = JSON.stringify({ id: pesquisar.value });
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            if (this.responseText != "Nenhum conta a receber encontrada") {
                jsonResponse = JSON.parse(this.responseText)
                resolve(jsonResponse[0]);
            }
            else {
                alert(this.responseText);
            }

        }
    });
    xhr.open("POST", "http://127.0.0.1:5000/consulta-receber", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.send(data);

    });
}

async function editarConta(id) {
    window.open("cadastroConta.html", '_blank');
    var conta = await pesquisarContaPorID(id);
    var cpf_cnpj = document.getElementById("clienteCPF_CNPJ").value;
    var valor = document.getElementById("valor").value.replace("R$ ", "").replace(".", "").replace(",", ".").replace(" ", "");
    var data_emissao = document.getElementById("data_emissao").value;
    var data_vencimento = document.getElementById("data_vencimento").value;
    var servico = document.getElementById("servicos").selectedOptions[0].value;
    
}