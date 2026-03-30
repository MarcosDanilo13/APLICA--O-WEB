export class ApiClient {
    constructor(baseUrl) {
        // Remove a barra final se existir para padronizar as requisições
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        // O recurso na API (tabela/coleção) será 'clientes'
        this.endpoint = `${this.baseUrl}/clientes`;
    }

    async getClients() {
        const response = await fetch(this.endpoint);
        if (!response.ok) throw new Error('Falha ao carregar os clientes.');
        return await response.json();
    }

    async addClient(clientData) {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData)
        });
        if (!response.ok) throw new Error('Falha ao cadastrar o cliente. Verifique se a cota do CrudCrud excedeu.');
        return await response.json();
    }

    async deleteClient(id) {
        const response = await fetch(`${this.endpoint}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Falha ao tentar excluir o cliente.');
        return true;
    }
}

export class ClientManager {
    constructor(apiClient) {
        this.api = apiClient;
        this.clients = [];
    }

    async load() {
        this.clients = await this.api.getClients();
        return this.clients;
    }

    async add(name, email) {
        const newClient = await this.api.addClient({ name, email });
        // Utilizando técnica funcional: criação de nova array ao invés de mutar a existente (sem push)
        this.clients = [...this.clients, newClient];
        return newClient;
    }

    async remove(id) {
        await this.api.deleteClient(id);
        
        // Utilizando o método find() conforme solicitado para encontrar o item
        const clientToRemove = this.clients.find(client => client._id === id);
        if (clientToRemove) {
            // Removendo o item e mantendo a imutabilidade com filter()
            this.clients = this.clients.filter(client => client._id !== id);
        }
    }
}
