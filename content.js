
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
let slangMap = {};
let pattern = null;

function buildPattern() {
  const keys = Object.keys(slangMap);
  if (keys.length === 0) {
    pattern = null;
    return;
  }
  pattern = new RegExp(`\\b(${keys.join("|")})\\b`, "gi");
}

function matchCase(replacement, original) {
  if (original === original.toUpperCase()) {
    return replacement.toUpperCase();
  }
  if (original[0] === original[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function replaceText(node) {
  if (!pattern) return;
  if (node.nodeType === Node.TEXT_NODE) {
    const original = node.nodeValue;
    const replaced = original.replace(pattern, (match) => {
      const lower = match.toLowerCase();
      const replacement = slangMap[lower];
      return replacement !== undefined ? matchCase(replacement, match) : match;
    });
    if (replaced !== original) {
      node.nodeValue = replaced;
    }
  } else if (
    node.nodeType === Node.ELEMENT_NODE &&
    !["SCRIPT", "STYLE", "TEXTAREA", "INPUT"].includes(node.tagName)
  ) {
    node.childNodes.forEach(replaceText);
  }
}

function runReplacement() {
  buildPattern();
  replaceText(document.body);
}

let mutationObserver = null;

function startObserving() {
  if (mutationObserver) {
    mutationObserver.disconnect();
  }
  mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => replaceText(node));
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}


chrome.storage.sync.get(["slangMap"], (result) => {
  slangMap = result.slangMap || defaultSlangMap;
  runReplacement();
  startObserving();
});


chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes.slangMap) {
    slangMap = changes.slangMap.newValue || defaultSlangMap;
    runReplacement(); 
  }
});
