// Adicione sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDT_HkKDXNTe5Nxw3nM6EkzuT9Z6yl1Fws",
  authDomain: "day-time-eecbf.firebaseapp.com",
  projectId: "day-time-eecbf",
  storageBucket: "day-time-eecbf.firebasestorage.app",
  messagingSenderId: "493255636114",
  appId: "1:493255636114:web:a718f41515b15db2baa24b",
};

// Inicializa o Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exporta o banco de dados para outros arquivos
export { database };
