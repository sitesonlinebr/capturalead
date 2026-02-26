// =====================================================
// CONFIG
// =====================================================
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLGi9Pa-5rCbI0ZJ72jA0PBxjY1cxKs5ovLGiVm0ARxZtgtJbWPEZte88yOVKCBlo/exec";

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
  txt.textContent = isLoading ? "Enviando..." : "Enviar";
}

// =====================================================
// MAIN
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("leadForm");
  const telefone = document.getElementById("telefone");

  if (telefone) {
    telefone.addEventListener("input", (e) => {
      const cur = e.target.value;
      e.target.value = maskPhoneBR(cur);
    });

    telefone.addEventListener("blur", (e) => {
      // Corrige máscara final ao sair do campo
      e.target.value = maskPhoneBR(e.target.value);
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    setButtonLoading(true);

    const utms = getUTMsFromURL();

    const payload = {
      nome: (document.getElementById("nome")?.value || "").trim(),
      telefone: (document.getElementById("telefone")?.value || "").trim(),
      email: (document.getElementById("email")?.value || "").trim(),
      tipo_estabelecimento: (document.getElementById("tipo_estabelecimento")?.value || "").trim(),
      faturamento_mensal: (document.getElementById("faturamento_mensal")?.value || "").trim(),

      // UTMs
      ...utms,

      // Extras
      page_url: window.location.href,
      user_agent: navigator.userAgent,
    };

    try {
      // Importante: mode 'no-cors' (como você pediu)
      // Observação: com no-cors a resposta vira "opaque" e não dá pra ler status/body.
      // Então, aqui consideramos "sucesso" se não lançar exceção.
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      window.location.href = "./obrigado.html";
    } catch (err) {
      console.error("Erro ao enviar lead:", err);
      alert("Não conseguimos enviar agora. Verifique sua internet e tente novamente.");
      setButtonLoading(false);
    }
  });
});
