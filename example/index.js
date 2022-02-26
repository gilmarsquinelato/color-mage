import { convertImageDataToRgba, kMeansColorExtractor, convertRgbToHex } from '../lib'

document.getElementById('fileUpload').addEventListener('change', (e) => {
  process(e.target.files[0])
})

const logColor = color => console.log('%c█', `color: ${color};`, color)

const process = async (file) => {
  console.time('Extract palette')
  const palette = await extractPalette(file)
  console.timeEnd('Extract palette')

  drawPalette(palette)
}

const drawPalette = (palette) => {
  const paletteElement = document.getElementById('palette')

  paletteElement.innerHTML = ''

  for (const color of palette) {
    logColor(color)

    const item = document.createElement('div')
    item.classList.add('color')
    item.style.backgroundColor = color

    paletteElement.appendChild(item)
  }
}

const width = 800
const height = 450

const extractPalette = async (file) => {
  console.time('Get drawn canvas')
  const canvas = await getDrawnCanvas(file)
  console.timeEnd('Get drawn canvas')

  console.time('Get image data')
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  console.timeEnd('Get image data')

  console.time('Convert imageData to RGBA')
  const colors = convertImageDataToRgba(imageData.data)
  console.timeEnd('Convert imageData to RGBA')

  console.time('Extract colors')
  const nearestColors = kMeansColorExtractor(colors, 10, { withAlpha: false, maxRuns: 50, nearestColors: true })
  console.timeEnd('Extract colors')

  return nearestColors.map(convertRgbToHex)
}

const getDrawnCanvas = async (file) => {
  const image = await getImageFromFile(file)

  const canvas = document.getElementById('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, width, height)
  ctx?.drawImage(image, 0, 0, width, height)

  return canvas
}

const getImageFromFile = (file) =>
  new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.src = URL.createObjectURL(file)
  })
