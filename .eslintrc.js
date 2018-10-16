module.exports = {
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
          "jsx": true
        }
    }, 
    "extends": ["plugin:prettier/recommended"],
    "plugins": [
        "prettier",
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
        "prettier/prettier": "error",
        "linebreak-style" : 0,
        "global-require": 0,
        "no-restricted-globals": ["error", "event", "fdescribe"]
    }    
};