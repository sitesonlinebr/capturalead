// =====================================================
// CONFIG
// =====================================================
const WHATSAPP_NUMBER = "5588996347026"; // 55 + DDD + número (sem espaços)

// =====================================================
// HELPERS
// =====================================================
function getUTMsFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
  };
}

function onlyDigits(str) {
  return (str || "").replace(/\D/g, "");
}

// Máscara: (99) 99999-9999
function maskPhoneBR(value) {
  const d = onlyDigits(value).slice(0, 11);
  const len = d.length;

  if (len === 0) return "";
  if (len <= 2) return `(${d}`;
  if (len <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function setButtonLoading(isLoading) {
  const btn = document.getElementById("submitBtn");
  const txt = document.getElementById("btnText");
  if (!btn || !txt) return;

  btn.disabled = isLoading;
  txt.textContent = isLoading ? "Abrindo WhatsApp..." : "Enviar no WhatsApp";
}

function buildWhatsAppMessage(data) {
  // Mensagem bem objetiva (pode ajustar o texto se quiser)
  return [
    "📩 *NOVO LEAD — DEMONSTRAÇÃO*",
    "",
    `👤 *Nome:* ${data.nome}`,
    `📞 *Telefone:* ${data.telefone}`,
    `✉️ *Email:* ${data.email}`,
    `🏪 *Tipo:* ${data.tipo_estabelecimento}`,
    `💰 *Faturamento:* ${data.faturamento_mensal}`,
    "",
    "📊 *UTMs:*",
    `• source: ${data.utm_source || "-"}`,
    `• medium: ${data.utm_medium || "-"}`,
    `• campaign: ${data.utm_campaign || "-"}`,
    `• term: ${data.utm_term || "-"}`,
    `• content: ${data.utm_content || "-"}`,
    "",
    `🔗 *Página:* ${data.page_url}`,
  ].join("\n");
}

function openWhatsApp(number, message) {
  // wa.me funciona melhor em celular; api.whatsapp.com também é ok.
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.location.href = url;
}

// =====================================================
// MAIN
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leadForm");
  const telefone = document.getElementById("telefone");

  if (telefone) {
    telefone.addEventListener("input", (e) => {
      e.target.value = maskPhoneBR(e.target.value);
    });
    telefone.addEventListener("blur", (e) => {
      e.target.value = maskPhoneBR(e.target.value);
    });
  }

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setButtonLoading(true);

    const utms = getUTMsFromURL();

    const payload = {
      nome: (document.getElementById("nome")?.value || "").trim(),
      telefone: (document.getElementById("telefone")?.value || "").trim(),
      email: (document.getElementById("email")?.value || "").trim(),
      tipo_estabelecimento: (document.getElementById("tipo_estabelecimento")?.value || "").trim(),
      faturamento_mensal: (document.getElementById("faturamento_mensal")?.value || "").trim(),
      ...utms,
      page_url: window.location.href,
    };

    // Abre WhatsApp com a mensagem pronta
    const msg = buildWhatsAppMessage(payload);
    openWhatsApp(WHATSAPP_NUMBER, msg);

    // fallback: reabilita caso o navegador bloqueie/usuário volte
    setTimeout(() => setButtonLoading(false), 1200);
  });
});