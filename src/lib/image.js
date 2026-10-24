// Shrinks the photo and re-encodes it as JPEG. Re-encoding through a canvas also drops EXIF
// metadata such as GPS location. Nothing here is uploaded or saved.
export async function fileToJpeg(file, maxDim = 1280, quality = 0.85) {
  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error("That image format isn't supported. Try a JPG or PNG.")
  }
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const dataUrl = canvas.toDataURL('image/jpeg', quality)
  return { mimeType: 'image/jpeg', data: dataUrl.split(',')[1], dataUrl }
}
