import globals from 'globals'
import pluginJs from '@eslint/js'
import jest from 'eslint-plugin-jest'

/**
 * @type {import('eslint').Linter.Config}
 */
export default [
    {
        languageOptions: {
            globals: globals.node,
            env: {
                'jest/globals': true,
            },
        },
    },
    pluginJs.configs.recommended,
    {
        files: ['test/**'],
        ...jest.configs['flat/recommended'],
    },
]
