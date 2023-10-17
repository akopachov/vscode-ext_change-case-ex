# Change Case Ex

[![Marketplace](https://vsmarketplacebadges.dev/version/akopachov.change-case-ex.svg)](https://marketplace.visualstudio.com/items?itemName=akopachov.change-case-ex)

This extension allows you to convert the selected text into different case. Supported Cases are:

| Case | Example |
|------|---------|
| Snake case | `snake_case` |
| Camel case | `camelCase` |
| Capital case | `Capital Case` |
| Kebab case | `kebab-case` |
| Pascal case | `PascalCase` |
| Constant case | `CONSTANT_CASE` |
| Upper case | `UPPER CASE` |
| Lower case | `lower case` |
| Dot case | `dot.case` |
| Path case | `path/case` |
| Sentence case | `Sentence case` |
| Train case | `Train-Case` |

## How to Use it

### Select any text from the file, You will see an left side icon for options

![Alt text](https://i.ibb.co/rZQYspH/img1.png)

> **NOTE**: If you want to change all the occurance of the selected Text, use **Ctrl+Shift+L** or **Cmd+Shift+L**(on Mac) after selection

### Click on the icon, it will give the options on change the case and select any option from the dropdown

![Alt text](https://i.ibb.co/VvYHQ45/img2.png)

### The selected text case will gets changed

![Alt text](https://i.ibb.co/yV0JS8K/img3.png)

> Language Supported: javascript, typescript, javascriptreact, typescriptreact, html, css, less, scss, sass, python, json, markdown, go

## Customizing the Case Change Options

You can add only a subset of all supported Case Change options as per your preference and usage, to keep the Case Change list short and more handy.

You need to change the default json (**settings.json**) in your VS Code settings (**Ctrl + ,**).

![Alt text](https://i.ibb.co/rdvNTfy/setting-Img.png)

Following is the default JSON that support all casing, Change the value to `false` which you don't want to use.

```json
{
    "snakeCase": true,
    "camelCase": true,
    "upperCase": true,
    "kebabCase": true,
    "constantCase": true,
    "pascalCase": true,
    "capitalizeCase": true,
    "lowerCase": true,
    "dotCase": true,
    "pathCase": true,
    "sentenceCase": true,
    "trainCase": true
}
