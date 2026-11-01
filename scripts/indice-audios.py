#!/usr/bin/env python3
"""Crea audio/frases.json con las frases del guion que ya tienen su audio grabado.

Uso:  python3 scripts/indice-audios.py
El juego lee ese índice: si una frase tiene audio, suena el audio; si no, la voz del navegador.
"""
import csv, json, os, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUION = os.path.join(RAIZ, 'audio', 'guion.csv')
SALIDA = os.path.join(RAIZ, 'audio', 'frases.json')

frases, faltan = {}, 0
with open(GUION, newline='', encoding='utf-8-sig') as f:
    for fila in csv.DictReader(f, delimiter=';'):
        archivo = fila['archivo'].strip()
        if os.path.isfile(os.path.join(RAIZ, 'audio', archivo)):
            frases[fila['texto'].strip()] = archivo
        else:
            faltan += 1

with open(SALIDA, 'w', encoding='utf-8') as f:
    json.dump({'base': 'audio/', 'frases': frases}, f, ensure_ascii=False, indent=1)
print(f'{len(frases)} frases con audio · {faltan} sin audio todavía (usarán la voz del navegador)')
