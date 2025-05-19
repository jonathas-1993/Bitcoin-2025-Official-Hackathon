// Bitcoin education content
export const tutorialSteps = [
  {
    title: "Bem-vindo ao Bitcoin!",
    text: "Você é um minerador digital. Sua missão: manter a rede Bitcoin segura!",
    highlight: "player",
    action: "movement"
  },
  {
    title: "Colete Moedas",
    text: "As moedas representam transações Bitcoin que precisam ser validadas.",
    highlight: "coins",
    action: "collect"
  },
  {
    title: "Mine Blocos",
    text: "Cada bloco contém ~3000 transações Bitcoin verificadas",
    highlight: "blocks",
    action: "collect"
  },
  {
    title: "Construa a Blockchain",
    text: "Conectar blocos = criar a blockchain mais segura do mundo!",
    highlight: "chain",
    action: "chain"
  },
  {
    title: "Hash Power",
    text: "Sua velocidade de mineração. Bitcoin real usa ~400 EH/s!",
    highlight: "hashpower",
    action: "explain"
  },
  {
    title: "Evite Hackers",
    text: "Proteja a rede de ataques 51% e double spending!",
    highlight: "enemies",
    action: "avoid"
  }
];

export const educationalPopups = {
  firstBlock: " Primeiro bloco minerado! No Bitcoin real, isso acontece a cada ~10 minutos.",
  chainBuilt: " Blockchain criada! Agora as transações são imutáveis.",
  hashIncrease: " Hash power aumentou! Mais segurança para a rede.",
  enemyDefeated: " Hacker derrotado! A descentralização protege o Bitcoin.",
  levelUp: " Level up! Bitcoin fica mais difícil de minerar com o tempo."
};

export const historicalLevels = {
  1: { year: 2009, event: "Genesis Block", difficulty: 1 },
  2: { year: 2010, event: "Pizza Purchase", difficulty: 2 },
  3: { year: 2012, event: "First Halving", difficulty: 3 },
  4: { year: 2017, event: "Bull Run", difficulty: 4 },
  5: { year: 2021, event: "El Salvador", difficulty: 5 },
  6: { year: 2023, event: "Lightning Network", difficulty: 6 },
  7: { year: 2024, event: "ETF Approval", difficulty: 7 },
  8: { year: 2024, event: "Ordinals", difficulty: 8 },
  9: { year: 2025, event: "Global Adoption", difficulty: 9 },
  10: { year: 2026, event: "Quantum Resistance", difficulty: 10 }
};

export const achievements = {
  firstMiner: {
    title: "Primeiro Minerador",
    description: "Coletou seu primeiro bloco",
    educational: "Satoshi minerou o primeiro bloco em 3 jan 2009",
    reward: "Aprendeu sobre Genesis Block",
    unlocked: false
  },
  chainBuilder: {
    title: "Construtor de Cadeia",
    description: "Conectou 10 blocos seguidos",
    educational: "Blockchain = cadeia de blocos criptograficamente ligados",
    reward: "Entendeu conceito de blockchain",
    unlocked: false
  },
  halvingSurvivor: {
    title: "Sobrevivente do Halving",
    description: "Passou pelo primeiro halving",
    educational: "A cada 210.000 blocos, recompensa é cortada pela metade",
    reward: "Compreendeu escassez programada",
    unlocked: false
  }
};

export const bitcoinFacts = [
  "Bitcoin foi criado em 2009 por uma pessoa ou grupo sob o pseudônimo Satoshi Nakamoto.",
  "Existirão apenas 21 milhões de bitcoins no total, o que o torna um recurso escasso.",
  "Um bloco é minerado aproximadamente a cada 10 minutos na rede Bitcoin.",
  "A menor unidade de Bitcoin é chamada 'satoshi', equivalente a 0,00000001 BTC.",
  "Bitcoin usa um algoritmo de consenso chamado Prova de Trabalho (Proof of Work).",
  "O primeiro bloco, conhecido como 'Genesis Block', contém uma mensagem sobre falhas bancárias.",
  "Em 2010, alguém pagou 10.000 BTC por duas pizzas, hoje uma fortuna.",
  "A cada aproximadamente 4 anos, ocorre o 'halving', reduzindo a recompensa de mineração pela metade.",
  "O custo energético da mineração de Bitcoin é significativo, porém incentiva uso de energia renovável.",
  "A blockchain do Bitcoin nunca foi hackeada em mais de 10 anos de operação."
];

export const quizQuestions = [
  {
    question: "O que é uma blockchain?",
    options: ["Base de dados", "Cadeia de blocos", "Tipo de moeda", "Software"],
    correct: 1,
    explanation: "Blockchain é uma cadeia de blocos criptograficamente ligados"
  },
  {
    question: "Com que frequência novos blocos Bitcoin são criados?",
    options: ["1 minuto", "10 minutos", "1 hora", "1 dia"],
    correct: 1,
    explanation: "Bitcoin ajusta dificuldade para manter ~10 minutos/bloco"
  },
  {
    question: "Quem criou o Bitcoin?",
    options: ["Elon Musk", "Bill Gates", "Satoshi Nakamoto", "Vitalik Buterin"],
    correct: 2,
    explanation: "Satoshi Nakamoto é o pseudônimo da pessoa ou grupo que criou o Bitcoin"
  },
  {
    question: "Quantos bitcoins existirão no total?",
    options: ["1 milhão", "21 milhões", "100 milhões", "Infinitos"],
    correct: 1,
    explanation: "O limite de 21 milhões torna o Bitcoin escasso como o ouro"
  },
  {
    question: "O que é o halving no Bitcoin?",
    options: ["Divisão da moeda", "Redução pela metade da recompensa", "Aumento da dificuldade", "Atualização da rede"],
    correct: 1,
    explanation: "A cada ~4 anos (210.000 blocos), a recompensa é cortada pela metade"
  }
];

export const enemyTypes = {
  hacker51: {
    name: "Hacker 51%",
    description: "Tenta controlar mais de 50% da rede",
    educational: "Ataques 51% são teoricamente possíveis mas extremamente caros"
  },
  doubleSpender: {
    name: "Double Spender",
    description: "Quer gastar o mesmo Bitcoin duas vezes",
    educational: "Bitcoin previne double spending através da blockchain"
  },
  quantumThreat: {
    name: "Computador Quântico",
    description: "Boss que ameaça a criptografia",
    educational: "Bitcoin pode se adaptar a ameaças quânticas futuras"
  }
};

// Tracks current educational state
export let educationState = {
  tutorialActive: true,
  currentTutorialStep: 0,
  showingPopup: false,
  currentPopup: null,
  achievementsUnlocked: 0,
  factIndex: 0,
  quizActive: false,
  currentQuestion: 0,
  quizScore: 0,
  tutorialCompleted: false
};

// Methods for managing education state
export function advanceTutorial() {
  if (educationState.currentTutorialStep < tutorialSteps.length - 1) {
    educationState.currentTutorialStep++;
    return true;
  } else {
    educationState.tutorialActive = false;
    educationState.tutorialCompleted = true;
    return false;
  }
}

export function showEducationalPopup(popupKey) {
  if (educationalPopups[popupKey] && !educationState.showingPopup) {
    educationState.showingPopup = true;
    educationState.currentPopup = popupKey;
    return true;
  }
  return false;
}

export function hideEducationalPopup() {
  educationState.showingPopup = false;
  educationState.currentPopup = null;
}

export function unlockAchievement(achievementKey) {
  if (achievements[achievementKey] && !achievements[achievementKey].unlocked) {
    achievements[achievementKey].unlocked = true;
    educationState.achievementsUnlocked++;
    return true;
  }
  return false;
}

export function getRandomFact() {
  const fact = bitcoinFacts[educationState.factIndex];
  educationState.factIndex = (educationState.factIndex + 1) % bitcoinFacts.length;
  return fact;
}

export function startQuiz() {
  educationState.quizActive = true;
  educationState.currentQuestion = 0;
  educationState.quizScore = 0;
}

export function answerQuestion(optionIndex) {
  const currentQuestion = quizQuestions[educationState.currentQuestion];
  const correct = optionIndex === currentQuestion.correct;
  
  if (correct) {
    educationState.quizScore++;
  }
  
  if (educationState.currentQuestion < quizQuestions.length - 1) {
    educationState.currentQuestion++;
    return { complete: false, correct };
  } else {
    educationState.quizActive = false;
    return { 
      complete: true, 
      correct,
      finalScore: educationState.quizScore,
      totalQuestions: quizQuestions.length
    };
  }
}

export function terminateQuiz() {
  educationState.quizActive = false;
  return {
    complete: true,
    finalScore: educationState.quizScore,
    totalQuestions: quizQuestions.length
  };
}

export function resetEducationState() {
  educationState = {
    tutorialActive: true,
    currentTutorialStep: 0,
    showingPopup: false,
    currentPopup: null,
    achievementsUnlocked: 0,
    factIndex: 0,
    quizActive: false,
    currentQuestion: 0,
    quizScore: 0,
    tutorialCompleted: false
  };
  
  // Reset achievements
  Object.keys(achievements).forEach(key => {
    achievements[key].unlocked = false;
  });
}