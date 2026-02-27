const WHATSAPP_NUMBER = "5588996347026";

// ========================
// Máscara Telefone
// ========================
function onlyDigits(str) {
  return (str || "").replace(/\D/g, "");
}

function maskPhoneBR(value) {
  const d = onlyDigits(value).slice(0, 11);
  const len = d.length;

  if (len === 0) return "";
  if (len <= 2) return `(${d}`;
  if (len <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// ========================
// Construir Mensagem
// ========================
function buildWhatsAppMessage(data) {
  return [
    "*Tenho interesse em orçamento para meu site!*",
    "",
    ` *Nome:* ${data.nome}`,
    ` *Telefone:* ${data.telefone}`,
    ` *Email:* ${data.email}`,
    ` *Tipo:* ${data.tipo}`,
    ` *Faturamento:* ${data.faturamento}`
  ].join("\n");
}

// ========================
// Abrir WhatsApp
// ========================
function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.location.href = url;
}

// ========================
// Inicialização
// ========================
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("leadForm");
  const telefone = document.getElementById("telefone");
  const submitBtn = document.getElementById("submitBtn");

  // Máscara telefone
  telefone.addEventListener("input", (e) => {
    e.target.value = maskPhoneBR(e.target.value);
  });

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerText = "Abrindo WhatsApp...";

    const payload = {
      nome: document.getElementById("nome").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      email: document.getElementById("email").value.trim(),
      tipo: document.getElementById("tipo_estabelecimento").value.trim(),
      faturamento: document.getElementById("faturamento_mensal").value.trim()
    };

    const message = buildWhatsAppMessage(payload);
    openWhatsApp(message);

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = "Enviar no WhatsApp";
    }, 1500);
  });

});