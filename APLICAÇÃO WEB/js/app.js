import { ApiClient, ClientManager } from './classes.js';
import { generateClientsListHTML } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    // Usando a URL fornecida sem o endpoint (pois é tratada em classes.js)
    const API_URL = 'https://crudcrud.com/api/fdbf8ffa2de44b05bec97219ac955bce';
    
    const apiClient = new ApiClient(API_URL);
    const clientManager = new ClientManager(apiClient);

    const form = document.getElementById('client-form');
    const clientsList = document.getElementById('clients-list');
    const refreshBtn = document.getElementById('refresh-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');

    const showError = (msg) => {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
        setTimeout(() => errorMessage.classList.add('hidden'), 6000);
    };

    const toggleListLoading = (isLoading) => {
        if (isLoading) {
            loadingIndicator.classList.remove('hidden');
            clientsList.innerHTML = '';
        } else {
            loadingIndicator.classList.add('hidden');
        }
    };

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

    const render = () => {
        // Atualiza a UI sem recarregar a página
        clientsList.innerHTML = generateClientsListHTML(clientManager.clients);
    };

    const loadClients = async () => {
        if (API_URL.includes('COLE_SEU_ID_AQUI')) {
            showError('Por favor, configure sua URL do CrudCrud.');
            return;
        }

        try {
            toggleListLoading(true);
            await clientManager.load();
            render();
        } catch (error) {
            console.error('Erro na requisição GET:', error);
            showError(error.message);
            clientManager.clients = [];
            render();
        } finally {
            toggleListLoading(false);
        }
    };

    // Cadastro Dinâmico
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (API_URL.includes('COLE_SEU_ID_AQUI')) {
            showError('Por favor, configure sua URL do CrudCrud.');
            return;
        }

        try {
            toggleSubmitLoading(true);
            await clientManager.add(name, email);
            nameInput.value = '';
            emailInput.value = '';
            render(); // Atualiza instantaneamente a UI
        } catch (error) {
            console.error('Erro na requisição POST:', error);
            showError(error.message);
        } finally {
            toggleSubmitLoading(false);
        }
    });

    // Exclusão por Delegação de Eventos (Event Delegation) 
    // Captura os cliques sem precisar definir onclick dentro do HTML gerado
    clientsList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            if (!confirm('Você tem certeza que deseja excluir este cliente?')) return;

            try {
                e.target.disabled = true;
                e.target.textContent = 'Excluindo...';
                await clientManager.remove(id);
                render(); // Atualiza a UI dinamicamente
            } catch (error) {
                console.error('Erro na requisição DELETE:', error);
                showError(error.message);
                e.target.disabled = false;
                e.target.textContent = 'Excluir';
            }
        }
    });

    refreshBtn.addEventListener('click', loadClients);

    // Initial load
    setTimeout(() => loadClients(), 300);
});
