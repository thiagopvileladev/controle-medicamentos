const GerenciadorMedicamentos = require('../src/js/gerenciador');

describe('Testes do Gerenciador de Medicamentos', () => {
    let gerenciador;
    beforeEach(() => {
        gerenciador = new GerenciadorMedicamentos();
    });
    test('Deve adicionar um medicamento corretamente à lista', () => {
        gerenciador.adicionar('Losartana', '50mg', '08:00');
        const lista = gerenciador.listar();

        expect(lista.length).toBe(1);
        expect(lista[0].nome).toBe('Losartana');
    });

    
    test('Deve bloquear cadastro sem nome ou sem horário', () => {
        expect(() => {
            gerenciador.adicionar('', '50mg', '08:00');
        }).toThrow("Erro: Nome e horário são obrigatórios!");

        expect(() => {
            gerenciador.adicionar('Dipirona', '500mg', '');
        }).toThrow("Erro: Nome e horário são obrigatórios!");
    });

    test('Deve remover um medicamento corretamente usando o ID', () => {
        const remedio = gerenciador.adicionar('Vitamina C', '1g', '09:00');
        expect(gerenciador.listar().length).toBe(1);

        gerenciador.remover(remedio.id);
        expect(gerenciador.listar().length).toBe(0);
    });
});