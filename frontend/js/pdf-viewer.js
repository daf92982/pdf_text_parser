export async function renderPdfPage(pdf, pageNumber, canvas) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1.35 });
  const context = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;
  return { page, viewport };
}
