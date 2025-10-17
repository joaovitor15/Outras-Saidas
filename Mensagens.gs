// Arquivo: Mensagens.gs
const MENSAGENS = {
  // Textos de uso geral
  GERAL: {
    OPERACAO_CANCELADA: "Operação cancelada pelo usuário."
  },

  // Textos para a interface do usuário (painéis)
  UI: {
    // Mensagens Gerais de Carregamento
    ABRINDO_PAINEL: "Abrindo painel...",
    VOLTANDO_AO_MENU: "Voltando ao menu...",
    CARREGANDO_DADOS: "Carregando dados...",

    // Mensagens de Ação - Devolução
    REGISTRANDO: "Registrando, por favor aguarde...",
    ATUALIZANDO: "Atualizando dados...",

    // Mensagens de Ação - Vencidos
    GERANDO_PDF: "Gerando PDF com todos os itens, aguarde...",
    GERANDO_ETIQUETA: "Gerando etiqueta, por favor aguarde..."
  },
  
  // Mensagens específicas da funcionalidade de Devolução
  DEVOLUCAO: {
    VALIDACAO: {
       CAMPOS_OBRIGATORIOS_REGISTRO: "Os campos 'Distribuidora', 'Produto' e 'Motivo' são obrigatórios.",
       PREFIXO_CAMPOS_FALTANDO: "Por favor, preencha os seguintes campos obrigatórios: ",
       CAMPOS_OBRIGATORIOS_FISCAL: "É necessário selecionar uma devolução e preencher a Nota Fiscal e o Valor.",
       SELECIONE_DEVOLUCAO: "Selecione uma devolução para continuar."
    },
    SUCESSO: {
       REGISTRADA: "Devolução registrada com sucesso!",
       DADOS_FISCAIS_ADICIONADOS: "Dados fiscais adicionados com sucesso!",
       COLETA_REGISTRADA: "Coleta registrada com sucesso!",
       CREDITO_REGISTRADO: "Crédito recebido com sucesso!"
    },
    ERRO: {
       FALHA_AO_REGISTRAR: "Ocorreu uma falha ao registrar a devolução.",
       FALHA_AO_ATUALIZAR: "Ocorreu uma falha ao atualizar os dados fiscais.",
       FALHA_AO_REGISTRAR_COLETA: "Falha ao registrar a data da coleta.",
       FALHA_AO_REGISTRAR_CREDITO: "Falha ao registrar o recebimento do crédito."
    }
  },

  // Mensagens específicas da funcionalidade de Vencidos
  VENCIDOS: {
     VALIDACAO: {
       CAMPOS_OBRIGATORIOS: "Os campos Medicamento e Quantidade são obrigatórios.",
       ITENS_NAO_ENCONTRADOS: "Não há itens na planilha Vencidos para gerar o documento.",
       NENHUM_ITEM_VALIDO: "Nenhum item válido encontrado para gerar a nota."
     },
     SUCESSO: {
       REGISTRADO: "Produto vencido registrado com sucesso!",
       DOCUMENTO_GERADO: (nomeArquivo, totalItens) => `Solicitação de NFD gerado com sucesso!`
     },
     ERRO: {
       FALHA_AO_REGISTRAR: "Ocorreu um erro ao tentar registrar o produto.",
       FALHA_GERAR_DOCUMENTO: (mensagem) => `Falha ao gerar a nota de devolução: ${mensagem}`
     }
   }
};