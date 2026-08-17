# Audio

El juego incluye narraciones pre-generadas para las frases. La música y los efectos siguen siendo
opcionales: si no están disponibles, los servicios de audio aplican sus mecanismos de respaldo sin
interrumpir la partida.

## Estructura

```
audio/
├── quotes/
│   └── <question-id>.mp3 # una narración por pregunta
├── music/
│   ├── menu.mp3      # música del menú principal (loop)
│   └── game.mp3      # música durante la partida (loop)
└── sfx/
    ├── button.mp3    # pulsación de botón
    ├── countdown.mp3 # cuenta atrás
    ├── correct.mp3   # respuesta correcta
    ├── incorrect.mp3 # respuesta incorrecta
    ├── reveal.mp3    # revelación de la respuesta
    └── victory.mp3   # final de partida
```

Los directorios `music/` y `sfx/` representan archivos opcionales que todavía no forman parte del
repositorio.

## Narraciones

Los 16 archivos de `quotes/` se generaron a partir de `src/assets/data/questions.json` con estos
parámetros:

- Herramienta: `edge-tts` 7.2.8.
- Voz: `es-MX-JorgeNeural`.
- Velocidad: `-12%`.
- Tono: `-10Hz`.
- Salida: MP3 mono, 48 kbps, 24 kHz.
- Tamaño total aproximado: 0,65 MiB.

El nombre de cada archivo debe coincidir con el `id` de su pregunta. Para regenerar un archivo:

```bash
edge-tts \
    --voice es-MX-JorgeNeural \
    --rate=-12% \
    --pitch=-10Hz \
    --text "Texto de la frase" \
    --write-media src/assets/audio/quotes/<question-id>.mp3
```

`edge-tts` es un cliente no oficial del servicio de voz en línea de Microsoft Edge. Antes de
redistribuir o monetizar estos audios, revisa las condiciones vigentes del servicio y la licencia
de la herramienta. La licencia MIT del repositorio no concede derechos adicionales sobre servicios
o recursos de terceros.

## Comportamiento de respaldo

- `SpeechService` reproduce las narraciones con Howler.js.
- Si un MP3 falla, utiliza una voz española disponible mediante Web Speech API.
- Los efectos ausentes se sustituyen por sonidos sintéticos generados con Web Audio cuando existe
  un fallback definido.

## Reglas

- No añadir música, voces ni efectos sin derechos de uso compatibles con el proyecto.
- Usar pistas propias o con licencia libre compatible (CC0 / CC-BY con atribución).
- Anotar aquí la procedencia y licencia de cada archivo que se incorpore.
- Mantener las narraciones en mono y con un bitrate adecuado para voz para limitar el peso.
