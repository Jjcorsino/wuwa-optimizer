# Web Performance Pass - 2026-05-01

## Cambio aplicado

- La pagina `/imports` ahora carga los tabs de importacion como componentes lazy.
- El tab JSON sigue siendo el flujo inicial.
- El tab scanner/OCR solo se renderiza cuando el usuario selecciona el scanner.

## Resultado observado

Despues de `pnpm build`, el manifest de cliente muestra:

- `pages/imports/index.vue`: chunk de ruta pequeno, con `dynamicImports` para los dos tabs.
- `components/Importer/JsonImporterTab.vue`: chunk separado de ~13.5 kB.
- `components/Importer/ScannerImporterTab.vue`: chunk separado de ~11.37 MB, donde siguen viviendo OpenCV/OCR y dependencias pesadas.
- `apps/web/dist/imports.html` no incluye `modulepreload` para el scanner; si incluye `prefetch`, por lo que el navegador puede descargarlo en idle.

## Riesgo residual

- El scanner sigue generando un chunk muy grande y advertencias de Vite por `@techstark/opencv-js`.
- Para eliminar el costo incluso en idle, la siguiente fase deberia mover OCR/scanner a un worker o loader manual activado por usuario, y separar parsing/normalizacion del componente Vue.
- El build tambien avisa que `caniuse-lite` esta desactualizado y que hay chunks grandes; no se actualizo esa dependencia en esta fase para mantener el cambio acotado.
