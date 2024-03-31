//#region Variáveis Globais
const periodo_vencimento_inicial = document.getElementById("periodo_vencimento_inicial");
const periodo_vencimento_final = document.getElementById("periodo_vencimento_final");
const formRelatorios = document.getElementById("formRelatorios");
const divResultadoRelatorio = document.getElementById("divResultadoRelatorio");
const buttonLimparRelatorio = document.getElementById("limparRelatorio");
const tableElementRelatorio = document.getElementById("tableElementRelatorio");

//#endregion

function Onload() {
    DefinirPeriodo();
    onloadServicos();
    let servicos = document.getElementById("servicos");
    let optionTodos = document.createElement("option");
    optionTodos.value = "99000001";
    optionTodos.innerText = "Todos";
    servicos.appendChild(optionTodos);
}

function OnchangePeriodo() {
    ValidarPeriodo();
}

function GerarRelatorio() {
    var cpf_cnpj = document.getElementById("clienteCPF_CNPJ")?.value;
    var codigo_fatura = document.getElementById("codigo_fatura")?.value;
    var servico = document.getElementById("servicos").selectedOptions[0]?.value;
    var status = document.getElementById("status").selectedOptions[0];
    var ignorarVencimento = document.getElementById("ignorarVencimento")?.checked;
    var trElements = tableElementRelatorio.getElementsByTagName("tr");
    while (trElements.length > 1) {
        tableElementRelatorio.removeChild(trElements[1]);
    }
    var data = {
        servicos_id: servico,
        status: status.value != 99000001 ? status.text.toLowerCase() : status.value
    };
    if(!ignorarVencimento){
        data.periodo_vencimento_inicial = periodo_vencimento_inicial.value;
        data.periodo_vencimento_final = periodo_vencimento_final.value;
    }
    if (cpf_cnpj) {
        data.cpf_cnpj = cpf_cnpj;
    };
    if (codigo_fatura) {
        data.id = codigo_fatura;
    };
    var data = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if (this.responseText != "Nenhum conta a receber encontrada") {
                montarRelatorio(this.responseText);

            }
            else {
                divResultadoRelatorio.style.display = "none";
                alert(this.responseText);
            }
        }
    });
    xhr.open("POST", `${hostAPI}/consulta-relatorio`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.send(data);

}
//#region Auxiliares
function DefinirPeriodo() {
    let data = new Date();
    let primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1);
    let ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0);
    periodo_vencimento_inicial.value = primeiroDia.toISOString().split('T')[0];
    periodo_vencimento_final.value = ultimoDia.toISOString().split('T')[0];
}

function ValidarPeriodo() {
    if (new Date(periodo_vencimento_inicial.value) > new Date(periodo_vencimento_final.value)) {
        alert("Data inicial não pode ser maior que Data Final");
        periodo_vencimento_final.value = periodo_vencimento_inicial.value;
    }
}

async function montarRelatorio(json) {
    let somaContasAberto = 0;
    let somaContasPago = 0;
    let somaContasAtraso = 0;
    let somaContas = 0;
    divResultadoRelatorio.style.display = "flex";
    buttonLimparRelatorio.style.display = "block";
    jsonResponse = JSON.parse(json)
    //onchangeCliente(jsonResponse[0].cpf_cnpj);
    const resultadosProcessados = [];
    for (const registro of jsonResponse) {
        somaContas += Number(registro.valor);
        switch (registro.status.toLowerCase()) {
            case 'em aberto':
                somaContasAberto += Number(registro.valor);
                break;
            case 'pago':
                somaContasPago += Number(registro.valor);
                break;
            case 'em atraso':
                somaContasAtraso += Number(registro.valor);
                break;
        }
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
        tableElementRelatorio.appendChild(trElement);

    });
    const somas = [somaContasAberto, somaContasPago, somaContasAtraso, somaContas];
    const tiposContas = ["Total Em Aberto: ", "Total Pago: ", "Total Em Atraso: ", "Total Geral: "]
    for (let i = 0; i < somas.length; i++) {
        let soma = somas[i];
        var trElementResultado = document.createElement("tr");
        var thElementResultadoTexto = document.createElement("th");
        var thElementResultado = document.createElement("th");
        thElementResultadoTexto.innerText = tiposContas[i];
        thElementResultado.innerText = formatarMoeda(Number(soma).toFixed(2).toString());
        thElementResultadoTexto.colSpan = "5";
        thElementResultadoTexto.style.textAlign = "right";
        thElementResultado.colSpan = "2";
        thElementResultado.style.textAlign = "left";
        trElementResultado.appendChild(thElementResultadoTexto);
        trElementResultado.appendChild(thElementResultado);
        tableElementRelatorio.appendChild(trElementResultado);
    }
}
function AbriFecharFiltros(){
    var buttonFiltros = document.getElementById("filtros");
    if(formRelatorios.hidden == true){
        buttonFiltros.hidden = false;
    }
}
function IgnorarVencimentoOnChange(ignorarVencimento){
    if(ignorarVencimento){
        periodo_vencimento_final.readOnly = true;
        periodo_vencimento_final.style.opacity = "50%";
        periodo_vencimento_inicial.readOnly = true;
        periodo_vencimento_inicial.style.opacity = "50%";

        
    }
    else{
        periodo_vencimento_inicial.readOnly = false;
        periodo_vencimento_inicial.style.opacity = "";
        periodo_vencimento_final.readOnly = false;
        periodo_vencimento_final.style.opacity = "";
    }
}
function limparRelatorio(){
    divResultadoRelatorio.style.display = "none";
}
//#endregion
