import { extractPdf } from "./api.js";
import { renderPdfPage } from "./pdf-viewer.js";
import { drawTextBoxes } from "./overlay.js";
import { downloadJson } from "./export.js";

const $ = (id) => document.getElementById(id);
const pdfInput = $("pdfInput");
let pdfDocument = null;
let extraction = null;
let currentPage = 1;
let selectedId = null;

pdfInput.addEventListener("change", async () => {
  const file = pdfInput.files?.[0];
  if (!file) return;
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    $("status").textContent = "請選擇 PDF 檔案。";
    return;
  }
  $("status").textContent = "正在擷取文字與座標……";
  try {
    extraction = await extractPdf(file);
    const bytes = await file.arrayBuffer();
    pdfDocument = await window.pdfjsLib.getDocument({ data: bytes }).promise;
    currentPage = 1;
    $("emptyState").hidden = true;
    $("pdfStage").hidden = false;
    $("detailsEmpty").hidden = true;
    $("details").hidden = false;
    $("exportJson").disabled = false;
    $("prevPage").disabled = false;
    $("nextPage").disabled = false;
    await showPage();
    $("status").textContent = `完成：共 ${extraction.page_count} 頁。`;
  } catch (error) {
    $("status").textContent = `處理失敗：${error.message}`;
  }
});

async function showPage() {
  const canvas = $("pdfCanvas");
  const { page, viewport } = await renderPdfPage(pdfDocument, currentPage, canvas);
  const pageData = extraction.pages.find(p => p.page === currentPage);
  $("pageIndicator").textContent = `${currentPage} / ${pdfDocument.numPages}`;
  $("prevPage").disabled = currentPage <= 1;
  $("nextPage").disabled = currentPage >= pdfDocument.numPages;
  const pageWidth = pageData?.width || page.view[2];
  const pageHeight = pageData?.height || page.view[3];
  const items = pageData?.items || [];
  drawTextBoxes($("overlay"), items, pageWidth, pageHeight, viewport, selectItem);
  $("resultCount").textContent = `本頁 ${items.length} 個文字單位`;
  $("itemsList").replaceChildren();
  for (const item of items) {
    const button = document.createElement("button");
    button.className = "item-row";
    button.textContent = item.text;
    button.addEventListener("click", () => selectItem(item));
    $("itemsList").append(button);
  }
  $("coordinateOutput").textContent = "請點選一個文字框";
  selectedId = null;
}

function selectItem(item, box) {
  selectedId = item.id;
  document.querySelectorAll(".text-box").forEach(el => el.classList.remove("selected"));
  if (box) box.classList.add("selected");
  $("coordinateOutput").textContent = JSON.stringify({
    text: item.text, page: item.page, bbox: item.bbox, corners: item.corners
  }, null, 2);
  [...$("itemsList").children].forEach((el, index) => {
    el.classList.toggle("active", extraction.pages[currentPage - 1].items[index]?.id === selectedId);
  });
}

$("prevPage").addEventListener("click", async () => { if (currentPage > 1) { currentPage--; await showPage(); } });
$("nextPage").addEventListener("click", async () => { if (currentPage < pdfDocument.numPages) { currentPage++; await showPage(); } });
$("exportJson").addEventListener("click", () => {
  if (extraction) downloadJson(extraction);
});
