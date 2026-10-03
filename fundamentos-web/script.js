// Referências dos elementos que já existem no HTML
const formProduto = document.querySelector("#form-produto");
const listaProdutos = document.querySelector("#lista-produtos");
const campoNome = document.querySelector("#nome");
const campoPreco = document.querySelector("#preco");
const campoQuantidade = document.querySelector("#quantidade");
const botaoForm = document.querySelector("#botao-form");
const botaoCancelar = document.querySelector("#botao-cancelar");
const mensagemErro = document.querySelector("#mensagem-erro");
const mensagemVazia = document.querySelector("#mensagem-vazia");
const contador = document.querySelector("#contador");

// Guarda o <li> que está sendo editado (null = modo "adicionar")
let itemEmEdicao = null;

// Produtos que já apareciam na lista original
const produtosIniciais = [
  { nome: "Caderno", preco: 12.5, quantidade: 30 },
  { nome: "Caneta", preco: 2, quantidade: 100 },
  { nome: "Mochila", preco: 89.9, quantidade: 8 },
  { nome: "Estojo", preco: 15, quantidade: 20 },
];

// Ícones (SVG) usados nos botões Editar e Remover
const ICONE_EDITAR =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
const ICONE_REMOVER =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';

// Monta o texto exibido, ex: "Caderno - R$ 12,50 (30 un.)"
function formatarTexto(nome, preco, quantidade) {
  const precoFormatado = Number(preco).toFixed(2).replace(".", ",");
  return `${nome} - R$ ${precoFormatado} - Quantidade: ${quantidade}`;
}

// Atualiza o contador e a mensagem de lista vazia
function atualizarResumo() {
  const total = listaProdutos.children.length;
  contador.textContent = `Produtos cadastrados: ${total}`;
  mensagemVazia.hidden = total > 0;
}

function mostrarErro(texto) {
  mensagemErro.textContent = texto;
  mensagemErro.hidden = false;
}

function limparErro() {
  mensagemErro.textContent = "";
  mensagemErro.hidden = true;
}

// Volta o formulário ao estado normal (adicionar produto)
function sairDoModoEdicao() {
  if (itemEmEdicao) {
    itemEmEdicao.classList.remove("em-edicao");
  }
  itemEmEdicao = null;
  listaProdutos.classList.remove("editando");
  botaoForm.textContent = "Adicionar produto";
  botaoCancelar.hidden = true;
  formProduto.reset();
  limparErro();
}

// Cria um <li> completo, com texto e botões Editar e Remover
function criarItem(nome, preco, quantidade) {
  const item = document.createElement("li");
  item.dataset.nome = nome;
  item.dataset.preco = preco;
  item.dataset.quantidade = quantidade;

  const texto = document.createElement("span");
  texto.className = "produto-texto";
  texto.textContent = formatarTexto(nome, preco, quantidade);

  const acoes = document.createElement("div");
  acoes.className = "acoes";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.className = "botao-editar";
  botaoEditar.innerHTML = ICONE_EDITAR;
  botaoEditar.title = "Editar";
  botaoEditar.setAttribute("aria-label", "Editar " + nome);
  botaoEditar.addEventListener("click", function () {
    // Se já havia outro item em edição, tira o destaque dele
    if (itemEmEdicao) {
      itemEmEdicao.classList.remove("em-edicao");
    }
    itemEmEdicao = item;
    item.classList.add("em-edicao");
    // Esconde os outros produtos: só o item em edição fica visível
    listaProdutos.classList.add("editando");

    // Devolve os dados do produto para o formulário
    campoNome.value = item.dataset.nome;
    campoPreco.value = item.dataset.preco;
    campoQuantidade.value = item.dataset.quantidade;

    botaoForm.textContent = "Salvar alterações";
    botaoCancelar.hidden = false;
    limparErro();
    campoNome.focus();
  });

  const botaoRemover = document.createElement("button");
  botaoRemover.type = "button";
  botaoRemover.className = "botao-remover";
  botaoRemover.innerHTML = ICONE_REMOVER;
  botaoRemover.title = "Remover";
  botaoRemover.setAttribute("aria-label", "Remover " + nome);
  botaoRemover.addEventListener("click", function () {
    // Se o item removido estava sendo editado, desfaz a edição
    if (item === itemEmEdicao) {
      sairDoModoEdicao();
    }
    item.remove();
    atualizarResumo();
  });

  acoes.appendChild(botaoEditar);
  acoes.appendChild(botaoRemover);
  item.appendChild(texto);
  item.appendChild(acoes);

  return item;
}

// Escuta o envio do formulário (serve para adicionar e para salvar edição)
formProduto.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nome = campoNome.value.trim();
  const preco = campoPreco.value;
  // Number() remove zeros à esquerda: "007" vira 7
  const quantidade = String(Number(campoQuantidade.value));

  if (nome === "") {
    mostrarErro("Informe o nome do produto.");
    return;
  }

  // Bônus 3: quantidade precisa ser maior que zero
  if (Number(quantidade) <= 0) {
    mostrarErro("A quantidade deve ser maior que zero.");
    return;
  }

  limparErro();

  if (itemEmEdicao) {
    // Atualiza o item existente, sem criar outro
    itemEmEdicao.dataset.nome = nome;
    itemEmEdicao.dataset.preco = preco;
    itemEmEdicao.dataset.quantidade = quantidade;
    itemEmEdicao.querySelector(".produto-texto").textContent = formatarTexto(nome, preco, quantidade);
    sairDoModoEdicao();
  } else {
    listaProdutos.appendChild(criarItem(nome, preco, quantidade));
    formProduto.reset();
    atualizarResumo();
  }
});

botaoCancelar.addEventListener("click", sairDoModoEdicao);

// Carrega os produtos iniciais e atualiza contador/mensagem
produtosIniciais.forEach(function (p) {
  listaProdutos.appendChild(criarItem(p.nome, p.preco, p.quantidade));
});
atualizarResumo();
