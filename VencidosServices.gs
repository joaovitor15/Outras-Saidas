// Arquivo: VencidosServices.gs (versão final e corrigida)

function registrarVencido(dados) {
  if (!dados.medicamento || !dados.quantidade) {
    throw new Error("Os campos 'Medicamento' e 'Quantidade' são obrigatórios.");
  }
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vencidos");
    const quantidade = parseFloat(dados.quantidade) || 0;
    const precoUnitarioStr = String(dados.precoUnitario || '0').replace(',', '.');
    const precoUnitario = parseFloat(precoUnitarioStr) || 0;
    const total = quantidade * precoUnitario;
    const novaLinha = [
      dados.codigo, dados.medicamento, dados.laboratorio, quantidade, dados.lote,
      dados.codigoDeBarra, dados.ms, dados.ncm, dados.cest, dados.cfop, 
      precoUnitario, total
    ];
    sheet.appendRow(novaLinha);
    return MENSAGENS.VENCIDOS.SUCESSO.REGISTRADO;
  } catch (e) {
    Logger.log("Falha ao registrar vencido: " + e.message);
    throw new Error(MENSAGENS.VENCIDOS.ERRO.FALHA_AO_REGISTRAR);
  }
}

function gerarNotaDevolucao() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vencidos");
    const todosOsDados = sheet.getDataRange().getValues();

    if (todosOsDados.length <= 1) {
      throw new Error(MENSAGENS.VENCIDOS.VALIDACAO.ITENS_NAO_ENCONTRADOS);
    }
    
    const cabecalhos = todosOsDados[0].map(h => String(h).toLowerCase().trim());
    const itensParaNota = [];

    for (let i = 1; i < todosOsDados.length; i++) {
      const rowData = todosOsDados[i];
      const item = {
        codigo: rowData[cabecalhos.indexOf('código')] || rowData[cabecalhos.indexOf('codigo')],
        medicamento: rowData[cabecalhos.indexOf('medicamento')],
        quantidade: rowData[cabecalhos.indexOf('quantidade')],
        lote: rowData[cabecalhos.indexOf('lote')],
        ncm: rowData[cabecalhos.indexOf('ncm')],
        cest: rowData[cabecalhos.indexOf('cest')],
        cfop: rowData[cabecalhos.indexOf('cfop')],
        precoUnitario: parseFloat(rowData[cabecalhos.indexOf('preço unit')] || rowData[cabecalhos.indexOf('preço unitário')] || 0)
      };
      itensParaNota.push(item);
    }

    if (itensParaNota.length === 0) {
      throw new Error(MENSAGENS.VENCIDOS.VALIDACAO.NENHUM_ITEM_VALIDO);
    }

    const doc = criarDocumentoNotaDevolucao(itensParaNota);
    const hoje = new Date();
    const dia = ('0' + hoje.getDate()).slice(-2);
    const mes = ('0' + (hoje.getMonth() + 1)).slice(-2);
    const ano = hoje.getFullYear();
    const nomeArquivo = CONFIG.DOCUMENTO.TEXTOS.VENCIDOS.nota.NOME_ARQUIVO
      .replace("{{DD}}", dia).replace("{{MM}}", mes).replace("{{YYYY}}", ano);
    
    const pdfUrl = _salvarComoPdf(doc, nomeArquivo);

    return { 
      message: MENSAGENS.VENCIDOS.SUCESSO.DOCUMENTO_GERADO(nomeArquivo, itensParaNota.length), 
      pdfUrl: pdfUrl 
    };
  } catch (e) {
    Logger.log("Erro em gerarNotaDevolucao: " + e.message + "\n" + e.stack);
    throw new Error(MENSAGENS.VENCIDOS.ERRO.FALHA_GERAR_DOCUMENTO(e.message));
  }
}

function gerarEtiquetaDescarte() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vencidos");
    const todosOsDados = sheet.getDataRange().getValues();

    if (todosOsDados.length <= 1) throw new Error(MENSAGENS.VENCIDOS.VALIDACAO.ITENS_NAO_ENCONTRADOS);
    
    const cabecalhos = todosOsDados[0].map(h => String(h).toLowerCase().trim());
    const itensParaEtiqueta = [];

    for (let i = 1; i < todosOsDados.length; i++) {
      const rowData = todosOsDados[i];
      const item = {
        medicamento: rowData[cabecalhos.indexOf('medicamento')],
        quantidade: rowData[cabecalhos.indexOf('quantidade')],
        laboratorio: rowData[cabecalhos.indexOf('laboratorio')],
        ms: rowData[cabecalhos.indexOf('ms')],
        lote: rowData[cabecalhos.indexOf('lote')],
        codigoDeBarra: rowData[cabecalhos.indexOf('codigo de barra')]
      };
      itensParaEtiqueta.push(item);
    }

    if (itensParaEtiqueta.length === 0) throw new Error(MENSAGENS.VENCIDOS.VALIDACAO.NENHUM_ITEM_VALIDO);

    const doc = criarDocumentoEtiquetaDescarte(itensParaEtiqueta);
    const hoje = new Date();
    const dia = ('0' + hoje.getDate()).slice(-2);
    const mes = ('0' + (hoje.getMonth() + 1)).slice(-2);
    const ano = hoje.getFullYear();
    const nomeArquivo = CONFIG.DOCUMENTO.TEXTOS.VENCIDOS.etiqueta.NOME_ARQUIVO
      .replace("{{DD}}", dia).replace("{{MM}}", mes).replace("{{YYYY}}", ano);
    
    const pdfUrl = _salvarComoPdf(doc, nomeArquivo);

    return { 
      message: `Etiqueta "${nomeArquivo}.pdf" gerada com sucesso!`, 
      pdfUrl: pdfUrl 
    };
  } catch (e) {
    Logger.log("Erro em gerarEtiquetaDescarte: " + e.message + "\n" + e.stack);
    throw new Error(MENSAGENS.VENCIDOS.ERRO.FALHA_GERAR_DOCUMENTO(e.message));
  }
}
function limparPlanilhaVencidos() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PLANILHA.ABAS.VENCIDOS);
    const ultimaLinha = sheet.getLastRow();

    // Se houver mais do que apenas a linha de cabeçalho
    if (ultimaLinha > 1) {
      // Apaga da linha 2 até a última linha
      sheet.deleteRows(2, ultimaLinha - 1);
    }
    
    return "A lista de vencidos foi limpa com sucesso!";
  } catch (e) {
    Logger.log("Falha ao limpar a planilha de vencidos: " + e.message);
    throw new Error("Ocorreu uma falha inesperada ao tentar limpar a lista.");
  }
}