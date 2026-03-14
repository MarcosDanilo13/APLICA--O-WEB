document.addEventListener('DOMContentLoaded', () => {
    // URL da API CrudCrud (Substitua pela sua URL gerada no site crudcrud.com)
    // Exemplo: https://crudcrud.com/api/1234567890abcdef/clientes
    const API_URL = 'https://crudcrud.com/api/ba2a6ec70d64463b835d5b94f2abf65b/clientes';

    // Referências aos elementos do DOM
    const form = document.getElementById('client-form');
    const clientsList = document.getElementById('clients-list');
    const refreshBtn = document.getElementById('refresh-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');

    // Utilitário para sanitizar HTML (Prevenir XSS)
    const escapeHtml = (unsafe) => {
        if (!unsafe) return '';
        return unsafe.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // Carrega clientes ao iniciar a aplicação
    setTimeout(() => loadClients(), 300);

    // Exibe mensagem de erro temporária
    const showError = (msg) => {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 6000);
    };

    // Controle do estado de carregamento da lista
    const toggleListLoading = (isLoading) => {
        if (isLoading) {
            loadingIndicator.classList.remove('hidden');
            clientsList.innerHTML = '';
        } else {
            loadingIndicator.classList.add('hidden');
        }
    };

    // Controle do estado de carregamento do botão de submit
    const toggleSubmitLoading = (isLoading) => {
        submitBtn.disabled = isLoading;
        if (isLoading) {
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
        } else {
            btnText.classList.remove('hidden');
            loader.classList.add('hidden');
        }
    };

    // GET Request: Listar Clientes
    const loadClients = async () => {
        if (API_URL.includes('COLE_SEU_ID_AQUI')) {
            showError('Por favor, configure sua URL do CrudCrud no arquivo scripts.js');
            return;
        }

        try {
            toggleListLoading(true);

            // Remove a barra final para listar todos, caso exista
            const fetchUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

            const response = await fetch(fetchUrl);

            if (!response.ok) {
                throw new Error('Falha ao carregar os clientes. Verifique o endpoint informado.');
            }

            const data = await response.json();
            renderClients(data);
        } catch (error) {
            console.error('Erro na requisição GET:', error);
            showError(error.message);
            renderClients([]);
        } finally {
            toggleListLoading(false);
        }
    };

    // Renderiza a grade de clientes
    const renderClients = (clients) => {
        clientsList.innerHTML = '';

        if (!Array.isArray(clients)) {
            showError('O endpoint retornou dados num formato inesperado.');
            return;
        }

        if (clients.length === 0) {
            clientsList.innerHTML = `
                <div class="empty-state">
                    Nenhum cliente cadastrado ainda.<br>Preencha o formulário acima para adicionar o seu primeiro cliente!
                </div>
            `;
            return;
        }

        clients.forEach(client => {
            const card = document.createElement('div');
            card.className = 'client-card';
            card.innerHTML = `
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
                    <button class="btn-danger" onclick="deleteClient('${client._id}')">Excluir</button>
                </div>
            `;
            clientsList.appendChild(card);
        });
    };

    // POST Request: Cadastrar Cliente
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (API_URL.includes('COLE_SEU_ID_AQUI')) {
            showError('Por favor, configure sua URL do CrudCrud no arquivo scripts.js');
            return;
        }

        try {
            toggleSubmitLoading(true);

            // Remove a barra final caso o usuário a tenha deixado, pois o post deve ser feito em /clientes
            const fetchUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            });

            if (!response.ok) {
                throw new Error('Falha ao cadastrar o cliente. Verifique se a cota do CrudCrud excedeu.');
            }

            // Limpa os dados do input após o sucesso
            nameInput.value = '';
            emailInput.value = '';

            // Atualiza a lista na tela
            loadClients();
        } catch (error) {
            console.error('Erro na requisição POST:', error);
            showError(error.message);
        } finally {
            toggleSubmitLoading(false);
        }
    });

    // DELETE Request: Excluir Cliente
    window.deleteClient = async (id) => {
        if (!confirm('Você tem certeza que deseja excluir este cliente?')) {
            return;
        }

        try {
            // O CrudCrud precisa do ID formatado como /ID no final
            const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
            const deleteUrl = `${baseUrl}${id}`;

            const response = await fetch(deleteUrl, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Falha ao tentar excluir o cliente.');
            }

            // Recarrega a lista para mostrar a remoção
            loadClients();
        } catch (error) {
            console.error('Erro na requisição DELETE:', error);
            showError(error.message);
        }
    };

    // Ações complementares
    refreshBtn.addEventListener('click', loadClients);


});
