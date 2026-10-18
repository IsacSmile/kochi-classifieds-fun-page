const runawayButton = document.getElementById("runaway-button");
const normalLink = document.getElementById("entebusiness-link");

const EDGE_PADDING = 18;
const SAFE_GAP = 26;
let hasEscaped = false;

function rectanglesOverlap(a, b, gap = 0) {
  return !(
    a.right + gap < b.left ||
    a.left - gap > b.right ||
    a.bottom + gap < b.top ||
    a.top - gap > b.bottom
  );
}

function getCandidateRect(x, y, width, height) {
  return {
    left: x,
    top: y,
    right: x + width,
    bottom: y + height
  };
}

function getRandomPosition() {
  const buttonRect = runawayButton.getBoundingClientRect();
  const maxX = Math.max(
    EDGE_PADDING,
    window.innerWidth - buttonRect.width - EDGE_PADDING
  );
  const maxY = Math.max(
    EDGE_PADDING,
    window.innerHeight - buttonRect.height - EDGE_PADDING
  );

  const protectedRect = normalLink.getBoundingClientRect();

  // Try several positions so the prank button doesn't cover
  // the normal Entebusiness.online link.
  for (let attempt = 0; attempt < 60; attempt++) {
    const x = Math.floor(
      EDGE_PADDING + Math.random() * Math.max(1, maxX - EDGE_PADDING)
    );
    const y = Math.floor(
      EDGE_PADDING + Math.random() * Math.max(1, maxY - EDGE_PADDING)
    );

    const candidate = getCandidateRect(
      x,
      y,
      buttonRect.width,
      buttonRect.height
    );

    if (!rectanglesOverlap(candidate, protectedRect, SAFE_GAP)) {
      return { x, y };
    }
  }

  // Safe fallback.
  return { x: EDGE_PADDING, y: EDGE_PADDING };
}

function runAway(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const { x, y } = getRandomPosition();

  if (!hasEscaped) {
    hasEscaped = true;
    runawayButton.classList.add("is-running");
    runawayButton.style.transform = "translate(0, 0)";
  }

  runawayButton.style.setProperty(
    "--tilt",
    `${Math.floor(Math.random() * 17) - 8}deg`
  );
  runawayButton.style.left = `${x}px`;
  runawayButton.style.top = `${y}px`;

  const messages = [
    "Too slow 😄",
    "Try again 👀",
    "Almost!",
    "Nope 😂",
    "Catch me!",
    "Missed me 😎",
    "Click me"
  ];

  runawayButton.childNodes[0].nodeValue =
    messages[Math.floor(Math.random() * messages.length)] + " ";
}

// Desktop: escape as soon as the pointer gets near/over the button.
runawayButton.addEventListener("mouseenter", runAway);

// Touch + mouse press fallback.
runawayButton.addEventListener("pointerdown", runAway);

// Keyboard users can trigger the same playful behavior.
runawayButton.addEventListener("click", runAway);
runawayButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    runAway(event);
  }
});

// Keep the runaway button inside the viewport if the screen is resized.
window.addEventListener("resize", () => {
  if (!hasEscaped) return;

  const rect = runawayButton.getBoundingClientRect();
  const outOfBounds =
    rect.right > window.innerWidth ||
    rect.bottom > window.innerHeight ||
    rect.left < 0 ||
    rect.top < 0;

  if (outOfBounds) {
    runAway();
  }
});
