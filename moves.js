// moves.js
function renderMoves(containerId, available, movesArray) {
  const moves = movesArray || [];

  const container = document.getElementById(containerId);
  if (!container) return;

  const params = new URLSearchParams(location.search);

  moves.forEach(move => {
    // Skip entirely if not in available
    if (!available.hasOwnProperty(move.id)) return;

    const moveDiv = document.createElement("div");
    moveDiv.className = "move";

    const label = document.createElement("label");
    label.className = "move-title";

    const checkbox = document.createElement("input");
    checkbox.name = "move_" + move.id;
    checkbox.type = "checkbox";

    // Determine checked state
    if (params.has("move_" + move.id)) {
      checkbox.checked = params.get("move_" + move.id) === "1";
    } else {
      checkbox.checked = available[move.id]; // true = checked, false = unchecked
    }

    label.appendChild(checkbox);
    label.append(" " + move.title);
    moveDiv.appendChild(label);

    // Render outcomes
    move.outcomes.forEach(outcome => {
      const outcomeDiv = document.createElement("div");
      outcomeDiv.className = "outcome";

      const p = document.createElement("p");
      p.innerHTML = `<strong>${outcome.range}:</strong> ${outcome.text}`;
      outcomeDiv.appendChild(p);

      if (outcome.bullets.length) {
        const ul = document.createElement("ul");
        outcome.bullets.forEach(b => {
          const li = document.createElement("li");
          li.textContent = b;
          ul.appendChild(li);
        });
        outcomeDiv.appendChild(ul);
      }

      moveDiv.appendChild(outcomeDiv);
    });

    container.appendChild(moveDiv);

    // Persist to URL on change
    checkbox.addEventListener("change", () => {
      const newParams = new URLSearchParams(location.search);
      newParams.set("move_" + move.id, checkbox.checked ? "1" : "0");
      history.replaceState({}, "", "?" + newParams);
    });
  });
}

// Expose globally
window.renderMoves = renderMoves;