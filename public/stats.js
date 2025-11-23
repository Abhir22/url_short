import { formatToIST } from "/utils.js";

// Extract shortCode from /stats/:shortCode
const shortCode = window.location.pathname.split("/").pop();

document.getElementById("backBtn").onclick = () => history.back();

// Correct API route based on your backend
const API_URL = `/api/links/${shortCode}`;

async function loadStats() {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      console.error("Failed to fetch stats:", res.statusText);
      throw new Error("Failed to fetch stats");
    }

    const response = await res.json();
    const data = response.data;

    // Fill basic stats
    document.getElementById("shortCodeTitle").innerText =
      "Short Code: " + data.short_code;

    document.getElementById("originalUrl").href = data.original_url;
    document.getElementById("originalUrl").innerText = data.original_url;

    document.getElementById("totalClicks").innerText = data.clicks;
    document.getElementById("createdAt").innerText = formatToIST(data.created_at);
    document.getElementById("lastClicked").innerText = formatToIST(data.last_clicked);

    renderChart(
      ["Day 1", "Day 2", "Day 3"],
      [3, 5, data.clicks]
    );

  } catch (err) {
    console.error("Failed to load stats:", err);
  }
}

function renderChart(labels, values) {
  new Chart(document.getElementById("clickChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Clicks",
        data: values,
        borderWidth: 2,
        fill: false
      }]
    }
  });
}

loadStats();
