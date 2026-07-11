import asyncio, re, os, sys, glob
import edge_tts

OUT = 'public/audio'
VOICE = 'en-US-AriaNeural'
RATE = '-6%'

os.makedirs(OUT, exist_ok=True)

files = ['src/data/words.ts'] + sorted(glob.glob('src/data/words_*.ts'))
cards = []
seen = set()

def add(cid, word, example):
    if cid in seen or not word or not example:
        return
    seen.add(cid)
    cards.append((cid, word, example))

for f in files:
    txt = open(f, encoding='utf-8').read()
    for b in re.findall(r"\{\s*id:\s*'([^']+)'(.*?)\n  \},", txt, re.S):
        body = b[1]
        word = re.search(r"word:\s*'([^']*)'", body)
        example = re.search(r"example:\s*'([^']*)'", body)
        if word and example:
            add(b[0], word.group(1), example.group(1))
    for m in re.finditer(r"deckWords\('([A-Z_]+)',\s*'(\w+)',\s*\[", txt, re.S):
        start = m.end() - 1  # position of the opening '['
        depth = 0
        i = start
        while i < len(txt):
            if txt[i] == '[':
                depth += 1
            elif txt[i] == ']':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        arr = txt[start:i+1]
        try:
            rows = eval(arr, {'__builtins__': {}}, {})
        except Exception:
            continue
        for i, row in enumerate(rows, 1):
            if isinstance(row, (list, tuple)) and len(row) > 7:
                # EN tuple 格式: [word, phonetic, pos, defZh, defEn, example, exampleZh, topic, register, learningFocus, synonyms]
                cid = f"{m.group(2)}-{i:02d}"
                add(cid, row[0], row[5])

print(f"parsed {len(cards)} cards", flush=True)

LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else 0
if LIMIT:
    cards = cards[:LIMIT]

sem = asyncio.Semaphore(12)

async def gen(cid, text, suffix):
    path = os.path.join(OUT, f"{cid}_{suffix}.mp3")
    if os.path.exists(path) and os.path.getsize(path) > 200:
        return
    async with sem:
        for attempt in range(3):
            try:
                comm = edge_tts.Communicate(text=text, voice=VOICE, rate=RATE)
                await comm.save(path)
                return
            except Exception as e:
                if attempt == 2:
                    print(f"FAIL {cid}_{suffix}: {e}", flush=True)
                await asyncio.sleep(1.5)

async def main():
    tasks = []
    for cid, word, example in cards:
        tasks.append(gen(cid, word, 'word'))
        tasks.append(gen(cid, example, 'example'))
    await asyncio.gather(*tasks)
    print("DONE", flush=True)

asyncio.run(main())
