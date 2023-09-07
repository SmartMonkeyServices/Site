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
    return true;
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

function formataDataISO(data) {
    const dataFormatada = new Date(data);
    return dataFormatada.toISOString().split('T')[0];

}

function formataData(data) {
    data = new Date(data+"-0000");
    data.setUTCHours(0, 0, 0, 0);
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    const ano = data.getUTCFullYear();
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
            pesquisarElement.value = pesquisar;
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
            pesquisar = pesquisar.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
            retornoNome = await pesquisarNomePorCPF_CNPJ(pesquisar);
            if (validacao == null) {
                nomeCliente.value = retornoNome;
            }
            else {
                nomeCliente.innerText += retornoNome;
            }
            pesquisarElement.value = pesquisar;
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

var botaoClicado = null;

function setBotaoClicado(botao) {
    botaoClicado = botao;
}

document.querySelector('form').addEventListener('submit', validarFormulario);
function validarFormulario(event) {
    var input = document.getElementById("valor");
    if (input.value == "R$ 0,00") {
        alert("Insira um valor válido")
        input.setFocus();
    }
    event.preventDefault(); // previne o envio automático do formulário
    if (botaoClicado === "confirmar") {
        inserirConta();
    } else {
        attConta();
    }

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
    if (pesquisar.value != "%%%") {
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
    }else {
        var data = JSON.stringify({ all: "*" });
    }

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", async function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            if (this.responseText != "Nenhum conta a receber encontrada") {
                divResultadoConta.style.display = "flex";
                limparBotao.style.display = "block";
                jsonResponse = JSON.parse(this.responseText)
                onchangeCliente(jsonResponse[0].cpf_cnpj);

                async function processaRegistro(registro) {
                    return {
                        "id": registro.id,
                        "cpf_cnpj": registro.cpf_cnpj,
                        "data_emissao": formataData(registro.data_emissao),
                        "data_vencimento": formataData(registro.data_vencimento),
                        "servicos_contratados": await consultaAsyncServico(registro.servicos_id),
                        "valor": formatarMoeda(registro.valor),
                        "status": formatarTextoUpper(registro.status)
                    };
                }
                const resultadosProcessados = [];
                for (const registro of jsonResponse) {
                    const registroProcessado = await processaRegistro(registro);
                    resultadosProcessados.push(registroProcessado);
                }
                resultadosProcessados.sort(function (a, b) {
                    return a.id - b.id;
                });
                resultadosProcessados.forEach(function (registro) {
                    var trElement = document.createElement("tr");
                    for (var propriedade in registro) {
                        if (registro.hasOwnProperty(propriedade)) {
                            var tdElement = document.createElement("td");
                            if (propriedade == "id") {
                                tdElement.classList.add("tdElement");
                                tdElement.addEventListener("click", function () {
                                    editarConta(this.innerText);
                                });
                            }
                            tdElement.innerText = registro[propriedade];
                            trElement.appendChild(tdElement);
                        }
                    }
                    tableElement.appendChild(trElement);
                });
            } else {
                divResultadoConta.style.display = "none";
                alert(this.responseText);
            }
        }
    });
    xhr.open("POST", "http://127.0.0.1:5000/consulta-receber", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.send(data);
    if (pesquisar.value == "%%%"){
        document.getElementById("nomeCliente").style.display = "none";
    }
    else{
       document.getElementById("nomeCliente").style.display = "table-cell";
    }

}

function pesquisarContaPorID(id) {
    return new Promise(function (resolve, reject) {
        var data = JSON.stringify({ id: id });
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

function attConta() {
    var cpf_cnpj = document.getElementById("clienteCPF_CNPJ").value;
    var valor = document.getElementById("valor").value.replace("R$ ", "").replace(".", "").replace(",", ".").replace(" ", "");
    var data_emissao = document.getElementById("data_emissao").value;
    var data_vencimento = document.getElementById("data_vencimento").value;
    var servico = parseInt(document.getElementById("servicos").selectedOptions[0].value);
    var idElement = parseInt(document.getElementById("idElement").innerText);
    var status = document.getElementById("status").selectedOptions[0].text.toLowerCase();



    var data = JSON.stringify({
        cpf_cnpj: cpf_cnpj,
        valor: valor,
        data_emissao: data_emissao,
        data_vencimento: data_vencimento,
        servico: servico,
        id: idElement,
        status: status
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            alert(this.responseText);
            window.close();

        }
    });
    xhr.open("POST", "http://127.0.0.1:5000/atualiza-receber", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.send(data);
}

function editarConta(id) {
    var novaJanela = window.open("cadastroConta.html", '_blank');
    novaJanela.addEventListener('load', async function () {
        //Botões
        var conta = await pesquisarContaPorID(parseInt(id));
        var botaoVoltar = novaJanela.document.getElementById("voltaPaginaInicial");
        var botaoCofirmar = novaJanela.document.getElementById("confirmar");
        var botaoCancelar = novaJanela.document.getElementById("cancelar");
        var botaoExcluir = novaJanela.document.getElementById("excluir");
        var botaoAlterar = novaJanela.document.getElementById("alterar");

        botaoAlterar.style.display = "block";
        botaoExcluir.style.display = "block";
        botaoCancelar.style.display = "block";
        botaoCofirmar.style.display = "none";
        botaoVoltar.style.display = "none";

        //Elementos
        var divId = novaJanela.document.getElementById("divId");
        var idElement = novaJanela.document.getElementById("idElement");
        var cpf_cnpj = novaJanela.document.getElementById("clienteCPF_CNPJ");
        var nomeCliente = novaJanela.document.getElementById("nomeCliente");
        var data_emissao = novaJanela.document.getElementById("data_emissao");
        var data_vencimento = novaJanela.document.getElementById("data_vencimento");
        var valor = novaJanela.document.getElementById("valor");
        var servico = novaJanela.document.getElementById("servicos");
        var statusDiv = novaJanela.document.getElementById("statusDiv");
        var status = novaJanela.document.getElementById("status");

        divId.style.display = "block";
        statusDiv.style.display = "block";
        idElement.innerText = id;
        cpf_cnpj.value = conta.cpf_cnpj;
        nomeCliente.value = await pesquisarNomePorCPF_CNPJ(conta.cpf_cnpj);
        valor.value = formatarMoeda(conta.valor);
        data_emissao.value = formataDataISO(conta.data_emissao);
        data_vencimento.value = formataDataISO(conta.data_vencimento);
        servico.selectedIndex = conta.servicos_id - 1;
        switch (conta.status) {
            case "em aberto":
                status.selectedIndex = 0;
                break;
            case "pago":
                status.selectedIndex = 1;
                break;
            case "em atraso":
                status.selectedIndex = 2;
                break;
        }
    })
    novaJanela.addEventListener('beforeunload', function(){
        pesquisarConta();
    })
}


function deletaConta() {
    if (confirm("Confirma a exclusão?")) {
        var id = parseInt(document.getElementById("idElement").innerText);
        var data = JSON.stringify({ id: id });

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.log(this.responseText);
                alert(this.responseText);
                cancelaEdicao();
            }
        });
        xhr.open("DELETE", "http://127.0.0.1:5000/delete-conta", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

        xhr.send(data);
        

    }
}

function cancelaEdicao() {
    window.close();
}

