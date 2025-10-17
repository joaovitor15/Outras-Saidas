// Arquivo: SheetsServices.gs (versão com leitura de dados otimizada)

/**
 * OTIMIZAÇÃO: Busca todos os dados necessários para o painel de uma só vez,
 * lendo a planilha de Devoluções apenas uma vez.
 */
function getDadosIniciaisPainelDevolucao() {
  const listas = getListasParaFormulario();

  const sheetDevolucoes = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PLANILHA.ABAS.DEVOLUCOES);
  const lastRow = sheetDevolucoes.getLastRow();

  const pendentes = [];
  const aguardandoColeta = [];
  const aguardandoCredito = [];

  if (lastRow >= 2) {
    const dataRange = sheetDevolucoes.getRange("A2:J" + lastRow).getValues();

    dataRange.forEach((row, index) => {
      const status = row[9]; // Coluna J: Status
      const dev = {
        linha: index + 2,
        texto: `${row[2]} - ${row[3]}` // Coluna C: Distribuidora, Coluna D: Produto
      };

      switch (status) {
        case 'Solicitando NF dev':
          pendentes.push(dev);
          break;
        case 'Aguardando Coleta':
          aguardandoColeta.push(dev);
          break;
        case 'Aguardando Crédito':
          aguardandoCredito.push(dev);
          break;
      }
    });
  }

  return {
    listas: listas,
    pendentes: pendentes,
    coleta: aguardandoColeta,
    credito: aguardandoCredito
  };
}


function getListasParaFormulario() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PLANILHA.ABAS.LISTAS);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return { distribuidores: [], motivos: [] };

    const distribuidores = sheet.getRange("A2:A" + lastRow).getValues().flat().filter(String);
    const motivos = sheet.getRange("B2:B" + lastRow).getValues().flat().filter(String);

    return { distribuidores: distribuidores, motivos: motivos };
  } catch (e) {
    throw new Error(MENSAGENS.GERAL.ERRO_LEITURA_DADOS);
  }
}

function registrarNovaDevolucao(dadosFormulario) {
  if (!dadosFormulario.distribuidora || !dadosFormulario.produto || !dadosFormulario.motivo) {
    throw new Error(MENSAGENS.DEVOLUCAO.VALIDACAO.CAMPOS_OBRIGATORIOS_REGISTRO);
  }
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PLANILHA.ABAS.DEVOLUCOES);
    const novaLinha = [
      new Date(), '', dadosFormulario.distribuidora, dadosFormulario.produto, dadosFormulario.motivo,
      dadosFormulario.protocolo, dadosFormulario.notaFiscal, '', '', 'Solicitando NF dev'
    ];
    sheet.appendRow(novaLinha);
    return MENSAGENS.DEVOLUCAO.SUCESSO.REGISTRADA;
  } catch (e) {
    throw new Error(MENSAGENS.DEVOLUCAO.ERRO.FALHA_AO_REGISTRAR);
  }
}

function adicionarDadosFiscais(dados) {
  if (!dados.linha || !dados.notaFiscalDev || !dados.valor) {
    throw new Error(MENSAGENS.DEVOLUCAO.VALIDACAO.CAMPOS_OBRIGATORIOS_FISCAL);
  }
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PLANILHA.ABAS.DEVOLUCOES);
    sheet.getRange(dados.linha, 8, 1, 3).setValues([[dados.notaFiscalDev, dados.valor, 'Aguardando Coleta']]);
    return MENSAGENS.DEVOLUCAO.SUCESSO.DADOS_FISCAIS_ADICIONADOS;
  } catch (e) {
    throw new Error(MENSAGENS.DEVOLUCAO.ERRO.FALHA_AO_ATUALIZAR);
  }
}

function registrarColeta(linha) {
  if (!linha) {
    throw new Error(MENSAGENS.DEVOLUCAO.VALIDACAO.SELECIONE_DEVOLUCAO);
  }
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PLANILHA.ABAS.DEVOLUCOES);
    sheet.getRange(linha, 2).setValue(new Date());
    sheet.getRange(linha, 10).setValue('Aguardando Crédito');
    return MENSAGENS.DEVOLUCAO.SUCESSO.COLETA_REGISTRADA;
  } catch (e) {
    throw new Error(MENSAGENS.DEVOLUCAO.ERRO.FALHA_AO_REGISTRAR_COLETA);
  }
}

function registrarCreditoRecebido(linha) {
  if (!linha) {
    throw new Error(MENSAGENS.DEVOLUCAO.VALIDACAO.SELECIONE_DEVOLUCAO);
  }
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.PLANILHA.ABAS.DEVOLUCOES);
    sheet.getRange(linha, 10).setValue('Crédito Recebido');
    return MENSAGENS.DEVOLUCAO.SUCESSO.CREDITO_REGISTRADO;
  } catch (e) {
    throw new Error(MENSAGENS.DEVOLUCAO.ERRO.FALHA_AO_REGISTRAR_CREDITO);
  }
}