// Variáveis para armazenar as cores das atividades
const activityColors = {
  work: "#ff6347", // Vermelho
  sleep: "#ffcc00", // Amarelo
  leisure: "#32cd32", // Verde
  tasks: "#1e90ff", // Azul
  training: "#ff4500", // Laranja
  study: "#f0e68c", // Bege
  hobby: "#9370db", // Roxo
  projects: "#dda0dd", // Lilás
  procrastination: "#d3d3d3", // Cinza
};

let activitiesLog = []; // Registro das atividades

// Atualiza o traço vermelho em tempo real
function updateCurrentTimeIndicator() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const percentage = (totalMinutes / (24 * 60)) * 100;

  const indicator = document.getElementById("current-time-indicator");
  if (indicator) {
    indicator.style.left = `${percentage}%`;
  } else {
    console.error("Elemento #current-time-indicator não encontrado!");
  }
}

// Função para registrar a atividade atual manualmente
function setActivity(activity) {
  const startInput = prompt(
    `Informe a hora de início para "${activity}" (formato HH:mm):`
  );
  const endInput = prompt(
    `Informe a hora de término para "${activity}" (formato HH:mm):`
  );

  if (startInput && endInput) {
    const [startHours, startMinutes] = startInput.split(":").map(Number);
    const [endHours, endMinutes] = endInput.split(":").map(Number);

    const startTime = startHours + startMinutes / 60; // Converte para decimal
    const endTime = endHours + endMinutes / 60; // Converte para decimal

    if (startTime >= 0 && endTime <= 24 && startTime < endTime) {
      activitiesLog.push({
        activity: activity,
        start: startTime,
        end: endTime,
      });

      renderTimeline(); // Atualiza a linha do tempo
      updateActivityLog(); // Atualiza o log de atividades
    } else {
      alert(
        "Horários inválidos. Certifique-se de que estão no formato HH:mm e que o horário de início é antes do término."
      );
    }
  }
}

// Função para renderizar a linha do tempo com as atividades registradas
function renderTimeline() {
  const timeline = document.getElementById("timeline");

  // Preserva o traço vermelho
  const timeIndicator = document.getElementById("current-time-indicator");
  const indicatorPosition = timeIndicator.style.left;

  // Limpa a linha do tempo (sem remover o traço vermelho)
  timeline.innerHTML = "";

  // Reposiciona o traço vermelho
  if (timeIndicator) {
    timeIndicator.style.left = indicatorPosition;
    timeline.appendChild(timeIndicator);
  }

  // Recria os segmentos de atividades na timeline
  activitiesLog.forEach((log) => {
    const startPercentage = (log.start / 24) * 100; // Cálculo do horário de início
    const endPercentage = (log.end / 24) * 100; // Cálculo do horário de término

    // Valida os cálculos antes de criar o segmento
    if (
      startPercentage < 0 ||
      endPercentage > 100 ||
      startPercentage >= endPercentage
    ) {
      console.error("Erro no cálculo de horários:", log);
      return; // Ignora entradas inválidas
    }

    // Cria um elemento para o segmento de atividade
    const segment = document.createElement("div");
    segment.classList.add("activity-segment");
    segment.style.backgroundColor = activityColors[log.activity] || "#ccc"; // Aplica a cor correta
    segment.style.position = "absolute"; // Necessário para posicionamento
    segment.style.left = `${startPercentage}%`; // Posição inicial
    segment.style.width = `${endPercentage - startPercentage}%`; // Largura do segmento
    segment.style.height = "100%"; // Altura total do timeline

    timeline.appendChild(segment);
  });
}

// Atualiza a lista de atividades no log
function updateActivityLog() {
  const logList = document.getElementById("log-list");
  logList.innerHTML = "";

  activitiesLog.forEach((log) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Atividade: ${
      log.activity
    }, Início: ${log.start.toFixed(2)}, Fim: ${log.end.toFixed(2)}`;
    logList.appendChild(listItem);
  });
}

// Aplica as cores aos botões
function applyButtonColors() {
  Object.keys(activityColors).forEach((activity) => {
    const button = document.getElementById(activity);
    if (button) {
      button.style.backgroundColor = activityColors[activity];
      button.style.color = "#fff"; // Texto branco para contraste
      button.style.border = "none"; // Remove bordas
      button.style.cursor = "pointer"; // Adiciona cursor interativo
    }
  });
}

// Marca os períodos não registrados como procrastinação
function markProcrastination() {
  let lastEndTime = 0; // Começa do início do dia (meia-noite)

  activitiesLog.forEach((log) => {
    if (log.start > lastEndTime) {
      activitiesLog.push({
        activity: "procrastination",
        start: lastEndTime,
        end: log.start,
      });
    }
    lastEndTime = log.end;
  });

  if (lastEndTime < 24) {
    activitiesLog.push({
      activity: "procrastination",
      start: lastEndTime,
      end: 24,
    });
  }

  renderTimeline(); // Atualiza a linha do tempo
}

// Atualiza a linha vermelha de tempo real a cada minuto
setInterval(updateCurrentTimeIndicator, 60000); // Atualiza a cada minuto
updateCurrentTimeIndicator(); // Atualiza imediatamente ao carregar a página

// Aplica as cores aos botões
applyButtonColors();

// Função para exibir o formulário de seleção de horário
function showTimeForm(activity) {
  const formContainer = document.getElementById("time-form-container");
  const form = document.getElementById("time-form");

  // Define a atividade que estamos registrando
  formContainer.style.display = "block";

  // Limpa os campos
  document.getElementById("start-time").value = "";
  document.getElementById("end-time").value = "";

  // Evento para salvar os horários
  form.onsubmit = function (event) {
    event.preventDefault();

    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;

    // Se ambos os horários forem preenchidos
    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(":").map(Number);
      const [endHours, endMinutes] = endTime.split(":").map(Number);

      const startDecimal = startHours + startMinutes / 60;
      const endDecimal = endHours + endMinutes / 60;

      // Verifica se o horário de início é antes do horário de término
      if (startDecimal < endDecimal && startDecimal >= 0 && endDecimal <= 24) {
        activitiesLog.push({
          activity: activity,
          start: startDecimal,
          end: endDecimal,
        });

        updateAndRenderTimeline(); // Atualiza a linha do tempo
        updateActivityLog(); // Atualiza o log de atividades

        // Oculta o formulário
        formContainer.style.display = "none";
      } else {
        alert(
          "Horário inválido. O horário de início deve ser antes do horário de término."
        );
      }
    }
  };

  // Cancela e fecha o formulário
  document.getElementById("cancel-time").onclick = function () {
    formContainer.style.display = "none";
  };
}

// Função para registrar atividade ao clicar no botão
function setActivity(activity) {
  showTimeForm(activity); // Exibe o formulário para inserir horário
}

// Função para atualizar a hora no centro da linha e o traço vermelho
function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes; // Total de minutos desde 00:00
  const percentOfDay = (totalMinutes / 1440) * 100; // Percentual do dia

  // Atualiza a hora visível no centro
  document.getElementById("current-time-indicator").textContent = `${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  // Move o traço vermelho para a posição correta
  const timeIndicator = document.getElementById("time-indicator");
  if (timeIndicator) {
    timeIndicator.style.left = `${percentOfDay}%`;
  }
}

// Atualiza a linha do tempo ao salvar atividades
function updateAndRenderTimeline() {
  updateTime(); // Atualiza o traço vermelho
  renderTimeline(); // Renderiza as atividades
}

// Adiciona os eventos aos botões
document
  .getElementById("work")
  .addEventListener("click", () => setActivity("work"));
document
  .getElementById("sleep")
  .addEventListener("click", () => setActivity("sleep"));
document
  .getElementById("leisure")
  .addEventListener("click", () => setActivity("leisure"));
document
  .getElementById("tasks")
  .addEventListener("click", () => setActivity("tasks"));
document
  .getElementById("training")
  .addEventListener("click", () => setActivity("training"));
document
  .getElementById("study")
  .addEventListener("click", () => setActivity("study"));
document
  .getElementById("hobby")
  .addEventListener("click", () => setActivity("hobby"));
document
  .getElementById("projects")
  .addEventListener("click", () => setActivity("projects"));
