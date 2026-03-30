// Função pura para escapar HTML, garantindo a segurança contra XSS
export const escapeHtml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// Função pura para gerar um bloco de HTML de um único cliente
export const generateClientCardHTML = (client) => {
    return `
        <div class="client-card" data-id="${client._id}">
            <div class="client-info">
                <h3>${escapeHtml(client.name)}</h3>
                <p>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    ${escapeHtml(client.email)}
                </p>
            </div>
            <div class="card-actions">
                <button class="btn-danger delete-btn" data-id="${client._id}">Excluir</button>
            </div>
        </div>
    `;
};

// Função pura utilizando map() e reduce() para renderizar a lista
export const generateClientsListHTML = (clients) => {
    if (!Array.isArray(clients) || clients.length === 0) {
        return `
            <div class="empty-state">
                Nenhum cliente cadastrado ainda.<br>Preencha o formulário acima para adicionar o seu primeiro cliente!
            </div>
        `;
    }
    
    // Utilização de métodos de alta ordem (map e reduce) - Programação Funcional
    return clients
        .map(generateClientCardHTML)
        .reduce((htmlString, cardHtml) => htmlString + cardHtml, '');
};
