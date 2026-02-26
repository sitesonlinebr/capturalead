/**
 * CONFIGURAÇÃO GLOBAL
 */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzLVPHwSzID3YeplRIrGkuqzvdfJYoLYH2_kKOLENPp8Xs_pXyeFR4UmiHz2WfmdXWc/exec";

/**
 * MÁSCARA DE TELEFONE BRASILEIRA
 */
const telInput = document.getElementById('telefone');
telInput.addEventListener('input', (e) => {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
});

/**
 * CAPTURA DE METADADOS (UTMs, URL, Browser)
 */
function getLeadMetadata() {
    const params = new URLSearchParams(window.location.search);
    return {
        utm_source: params.get('utm_source') || 'direto',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_term: params.get('utm_term') || '',
        utm_content: params.get('utm_content') || '',
        page_url: window.location.href,
        referrer: document.referrer || 'direto',
        user_agent: navigator.userAgent,
        timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
    };
}

/**
 * ENVIO DO FORMULÁRIO
 */
const form = document.getElementById('leadForm');
const btn = document.getElementById('btnSubmit');
const statusMsg = document.getElementById('statusMsg');

let isSubmitting = false;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Honeypot (Anti-spam) - Se preenchido, ignora o envio
    if (form._hp_field && form._hp_field.value !== "") return;

    isSubmitting = true;
    btn.disabled = true;
    btn.innerText = "ENVIANDO AGUARDE...";
    statusMsg.classList.add('hidden');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Mescla dados do formulário com metadados
    const payload = { ...data, ...getLeadMetadata() };

    try {
        // Envio para o Google Apps Script
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Obrigatório para Google Scripts
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Redireciona para página de agradecimento
        window.location.href = 'obrigado.html';

    } catch (error) {
        console.error("Erro no envio:", error);
        statusMsg.innerText = "Ocorreu um erro ao enviar. Verifique sua conexão.";
        statusMsg.classList.remove('hidden');
        statusMsg.classList.add('text-red-500');
        
        // Reseta o botão
        btn.disabled = false;
        btn.innerText = "ENVIAR";
        isSubmitting = false;
    }
});