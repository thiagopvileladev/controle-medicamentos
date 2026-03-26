const gerenciador = new GerenciadorMedicamentos();

const form = document.getElementById('form-remedio');
const listaUI = document.getElementById('lista-remedios');
const statusUI = document.getElementById('status-alerta'); // Pega o alerta na tela

function carregarDados() {
    const dadosSalvos = JSON.parse(localStorage.getItem('medicamentos')) || [];
    gerenciador.medicamentos = dadosSalvos;
    atualizarTela();
}

function salvarDados() {
    localStorage.setItem('medicamentos', JSON.stringify(gerenciador.listar()));
}

function atualizarTela() {
    listaUI.innerHTML = ''; 
    const remedios = gerenciador.listar();

    // IDEIA 3: Lógica do Alerta de Status
    const total = remedios.length;
    const tomados = remedios.filter(m => m.tomado).length;
    
    statusUI.style.display = "block"; // Mostra a caixa
    if (total === 0) {
        statusUI.innerHTML = "Nenhum remédio programado. Tudo tranquilo!";
        statusUI.style.backgroundColor = "#ecf0f1";
        statusUI.style.color = "#7f8c8d";
        statusUI.style.borderColor = "#bdc3c7";
    } else if (tomados === total) {
        statusUI.innerHTML = "Parabéns! Você já tomou todos os seus remédios hoje!";
        statusUI.style.backgroundColor = "#e8f8f5";
        statusUI.style.color = "#16a085";
        statusUI.style.borderColor = "#1abc9c";
    } else {
        statusUI.innerHTML = `Você tem <strong>${total}</strong> remédio(s) hoje. Faltam tomar <strong>${total - tomados}</strong>.`;
        statusUI.style.backgroundColor = "#fcf3cf";
        statusUI.style.color = "#f39c12";
        statusUI.style.borderColor = "#f1c40f";
    }

    // Desenhando os remédios na tela
    remedios.forEach(med => {
        const li = document.createElement('li');
        
        // Se estiver tomado, aplica a classe do CSS e marca o checkbox
        const classeTomado = med.tomado ? 'tomado-texto' : '';
        const checked = med.tomado ? 'checked' : '';

        li.innerHTML = `
            <div class="med-info ${classeTomado}">
                <input type="checkbox" class="checkbox-tomado" onchange="alternarStatusNaTela(${med.id})" ${checked}>
                <div>
                    <strong>${med.nome}</strong> (${med.dosagem}) <br>
                    Horário: <strong>${med.horario}</strong>
                </div>
            </div>
            <button class="btn-remover" onclick="removerNaTela(${med.id})">Remover</button>
        `;
        listaUI.appendChild(li);
    });
}

form.addEventListener('submit', function(evento) {
    evento.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const dosagem = document.getElementById('dosagem').value;
    const horario = document.getElementById('horario').value;

    try {
        gerenciador.adicionar(nome, dosagem, horario);
        salvarDados();
        atualizarTela();
        form.reset(); 
    } catch (erro) {
        alert(erro.message); 
    }
});

// Evento: Clicar no botão "Remover"
window.removerNaTela = function(id) {
    gerenciador.remover(id);
    salvarDados();
    atualizarTela();
};

// Evento: Clicar na caixinha de seleção (Checkbox)
window.alternarStatusNaTela = function(id) {
    gerenciador.alternarStatus(id);
    salvarDados();
    atualizarTela();
}

carregarDados();