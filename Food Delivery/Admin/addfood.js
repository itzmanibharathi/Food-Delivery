import { db } from "../firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const form = document.getElementById("foodForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("foodName").value;
  const price = parseFloat(document.getElementById("price").value);
  const hotelName = document.getElementById("hotelName").value;
  const imageUrl = document.getElementById("imageUrl").value;

  try {
    await push(ref(db, "foods"), {
      name,
      price,
      hotelName,
      imageUrl
    });
    alert("Food added successfully!");
    form.reset();
  } catch (err) {
    alert("Error adding food: " + err.message);
  }
});
