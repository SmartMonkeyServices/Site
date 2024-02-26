//#region Variáveis Globais
const periodo_vencimento_inicial = document.getElementById("periodo_vencimento_inicial");
const periodo_vencimento_final = document.getElementById("periodo_vencimento_final");
//#endregion

function Onload(){
    DefinirPeriodo();
    onloadServicos();
    let servicos = document.getElementById("servicos");
    let optionTodos = document.createElement("option");
    optionTodos.value = "99000001";
    optionTodos.innerText = "Todos";
    servicos.appendChild(optionTodos);
}

function OnchangePeriodo(){
    ValidarPeriodo();
}

function GerarRelatorio(){
    var cpf_cnpj = document.getElementById("clienteCPF_CNPJ")?.value;
    var codigo_fatura = document.getElementById("codigo_fatura")?.value;
    var servico = document.getElementById("servicos").selectedOptions[0]?.value;
    var status = document.getElementById("status").selectedOptions[0]?.value;

    var data = {
        periodo_vencimento_inicial: periodo_vencimento_inicial.value,
        periodo_vencimento_final: periodo_vencimento_final.value,
        servico: servico,
        status: status
    };
    if(cpf_cnpj){
        data.cpf_cnpj = cpf_cnpj;
    };
    if(codigo_fatura){
        data.codigo_fatura = codigo_fatura;
    };
    var data = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            
        }
    });
    xhr.open("POST", `${hostAPI}/consulta-relatorio`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.send(data);

}
//#region Auxiliares
function DefinirPeriodo(){
    let data = new Date();
    let primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1);
    let ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0);
    periodo_vencimento_inicial.value = primeiroDia.toISOString().split('T')[0];
    periodo_vencimento_final.value = ultimoDia.toISOString().split('T')[0];
}

function ValidarPeriodo(){
    if(new Date(periodo_vencimento_inicial.value) > new Date(periodo_vencimento_final.value)){
        alert("Data inicial não pode ser maior que Data Final");
        periodo_vencimento_final.value = periodo_vencimento_inicial.value;
    }
}
//#endregion
