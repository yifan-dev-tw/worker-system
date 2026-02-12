import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  // 你的設定
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
