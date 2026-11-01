#!/usr/bin/env python3
"""Genera de una vez todos los audios del guion con ElevenLabs (opcional).

Si prefieres otra herramienta, ignora este script: basta con guardar cada audio
en audio/ con el nombre de la columna «archivo» de audio/guion.csv.

Uso:
  export ELEVENLABS_API_KEY=tu_clave
  export LOLO_VOICE_ID=id_de_la_voz_de_lolo
  python3 scripts/generar-audios.py            # genera los que faltan
  python3 scripts/generar-audios.py 0001-0040  # solo un tramo, para probar
  python3 scripts/generar-audios.py --rehacer 0153  # vuelve a generar uno

Después:  python3 scripts/indice-audios.py
"""
import csv, json, os, sys, time, urllib.request, urllib.error

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CARPETA = os.path.join(RAIZ, 'audio')
CLAVE = os.environ.get('ELEVENLABS_API_KEY')
VOZ = os.environ.get('LOLO_VOICE_ID')
MODELO = os.environ.get('LOLO_MODELO', 'eleven_multilingual_v2')

# Ajustes por tipo de frase: más estable en pistas y calma, más expresiva al celebrar.
AJUSTES = {
    'Alegre': dict(stability=0.38, similarity_boost=0.8, style=0.45),
    'Pista': dict(stability=0.6, similarity_boost=0.8, style=0.15),
    'Suave': dict(stability=0.75, similarity_boost=0.8, style=0.05),
    'Palabra': dict(stability=0.8, similarity_boost=0.8, style=0.0),
    'Inicio': dict(stability=0.7, similarity_boost=0.8, style=0.1),
}
BASE = dict(stability=0.5, similarity_boost=0.8, style=0.25)

if not CLAVE or not VOZ:
    sys.exit('Falta ELEVENLABS_API_KEY o LOLO_VOICE_ID (mira AUDIOS.md).')

args = [a for a in sys.argv[1:] if not a.startswith('--')]
rehacer = '--rehacer' in sys.argv
desde, hasta = 1, 10**6
if args:
    a = args[0].split('-')
    desde, hasta = int(a[0]), int(a[-1])

with open(os.path.join(CARPETA, 'guion.csv'), newline='', encoding='utf-8-sig') as f:
    filas = [r for r in csv.DictReader(f, delimiter=';') if desde <= int(r['id']) <= hasta]

hechos = 0
for r in filas:
    destino = os.path.join(CARPETA, r['archivo'])
    if os.path.exists(destino) and not rehacer:
        continue
    ajustes = next((v for k, v in AJUSTES.items() if r['indicacion'].startswith(k)), BASE)
    cuerpo = json.dumps({'text': r['texto'], 'model_id': MODELO,
                         'voice_settings': dict(ajustes, use_speaker_boost=True)}).encode()
    pet = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{VOZ}?output_format=mp3_44100_128',
        data=cuerpo, headers={'xi-api-key': CLAVE, 'Content-Type': 'application/json'})
    for intento in range(3):
        try:
            with urllib.request.urlopen(pet, timeout=60) as resp, open(destino, 'wb') as out:
                out.write(resp.read())
            hechos += 1
            print(f"{r['id']}  {r['texto'][:70]}")
            break
        except urllib.error.HTTPError as e:
            if e.code == 429 and intento < 2:
                time.sleep(5 * (intento + 1)); continue
            sys.exit(f"Error {e.code} en {r['id']}: {e.read()[:200]!r}")
    time.sleep(0.3)

print(f'Listo: {hechos} audios nuevos. Ahora ejecuta: python3 scripts/indice-audios.py')
