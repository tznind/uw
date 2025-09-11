// moves.js
function renderMoves(containerId, available) {
  const moves = [
    {
	
	id: "a1b2c3", 
      title: "Chart the Immaterium (+Conviction)",
      outcomes: [
        { range: "≥ 10", text: "The passage is smooth and precise. You emerge exactly where intended.", bullets: [] },
        { range: "7–9", text: "You reach the destination, but choose one:", bullets: [
          "The voyage takes longer than expected",
          "The ship suffers debility or damage",
          "You attract unwanted attention"
        ]},
        { range: "≤ 6", text: "GM chooses one:", bullets: [
          "You emerge off-course",
          "The voyage has taken far too long",
          "A warp intrusion threatens the ship",
          "Your mind or soul suffers strain; mark 1 Debility or permanent stigma."
        ]}
      ]
    },
    {
		
      id: "d4e5f6",
      title: "Scan the Astropathic Beacon",
      outcomes: [
        { range: "≥ 10", text: "You receive a clear psychic signal.", bullets: [] },
        { range: "7–9", text: "The signal is fuzzy, choose one:", bullets: [
          "You misinterpret part of the message",
          "The beacon signals a false location"
        ]},
        { range: "≤ 6", text: "The signal is incomprehensible:", bullets: [
          "You feel psychic backlash",
          "Your mind is shaken, mark 1 Debility"
        ]}
      ]
    },
    {
      id: "g7h8i9",
      title: "Navigate the Warp Currents",
      outcomes: [
        { range: "≥ 10", text: "Your navigation is flawless.", bullets: [] },
        { range: "7–9", text: "Partial success:", bullets: [
          "You drift slightly off course",
          "Minor strain on crew"
        ]},
        { range: "≤ 6", text: "Catastrophic:", bullets: [
          "Major warp disruption",
          "Crew suffers stress and debility"
        ]}
      ]
    }
  ];


  const container = document.getElementById(containerId);
  if (!container) return;

  const params = new URLSearchParams(location.search);

  moves.forEach(move => {
    const moveId = move.id || shortId();
    move.id = moveId; // save id in case it wasn't pre-set

    const moveDiv = document.createElement("div");
    moveDiv.className = "move";

    const label = document.createElement("label");
    label.className = "move-title";

    const checkbox = document.createElement("input");
    checkbox.name = "move_" + moveId;
    checkbox.type = "checkbox";

    // Load from URL or default
    checkbox.checked = params.has("move_" + moveId) 
      ? params.get("move_" + moveId) === "1"
      : (available[moveId] || false);

    label.appendChild(checkbox);
    label.append(" " + move.title);
    moveDiv.appendChild(label);

    // Outcomes
    move.outcomes.forEach(outcome => {
      const outcomeDiv = document.createElement("div");
      outcomeDiv.className = "outcome";

      const p = document.createElement("p");
      p.innerHTML = `<strong>${outcome.range}:</strong> ${outcome.text}`;
      outcomeDiv.appendChild(p);

      if (outcome.bullets.length > 0) {
        const ul = document.createElement("ul");
        outcome.bullets.forEach(bullet => {
          const li = document.createElement("li");
          li.textContent = bullet;
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
      newParams.set("move_" + moveId, checkbox.checked ? "1" : "0");
      history.replaceState({}, "", "?" + newParams);
    });
  });
}

// Expose globally
window.renderMoves = renderMoves;