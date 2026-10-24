// A fictional label drawn in the browser so the demo never needs a real person's records.
export function makeSampleLabel() {
  const canvas = document.createElement('canvas')
  canvas.width = 900
  canvas.height = 620
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 900, 620)
  ctx.strokeStyle = '#1f3a5f'
  ctx.lineWidth = 6
  ctx.strokeRect(20, 20, 860, 580)
  ctx.fillStyle = '#1f3a5f'
  ctx.fillRect(20, 20, 860, 70)
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px Arial, sans-serif'
  ctx.fillText('SAMPLE PHARMACY   Rx 000000', 44, 66)
  ctx.fillStyle = '#111111'
  const lines = [
    ['bold 26px Arial, sans-serif', 'SAMPLE PATIENT (not a real person)', 140],
    ['bold 36px Arial, sans-serif', 'EXAMPLECILLIN 250 MG TABLETS', 200],
    ['30px Arial, sans-serif', 'TAKE 1 TABLET BY MOUTH TWICE DAILY', 262],
    ['30px Arial, sans-serif', 'WITH FOOD', 306],
    ['26px Arial, sans-serif', 'QTY: 60        REFILLS: 2', 370],
    ['26px Arial, sans-serif', 'DISCARD AFTER: 01/2027', 414],
    ['bold 24px Arial, sans-serif', 'WARNING: CONTRAINDICATED IF ALLERGIC TO', 480],
    ['bold 24px Arial, sans-serif', 'PENICILLIN. MAY CAUSE NAUSEA. AS NEEDED', 516],
    ['bold 24px Arial, sans-serif', 'FOR ANY QUESTIONS, ASK YOUR PHARMACIST.', 552],
  ]
  for (const [font, text, y] of lines) {
    ctx.font = font
    ctx.fillText(text, 44, y)
  }
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
  return { mimeType: 'image/jpeg', data: dataUrl.split(',')[1], dataUrl }
}
