module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [ '@typescript-eslint' ],
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module', // Allows for the use of imports
    },
    settings: {
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    },
    extends: [
        'eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier',
    ],
    rules: {
        "array-bracket-spacing": [
            "error", "always", {
                "objectsInArrays": false
            }
        ]
    }
};
