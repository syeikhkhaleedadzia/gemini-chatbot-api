const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Fungsi untuk menambahkan chat ke layar dengan gaya Bubble
function appendMessage(role, text) {
  const msgDiv = document.createElement("div");
  // 'user' akan ke kanan (biru), 'bot' akan ke kiri (abu-abu)
  msgDiv.className = `message ${role}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "content";
  contentDiv.textContent = text;

  msgDiv.appendChild(contentDiv);
  chatBox.appendChild(msgDiv);

  // Auto-scroll ke bawah
  chatBox.scrollTop = chatBox.scrollHeight;
  return contentDiv; // Kita kembalikan ini supaya bisa diubah pas bot selesai "mikir"
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  // 1. Tampilkan pesan kamu di kanan (biru)
  appendMessage("user", message);
  userInput.value = "";

  // 2. Tampilkan status "Thinking..." di kiri (abu-abu)
  const thinkingMsg = appendMessage("bot", "Thinking...");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation: [{ role: "user", text: message }],
      }),
    });

    if (!response.ok) throw new Error("Server bermasalah");

    const data = await response.json();

    // 3. Ganti tulisan "Thinking..." jadi jawaban asli Gemini
    if (data.result) {
      thinkingMsg.textContent = data.result;
    } else {
      thinkingMsg.textContent = "Sorry, no response received.";
    }
  } catch (error) {
    console.error("Error:", error);
    thinkingMsg.textContent = "Gagal terhubung ke server.";
    thinkingMsg.style.color = "red";
  }
});
