// Arquivo: Config.gs (versão final e completa)
const CONFIG = {
  DRIVE: {
    ID_DA_PASTA_IMPRESSOS: "108MMX1_npA_roT8kzkC2EJWbYdieFO8i"
  },
  PLANILHA: {
    ABAS: {
      DEVOLUCOES: "Painel de Devoluções",
      LISTAS: "Listas",
      VENCIDOS: "Vencidos"
    }
  },
  DOCUMENTO: {
    MARGENS: { superior: 35, inferior: 35, esquerda: 36, direita: 36 },
    ESTILOS: {
      titulo: { fonte: "Arial", tamanho: 14, negrito: true, alinhamento: DocumentApp.HorizontalAlignment.CENTER },
      subtitulo: { fonte: "Arial", tamanho: 12, negrito: true, alinhamento: DocumentApp.HorizontalAlignment.LEFT },
      textoNormal: { fonte: "Arial", tamanho: 11, negrito: false, alinhamento: DocumentApp.HorizontalAlignment.JUSTIFY },
      textoNegrito: { fonte: "Arial", tamanho: 11, negrito: true, alinhamento: DocumentApp.HorizontalAlignment.LEFT },
      tabelaCabecalho: { fonte: "Arial", tamanho: 9, negrito: true },
      tabelaCorpo: { fonte: "Arial", tamanho: 10, negrito: false }
    },
    
    TEXTOS: {
      estabelecimento: {
        nome: "Farmácia Tuparendi",
        razaoSocial: "Luiz Moacir Machry",
        cnpj: "CNPJ: 89.055.768/0001-76"
      },
      
      VENCIDOS: {
        // --- Textos para a Solicitação de NFD ---
        nota: {
          tituloPrincipal: "Solicitação de NFD",
          descricao: "Solicito NFD, para dar baixa no sistema SNGPC, dos produtos controlado e antimicrobiano, conforme a RDC 344/98.",
          destinatarioTitulo: "DESTINATÁRIO:",
          destinatarioRazao: "ARL AMBIENTAL",
          destinatarioCnpj: "CNPJ: 08.688.124/0001-34",
          destinatarioEndereco: "Endereço: RUA BORGES DE MEDEIROS, 234, SALA 01",
          destinatarioCidade: "Cidade: SANTO CRISTO / RS",
          destinatarioCep: "CEP: 98960-000",
          NOME_ARQUIVO: "Pedido de NFD - {{DD}}-{{MM}}-{{YYYY}}",
          TABELA_CABECALHO: ['Código', 'Medicamento', 'Qtd.', 'Lote', 'NCM', 'CEST', 'CFOP', 'Preço Unit', 'Total'],
          TABELA_LARGURAS: {
            0: 45, 1: 120, 2: 40, 3: 60, 4: 60, 5: 60, 6: 40, 7: 65, 8: 65
          }
        },
        // --- Textos para a Etiqueta de Descarte ---
        etiqueta: {
          tituloPrincipal: "MEDICAMENTOS VENCIDOS (PORTARIA 344/98 e Antimicrobianos)",
          descricao1: "Por meio deste, estão recolhendo os seguintes medicamentos sujeitos ao controle especial (portaria 344/98) e os antimicrobianos.",
          descricao2: "Ficando com a ARL Coleta e transporte de Resíduos LTDA, no momento da coleta.",
          assinaturaNome: "João Vitor Machry",
          assinaturaCrf: "CRF/RS: 586549",
          NOME_ARQUIVO: "Etiqueta Descarte - {{DD}}-{{MM}}-{{YYYY}}",
          TABELA_CABECALHO: ['Medicamentos', 'Quantidade', 'Fabricante', 'MS', 'Lote', 'EAN'],
          TABELA_LARGURAS: {
            0: 150, 
            1: 40, 
            2: 70, 
            3: 100, 
            4: 60, 
            5: 100
          }
        }
      }
    }
  }
};