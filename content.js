
const slangMap = {
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
  "ai": "artificial intelligence",
  
};

const pattern = new RegExp(`\\b(${Object.keys(slangMap).join("|")})\\b`, "gi");

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

replaceText(document.body);

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => replaceText(node));
  });
});

observer.observe(document.body, { childList: true, subtree: true });
