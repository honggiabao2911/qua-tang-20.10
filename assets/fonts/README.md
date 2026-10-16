# Local fonts

These fonts are served locally so Vietnamese text does not depend on a third-party font server.

- Lora normal and italic, variable weights 400–700: [official Google Fonts source](https://github.com/google/fonts/tree/main/ofl/lora). License: `lora-OFL.txt`.
- Manrope normal, variable weights 200–800: [official Google Fonts source](https://github.com/google/fonts/tree/main/ofl/manrope). License: `manrope-OFL.txt`.
- Dancing Script handwriting, variable weights 400–700: [official Google Fonts source](https://github.com/google/fonts/tree/main/ofl/dancingscript). File: `handwriting.ttf`; license: `handwriting-OFL.txt`.

Lora and Manrope were converted from the original variable TrueType fonts to WOFF2 without subsetting or removing glyphs. Dancing Script is the original complete variable TrueType file. All three families contain the complete set of precomposed Vietnamese letters. Lora and Dancing Script also contain all eight combining marks needed for decomposed Vietnamese Unicode input; the application normalizes user text to NFC.

The four typography choices are Lora, Manrope, italic Lora and Dancing Script. These are four styles using three font families. All font files are local, total approximately 356 KiB, and need no runtime request to Google Fonts.

Dancing Script was obtained over HTTPS from `google/fonts` on 2026-10-16. SHA-256 of the unmodified `handwriting.ttf`: `21808625578fe8d8cd10cb684be546dca077b27cd03a53a2f1ec11dc743c924c`.
