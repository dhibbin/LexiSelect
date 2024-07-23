import js from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  
  {
    files: ['*.vue', '**/*.vue', '*.ts', '**/*.ts'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser
      }
    },
    plugins: {
      '@stylistic': stylistic
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
     '@stylistic/indent': ['error', 2],
    }
  }
)