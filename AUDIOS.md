# Las voces de Lolo · guion y prompts para generar los audios

Todo lo que dice Lolo está en **`audio/guion.csv`**: son **765 audios** (unos 45 000 caracteres).

- **725 frases completas.**
- **40 palabras sueltas** (colores, números, formas, direcciones…). El juego las encadena para las frases que cambian cada vez, como «Mirad la fila: rojo, azul, rojo… ¿Y ahora qué va?».

Mientras falte un audio, el juego usa la voz del navegador para esa frase. Así se pueden ir subiendo por tandas sin que nada deje de sonar.

---

## 1. La voz de Lolo (prompt para diseñar la voz)

Pega esto en la herramienta de diseño de voz: ElevenLabs › *Voice Design*, Murf, Play.ht, Azure *Custom Voice*, etc.

> **Prompt de voz (ES)**
> Voz de personaje infantil para Lolo, un pulpo simpático que es la mascota de una clase de Educación Infantil (3 a 5 años). Español de España, acento neutro peninsular, pronunciación muy clara y bien articulada. Timbre cálido, luminoso y algo agudo, entre adulto joven y dibujo animado, pero natural, sin caricatura ni voz chillona. Ritmo pausado, frases cortas, pequeñas pausas entre ideas para que los niños procesen. Sonríe al hablar. Muy paciente y cariñoso: nunca suena impaciente ni regaña. Entusiasta al celebrar, curioso al preguntar y muy sereno en los momentos de calma. Sonido limpio de estudio, sin eco ni música de fondo.

> **Voice prompt (EN, for tools that work better in English)**
> Friendly children's character voice for "Lolo", a cheerful octopus mascot in a preschool classroom (ages 3–5). Spanish from Spain (Castilian, neutral accent), very clear articulation. Warm, bright, slightly high-pitched timbre, between a young adult and a cartoon, but natural, not squeaky or exaggerated. Slow, calm pacing with short pauses between ideas. Smiling tone. Endlessly patient and kind, never scolding. Excited when celebrating, curious when asking, very soft and soothing in calm moments. Clean studio sound, no reverb, no background music.

**Texto para probar la voz.** Genera estas cuatro frases y elige la voz que mejor suene en las cuatro:

1. ¡Hola, amigos! Soy Lolo, el pulpo. ¿Jugamos juntos?
2. ¡Lo habéis conseguido juntos! ¡Qué bien!
3. Ese calcetín es azul. Yo busco el rojo.
4. Vamos a respirar juntos. Cogemos aire… y lo soltamos despacito.

> **Importante para un niño con autismo:** usad **una sola voz para todo**, con el mismo volumen y la misma velocidad de principio a fin. La previsibilidad de la voz es parte del apoyo. Evitad efectos sonoros, risas o susurros añadidos.

---

## 2. Cómo leer cada frase

Cada fila del guion trae una columna **`indicacion`** con el tono:

| Indicación | Cómo suena | Ajustes orientativos (ElevenLabs) |
|---|---|---|
| **Alegre y entusiasta** (310) | Celebración sincera, sonrisa, sin gritar | Estabilidad 35–40 %, estilo 45 % |
| **Pista amable y paciente** (191) | Cuando el niño se equivoca: tranquilo, sin reproche, animando | Estabilidad 60 %, estilo 15 % |
| **Curiosa e invitadora** (104) | Pregunta abierta; deja ½ segundo de silencio al final | Estabilidad 50 %, estilo 25 % |
| **Cálida, clara y cercana** (97) | Explicaciones e instrucciones | Estabilidad 50 %, estilo 25 % |
| **Suave y lenta** (15) | Respiración y calma: más lento y más bajo | Estabilidad 75 %, estilo 5 % |
| **Palabra suelta** (40) | Neutra, como al enumerar; ni pregunta ni final | Estabilidad 80 %, estilo 0 % |
| **Inicio de frase** (8) | Termina en suspenso porque sigue una lista | Estabilidad 70 %, estilo 10 % |

Reglas que valen para todas:

- **Lee el texto tal cual.** El juego busca cada audio por su texto exacto. Si cambias una palabra al grabar, la grabación vale igual (el juego no escucha), pero mantén el sentido.
- **Los números se leen como palabra**, por ejemplo «el jugador uno».
- **Las palabras sueltas deben sonar iguales entre sí** (mismo tono y volumen). Se pegan unas a otras, y si una suena más fuerte o más aguda se nota mucho.
- **Los «…»** son una pausa breve, como de respiración.

---

## 3. Formato de los archivos

- **Formato:** MP3, mono, 44,1 kHz, 128 kbps (vale también 96 kbps).
- **Nombre:** exactamente el de la columna `archivo`, por ejemplo `lolo_0001.mp3`.
- **Silencio:** recortado al principio y al final (máximo 0,1 s), sobre todo en las palabras sueltas.
- **Volumen:** igualado en todos, alrededor de **−16 LUFS**, con picos por debajo de −1 dB.

Si tu herramienta exporta con mucho silencio o volúmenes distintos, esto lo arregla de golpe (necesita `ffmpeg`):

```bash
cd audio
for f in lolo_*.mp3; do
  ffmpeg -y -loglevel error -i "$f" -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,loudnorm=I=-16:TP=-1.5:LRA=11" -ac 1 -ar 44100 -b:a 128k "tmp_$f" && mv "tmp_$f" "$f"
done
```

---

## 4. Dos maneras de generarlos

### A) A mano, con cualquier herramienta

1. Abre `audio/guion.csv` con Excel, Numbers o Google Sheets (separador: punto y coma).
2. Por cada fila, pega el `texto`, genera el audio y guárdalo con el nombre de `archivo`.
3. Ve por bloques: la columna `juego` agrupa las frases. Empieza por **General** y **La visita de Lolo**, que son las que más suenan.

### B) Todo de una vez con ElevenLabs (automático)

1. Crea la voz de Lolo con el prompt del punto 1 y copia su **Voice ID**.
2. En la carpeta del proyecto:

   ```bash
   export ELEVENLABS_API_KEY=tu_clave
   export LOLO_VOICE_ID=el_id_de_la_voz
   python3 scripts/generar-audios.py 1-20    # prueba primero con 20
   python3 scripts/generar-audios.py         # luego, todos los que falten (o solo los nuevos: ya se saltan los hechos)
   ```

   El script aplica los ajustes de la tabla según la indicación de cada frase y se salta los que ya existen. Para repetir uno que no te guste: `python3 scripts/generar-audios.py --rehacer 153`.

---

## 5. Subirlos a la web

1. Mete los MP3 en la carpeta **`audio/`** del repositorio (GitHub › *Add file* › *Upload files* sirve).
2. Haz *commit* en `main`.

La publicación ejecuta sola `scripts/indice-audios.py`, que crea el índice de los audios que existen, y sube la carpeta. En unos minutos Lolo habla con su voz nueva. En las pizarras que tenían la web guardada sin conexión, el cambio llega al abrirla con Internet.

Para probarlo en tu ordenador antes de subirlo:

```bash
python3 scripts/indice-audios.py
python3 -m http.server 8000      # y abre http://localhost:8000
```

---

## 6. Si se cambia un texto del juego

Si en el futuro se modifica una frase en `js/app.js`, hay que poner el mismo texto nuevo en `guion.csv` y regrabar ese audio. Mientras tanto, esa frase sonará con la voz del navegador; nada se rompe.

