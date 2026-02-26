# LP de Captura - Google Sheets

## Passo a Passo do Backend (Google Apps Script)

1. Crie uma **Planilha Google**.
2. Na primeira linha, crie o cabeçalho exatamente nesta ordem:
   `nome | telefone | email | tipo_estabelecimento | faturamento_mensal | utm_source | utm_medium | utm_campaign | utm_term | utm_content | page_url | referrer | user_agent | timestamp`
3. Vá em **Extensões > Apps Script**.
4. Apague tudo e cole o código abaixo:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.nome, 
    data.telefone, 
    data.email, 
    data.tipo_estabelecimento, 
    data.faturamento_mensal,
    data.utm_source,
    data.utm_medium,
    data.utm_campaign,
    data.utm_term,
    data.utm_content,
    data.page_url,
    data.referrer,
    data.user_agent,
    data.timestamp
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({"ok": true}))
    .setMimeType(ContentService.MimeType.JSON);
}