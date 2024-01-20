import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyCgREez7oIzBjY9MtUQRIPaj5rmrj_XMfs",
  authDomain: "next-chat-bot-app.firebaseapp.com",
  projectId: "next-chat-bot-app",
  storageBucket: "next-chat-bot-app.appspot.com",
  messagingSenderId: "8252399902",
  appId: "1:8252399902:web:7e11faac41faa739d1e90f",
  measurementId: "G-C7C2K72P5Q",
};

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
