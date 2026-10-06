// --- CARROSSEL DE IMAGENS DO FUNDO (HERO) COM 6 FOTOS ---
const imagensHero = [
    'img/foto1.jpg',
    'img/foto2.jpg',
    'img/foto3.jpg',
    'img/foto4.jpg',
    'img/foto5.jpg',
    'img/foto6.jpg'
];

let indiceAtual = 0;
const heroSection = document.querySelector('.hero');

// Cria a div de fundo dinamicamente se ela não existir
let heroBg = document.querySelector('.hero-bg');
if (!heroBg && heroSection) {
    heroBg = document.createElement('div');
    heroBg.className = 'hero-bg';
    heroSection.prepend(heroBg);
}

function trocarFundoHero() {
    if (heroBg && imagensHero.length > 0) {
        heroBg.style.backgroundImage = `url('${imagensHero[indiceAtual]}')`;
        indiceAtual = (indiceAtual + 1) % imagensHero.length;
    }
}

// Roda a primeira foto imediatamente e troca a cada 5 segundos
if (heroBg) {
    trocarFundoHero();
    setInterval(trocarFundoHero, 5000);
}


// --- INTEGRAÇÃO DOS PRÓXIMOS EVENTOS DA PLANILHA ---
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRMcbzxSRR-V0YpbIqep7yF5mlctQuxPCVFj2mpJtZ5S47hvHwlVhAwEtrYeFX7Eg/pub?output=csv';

async function carregarDadosDaPlanilha() {
    try {
        const resposta = await fetch(csvUrl);
        const dadosTexto = await resposta.text();
        
        const linhas = dadosTexto.split('\n');
        let eventosHtml = '';
        const eventosAdicionados = new Set();

        linhas.forEach((linha) => {
            const colunas = linha.split(',');
            if (colunas.length < 5) return;

            let dataEvento = colunas[3]?.trim().replace(/"/g, '');
            let nomeEvento = colunas[4]?.trim().replace(/"/g, '');

            if (!dataEvento || !nomeEvento) return;
            if (dataEvento.toUpperCase() === 'DATA' || nomeEvento.toUpperCase() === 'EVENTO') return;
            if (!dataEvento.includes('/')) return;

            const chaveUnica = `${dataEvento}-${nomeEvento}`;
            if (eventosAdicionados.has(chaveUnica)) return;
            eventosAdicionados.add(chaveUnica);

            eventosHtml += `
                <div class="event-card">
                    <span class="event-date">${dataEvento}</span>
                    <h3>${nomeEvento}</h3>
                </div>
            `;
        });

        const containerEventos = document.getElementById('dynamic-events');
        if (containerEventos) {
            containerEventos.innerHTML = eventosHtml || '<p style="text-align: center; color: #666;">Nenhum evento próximo no momento.</p>';
        }

    } catch (error) {
        console.error('Erro ao carregar os dados da planilha:', error);
    }
}

document.addEventListener('DOMContentLoaded', carregarDadosDaPlanilha);
