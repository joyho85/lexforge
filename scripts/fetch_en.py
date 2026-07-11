#!/usr/bin/env python3
"""Fetch real English data (phonetic, partOfSpeech, EN definition, example)
from dictionaryapi.dev for a list of words. Chinese fields are left blank
for the model to fill in a later pass. Emits JSONL to stdout.

Usage: python fetch_en.py <word_list_file> [out_jsonl] [limit]
"""
import json
import sys
import time
import urllib.request
import urllib.error

API = "https://api.dictionaryapi.dev/api/v2/entries/en_US/{}"
UA = {"User-Agent": "LexForge/1.0 (vocab builder)"}


def fetch(word: str, timeout: float = 8.0):
    url = API.format(word)
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None  # word not in free dictionary
        raise
    if not isinstance(data, list) or not data:
        return None
    meanings = data[0].get("meanings", [])
    if not meanings:
        return None
    # pick the most common / first meaning
    m = meanings[0]
    pos = m.get("partOfSpeech", "")
    defs = m.get("definitions", [])
    if not defs:
        return None
    d0 = defs[0]
    phonetic = ""
    for ph in data[0].get("phonetics", []):
        if ph.get("text"):
            phonetic = ph["text"]
            break
    if not phonetic:
        phonetic = data[0].get("phonetic", "")
    return {
        "word": word,
        "phonetic": phonetic,
        "partOfSpeech": pos,
        "definitionEn": (d0.get("definition") or "").strip(),
        "example": (d0.get("example") or "").strip(),
    }


def main():
    infile = sys.argv[1]
    outfile = sys.argv[2] if len(sys.argv) > 2 else None
    limit = int(sys.argv[3]) if len(sys.argv) > 3 else 10_000
    with open(infile, encoding="utf-8") as f:
        words = [w.strip() for w in f if w.strip()]
    words = words[:limit]
    results = []
    for i, w in enumerate(words, 1):
        try:
            rec = fetch(w)
        except Exception as e:
            rec = None
            sys.stderr.write(f"ERR {w}: {e}\n")
        if rec and rec["definitionEn"]:
            results.append(rec)
        else:
            # keep a stub so we don't lose the word
            results.append({"word": w, "phonetic": "", "partOfSpeech": "", "definitionEn": "", "example": ""})
        if i % 25 == 0:
            sys.stderr.write(f"  {i}/{len(words)} done\n")
        time.sleep(0.05)  # be polite to the free API
    text = "\n".join(json.dumps(r, ensure_ascii=False) for r in results)
    if outfile:
        with open(outfile, "w", encoding="utf-8") as f:
            f.write(text + "\n")
    else:
        print(text)


if __name__ == "__main__":
    main()
