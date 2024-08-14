/**
 * Trims the # from the hex color
 * @param {string} hex Ex: #0000FF
 * @returns {string} Ex: 0000FF
 */
export const trimHex = (hex) => hex.replace('#', '')

/**
 * Validates the hex color to ensure it starts with a #.
 * Throws an error if the hex color does not start with a #
 * @param {String} hex
 */
export const validateHex = (hex) => {
    if (!hex.startsWith('#')) throw new Error('Only hex colors are supported')
}

/**
 * Checks the a11y score of two colors using the WebAIM API
 * @param {string} color1 Ex: #0000FF
 * @param {string} color2 Ex: #FFFFFF
 * @returns {Promise<import("./types").WebAimResponse>}
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
 * @returns {Promise<import("./types").GradedColor>}
 */
export const findA11ySafeColor = async (
    bgColor,
    textColorOptions = defaultColors
) => {
    // Validate color and textColorOptions
    validateHex(bgColor)
    textColorOptions.forEach(validateHex)

    /**
     * Track the best color in case no color meets the a11y requirements
     * Initializes to the first color in the textColorOptions
     * @type {import("./types").GradedColor}
     */
    let bestColor = {
        color: textColorOptions[0],
        ratio: '0',
        AA: 'fail',
        AALarge: 'fail',
        AAA: 'fail',
        AAALarge: 'fail',
    }

    // Check a11y for each text color,
    // and return the first one that satisfies a ratio of 7.1 or greater
    for (const color of textColorOptions) {
        const result = await checkA11y(bgColor, color)
        const newResult = { ...result, color }

        // If the ratio is greater than or equal to 7.1, return the color, killing the loop
        if (Number(result.ratio) >= 7.1) return newResult

        // If the current color is better than the best color, update the best color
        if (Number(result.ratio) > Number(bestColor.ratio))
            bestColor = newResult
    }

    return bestColor
}
