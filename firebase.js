import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-ajaVChBSIK7uXIgcv5JTlxDjuxLWHDA",
  authDomain: "worker-system.firebaseapp.com",
  projectId: "worker-system",
  storageBucket: "worker-system.firebasestorage.app",
  messagingSenderId: "249724369179",
  appId: "1:249724369179:web:9d14d30c499aec379dbbbe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
