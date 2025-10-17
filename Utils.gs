// Arquivo: Utils.gs

/**
 * Inclui o conteúdo de um arquivo HTML dentro de outro.
 * Usaremos isso para importar nosso arquivo de CSS.
 * @param {string} filename O nome do arquivo a ser incluído.
 * @return {string} O conteúdo do arquivo.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function formatarMS(ms) {
  if (!ms) return "";
  const cleaned = String(ms).replace(/\D/g, '');
  if (cleaned.length !== 13) return ms; // Retorna o original se não tiver 13 dígitos
  
  // Aplica a máscara X.XXXX.XXXX.XXX-X
  return cleaned.replace(/^(\d{1})(\d{4})(\d{4})(\d{3})(\d{1})$/, '$1.$2.$3.$4-$5');
}