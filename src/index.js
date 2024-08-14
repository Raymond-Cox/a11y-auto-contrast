/**
 * Trims the # from the hex color
 * @param {string} hex Ex: #0000FF
 * @returns {string} Ex: 0000FF
 */
const trimHex = (hex) => hex.replace('#', '')

/**
 * Checks the a11y score of two colors using the WebAIM API
 * @param {string} color1 Ex: #0000FF
 * @param {string} color2 Ex: #FFFFFF
 * @returns {Promise<{ratio: string, AA: 'pass' | 'fail', AALarge: 'pass' | 'fail', AAA: 'pass' | 'fail', AAALarge: 'pass' | 'fail'}>}
 */
export const checkA11y = async (color1, color2) => {
    const result = await fetch(
        `https://webaim.org/resources/contrastchecker/?fcolor=${trimHex(color1)}&bcolor=${trimHex(color2)}&api`
    )

    return result.json()
}

const defaultColors = ['#000000', '#FFFFFF']

/**
 * Takes a color and determines an a11y safe color to use as a text color from the textColorOptions.
 * If no color meets the a11y requirements, the best color is returned
 * Instantly returns the first color that meets the a11y requirements of 7.1 or greater
 * @param {string} bgColor Ex: #0000FF
 * @param {string[]} textColorOptions Default: ['#000000', '#FFFFFF'] An array of hex colors to check for a11y of any length.
 * @returns {Promise<{textColor: string, ratio: string, AA: 'pass' | 'fail', AALarge: 'pass' | 'fail', AAA: 'pass' | 'fail', AAALarge: 'pass' | 'fail'}>}
 */
async function findA11ySafeColor(bgColor, textColorOptions = defaultColors) {
    // Validate color
    if (!bgColor.startsWith('#'))
        throw new Error('Only hex colors are supported')

    // Track the best color in case no color meets the a11y requirements
    let bestColor

    // Check a11y for each text color,
    // and return the first one that satisfies a ratio of 7.1 or greater
    for (const textColor of textColorOptions) {
        const result = await checkA11y(bgColor, textColor)
        const newResult = { ...result, textColor }

        // If the ratio is greater than or equal to 7.1, return the color, killing the loop
        if (Number(result.ratio) >= 7.1) return newResult

        // If bestColor is not set, set it to the first color
        if (!bestColor) bestColor = newResult

        // If the current color is better than the best color, update the best color
        if (Number(result.ratio) > Number(bestColor.ratio))
            bestColor = newResult
    }

    // @ts-ignore
    return bestColor
}

const result = await findA11ySafeColor('#0000FF')

console.log('final color', result?.textColor)
console.log('ratio', result?.ratio)
