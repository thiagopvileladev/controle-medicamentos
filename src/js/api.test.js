describe('Teste de Integração - API Pública ViaCEP', () => {
    it('Deve consultar a API externa e retornar os dados corretos de um CEP válido', async () => {
        const cepDeTeste = '01001000'; // CEP da Praça da Sé
        
        const response = await fetch(`https://viacep.com.br/ws/${cepDeTeste}/json/`);
        const data = await response.json();

        // Validações que garantem que o contrato com a API externa funciona
        expect(data).toHaveProperty('logradouro');
        expect(data.localidade).toBe('São Paulo');
        expect(data.uf).toBe('SP');
    });
});