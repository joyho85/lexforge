"""每週抓取 BBC World + The Guardian World 最新文章（混搭），產生 src/news.json。
只閱讀，不加 TTS。
來源：兩家穩定 RSS（即時更新）→ 各抓最新幾篇 → 抓全文 → 合併取前 N 篇。
"""
import urllib.request, re, json, os, datetime, html as htmlmod
import xml.etree.ElementTree as ET

HDR = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
OUT = 'src/news.json'
PER_SRC = 6          # 每來源取最新 6 篇
MAX_ITEMS = 8        # 最終合併取前 8 篇

SOURCES = [
    ('BBC World', 'https://feeds.bbci.co.uk/news/world/rss.xml', 'bbc'),
    ('The Guardian', 'https://www.theguardian.com/world/rss', 'guardian'),
]


def get(url: str) -> str:
    return urllib.request.urlopen(urllib.request.Request(url, headers=HDR), timeout=30).read().decode('utf-8', 'ignore')


def clean(t: str) -> str:
    t = re.sub(r'<[^>]+>', '', t)
    return htmlmod.unescape(t).strip()


def parse_date(s: str) -> str:
    for fmt in ('%a, %d %b %Y %H:%M:%S %z', '%a, %d %b %Y %H:%M:%S %Z'):
        try:
            return datetime.datetime.strptime(s.strip(), fmt).date().isoformat()
        except Exception:
            pass
    return datetime.date.today().isoformat()


def rss_items(url: str):
    root = ET.fromstring(get(url))
    out = []
    for it in root.findall('.//item') + root.findall('.//{http://www.w3.org/2005/Atom}entry'):
        title = clean(it.findtext('title') or it.findtext('{http://www.w3.org/2005/Atom}title') or '')
        link = it.findtext('link') or (it.find('{http://www.w3.org/2005/Atom}link') and it.find('{http://www.w3.org/2005/Atom}link').get('href')) or ''
        pd = it.findtext('pubDate') or it.findtext('{http://www.w3.org/2005/Atom}updated') or ''
        if link and title:
            out.append((title, link.split('?')[0], parse_date(pd)))
    return out


def parse_body(url: str, src: str):
    art = get(url)
    ps = re.findall(r'<p[^>]*>(.*?)</p>', art, re.S)
    body = [clean(p) for p in ps if len(clean(p)) > 40]
    if src == 'bbc':
        # 跳過開頭導航垃圾（BBC Homepage / Skip to content 等）
        body = [b for b in body if not b.lower().startswith(('bbc homepage', 'skip to', 'your account', 'accessibility'))][:12]
    else:
        body = body[:12]
    return body


def main():
    items = []
    for name, feed, src in SOURCES:
        try:
            for title, link, date in rss_items(feed)[:PER_SRC]:
                try:
                    body = parse_body(link, src)
                    if body:
                        items.append({'title': title, 'date': date, 'url': link, 'body': body, 'source': name})
                except Exception as e:
                    print('  skip', link, e)
        except Exception as e:
            print('feed fail', name, e)
    items.sort(key=lambda x: x['date'], reverse=True)
    items = items[:MAX_ITEMS]
    os.makedirs('src', exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump({'updated': datetime.date.today().isoformat(), 'items': items}, f, ensure_ascii=False, indent=2)
    print(f'wrote {len(items)} news items -> {OUT}')


if __name__ == '__main__':
    main()
