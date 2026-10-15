// ==========================================
// CONFIGURAÇÕES
// ==========================================
// ID do documento base (Template)
const ID_DO_TEMPLATE = '1l7zYoNNfN1BClTtiZGifTBksMs3BwJRmswp2CmK1FP4';

// ID da Planilha onde os eventos serão salvos
const ID_DA_PLANILHA = '1FvKAmD44SGJK_nYJT5XWvmuenDg5mJFJYrLMkkWSLTQ';

// ==========================================
// ROTAS (Página Principal x Admin)
// ==========================================
function doGet(e) {
  // Se acessar a URL com "?page=admin", abre a tela de administrador
  if (e.parameter.page === 'admin') {
    return HtmlService.createHtmlOutputFromFile('Admin')
      .setTitle('Admin - Cadastro de Eventos')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  // Senão, abre a página padrão para os pais
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Gerador de Autorização - Eventos')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ==========================================
// BANCO DE DADOS (PLANILHA)
// ==========================================
// Salva um novo evento na planilha
function salvarEvento(nomeEvento, datasArray) {
  const sheet = SpreadsheetApp.openById(ID_DA_PLANILHA).getActiveSheet();
  
  // Formata as datas (Ex: de '2026-10-12' para '12/10/2026')
  let datasFormatadas = datasArray.map(d => formatarData(d));
  
  let textoDatas = "";
  if (datasFormatadas.length === 1) {
    textoDatas = datasFormatadas[0];
  } else if (datasFormatadas.length > 1) {
    // Regra: separação por vírgula e o "e" no final
    let ultima = datasFormatadas.pop();
    textoDatas = datasFormatadas.join(", ") + " e " + ultima;
  }
  
  sheet.appendRow([nomeEvento, textoDatas]);
  return "Evento cadastrado com sucesso!";
}

// Busca os eventos para preencher o dropdown
function getEventos() {
  const sheet = SpreadsheetApp.openById(ID_DA_PLANILHA).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  let eventos = [];
  // Começa do índice 1 para pular o cabeçalho
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) {
      eventos.push({
        nome: data[i][0],
        datasTexto: data[i][1]
      });
    }
  }
  return eventos;
}

// ==========================================
// GERAÇÃO DO PDF
// ==========================================
function gerarPDF(dadosFormulario) {
  // Extrai nome e data do evento que vieram juntos no value do Select
  const partesEvento = dadosFormulario.eventoSelecionado.split("|");
  const nomeDoEvento = partesEvento[0];
  const datasDoEvento = partesEvento[1] || "";

  // Dados do menor
  const nomeJovem = dadosFormulario.nomeJovem || "________________________________________________";
  const dataNascimento = dadosFormulario.dataNascimento ? formatarData(dadosFormulario.dataNascimento) : "______________________";
  const cpfMenor = dadosFormulario.cpfMenor || "______________________";
  const rgMenor = dadosFormulario.rgMenor || "______________________";

  // Dados do responsável
  const nomeResponsavel = dadosFormulario.nomeResponsavel || "________________________________________________";
  const cpfResponsavel = dadosFormulario.cpfResponsavel || "______________________";
  const rgResponsavel = dadosFormulario.rgResponsavel || "______________________";

  const dataAtual = getDataAtualPorExtenso();

  // Faz a cópia do template
  const arquivoTemplate = DriveApp.getFileById(ID_DO_TEMPLATE);
  const arquivoTemp = arquivoTemplate.makeCopy(`Temp_Autorizacao_${nomeDoEvento}`);
  const doc = DocumentApp.openById(arquivoTemp.getId());
  const body = doc.getBody();

  // Substitui as tags no documento
  body.replaceText('\\[NOME DO EVENTO\\]', nomeDoEvento);
  body.replaceText('\\[DATA_EVENTO\\]', datasDoEvento);
  
  body.replaceText('\\[NOME_MENOR\\]', nomeJovem);
  body.replaceText('\\[DATA_NASCIMENTO\\]', dataNascimento);
  body.replaceText('\\[CPF_MENOR\\]', cpfMenor);
  body.replaceText('\\[RG_MENOR\\]', rgMenor);
  
  body.replaceText('\\[NOME_RESPONSAVEL\\]', nomeResponsavel);
  body.replaceText('\\[CPF_RESPONSAVEL\\]', cpfResponsavel);
  body.replaceText('\\[RG_RESPONSAVEL\\]', rgResponsavel);
  
  body.replaceText('\\[DATA_ATUAL\\]', dataAtual);

  // Salva e gera o PDF
  doc.saveAndClose();
  const pdfBlob = arquivoTemp.getAs('application/pdf');
  
  // Exclui o arquivo temporário
  arquivoTemp.setTrashed(true);

  // Nome do arquivo gerado
  const nomeArquivoJovem = dadosFormulario.nomeJovem ? dadosFormulario.nomeJovem.split(" ")[0] : "Participante";
  const nomeArquivo = `Autorizacao_${nomeDoEvento}_${nomeArquivoJovem}.pdf`.replace(/ /g, "_");

  const base64 = Utilities.base64Encode(pdfBlob.getBytes());
  return {
    nomeArquivo: nomeArquivo,
    tipoMime: 'application/pdf',
    dadosBase64: base64
  };
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================
function getDataAtualPorExtenso() {
  const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
                 "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = meses[hoje.getMonth()];
  const ano = hoje.getFullYear();
  return `${dia} de ${mes} de ${ano}`;
}

function formatarData(data) {
  if (!data) return "";
  const partes = data.split('-');
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }
  return data;
}
