#!/usr/bin/env python3
"""Generate a LexForge deck TS module from a JSONL card file.

Usage:
  python gen_deck.py <deck> <prefix> <in_jsonl> <out_ts>

  deck   : CEFR_B2 | CEFR_C1 | CEFR_C2 | TOEFL | GRE
  prefix : b2 | c1 | c2 | toefl | gre   (id prefix)
  in_jsonl: one JSON object per line, fields:
      word, phonetic, partOfSpeech, definitionZh, definitionEn,
      example, exampleZh, topic, register, learningFocus,
      synonyms (optional list), note (optional)
  out_ts : e.g. src/data/words_b2_life_02.ts

The script auto-adds route (life for CEFR_*, academic for TOEFL/GRE),
assigns ids `${prefix}-NN`, and emits valid TypeScript typed as Word[].
"""
import json
import sys


def main():
    import argparse
    p = argparse.ArgumentParser()
    p.add_argument("deck")
    p.add_argument("prefix")
    p.add_argument("infile")
    p.add_argument("outfile")
    p.add_argument("--start", type=int, default=1, help="starting index for ids")
    p.add_argument("--const", default=None, help="exported const name (default: <DECK>_BATCH)")
    args = p.parse_args()
    deck, prefix, infile, outfile = args.deck, args.prefix, args.infile, args.outfile
    const_name = args.const or f"{deck}_BATCH"
    route = "life" if deck.startswith("CEFR_") else "academic"
    cards = []
    with open(infile, encoding="utf-8") as f:
        for i, line in enumerate(f, args.start):
            line = line.strip()
            if not line:
                continue
            c = json.loads(line)
            cid = f"{prefix}-{i:02d}"
            cards.append((cid, c))
    body = "import type { Word } from '../lib/types'\n\n"
    body += f"// Auto-generated deck: {deck} ({route} route)\n"
    body += f"export const {const_name}: Word[] = [\n"
    for cid, c in cards:
        syn = c.get("synonyms") or []
        syn_str = "[" + ", ".join(f"'{s.replace(chr(39), chr(92)+chr(39))}'" for s in syn) + "]"
        note = c.get("note")
        note_field = f"  note: '{note.replace(chr(39), chr(92)+chr(39))}',\n" if note else ""
        body += "  {\n"
        body += f"    id: '{cid}',\n"
        body += f"    word: '{c['word'].replace(chr(39), chr(92)+chr(39))}',\n"
        body += f"    phonetic: '{c.get('phonetic','').replace(chr(39), chr(92)+chr(39))}',\n"
        body += f"    partOfSpeech: '{c.get('partOfSpeech','').replace(chr(39), chr(92)+chr(39))}',\n"
        body += f"    definitionZh: '{c['definitionZh'].replace(chr(39), chr(92)+chr(39))}',\n"
        body += f"    definitionEn: '{c['definitionEn'].replace(chr(39), chr(92)+chr(39))}',\n"
        body += f"    example: '{c.get('example','').replace(chr(39), chr(92)+chr(39))}',\n"
        body += f"    exampleZh: '{c.get('exampleZh','').replace(chr(39), chr(92)+chr(39))}',\n"
        body += f"    deck: '{deck}',\n"
        body += f"    route: '{route}',\n"
        body += f"    topic: '{c.get('topic','').replace(chr(39), chr(92)+chr(39))}',\n"
        body += f"    register: '{c.get('register','neutral')}',\n"
        body += f"    learningFocus: '{c['learningFocus'].replace(chr(39), chr(92)+chr(39))}',\n"
        if note_field:
            body += note_field
        body += f"    synonyms: {syn_str},\n"
        body += "  },\n"
    body += "]\n"
    with open(outfile, "w", encoding="utf-8") as f:
        f.write(body)
    print(f"wrote {len(cards)} cards -> {outfile}")


if __name__ == "__main__":
    main()
