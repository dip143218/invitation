// =====================================
// DATE INVITATION WEBSITE - FINAL VERSION
// =====================================

const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const startTime = Date.now();

// Music Control
let music, musicBtn, playing = false;

function initMusic() {
  music = document.getElementById("bgMusic");
  musicBtn = document.getElementById("musicBtn");
  if (music) {
    music.play().then(() => {
      playing = true;
      if (musicBtn) musicBtn.innerHTML = "⏸";
    }).catch(() => {
      if (musicBtn) musicBtn.innerHTML = "▶️";
    });
  }
}

function toggleMusic() {
  if (!music || !musicBtn) return;
  if (playing) {
    music.pause();
    musicBtn.innerHTML = "▶️";
    playing = false;
  } else {
    music.play();
    musicBtn.innerHTML = "⏸";
    playing = true;
  }
}

// Basic Functions
function openEnvelope(){
  const loading = document.getElementById("loading");
  if(loading){
    loading.classList.add("hideLoading");
    setTimeout(() => loading.style.display = "none", 800);
  }
}

function goNext(){
  document.body.classList.add("fadeOut");
  setTimeout(() => window.location.href = "date.html", 600);
}

function secretMessage(){
  alert(`🌸\n\nYou found the secret!\n\nEvery click you make makes me smile more.\n\n❤️`);
}

// Date Page Functions
function highlightChip(btn, selector){
  document.querySelectorAll(selector).forEach(c => c.classList.remove("active"));
  if(btn) btn.classList.add("active");
}

function pickQuickDate(type, btn){
  const dateInput = document.getElementById("datePicker");
  if(!dateInput) return;

  const today = new Date();
  let target = new Date(today);

  if(type === "tomorrow") target.setDate(today.getDate() + 1);
  else if(type === "weekend"){
    let diff = (6 - today.getDay() + 7) % 7;
    if(diff === 0) diff = 7;
    target.setDate(today.getDate() + diff);
  }
  else if(type === "nextweek") target.setDate(today.getDate() + 7);

  dateInput.value = target.toISOString().split('T')[0];
  highlightChip(btn, ".date-chip");
}

function pickQuickTime(value, btn){
  const timeInput = document.getElementById("timePicker");
  if(timeInput){
    timeInput.value = value;
    highlightChip(btn, ".time-chip");
  }
}

function skipDate(){
  document.body.classList.add("fadeOut");
  setTimeout(() => window.location.href = "food.html", 500);
}

function saveDate(){
  const dateInput = document.getElementById("datePicker");
  const timeInput = document.getElementById("timePicker");

  const date = dateInput ? dateInput.value : "";
  const time = timeInput ? timeInput.value : "";

  if(!date || !time){
    alert("Please select both Date and Time ");
    return;
  }

  localStorage.setItem("date", date);
  localStorage.setItem("time", time);

  document.body.classList.add("fadeOut");
  setTimeout(() => window.location.href = "food.html", 500);
}

// Food Page
function saveFood(){
  const checked = document.querySelectorAll("input[type='checkbox']:checked");
  const foods = Array.from(checked).map(item => item.value);

  if(foods.length === 0){
    alert("Pick at least one food ❤️");
    return;
  }

  localStorage.setItem("foods", JSON.stringify(foods));

  document.body.classList.add("fadeOut");
  setTimeout(() => window.location.href = "final.html", 500);
}

// Final Page
function formatDate(dateStr){
  if(!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

function formatTime(timeStr){
  if(!timeStr) return "—";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2,'0')} ${period}`;
}

function renderResult(){
  const result = document.getElementById("result");
  if(!result) return;

  const date = localStorage.getItem("date");
  const time = localStorage.getItem("time");
  const foods = JSON.parse(localStorage.getItem("foods") || "[]");

  result.innerHTML = `
    <h3>📅 ${formatDate(date)}</h3>
    <h3>🕒 ${formatTime(time)}</h3>
    <h3>🍽️ ${foods.length ? foods.join(", ") : "Surprise me"}</h3>
  `;
}

// Google Sheets Integration
function sendToGoogleSheets(data) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbzPNKCvULke62leZ-hLqd7TGqAMb8c-i-E2sc2xOLQI1rYTCnakoa4WLHlXSj-0djHT/exec";

  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// Say Something Form
function saySomething() {
  const questions = [
    "Say some about you?",
    "Beach or mountains?",
    "What’s your favorite food?",
    "What’s your favorite color?",
    "Do you like movies or dramas more?",
    "What makes you happy the most?",
    "Why are you answer this question?",
    "Do you like traveling? Want to travel with me?",
    "What kind of music do you listen to?"
  ];

  let formHTML = `<div style="text-align:left; margin:20px 0; max-width:500px; margin-left:auto; margin-right:auto;">
    <h3 style="color:#ff4f87;">💬 Tell me more about you...</h3>`;

  questions.forEach((q, i) => {
    formHTML += `
      <div style="margin-bottom:18px;">
        <label style="display:block; margin-bottom:6px; font-weight:600; color:#555;">${i+1}. ${q}</label>
        <textarea id="q${i}" rows="2" style="width:100%; padding:10px; border-radius:12px; border:2px solid #ffc4d6; resize:vertical; font-family:inherit;"></textarea>
      </div>`;
  });

  formHTML += `<button onclick="submitResponses()" class="yes" style="width:100%;margin-top:15px;">Submit Responses ❤️</button>`;

  const modal = document.createElement("div");
  modal.id = "responseModal";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:10000;";
  modal.innerHTML = `<div style="background:white;padding:30px;border-radius:24px;max-width:90%;max-height:90vh;overflow:auto;">${formHTML}</div>`;
  document.body.appendChild(modal);
}

function closeForm(){
  const modal = document.getElementById("responseModal");
  if(modal) modal.remove();
}

function submitResponses(){
  let responses = [];
  for(let i = 0; i < 9; i++){
    const ta = document.getElementById(`q${i}`);
    responses.push(ta ? ta.value.trim() || "(no answer)" : "");
  }

  const data = {
    visitTime: new Date().toLocaleString(),
    timeSpent: Math.round((Date.now() - startTime)/1000) + " seconds",
    date: localStorage.getItem("date") || "",
    time: localStorage.getItem("time") || "",
    foods: JSON.parse(localStorage.getItem("foods") || "[]"),
    q1: responses[0], q2: responses[1], q3: responses[2],
    q4: responses[3], q5: responses[4], q6: responses[5],
    q7: responses[6], q8: responses[7], q9: responses[8]
  };

  sendToGoogleSheets(data);

  alert("✅ Thank you! Your response has been saved to Google Sheet.");
  closeForm();
}

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  initMusic();
  if(document.getElementById("result")) renderResult();
});
