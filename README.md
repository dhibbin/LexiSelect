# LexiSelect

An AI frontend that allows users precise control over output tokens.

Developed during the course of an internship with [Electric Azimuth](https://www.electric-azimuth.co.uk)

Currently deployed using GitHub pages: https://dhibbin.github.io/LexiSelect/ (using `localhost` only works on Chrome)


![Example video](https://github.com/user-attachments/assets/3899b0db-5baf-45e9-b888-457e1f1dce5d)




# Overview

**LexiSelect** provides a user-friendly interface that allows users to select alternative tokens from the outputs generated by large language model (LLM).

This project was designed primarily with creative writing in mind. Traditional LLM front ends use a chat-style interface that doesn't give the user particularly great control over outputs from the LLM. LexiSelect uses a list of branches to present outputs from the LLM to the user. Each token can be selected and a list of alternative tokens (alongside a field for users to enter their own tokens) is shown. Providing users with alternative tokens allows writers to investigate alternative ways to phrase paragraphs and sentences within their stories.

Using LLMs to generate parts of a story could help artists get around writer's block and provide inspiration for where to take the creative work.

# Usage

The website needs to be able to send `/completion` requests to an HTTP address running a llama.cpp server. This can be a localhost address (requires Chrome) or a remote server.

# Local Project Setup

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Running the project locally

Run the following commands to setup the project for development

Project setup

```sh
npm install
```

Compile and Hot-Reload for Development

```sh
npm run dev
```

Type-Check, Compile and Minify for Production

```sh
npm run build
```

Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
