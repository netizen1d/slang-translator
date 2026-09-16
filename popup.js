const defaultSlangMap = {
  "ts": "this shit",
  "pmo": "piss me off",
  "ngl": "not gonna lie",
  "fr": "for real",
  "ya": "yeah",
  "nga": "nigga",
  "plz": "please",
  "dat": "that",
  "u": "you",
  "luv": "love",
  "<3": "❤️ ",
  "itz": "it's",
  "ye": "yeah",
  "pfp": "profile picture",
  "bcuz": "because",
  "gc": "groupchat",
  "ai": "artificial intelligence"
};

let currentMap = {};

function render() {
  const listEl = document.getElementById("list");
  listEl.innerHTML = "";
  Object.entries(currentMap).forEach(([slang, full]) => {
    const row = document.createElement("div");
    row.className = "row";

    const slangInput = document.createElement("input");
    slangInput.value = slang;
    slangInput.dataset.key = slang;
    slangInput.dataset.field = "slang";

    const fullInput = document.createElement("input");
    fullInput.value = full;
    fullInput.dataset.key = slang;
    fullInput.dataset.field = "full";

    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.addEventListener("click", () => {
      delete currentMap[slang];
      render();
    });

    row.appendChild(slangInput);
    row.appendChild(fullInput);
    row.appendChild(delBtn);
    listEl.appendChild(row);
  });
}

function collectFromInputs() {
  const rows = document.querySelectorAll("#list .row");
  const newMap = {};
  rows.forEach((row) => {
    const inputs = row.querySelectorAll("input");
    const slangKey = inputs[0].value.trim().toLowerCase();
    const fullVal = inputs[1].value.trim();
    if (slangKey && fullVal) {
      newMap[slangKey] = fullVal;
    }
  });
  currentMap = newMap;
}

document.getElementById("addBtn").addEventListener("click", () => {
  const slangEl = document.getElementById("newSlang");
  const fullEl = document.getElementById("newFull");
  const slang = slangEl.value.trim().toLowerCase();
  const full = fullEl.value.trim();
  if (slang && full) {
    currentMap[slang] = full;
    slangEl.value = "";
    fullEl.value = "";
    render();
  }
});

document.getElementById("saveBtn").addEventListener("click", () => {
  collectFromInputs();
  chrome.storage.sync.set({ slangMap: currentMap }, () => {
    const status = document.getElementById("status");
    status.textContent = "Saved!";
    setTimeout(() => (status.textContent = ""), 1500);
  });
});

chrome.storage.sync.get(["slangMap"], (result) => {
  currentMap = result.slangMap || defaultSlangMap;
  render();
});
