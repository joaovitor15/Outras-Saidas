// Arquivo: DocumentBuilder_NFD.gs (com o cabeçalho já removido)

/**
 * Cria o documento da Nota de Devolução com base nos itens selecionados.
 * @param {Array<Object>} itensSelecionados - Os dados dos itens vencidos.
 * @returns {DocumentApp.Document} O objeto do documento criado.
 */
/**
 * Cria o documento da Nota de Devolução com base nos itens selecionados.
 * @param {Array<Object>} itensSelecionados - Os dados dos itens vencidos.
 * @returns {DocumentApp.Document} O objeto do documento criado.
 */
function criarDocumentoNotaDevolucao(itensSelecionados) {
  const tempName = "temp_nota_devolucao_" + Date.now();
  const doc = DocumentApp.create(tempName);
  const body = doc.getBody();

  const textos = CONFIG.DOCUMENTO.TEXTOS;
  const textosNota = textos.VENCIDOS.nota;
  const estilos = CONFIG.DOCUMENTO.ESTILOS;

  _formatarCorpoDocumento(body);

  // _adicionarCabecalhoPadrao(body, estilos); // Continua desativado

  body.appendParagraph(textosNota.tituloPrincipal).setAttributes(_criarEstiloAtributos(estilos.titulo));
  body.appendParagraph(textosNota.descricao).setAttributes(_criarEstiloAtributos(estilos.textoNormal));
  body.appendParagraph("\n");

  const tableData = [textosNota.TABELA_CABECALHO];
  
  itensSelecionados.forEach(item => {
    const pf = item.precoUnitario || 0;
    const total = (item.quantidade || 0) * pf;
    tableData.push([
      String(item.codigo || ''), item.medicamento, String(item.quantidade || ''),
      String(item.lote || ''), String(item.ncm || ''), String(item.cest || ''),
      String(item.cfop || ''), `R$ ${pf.toFixed(2).replace('.', ',')}`, 
      `R$ ${total.toFixed(2).replace('.', ',')}`
    ]);
  });
  
  const table = body.appendTable(tableData);

  // --- ALTERAÇÃO AQUI: Lógica para aplicar as larguras do Config.gs ---
  const larguras = textosNota.TABELA_LARGURAS;
  if (larguras) {
    // Percorre cada definição de largura no objeto de configuração
    for (const indice in larguras) {
      // 'indice' é a chave (ex: "1"), 'larguras[indice]' é o valor (ex: 120)
      table.setColumnWidth(parseInt(indice), larguras[indice]);
    }
  }
  // ----------------------------------------------------------------------

  const estiloCabecalho = _criarEstiloAtributos(estilos.tabelaCabecalho);
  table.getRow(0).setAttributes(estiloCabecalho);

  const estiloCorpo = _criarEstiloAtributos(estilos.tabelaCorpo);
  for (let i = 1; i < table.getNumRows(); i++) {
    table.getRow(i).setAttributes(estiloCorpo);
  }

  body.appendParagraph("\n");

  // O restante do código continua igual
  body.appendParagraph(textosNota.destinatarioTitulo).setAttributes(_criarEstiloAtributos(estilos.textoNegrito));
  body.appendParagraph(textosNota.destinatarioRazao).setAttributes(_criarEstiloAtributos(estilos.textoNormal));
  body.appendParagraph(textosNota.destinatarioCnpj).setAttributes(_criarEstiloAtributos(estilos.textoNormal));
  body.appendParagraph(textosNota.destinatarioEndereco).setAttributes(_criarEstiloAtributos(estilos.textoNormal));
  body.appendParagraph(textosNota.destinatarioCidade).setAttributes(_criarEstiloAtributos(estilos.textoNormal));
  body.appendParagraph(textosNota.destinatarioCep).setAttributes(_criarEstiloAtributos(estilos.textoNormal));

  doc.saveAndClose();
  return doc;
}
// --- FUNÇÕES AUXILIARES (LENDO DO CONFIG) ---

function _salvarComoPdf(doc, nomeArquivo) {
  const pasta = DriveApp.getFolderById(CONFIG.DRIVE.ID_DA_PASTA_IMPRESSOS);
  const pdf = pasta.createFile(doc.getAs('application/pdf')).setName(nomeArquivo + ".pdf");
  const pdfUrl = pdf.getUrl();
  try { DriveApp.getFileById(doc.getId()).setTrashed(true); } 
  catch (e) { Logger.log("Aviso: Falha ao remover documento temporário. Erro: " + e.message); }
  return pdfUrl;
}

function _formatarCorpoDocumento(body) {
  const margens = CONFIG.DOCUMENTO.MARGENS;
  body.setMarginTop(margens.superior).setMarginBottom(margens.inferior)
      .setMarginLeft(margens.esquerda).setMarginRight(margens.direita);
}

function _criarEstiloAtributos(cfg) {
  let atr = {};
  if (cfg.fonte) atr[DocumentApp.Attribute.FONT_FAMILY] = cfg.fonte;
  if (cfg.tamanho) atr[DocumentApp.Attribute.FONT_SIZE] = cfg.tamanho;
  if (cfg.negrito !== undefined) atr[DocumentApp.Attribute.BOLD] = cfg.negrito;
  if (cfg.alinhamento) atr[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = cfg.alinhamento;
  return atr;
}

function _adicionarCabecalhoPadrao(body, estilos) {
  const estab = CONFIG.DOCUMENTO.TEXTOS.estabelecimento;
  body.appendParagraph(estab.nome).setAttributes(_criarEstiloAtributos(estilos.subtitulo));
  body.appendParagraph(`${estab.razaoSocial} | ${estab.cnpj}`).setAttributes(_criarEstiloAtributos(estilos.textoNormal));
  body.appendParagraph("\n");
}