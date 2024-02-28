const cep = document.getElementById('CEP');
const logradouro = document.getElementById('logradouro');
const complemento = document.getElementById('complemento');
const bairro = document.getElementById('bairro');
const localidade = document.getElementById('cidade');
const uf = document.getElementById('estado');
const pais = document.getElementById('pais');
var fantasia = document.getElementById("divfantasia");
var divResultado = document.getElementById("divResultado");
const hostAPI = "api-production-b825.up.railway.app";


function cepOnchange(){

  var cepRequest = cep.value;
  cepRequest = cepRequest.replace(/\D/g, "");
  
  if(cepRequest != null && cepRequest != ""){

    if(cepRequest.length == 8){
        var req = new XMLHttpRequest();
        req.open("GET", encodeURI("https://viacep.com.br/ws/" + cepRequest + "/json"), false);
    
        req.send(null);
        data = JSON.parse(req.responseText);
        logradouro.value = data.logradouro;
        complemento.value = data.complemento;
        bairro.value = data.bairro;
        localidade.value = data.localidade;
        uf.value = data.uf;
        pais.value = "Brasil";
        cepRequest = cepRequest.replace(/(\d{5})(\d{3})/, "$1-$2");
        cep.value = cepRequest;
    }
  }
}

function onchangeCPF_CNPJ(){
    var cpf_cnpj = document.getElementById("cpf_cnpj");
    cpf_cnpjReq = cpf_cnpj.value
    cpf_cnpjReq = cpf_cnpjReq.replace(/[^\d]/g, "");
    if(cpf_cnpjReq.length == 11){
        if(validaCPF(cpf_cnpjReq)){
            cpf_cnpjReq = cpf_cnpjReq.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            cpf_cnpj.value = cpf_cnpjReq;
            fantasia.style.display = "none";

        }
        else{
            alert("CPF inválido")
            cpf_cnpj.value = "";
            cpf_cnpj.focus();
        }
    }
    else if(cpf_cnpjReq.length == 14){
        if(validaCNPJ(cpf_cnpjReq)){
            cpf_cnpjReq = cpf_cnpjReq.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
            cpf_cnpj.value = cpf_cnpjReq;
            fantasia.style.display = "inline";
        }
        else{
            alert("CNPJ inválido")
            cpf_cnpj.focus();
        }
    }else{
        alert("CPF ou CNPJ inválido")
        cpf_cnpj.value = "";
        cpf_cnpj.focus();
    }
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

  function onchangeEmail() {
    var email = document.getElementById("email");
    var emailValida = email.value;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email.value != "")
    if(!regexEmail.test(emailValida)){
        alert("E-mail inválido");
        email.focus();
    };

  }
  document.querySelector('form').addEventListener('submit', validarFormulario);
  function validarFormulario(event) {
    event.preventDefault(); // previne o envio automático do formulário
  
    // valida os campos do formulário aqui
    // por exemplo, você pode verificar se os campos estão preenchidos corretamente, se o CPF/CNPJ é válido, etc.
  
    enviarDados(); // se o formulário estiver válido, envia os dados
  }

  function enviarDados() {
    
    // Cria um objeto com os valores do formulário
    
      var cpf_cnpj = document.getElementById("cpf_cnpj").value;
      var nome = document.getElementById("nome").value;
      var fantasia = document.getElementById("fantasia").value;
      var email = document.getElementById("email").value;
      var telefone = document.getElementById("telefone").value;
      var celular = document.getElementById("celular").value;
      var CEP = document.getElementById("CEP").value;
      var logradouro = document.getElementById("logradouro").value;
      var complemento = document.getElementById("complemento").value;
      var numero = document.getElementById("numero").value;
      var bairro = document.getElementById("bairro").value;
      var cidade = document.getElementById("cidade").value;
      var estado = document.getElementById("estado").value;
      var pais = document.getElementById("pais").value;
    
  // WARNING: For POST requests, body is set to null by browsers.
  var data = JSON.stringify({
    cpf_cnpj: cpf_cnpj,
    nome: nome,
    fantasia: fantasia,
    email: email,
    telefone: telefone,
    celular: celular,
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
  
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      console.log(this.responseText);
      alert(this.responseText);
      var elementos = document.getElementsByTagName("input");
            for (var i = 0; i < elementos.length; i++) {
                elementos[i].value = "";

            }

    }
  });
  xhr.open("POST", `${hostAPI}/inserir-dados`, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

  xhr.send(data);

  
}

function deletaCliente() {
    
  // Cria um objeto com os valores do formulário
  if(confirm("Confirma a exclusão?")){
    var cpf_cnpj = document.getElementById("rCpf_cnpj").value;
    var data = JSON.stringify({cpf_cnpj: cpf_cnpj});

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        console.log(this.responseText);
        alert(this.responseText);
        }
      });
    xhr.open("DELETE", `${hostAPI}/delete-dados`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.send(data);
    divResultado.style.display = "none";
  }
  
    

}
    
function pesquisar(){
  var pesquisar = document.getElementById("pesquisar");
  var rCpf_cnpj = document.getElementById("rCpf_cnpj");
  var rNomeRazao = document.getElementById("rNomeRazao");
  var rNomeFantasia = document.getElementById("rNomeFantasia");
  var rTelefone = document.getElementById("rTelefone");
  var rCelular = document.getElementById("rCelular");
  //var rServicos = document.getElementById("rServicos");
  var rEmail = document.getElementById("rEmail");
  var rCep = document.getElementById("rCep");
  var rLogradouro = document.getElementById("rLogradouro");
  var rComplemento = document.getElementById("rComplemento");
  var rNumero = document.getElementById("rNumero");
  var rBairro = document.getElementById("rBairro");
  var rCidade = document.getElementById("rCidade");
  var rEstado = document.getElementById("rEstado");
  var rPais = document.getElementById("rPais");
  var divfantasia = document.getElementById("divfantasia");
  divfantasia.style.display = "none";
  
  pesquisar.value = pesquisar.value.replace(/\D/g, "")
  if(pesquisar.value.length == 11){
    if(validaCPF(pesquisar.value)){
      pesquisar.value = pesquisar.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    else{
      alert("CPF inválido")
      divResultado.style.display = "none";

      return
    }
    
  }
  else if(pesquisar.value.length == 14){
    if(validaCNPJ(pesquisar.value)){
      pesquisar.value = pesquisar.value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
    else{
      alert("CNPJ inválido")
      divResultado.style.display = "none";
      return
    }
  }
  else{
    alert("Digite um CNPJ ou CPF")
    divResultado.style.display = "none";
    pesquisar.focus();
    return
  }

  var data = JSON.stringify({cpf_cnpj: pesquisar.value});
  
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
      console.log(this.responseText);
      if(this.responseText != "CPF não encontrado"){
        jsonResponse = JSON.parse(this.responseText)
        divResultado.style.display = "inline";
        rCpf_cnpj.value = jsonResponse[0].cpf_cnpj;
        rNomeRazao.value = jsonResponse[0].nome_razao_social;
        rNomeFantasia.value = jsonResponse[0].nome_fantasia;

        if (rNomeFantasia.value != "" & rNomeFantasia.value != null){
            divfantasia.style.display = "inline";
        }

        rTelefone.value = jsonResponse[0].telefone;
        rCelular.value = jsonResponse[0].celular;
        // rServicos.value = jsonResponse[0].servicos;
        rEmail.value = jsonResponse[0].email;
        rCep.value = jsonResponse[0].cep;
        rLogradouro.value = jsonResponse[0].logradouro;
        rComplemento.value = jsonResponse[0].complemento;
        rNumero.value = jsonResponse[0].numero;
        rBairro.value = jsonResponse[0].bairro;
        rCidade.value = jsonResponse[0].cidade;
        rEstado.value = jsonResponse[0].estado;
        rPais.value = jsonResponse[0].pais;

      }
      else{
        alert(this.responseText);
        divResultado.style.display = "none";

      }
    
    }
  });
  xhr.open("POST", `${hostAPI}/consulta-dados`, true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
  
  xhr.send(data);


}
  
function atualizaDados() {
    
    var cpf_cnpj = document.getElementById("rCpf_cnpj").value;
    var nome = document.getElementById("rNomeRazao").value;
    var fantasia = document.getElementById("rNomeFantasia").value;
    var email = document.getElementById("rEmail").value;
    var telefone = document.getElementById("rTelefone").value;
    var celular = document.getElementById("rCelular").value;
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

xhr.addEventListener("readystatechange", function() {
  if(this.readyState === 4) {
    console.log(this.responseText);
    var status =xhr.status;
    alert(this.responseText);

  }
});
xhr.open("POST", `${hostAPI}/atualiza-dados`, true);
xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

xhr.send(data);

}
function aumentarDiminuirFonte(){
  var zoomAtual = parseFloat(document.body.style.zoom) || 1.0;
  var table = document.getElementById("tableResultado")
  var botao = document.getElementById("aumentarDimunirFonte");

  if (botao.innerText.toLowerCase() == "aumentar fonte"){
      zoomAtual += 1;
      document.body.style.zoom = zoomAtual;
      botao.innerText = "Diminuir fonte";
      table.style.width = "100%";
  }else{
      zoomAtual -= 1;
      document.body.style.zoom = zoomAtual;
      botao.innerText = "Aumentar fonte";
      table.style.width = "50%";
  }
}

function limparClientes(){
  document.getElementById("divResultado").style.display = "none";
  document.getElementById("pesquisar").value = "";

}