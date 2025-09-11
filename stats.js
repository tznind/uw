
// Render hex stats inside a container
window.renderStats = function(containerSelector, hexStats) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const params = new URLSearchParams(location.search);

  const hexRow = document.createElement("div");
  hexRow.className = "hex-row";

  hexStats.forEach(stat => {
    const hexContainer = document.createElement("div");
    hexContainer.className = "hex-container";

    const wrapper = document.createElement("div");
    wrapper.className = "hex-input-wrapper";

    const input = document.createElement("input");
    input.type = "text";
    input.id = stat.id;
    input.placeholder = stat.title;

    // Restore value from URL if exists
    if (params.has(stat.id)) input.value = params.get(stat.id);

    wrapper.appendChild(input);
    hexContainer.appendChild(wrapper);

    const title = document.createElement("div");
    title.className = "hex-title";
    title.textContent = stat.title;
    hexContainer.appendChild(title);

    hexRow.appendChild(hexContainer);
  });

  container.appendChild(hexRow);

  return hexRow;
};
