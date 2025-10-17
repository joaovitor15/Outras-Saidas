// Arquivo: Main.gs (versão correta e limpa)

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Painel de Controle')
    .addItem('Abrir Menu Principal', 'mostrarMenuPrincipal')
    .addToUi();
}

function mostrarMenuPrincipal() {
  const template = HtmlService.createTemplateFromFile('MenuPrincipal');
  const html = template.evaluate()
      .setTitle('Painel Principal');
  SpreadsheetApp.getUi().showSidebar(html);
}

function mostrarPainelDevolucao() {
  const template = HtmlService.createTemplateFromFile('PainelDevolucao');
  const html = template.evaluate()
      .setTitle('Painel de Devolução');
  SpreadsheetApp.getUi().showSidebar(html);
}

function mostrarPainelVencido() {
  const template = HtmlService.createTemplateFromFile('PainelVencido');
  // Não injetamos mais os dados aqui. Apenas criamos e mostramos o painel.
  const html = template.evaluate()
      .setTitle('Painel de Vencidos');
  SpreadsheetApp.getUi().showSidebar(html);
}

// Função que entrega os dados de mensagens para o cliente (painel)
function getDadosParaCliente() {
  return JSON.stringify({ 
    mensagens: MENSAGENS
  });
}