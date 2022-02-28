# Color mage

A dependency-free image color extraction library.
The extraction consists of using K-Means algorithm.
It has a few utility functions as well!

## Functions

* Color extractors
* * [kMeansColorExtractor](./src/extractors/kMeansColorExtractor.ts): Function that extracts colors from a given array of pixels.
* Converters
* * [convertImageDataToRgba](./src/convert/convertImageDataToRgba.ts): Function that converts raw imageData.data array into an array of [RGBA](./src/types.ts) objects.
* * [convertRgbToHex](./src/convert/convertRgbToHex.ts): Converts an RGB color into it hexadecimal representation.
* Counters
* * [rgbaCounter](./src/counter/rgbaCounter.ts): Counts unique colors from the given array of RGBA colors, you can determine if you want it to consider the alpha channel or not.

## Install

With npm:
```bash
npm i color-mage
# or
yarn add color-mage
```

## Usage

```typescript
import { convertImageDataToRgba, kMeansColorExtractor, convertRgbToHex } from 'color-mage'

const canvas = document.getElementById('#canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')
// draw your image
ctx.drawImage(image, 0, 0, 640, 480)
// then get the image data from canvas
const imageData = ctx.getImageData(0, 0, 640, 480)

// converts the imageData array into an array of colors
const colors = convertImageDataToRgba(imageData.data)

// RGBA color representation
const palette = kMeansColorExtractor(colors, 5)

// All colors converted into hexadecimal representation
const hexColors = palette.map(convertRgbToHex)
```

## Tips

The process might take longer depending on the output size of `ctx.getImageData`,
since it will result in more pixels to process.

It might take longer as well if the image has many colors or the `maxRuns` in `kMeansColorExtractor` parameter is higher.

As you can see in the example below, the `maxRuns` is a tradeoff between color accuracy and time to process.

An example using a 8K image:
* Extracting 10 colors and `maxRuns` equals to 50
* imageData extracted with size of 800x450px using `ctx.getImageData(0, 0, 800, 450)`
* Metrics:
* * Get drawn canvas (draw image in canvas element): 14 ms
* * Get image data (gets the image data from drawn canvas): 98 ms
* * Convert imageData to RGBA (convertImageDataToRgba): 30 ms
* * Extract colors (kMeansColorExtractor): 845 ms
* * Total: 988 ms


* The same image and output size, but with `maxRuns` equals to 10 (default)
* Metrics:
* * Get drawn canvas: 18 ms
* * Get image data: 89 ms
* * Convert imageData to RGBA: 32 ms
* * Extract colors: 326 ms
* * Total: 466 ms

## License

[MIT](https://choosealicense.com/licenses/mit/)
