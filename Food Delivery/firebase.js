import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDZQnSNVQ16Ur88fpe3Gb1PFrJ4Vg8qz68",
  authDomain: "food-ba0be.firebaseapp.com",
  databaseURL: "https://food-ba0be-default-rtdb.firebaseio.com/", // Realtime DB URL
  projectId: "food-ba0be",
  storageBucket: "food-ba0be.appspot.com",
  messagingSenderId: "760153835565",
  appId: "1:760153835565:web:66ae3ee406b8095c8690a4"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
