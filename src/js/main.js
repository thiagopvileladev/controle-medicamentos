const gerenciador = new GerenciadorMedicamentos();

const form = document.getElementById('form-remedio');
const listaUI = document.getElementById('lista-remedios');
const statusUI = document.getElementById('status-alerta');

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

    const total = remedios.length;
    const tomados = remedios.filter(m => m.tomado).length;
    
    statusUI.style.display = "block"; 
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

    remedios.forEach(med => {
        const li = document.createElement('li');
        
        const classeTomado = med.tomado ? 'tomado-texto' : '';
        const checked = med.tomado ? 'checked' : '';

        li.innerHTML = `
            <div class="med-info ${classeTomado}">
                <input type="checkbox" class="checkbox-tomado" onchange="alternarStatusNaTela(${med.id})" ${checked}>
                <div>
                    <strong>${med.nome}</strong> (${med.dosagem}) <br>
                    Horário: <strong>${med.horario}</strong> <br>
                    <small style="color: #7f8c8d;">🏥 Retirada: ${med.endereco}</small>
                </div>
            </div>
            <button class="btn-remover" onclick="removerNaTela(${med.id})">Remover</button>
        `;
        listaUI.appendChild(li);
    });
}

// INTEGRAÇÃO COM A API PÚBLICA (ViaCEP)
document.getElementById('btn-buscar-cep').addEventListener('click', async function() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    const enderecoInput = document.getElementById('endereco');

    if (cep.length !== 8) {
        alert('Por favor, digite um CEP válido com 8 dígitos.');
        return;
    }

    enderecoInput.value = "Buscando endereço...";

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            alert('CEP não encontrado!');
            enderecoInput.value = "";
        } else {
            enderecoInput.value = `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`;
        }
    } catch (error) {
        alert('Erro ao buscar o CEP na rede.');
        enderecoInput.value = "";
    }
});

form.addEventListener('submit', function(evento) {
    evento.preventDefault(); 

    const nome = document.getElementById('nome').value;
    const dosagem = document.getElementById('dosagem').value;
    const horario = document.getElementById('horario').value;
    const endereco = document.getElementById('endereco').value;

    try {
        gerenciador.adicionar(nome, dosagem, horario, endereco);
        salvarDados();
        atualizarTela();
        form.reset(); 
    } catch (erro) {
        alert(erro.message); 
    }
});

window.removerNaTela = function(id) {
    gerenciador.remover(id);
    salvarDados();
    atualizarTela();
};

window.alternarStatusNaTela = function(id) {
    gerenciador.alternarStatus(id);
    salvarDados();
    atualizarTela();
};

carregarDados();