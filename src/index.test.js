import { trimHex, validateHex, checkA11y, findA11ySafeColor } from './'

describe('index', () => {
    describe('trimHex', () => {
        test('should remove the # from a hex color', () => {
            expect(trimHex('#000000')).toBe('000000')
        })

        test('should return the same value if no # is present', () => {
            expect(trimHex('000000')).toBe('000000')
        })
    })

    describe('validateHex', () => {
        test('should throw an error if the color is not a valid hex color', () => {
            expect(() => validateHex('00000')).toThrow(
                'Only hex colors are supported'
            )
        })

        test('should not throw an error if the color is a valid hex color', () => {
            expect(() => validateHex('#000000')).not.toThrow()
        })
    })

    describe('checkA11y', () => {
        test('should return a WebAimResponse', async () => {
            const result = await checkA11y('#000000', '#FFFFFF')
            expect(result).toHaveProperty('AA')
            expect(result).toHaveProperty('AALarge')
            expect(result).toHaveProperty('AAA')
            expect(result).toHaveProperty('AAALarge')
            expect(result).toHaveProperty('ratio')
        })
    })

    describe('findA11ySafeColor', () => {
        test('should return a GradedColor when optional array is provided', async () => {
            const result = await findA11ySafeColor('#000000', ['#FFFFFF'])
            expect(result).toHaveProperty('color')
            expect(result).toHaveProperty('AA')
            expect(result).toHaveProperty('AALarge')
            expect(result).toHaveProperty('AAA')
            expect(result).toHaveProperty('AAALarge')
            expect(result).toHaveProperty('ratio')

            expect(result.color).toBe('#FFFFFF')
        })

        test('should return a GradedColor when optional array is not provided', async () => {
            const result = await findA11ySafeColor('#000000')
            expect(result).toHaveProperty('color')
            expect(result).toHaveProperty('AA')
            expect(result).toHaveProperty('AALarge')
            expect(result).toHaveProperty('AAA')
            expect(result).toHaveProperty('AAALarge')
            expect(result).toHaveProperty('ratio')

            expect(result.color).toBe('#FFFFFF')
        })

        test('should maintain the best color if no color meets the a11y requirements', async () => {
            const result = await findA11ySafeColor('#ffffff', [
                '#ffffff',
                '#a9a9a9',
                '#d4d4d4',
                '#7f7f7f',
            ])
            expect(result).toHaveProperty('color')
            expect(result).toHaveProperty('AA')
            expect(result).toHaveProperty('AALarge')
            expect(result).toHaveProperty('AAA')
            expect(result).toHaveProperty('AAALarge')
            expect(result).toHaveProperty('ratio')

            expect(result.color).toBe('#7f7f7f')
            expect(Number(result.ratio)).toBeLessThan(7.1)
        })
    })
})
