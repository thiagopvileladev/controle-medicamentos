class GerenciadorMedicamentos {
    constructor() {
        this.medicamentos = [];
    }

    adicionar(nome, dosagem, horario) {
        if (!nome || !horario) {
            throw new Error("Erro: Nome e horário são obrigatórios!");
        }

        const novoMedicamento = {
            id: Date.now(),
            nome: nome,
            dosagem: dosagem || "Não informada",
            horario: horario,
            tomado: false
        };

        this.medicamentos.push(novoMedicamento);
        return novoMedicamento;
    }

    listar() {
        return this.medicamentos.sort((a, b) => {
            return a.horario.localeCompare(b.horario);
        });
    }

    remover(id) {
        this.medicamentos = this.medicamentos.filter(med => med.id !== id);
    }

    alternarStatus(id) {
        const med = this.medicamentos.find(m => m.id === id);
        if (med) {
            med.tomado = !med.tomado;
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GerenciadorMedicamentos;
}