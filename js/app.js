class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validarDados() {
    for (const prop in this) {
      if (
        this[prop] === undefined ||
        this[prop] === '' ||
        this[prop] === null
      ) {
        return false;
      }
    }

    return true;
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem('id');

    if (id === null) {
      localStorage.setItem('id', 0);
    }
  }

  getProximoId = () => {
    let proximoId = localStorage.getItem('id') || 0;
    return parseInt(proximoId) + 1;
  };

  gravar = (d) => {
    let id = this.getProximoId();

    localStorage.setItem(id, JSON.stringify(d));
    localStorage.setItem('id', id);
  };

  recuperarTodosRegistros = () => {
    let id = localStorage.getItem('id') || 0;

    let despesas = Array.from({ length: id }, (_, i) => {
      let despesa = JSON.parse(localStorage.getItem(i + 1));
      if (despesa) {
        despesa.id = i + 1;
      }
      return despesa;
    }).filter(Boolean);

    return despesas;
  };

  pesquisar = (despesa = {}) => {
    let despesasFiltradas = this.recuperarTodosRegistros();

    despesasFiltradas = despesasFiltradas.filter((d) => {
      return Object.entries(despesa).every(([key, value]) => {
        return !value || d[key] == value;
      });
    });

    return despesasFiltradas;
  };

  remover = (id) => {
    localStorage.removeItem(id);
  };
}

let bd = new Bd();

function cadastrarDespesa() {
  const ano = document.getElementById('ano').value;
  const mes = document.getElementById('mes').value;
  const dia = document.getElementById('dia').value;
  const tipo = document.getElementById('tipo').value;
  const descricao = document.getElementById('descricao').value;
  const valor = document.getElementById('valor').value;

  const despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

  if (despesa.validarDados()) {
    bd.gravar(despesa);

    exibirDialogoDeSucesso(
      'Registro inserido com sucesso',
      'Despesa foi cadastrada com sucesso!',
      limparCamposDoFormulario
    );
  } else {
    exibirDialogoDeErro(
      'Erro na inclusão do registro',
      'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!',
      voltarECorrigir
    );
  }
}

function exibirDialogoDeSucesso(titulo, mensagem, acaoBotao) {
  document.getElementById('modal_titulo').innerHTML = titulo;
  document.getElementById('modal_titulo_div').className =
    'modal-header text-success';
  document.getElementById('modal_conteudo').innerHTML = mensagem;
  document.getElementById('modal_btn').innerHTML = 'Voltar';
  document.getElementById('modal_btn').className = 'btn btn-success';

  // dialog de sucesso
  $('#modalRegistraDespesa').modal('show');

  acaoBotao();
}

function exibirDialogoDeErro(titulo, mensagem, acaoBotao) {
  document.getElementById('modal_titulo').innerHTML = titulo;
  document.getElementById('modal_titulo_div').className =
    'modal-header text-danger';
  document.getElementById('modal_conteudo').innerHTML = mensagem;
  document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir';
  document.getElementById('modal_btn').className = 'btn btn-danger';

  // dialog de erro
  $('#modalRegistraDespesa').modal('show');

  acaoBotao();
}

function limparCamposDoFormulario() {
  document.getElementById('ano').value = '';
  document.getElementById('mes').value = '';
  document.getElementById('dia').value = '';
  document.getElementById('tipo').value = '';
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
}

function voltarECorrigir() {
  // dialog de erro
  $('#modalRegistraDespesa').modal('show');
}

function carregaListaDespesas(despesas = [], filtro = false) {
  if (!filtro && despesas.length === 0) {
    despesas = bd.recuperarTodosRegistros();
  }

  const listaDespesas = document.getElementById('listaDespesas');
  listaDespesas.innerHTML = '';

  const tiposDeDespesa = {
    1: 'Alimentação',
    2: 'Educação',
    3: 'Lazer',
    4: 'Saúde',
    5: 'Transporte',
  };

  despesas.forEach((d) => {
    const linha = listaDespesas.insertRow();

    linha.innerHTML = `
      <td>${d.dia}/${d.mes}/${d.ano}</td>
      <td>${tiposDeDespesa[d.tipo]}</td>
      <td>${d.descricao}</td>
      <td>${d.valor}</td>
      <td><button class="btn btn-danger" data-id="${
        d.id
      }"><i class="fas fa-times"></i></button></td>
    `;
  });

  listaDespesas.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      const id = event.target.dataset.id;
      removerDespesa(id);
    }
  });
}

function removerDespesa(id) {
  if (isNaN(id) || id === '') {
    alert('ID inválido!');
    return;
  }

  if (confirm('Deseja realmente excluir esta despesa?')) {
    bd.remover(id);
    window.location.reload();
  }
}

function pesquisarDespesa() {
  const ano = document.getElementById('ano').value;
  const mes = document.getElementById('mes').value;
  const dia = document.getElementById('dia').value;
  const tipo = document.getElementById('tipo').value;
  const descricao = document.getElementById('descricao').value;
  const valor = document.getElementById('valor').value;

  const despesas = bd.pesquisar({ ano, mes, dia, tipo, descricao, valor });

  this.carregaListaDespesas(despesas, true);
}
