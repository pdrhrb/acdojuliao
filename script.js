// ===== Dados =====
const produtos = [
    { id: 1, nome: 'Pão de fermentação natural', cat: 'paes', preco: 22 },
    { id: 2, nome: 'Baguete', cat: 'paes', preco: 9 },
    { id: 3, nome: 'Croissant', cat: 'doces', preco: 12 },
    { id: 4, nome: 'Rolinho de canela', cat: 'doces', preco: 11 },
    { id: 5, nome: 'Café coado', cat: 'cafes', preco: 7 }
];
let carrinho = [];
let categoria = 'todos';

// ===== Seletores =====
const grade = document.querySelector('#grade');
const busca = document.querySelector('#busca');
const lista = document.querySelector('#lista');

// ===== Mostra os produtos na tela (innerHTML) =====
for (const p of produtos) {
    grade.innerHTML += `
    <div class="produto" data-cat="${p.cat}" data-nome="${p.nome.toLowerCase()}">
      <h3>${p.nome}</h3>
      <p>R$ ${p.preco},00</p>
      <button data-id="${p.id}">Adicionar</button>
    </div>`;
}

// ===== EVENTO 1 (click): filtrar por categoria =====
document.querySelectorAll('.filtros button').forEach(botao => {
    botao.addEventListener('click', () => {
        document.querySelectorAll('.filtros button').forEach(b => b.classList.remove('ativo'));
        botao.classList.add('ativo');          // classList: marca o botão ativo
        categoria = botao.dataset.cat;
        filtrar();
    });
});

// ===== EVENTO 2 (input): buscar enquanto digita =====
busca.addEventListener('input', filtrar);

function filtrar() {
    const termo = busca.value.toLowerCase();
    document.querySelectorAll('.produto').forEach(card => {
        const certaCat = categoria === 'todos' || card.dataset.cat === categoria;
        const certoNome = card.dataset.nome.includes(termo);
        card.classList.toggle('oculto', !(certaCat && certoNome));
    });
}

// ===== EVENTO 3 (click): adicionar ao carrinho =====
grade.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') return;
    const produto = produtos.find(p => p.id == e.target.dataset.id);
    carrinho.push(produto);
    mostrarCarrinho();
});

// ===== Atualiza o carrinho (cria elementos) =====
function mostrarCarrinho() {
    lista.innerHTML = '';
    let total = 0;
    carrinho.forEach((item, posicao) => {
        const li = document.createElement('li');            // cria elemento
        li.textContent = `${item.nome} – R$ ${item.preco},00 `;
        const remover = document.createElement('button');
        remover.textContent = '✕';
        // EVENTO 4 (click): remover item
        remover.addEventListener('click', () => {
            carrinho.splice(posicao, 1);                      // remove do array
            mostrarCarrinho();
        });
        li.appendChild(remover);                            // adiciona na lista
        lista.appendChild(li);
        total += item.preco;
    });
    document.querySelector('#total').textContent = `R$ ${total},00`;  // modifica texto
}

// ===== EVENTO 5 (click): menu mobile =====
document.querySelector('#menuBtn').addEventListener('click', () => {
    document.querySelector('#menu').classList.toggle('aberto');
});

// ===== Validação do formulário =====
const regras = {
    nome: v => v.trim().length >= 3 ? '' : 'Digite pelo menos 3 letras.',
    email: v => v.includes('@') && v.includes('.') ? '' : 'Digite um e-mail válido.',
    turno: v => v ? '' : 'Escolha um turno.'
};

function validar(id) {
    const campo = document.querySelector('#' + id);
    const msg = regras[id](campo.value);
    document.querySelector('#erro-' + id).textContent = msg;
    campo.classList.toggle('invalido', msg !== '');
    campo.classList.toggle('valido', msg === '');
    return msg === '';
}

// EVENTO 6 (blur) e EVENTO 7 (change): validar ao sair do campo
for (const id in regras) {
    document.querySelector('#' + id).addEventListener('blur', () => validar(id));
    document.querySelector('#' + id).addEventListener('change', () => validar(id));
}

// EVENTO 8 (submit): validar tudo ao enviar
document.querySelector('#form').addEventListener('submit', e => {
    e.preventDefault();
    const nomeOk = validar('nome');
    const emailOk = validar('email');
    const turnoOk = validar('turno');
    if (nomeOk && emailOk && turnoOk) {
        document.querySelector('#sucesso').textContent = 'Encomenda enviada! Obrigado!';
        e.target.reset();
    }
});