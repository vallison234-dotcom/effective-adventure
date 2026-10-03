# effective-adventure

This repository now contains a lightweight project studio prototype for editing files, updating logo assets, and exporting packages for mobile and desktop builds.

## Included features

- File tree with add, edit, delete, and upload support
- Code editor panel for editing text-based project files
- Logo editor canvas with color and size controls
- Export actions for .ipa, .apk, and .exe package bundles
- Local browser storage for persistence between refreshes

## Run locally

Open `index.html` in a browser, or serve the folder with a lightweight static server:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Notes

This is a front-end prototype designed to match the requests for file editing, code editing, logo editing, and export/publish workflow controls. It is intentionally simple and runs fully in-browser without build tooling.
