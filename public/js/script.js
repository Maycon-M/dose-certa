const fix = document.querySelector('.fix');
const url = 'http://localhost:8000/lembretes/'

// Função para criar o ícone da pílula
function createPillIcon(colors, size = 40) {
  return `
      <span class="pill-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
          <defs>
            <clipPath id="pill-clip">
              <rect x="2" y="8" width="20" height="8" rx="4" ry="4"/>
            </clipPath>
          </defs>
          <!-- Metade esquerda (roxa ou conforme a propriedade 'left') -->
          <rect x="2" y="8" width="10" height="8" fill="${colors.left}" clip-path="url(#pill-clip)"/>
          <!-- Metade direita (a cor 'right') -->
          <rect x="12" y="8" width="10" height="8" fill="${colors.right}" clip-path="url(#pill-clip)"/>
          <!-- Borda da pílula -->
          <rect x="2" y="8" width="20" height="8" rx="4" ry="4" fill="none" stroke="#f3f3f3" stroke-width="1"/>
          <line x1="12" y1="8" x2="12" y2="16" stroke="#f3f3f3" stroke-width="1"/>
        </svg>
      </span>
    `;
}

// Função para criar o ícone do relógio
function createClockIcon(size = 26) {
  return `
      <span class="clock-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="none" stroke="white" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke-width="2" stroke="white" fill="none"/>
          <polyline points="12 6 12 12 16 14" stroke-width="2" stroke="white" fill="none"/>
        </svg>
      </span>
    `;
}

// Função para criar um elemento "lembrete" a partir de um objeto de dados
function createLembreteElement(lembrete) {
  const lembreteDiv = document.createElement("div");
  lembreteDiv.classList.add("lembrete");

  // Nome do remédio
  const nomeEl = document.createElement("p");
  nomeEl.classList.add("nome");
  nomeEl.textContent = lembrete.nome;

  // Quantidade (com ícone da pílula se os dados estiverem disponíveis)
  const quantidadeEl = document.createElement("p");
  quantidadeEl.classList.add("quantidade");
  if (lembrete.pillColors) {
    quantidadeEl.innerHTML += createPillIcon(lembrete.pillColors);
  }
  quantidadeEl.innerHTML += `<span>${lembrete.quantidade} comprimido${lembrete.quantidade == '1' ? '' : 's'}
    </span>`;

  // Horário (com ícone do relógio)
  const horaEl = document.createElement("p");
  horaEl.classList.add("hora");
  horaEl.innerHTML = createClockIcon() + `<span class="hora-text">${lembrete.hora}h</span>`;

  // Botão de editar
  const editButton = document.createElement("button");
  editButton.classList.add("editar");
  editButton.textContent = "Excluir";
  editButton.dataset.id = lembrete.id
 // Botão de excluir com o event listener corrigido
editButton.addEventListener('click', async (ev) => {
  try {
    // Como a URL já termina com uma barra, basta concatenar o id sem outra barra extra
    const response = await fetch(`${url}${lembrete.id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Erro ao deletar o item: ' + response.status);
    }
    // Remove o elemento do DOM
    editButton.closest('.lembrete').remove();
    alert('Lembre excluído com sucesso!');
  } catch (error) {
    console.error('Erro ao deletar o lembrete:', error);
  }
});

  // Exemplo: editButton.addEventListener('click', () => { ... });

  // Adiciona os elementos criados ao container do lembrete
  lembreteDiv.appendChild(nomeEl);
  lembreteDiv.appendChild(quantidadeEl);
  lembreteDiv.appendChild(horaEl);
  lembreteDiv.appendChild(editButton);

  return lembreteDiv;
}

// Função para renderizar todos os lembretes na página
function renderLembretes(lembretesArray) {
  const container = document.querySelector(".lembretes");
  container.innerHTML = "";
  lembretesArray.forEach((lembrete) => {
    const lembreteElement = createLembreteElement(lembrete);
    container.appendChild(lembreteElement);
  });
}

// http://localhost:8000/lembretes/ novo?

// Renderiza os lembretes quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Verifica a estrutura completa dos dados retornados

      // Extrai o array de lembretes de data.data.attributes
      const lembretes = data.data.attributes;
      if (!Array.isArray(lembretes)) {
        throw new Error("Formato inesperado dos dados.");
      }

      // Mapeia os lembretes, ajustando a propriedade 'horario' para 'hora'
      const lembretesFormatados = lembretes.map(remedio => ({
        id: remedio.id,
        nome: remedio.nome,
        quantidade: remedio.quantidade,
        hora: remedio.horario // Certifique-se de que o nome seja o mesmo usado na renderização
      }));

      renderLembretes(lembretesFormatados);
    })
    .catch(error => console.error('Erro ao buscar os itens:', error));
});

fix.addEventListener('click', async (ev) => {
  ev.preventDefault();

  const remedio = prompt('Qual o nome do remédio?');
  const horario = prompt('Qual o horario do remedio? (Formato hh/mm. Ex: 12:30');
  const quantidade = Number(prompt('Qual a quantidade da dose?'));

  const confirmar = confirm(`Deseja adicionar o alarme do remédio ${remedio} às ${horario} com dose de ${quantidade} ?`);

  if (confirmar) {
    const lembrete = { nome: remedio, horario: horario, quantidade: quantidade }

    const response = await fetch(url + 'novo/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lembrete)
    });

    const lembreteFinal = { nome: remedio, hora: horario, quantidade: quantidade }
    const container = document.querySelector(".lembretes");
    const lembreteElement = createLembreteElement(lembreteFinal);
    container.appendChild(lembreteElement);

  } else {
    alert('Ok! O remédio não será adicionado.')
  }
})

