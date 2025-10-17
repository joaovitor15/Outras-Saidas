// Arquivo: DocumentBuilder_Etiqueta.gs (versão final com todas as melhorias)

function criarDocumentoEtiquetaDescarte(itensParaEtiqueta) {
  const tempName = "temp_etiqueta_descarte_" + Date.now();
  const doc = DocumentApp.create(tempName);
  const body = doc.getBody();

  const textos = CONFIG.DOCUMENTO.TEXTOS;
  const textosEtiqueta = textos.VENCIDOS.etiqueta;
  const estilos = CONFIG.DOCUMENTO.ESTILOS;

  _formatarCorpoDocumento(body);

  // 1. Cabeçalho (REMOVIDO, conforme solicitado)
  // _adicionarCabecalhoPadrao(body, estilos);
  
  // 2. Título e Descrição
  body.appendParagraph(textosEtiqueta.tituloPrincipal).setAttributes(_criarEstiloAtributos(estilos.titulo));
  body.appendParagraph(textosEtiqueta.descricao1).setAttributes(_criarEstiloAtributos(estilos.textoNormal));
  body.appendParagraph(textosEtiqueta.descricao2).setAttributes(_criarEstiloAtributos(estilos.textoNormal));
  body.appendParagraph("\n");

  // 3. Tabela de Medicamentos
  const tableData = [textosEtiqueta.TABELA_CABECALHO];
  itensParaEtiqueta.forEach(item => {
    tableData.push([
      item.medicamento, 
      String(item.quantidade || ''), 
      item.laboratorio, 
      formatarMS(item.ms), // APLICA A FORMATAÇÃO DO MS AQUI
      String(item.lote || ''), 
      String(item.codigoDeBarra || '')
    ]);
  });
  
  const table = body.appendTable(tableData);

  // Lógica para aplicar as larguras definidas no Config.gs
  const larguras = textosEtiqueta.TABELA_LARGURAS;
  if (larguras) {
    for (const indice in larguras) {
      table.setColumnWidth(parseInt(indice), larguras[indice]);
    }
  }

  // Aplica estilos de fonte para cabeçalho e corpo
  table.getRow(0).setAttributes(_criarEstiloAtributos(estilos.tabelaCabecalho));
  for (let i = 1; i < table.getNumRows(); i++) {
    table.getRow(i).setAttributes(_criarEstiloAtributos(estilos.tabelaCorpo));
  }
  
  // 4. Assinatura
  body.appendParagraph("\n\n\n");
  body.appendParagraph("________________________").setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph(textosEtiqueta.assinaturaNome).setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph(textosEtiqueta.assinaturaCrf).setAlignment(DocumentApp.HorizontalAlignment.CENTER);

  doc.saveAndClose();
  return doc;
}