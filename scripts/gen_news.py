"""每週抓取 VOA Learning English 文章，產生 public/news.json（只閱讀，不加 TTS）。
用法： python scripts/gen_news.py
來源：VOA Learning English 專欄列表頁（穩定 URL，不需會過期的 RSS token）。
"""
import urllib.request, re, json, os, datetime, html as htmlmod

HDR = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
BASE = 'https://learningenglish.voanews.com'

# 選幾個適合閱讀練習的專欄（程度適中、有正文）
SECTIONS = [
    ('Read, Listen & Learn', '/z/952'),
    ('Health & Lifestyle', '/z/955'),
    ('Science & Technology', '/z/1579'),
    ('Words and Their Stories', '/z/987'),
    ('Education', '/z/959'),
]

OUT = 'src/news.json'
PER_SECTION = 2  # 每專欄抓 2 篇 -> 共 ~10 篇，取前 8 篇
MAX_ITEMS = 8


def get(url: str) -> str:
    return urllib.request.urlopen(urllib.request.Request(url, headers=HDR), timeout=30).read().decode('utf-8', 'ignore')


def clean(t: str) -> str:
    t = re.sub(r'<[^>]+>', '', t)
    return htmlmod.unescape(t).strip()


def list_articles(section_url: str):
    page = get(BASE + section_url)
    links = re.findall(r'href="(/a/[^"]+\.html)"', page)
    seen, out = set(), []
    for l in links:
        if l not in seen:
            seen.add(l)
            out.append(BASE + l)
    return out


def parse_article(url: str):
    art = get(url)
    # 標題
    m = re.search(r'<h1[^>]*class="[^"]*title[^"]*"[^>]*>(.*?)</h1>', art, re.S)
    title = clean(m.group(1)) if m else 'Untitled'
    # 日期（優先 datePublished meta，否則 pub-date class）
    d = re.search(r'"datePublished"\s*content="([^"]+)"', art)
    if not d:
        d = re.search(r'class="[^"]*pub-date[^"]*"[^>]*>([^<]+)<', art)
    date = d.group(1)[:10] if d else datetime.date.today().isoformat()
    # 正文段落
    ps = re.findall(r'<p>(.*?)</p>', art, re.S)
    body = [clean(p) for p in ps if len(clean(p)) > 40]
    body = body[:12]  # 取前 12 段，避免過長
    return {'title': title, 'date': date, 'url': url, 'body': body}


def main():
    items = []
    for name, url in SECTIONS:
        try:
            arts = list_articles(url)[:PER_SECTION]
            for a in arts:
                try:
                    items.append(parse_article(a))
                except Exception as e:
                    print('  skip', a, e)
        except Exception as e:
            print('section fail', name, e)
    # 依日期新到舊排序，取前 MAX_ITEMS
    items.sort(key=lambda x: x['date'], reverse=True)
    items = items[:MAX_ITEMS]
    os.makedirs('src', exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump({'updated': datetime.date.today().isoformat(), 'items': items}, f, ensure_ascii=False, indent=2)
    print(f'wrote {len(items)} news items -> {OUT}')


if __name__ == '__main__':
    main()
