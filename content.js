
const slangMap = {
  "ts": "this shit",
  "pmo": "piss me off",
  "ngl": "not gonna lie",
  "fr": "for real",
  "ya": "yeah",
  "nga": "nigga"
};

const pattern = new RegExp(`\\b(${Object.keys(slangMap).join("|")})\\b`, "gi");

function replaceText(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const original = node.nodeValue;
    const replaced = original.replace(pattern, (match) => {
      const lower = match.toLowerCase();
      return slangMap[lower] !== undefined ? slangMap[lower] : match;
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
