# Gerador de Autorização de Imagem para Eventos (Calendário Específico)

Um sistema ágil em Google Apps Script (HTML, CSS e JavaScript) desenhado para a organização de eventos escoteiros (Distritais, Regionais ou de Grupo). Ele substitui o processo demorado de preenchimento manual de autorizações de imagem por um formulário web simples que gera o documento PDF formatado instantaneamente[cite: 4].

Diferente de sistemas fixos por grupo, esta solução possui um banco de dados dinâmico alimentado por um Painel Administrativo, permitindo que a organização cadastre eventos temporários (como acampamentos, feiras e desfiles) com suporte a múltiplas datas[cite: 4].

## 🌟 Detalhes e Benefícios

* **Painel Administrativo Dinâmico (`?page=admin`):** Permite o cadastro rápido do nome do evento e a adição de múltiplas datas. O sistema formata automaticamente os dias (ex: "12/10/2026, 13/10/2026 e 14/10/2026") e salva na base de dados[cite: 4].
* **Geração Automática de PDF:** O sistema lê um template oculto no Google Docs, substitui as tags pelos dados preenchidos, salva em PDF no computador do usuário e descarta o arquivo temporário, economizando espaço no Drive[cite: 4].
* **Campos Opcionais Inteligentes:** Se a família não souber informar o CPF ou RG no momento, basta deixar o campo em branco. O sistema preencherá a lacuna com uma linha sublinhada (ex: `____`) para que seja preenchida à mão na hora de assinar[cite: 4].
* **Interface Responsiva:** Design amigável e otimizado para celulares, com temas em verde e azul para fácil identificação[cite: 4].

---

## 🚀 Pré-work (Como colocar o código em funcionamento)

Para ativar este sistema no seu Google Drive, siga o passo a passo:

### 1. Criar o Banco de Dados (Google Sheets)
1. Crie uma Planilha em branco no Google Sheets.
2. Na aba principal, deixe a coluna **A** para o "Nome do Evento" e a coluna **B** para as "Datas"[cite: 4].
3. Copie o **ID da Planilha** (o código longo que fica na barra de endereços do navegador, entre `/d/` e `/edit`).

### 2. Criar o Documento Template (Google Docs)
1. Crie um novo Google Docs e redija o texto da Autorização de Uso de Imagem.
2. Insira as seguintes tags exatas (com colchetes) onde deseja que os dados apareçam:
   * `[NOME DO EVENTO]` e `[DATA_EVENTO]`[cite: 4]
   * `[NOME_MENOR]`, `[DATA_NASCIMENTO]`, `[CPF_MENOR]`, `[RG_MENOR]`[cite: 4]
   * `[NOME_RESPONSAVEL]`, `[CPF_RESPONSAVEL]`, `[RG_RESPONSAVEL]`[cite: 4]
   * `[DATA_ATUAL]`[cite: 4]
3. Copie o **ID do Documento** (também localizado na URL).

### 3. Configurar o Google Apps Script
1. Vá no menu da sua planilha: **Extensões > Apps Script**.
2. Crie três arquivos no editor e cole os códigos fornecidos:
   * `codigo.gs` (Script)[cite: 4]
   * `Admin.html` (Arquivo HTML)[cite: 4]
   * `Index.html` (Arquivo HTML)[cite: 4]
3. **MUITO IMPORTANTE:** No arquivo `codigo.gs`, substitua as constantes `ID_DO_TEMPLATE` e `ID_DA_PLANILHA` pelos IDs que você copiou nos passos 1 e 2[cite: 4].

### 4. Deploy (Implantação)
1. Clique em **Implantar > Nova implantação**.
2. Selecione o tipo **App da Web** (ícone da engrenagem).
3. Defina "Executar como: **Eu**" e "Quem pode acessar: **Qualquer pessoa**"[cite: 4].
4. Autorize o acesso à sua conta Google e copie o "URL do Web App".

---

## 🛠️ Customização: Implementando em um Novo Ambiente

Se você for utilizar o sistema em outro local ou contexto, basta ajustar as variáveis abaixo:

* **No arquivo `codigo.gs`:** Você **deve** atualizar `ID_DO_TEMPLATE` e `ID_DA_PLANILHA` para os novos IDs dos arquivos correspondentes na conta/drive da nova diretoria[cite: 4].
* **Template do Google Docs:** Você deve reescrever o corpo do texto do Google Docs para se adequar às regras e CNPJ da nova organização, mas garanta que as tags entre colchetes (`[NOME DO EVENTO]`, `[CPF_MENOR]`, etc.) permaneçam intactas[cite: 4].
* **Identidade Visual (Cores):**
  * Para mudar as cores do **Painel Admin**, vá em `Admin.html` e edite os valores hexadecimais no CSS (ex: `background: linear-gradient(135deg, #1d976c 0%, #93f9b9 100%);`)[cite: 4].
  * Para mudar as cores da **Tela de Autorização**, vá em `Index.html` e edite os valores no CSS (ex: `background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);`)[cite: 4].
* **Nomenclatura Padrão do Arquivo:** Caso queira alterar o nome que o arquivo PDF baixa para o celular do usuário, edite a variável `nomeArquivo` dentro da função `gerarPDF` no arquivo `codigo.gs`[cite: 4].

## 💻 Como Acessar

* **Visão dos Pais (Formulário Público):** Envie o link gerado no Deploy[cite: 4].
* **Visão da Organização (Adicionar Eventos):** Adicione o sufixo `?page=admin` ao final do link público. Exemplo: `https://script.google.com/macros/s/.../exec?page=admin`[cite: 4].
