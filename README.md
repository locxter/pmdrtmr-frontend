# pmdrtmr frontend

## Overview

This repository includes the frontend of my Pomodoro timer project pmdrtmr, which I build during my work placement at the [KDO](https://www.kdo.de/).

## Dependencies

I generally try to minimize dependencies, but I'm a one man crew and can therefore only support Debian as I'm running it myself. Anyway, you need to have the following packages installed for everything to work properly:

- NodeJS as the development base. Install it with `sudo apt install nodejs npm`.
- VSCodium as universal text editor and IDE. To install it visit their [website](https://vscodium.com/#install).
- VSCodium extensions npm, Svelte for VS Code and Sort lines to enhance it's capabilities. Install them with `codium --install-extension eg2.vscode-npm-script --install-extension svelte.svelte-vscode --install-extension Tyriar.sort-lines`.
- Firefox for viewing the website. Install it with `sudo apt install firefox-esr`.

## How to use it

First install the needed packages via `npm install`. Then run the program directly via `npm run dev` or build it via `npm run build` and then run it via `npm run start`.
