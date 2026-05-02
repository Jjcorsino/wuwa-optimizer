# Wuthering Waves Game Data 3.3 Update

Fecha de corte: 2026-05-01.

## Fuentes verificadas

- Wuthering Waves 3.3, "Reverbs from the End of Galaxies", fue publicado el 2026-04-30.
- Wuthering.gg lista 50 resonadores en la pagina de personajes.
- Las tipificaciones, armas, stats base y armas signature de los resonadores recientes se contrastaron contra sus paginas publicas de Wuthering.gg.

Paginas consultadas:

- https://www.gematsu.com/2026/04/wuthering-waves-version-3-3-update-reverbs-from-the-end-of-galaxies-launches-april-30
- https://wuthering.gg/characters
- https://wuthering.gg/characters/augusta
- https://wuthering.gg/characters/iuno
- https://wuthering.gg/characters/galbrena
- https://wuthering.gg/characters/qiuyuan
- https://wuthering.gg/characters/chisa
- https://wuthering.gg/characters/hiyuki
- https://wuthering.gg/characters/denia
- https://wuthering.gg/characters/mornye
- https://wuthering.gg/characters/aemeath
- https://wuthering.gg/characters/buling
- https://wuthering.gg/characters/sigrika
- https://wuthering.gg/characters/lynae
- https://wuthering.gg/characters/luuk-herssen

## Alcance aplicado

- `GameVersion` y `ScorerGameVersion` quedan en `3.3`; `UpcomingGameVersion` queda en `3.4`.
- El roster base queda en 50 resonadores.
- Se reemplazaron placeholders `NONE` de resonadores recientes por elemento, arma, stats base y pesos de scoring iniciales.
- Se agregaron los stat blocks de armas signature recientes que faltaban.
- Se agrego un test de frescura para version, tamano de roster, placeholders, Hiyuki, Denia y armas signature recientes.

## Limites intencionales

- No se copiaron implementaciones ni datos derivados de repositorios GPL.
- No se agregaron skills/sequences completas sin una fuente estable y verificable.
- No se agregaron assets nuevos de personajes/armas por posible riesgo de licencia; queda pendiente definir una politica de assets propia o enlazable.
- Los pesos de scoring nuevos son defaults conservadores hasta que exista una calculadora por kit/rotacion.
