# Audio

Infraestructura de sonido del juego. **Los archivos todavía no existen**: son
placeholders documentados aquí. `AudioService` está preparado para funcionar sin
ellos (si un archivo no se puede cargar, el sonido se desactiva silenciosamente).

## Estructura esperada

```
audio/
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

## Reglas

- No añadir música ni efectos con copyright.
- Usar pistas propias o con licencia libre compatible (CC0 / CC-BY con atribución).
- Anotar aquí la procedencia y licencia de cada archivo que se incorpore.
