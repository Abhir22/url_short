import { formatToIST } from "/utils.js";

const tableBody = document.getElementById("linksTable");

async function loadTable() {
  try {
    const response = await fetch("/api/links");
    const result = await response.json();
    
    if (!result.success) {
      alert("Failed to load links: " + result.message);
      return;
    }

    const links = result.data;
    tableBody.innerHTML = "";

    if (links.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center">No links yet. Add one above!</td></tr>';
      return;
    }

    links.forEach((link) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${link.short_code}</td>
        <td><a href="${link.original_url}" target="_blank">${link.original_url}</a></td>
        <td>${link.clicks}</td>
        <td>${formatToIST(link.last_clicked)}</td>
        <td>${formatToIST(link.created_at)}</td>
        <td><button class="action-btn copy-btn" onclick="copyLink('${link.short_code}')">Copy</button></td>
        <td>
          <button class="action-btn view-btn" onclick="viewLink('${link.short_code}')">View</button>
          <button class="action-btn delete-btn" onclick="deleteLink('${link.short_code}')">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading links:", error);
    alert("Error loading links. Check console.");
  }
}

loadTable();

window.copyLink = function(shortCode) {
  const fullUrl = window.location.origin + "/" + shortCode;
  navigator.clipboard.writeText(fullUrl);
  alert("Copied: " + fullUrl);
}

window.viewLink = function(shortCode) {
  window.location.href = `/stats/${shortCode}`;
}

window.deleteLink = async function(shortCode) {
  if (!confirm(`Delete link ${shortCode}?`)) return;

  try {
    const response = await fetch(`/api/${shortCode}`, {
      method: "DELETE"
    });
    const result = await response.json();

    if (result.success) {
      alert("Link deleted!");
      loadTable();
    } else {
      alert("Failed to delete: " + result.message);
    }
  } catch (error) {
    console.error("Error deleting link:", error);
    alert("Error deleting link");
  }
}




// Health check button - navigate to health page
const healthBtn = document.getElementById("healthBtn");
healthBtn.addEventListener("click", () => {
  window.location.href = "/health";
});

// Add link
const addLinkBtn = document.getElementById("addLinkBtn");
addLinkBtn.addEventListener("click", async () => {
  const url = document.getElementById("targetUrl").value;
  const customCode = document.getElementById("customCode").value.trim();
  
  if (!url) return alert("Please enter a URL");

  const payload = { original_url: url };
  if (customCode) {
    payload.custom_code = customCode;
  }

  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.success) {
      alert(`Link created! Short code: ${result.data.short_code}`);
      document.getElementById("targetUrl").value = "";
      document.getElementById("customCode").value = "";
      loadTable();
    } else {
      alert("Failed to create link: " + result.message);
    }
  } catch (error) {
    console.error("Error creating link:", error);
    alert("Error creating link");
  }
});
