let campoNome = document.querySelector('#nome');
let campoEmail = document.querySelector('#email');
let botao = document.querySelector('button');
let lista = document.querySelector('ul');

function apagarItem(){
    let texto = this.previousElementSibling.innerHTML;
    let nome = texto.split("-")[0];

    fetch(`http://localhost:3000/email/${nome.trim()}`, {
        method: 'DELETE'
    }).then(() => {
        carregar();
    })
}

function montarTela(cadastro){
    let entrada = document.createElement('li');
    let texto = document.createElement('span');
    texto.innerHTML = `${cadastro.nome} - ${cadastro.email}`;
    let botao = document.createElement('button');
    botao.innerHTML = "Apagar";
    botao.addEventListener('click', apagarItem);
    
    entrada.appendChild(texto);
    entrada.appendChild(botao);
    lista.appendChild(entrada);
}

botao.addEventListener('click', () => {
    let cadastro = {
        nome: campoNome.value,
        email: campoEmail.value
    }
    
    campoNome.value = '';
    campoEmail.value = '';
    
    fetch('http://localhost:3000/email/cadastrar', {
    method: 'POST',
    body: JSON.stringify(cadastro),
    headers: {
        'Content-type': 'application/json'
    }
}).then(() => {
    carregar();
});
});

function carregar(){
    fetch('http://localhost:3000/emails').then(resposta => {
    return resposta.json();
}).then(cadastros => {
    lista.innerHTML = '';
    for(let cadastro of cadastros){
        montarTela(cadastro);
    }
});
}

carregar();
