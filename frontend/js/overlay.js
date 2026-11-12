export function drawTextBoxes(container, items, pageWidth, pageHeight, viewport, onSelect) {
  container.replaceChildren();
  for (const item of items) {
    const [x0, y0, x1, y1] = item.bbox;
    const box = document.createElement("button");
    box.type = "button";
    box.className = "text-box";
    box.title = item.text;
    // Initial scaffold: PDF point coordinates are scaled to the rendered viewport.
    box.style.left = `${(x0 / pageWidth) * viewport.width}px`;
    box.style.top = `${(y0 / pageHeight) * viewport.height}px`;
    box.style.width = `${((x1 - x0) / pageWidth) * viewport.width}px`;
    box.style.height = `${((y1 - y0) / pageHeight) * viewport.height}px`;
    box.addEventListener("click", () => onSelect(item, box));
    container.append(box);
  }
}
