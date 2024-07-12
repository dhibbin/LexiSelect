import js from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    },
    rules : {
      "@typescript-eslint/typedef": [
        "error",
        {
          "arrayDestructuring": true,
          //"variableDeclaration": true,
          "arrowParameter" : true,
          "memberVariableDeclaration" : true,
          "parameter" : true,
          "propertyDeclaration" : true,
        }
      ],
      "@typescript-eslint/explicit-function-return-type": "error",
    }
  }
)