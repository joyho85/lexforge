"""每週抓取 VOA News（正式新聞，非 Learning English）最新文章，產生 src/news.json。
只閱讀，不加 TTS。
用法： python scripts/gen_news.py
來源：VOA News 主站首頁（穩定 URL，抓最新報導列表 → 各篇正文）。
"""
import urllib.request, re, json, os, datetime, html as htmlmod

HDR = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
HOME = 'https://www.voanews.com'
OUT = 'src/news.json'
MAX_ITEMS = 8


def get(url: str) -> str:
    return urllib.request.urlopen(urllib.request.Request(url, headers=HDR), timeout=30).read().decode('utf-8', 'ignore')


def clean(t: str) -> str:
    t = re.sub(r'<[^>]+>', '', t)
    return htmlmod.unescape(t).strip()


def list_articles():
    home = get(HOME)
    links = re.findall(r'href="(/a/[^"]+\.html)"', home)
    seen, out = set(), []
    for l in links:
        if l not in seen:
            seen.add(l)
            out.append(HOME + l)
    return out


def parse_article(url: str):
    art = get(url)
    m = re.search(r'<h1[^>]*>(.*?)</h1>', art, re.S)
    title = clean(m.group(1)) if m else 'Untitled'
    d = re.search(r'"datePublished"\s*content="([^"]+)"', art)
    if not d:
        d = re.search(r'datetime="([^"]+)"', art)
    date = d.group(1)[:10] if d else datetime.date.today().isoformat()
    ps = re.findall(r'<p>(.*?)</p>', art, re.S)
    body = [clean(p) for p in ps if len(clean(p)) > 40][:14]
    return {'title': title, 'date': date, 'url': url, 'body': body}


def main():
    items = []
    for url in list_articles()[:MAX_ITEMS * 2]:
        try:
            items.append(parse_article(url))
        except Exception as e:
            print('  skip', url, e)
        if len(items) >= MAX_ITEMS:
            break
    items.sort(key=lambda x: x['date'], reverse=True)
    items = items[:MAX_ITEMS]
    os.makedirs('src', exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump({'updated': datetime.date.today().isoformat(), 'items': items}, f, ensure_ascii=False, indent=2)
    print(f'wrote {len(items)} news items -> {OUT}')


if __name__ == '__main__':
    main()
