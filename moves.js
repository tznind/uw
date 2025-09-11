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

        // Render outcomes if they exist
        if (move.outcomes && move.outcomes.length) {
            move.outcomes.forEach(outcome => {
                const outcomeDiv = document.createElement("div");
                outcomeDiv.className = "outcome";

                const p = document.createElement("p");
                if (outcome.range && outcome.range.trim() !== "") {
                    p.innerHTML = `<strong>${outcome.range}:</strong> ${outcome.text}`;
                } else {
                    p.innerHTML = outcome.text;
                }
                outcomeDiv.appendChild(p);

                if (outcome.bullets && outcome.bullets.length) {
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
        }

        // Render pick options if they exist
        if (move.pick && move.pick.length) {
            const pickDiv = document.createElement("div");
            pickDiv.className = "pick-options";

            move.pick.forEach((opt, index) => {
                const label = document.createElement("label");
                label.style.display = "block"; // each option on its own line

                const pickCheckbox = document.createElement("input");
                pickCheckbox.type = "checkbox";
                pickCheckbox.name = `move_${move.id}_pick_${index}`;
                pickCheckbox.value = opt;

                // Persist selection from URL
                if (params.has(`move_${move.id}_pick_${index}`)) {
                    pickCheckbox.checked = params.get(`move_${move.id}_pick_${index}`) === "1";
                }

                // Update URL on change
                pickCheckbox.addEventListener("change", () => {
                    const newParams = new URLSearchParams(location.search);
                    newParams.set(`move_${move.id}_pick_${index}`, pickCheckbox.checked ? "1" : "0");
                    history.replaceState({}, "", "?" + newParams);
                });

                label.appendChild(pickCheckbox);
                label.appendChild(document.createTextNode(" " + opt));
                pickDiv.appendChild(label);
            });

            moveDiv.appendChild(pickDiv);
        }

        // Horizontal rule
        const hr = document.createElement("hr");
        hr.style.border = "0";
        hr.style.height = "2px";
        hr.style.backgroundColor = "#ccc";
        moveDiv.appendChild(hr);

        // Persist to URL on change
        checkbox.addEventListener("change", () => {
            const newParams = new URLSearchParams(location.search);
            newParams.set("move_" + move.id, checkbox.checked ? "1" : "0");
            history.replaceState({}, "", "?" + newParams);
        });

        container.appendChild(moveDiv);
    });
}

window.renderMoves = renderMoves;