# Trích API thật của @sd-angular/core 19.0.10 từ các file .d.ts (khai báo ɵcmp / ɵdir)
import re, os, json, sys
# python3 lib.py <thư mục gói @sd-angular/core đã giải nén> <file json ra>
ROOT = sys.argv[1]; OUTF = sys.argv[2]
def split_top(s):
    parts, depth, cur, q = [], 0, '', False
    for ch in s:
        if ch == '"' : q = not q
        if not q:
            if ch in '{[<(': depth += 1
            elif ch in '}]>)': depth -= 1
            elif ch == ',' and depth == 0:
                parts.append(cur.strip()); cur = ''; continue
        cur += ch
    parts.append(cur.strip()); return parts
out = {}
head = re.compile(r'static (ɵcmp|ɵdir): i0\.ɵɵ(Component|Directive)Declaration<')
for dp, dn, fn in os.walk(ROOT):
    for f in fn:
        if not f.endswith('.d.ts'): continue
        p = os.path.join(dp, f); s = open(p, encoding='utf-8').read()
        for m in head.finditer(s):
            # lấy phần trong <...> tới dấu '>;' cuối dòng
            end = s.index('>;', m.end())
            args = split_top(s[m.end():end])
            cls = re.sub(r'<.*', '', args[0]); sel = args[1].strip('"')
            ins = re.findall(r'"(\w+)": \{ "alias": "(\w+)"; "required": (true|false);', args[3])
            outs = re.findall(r'"(\w+)": "(\w+)"', args[4])
            slots = re.findall(r'"([^"]+)"', args[6]) if m.group(2) == 'Component' and len(args) > 6 else []
            def typ(prop):
                mm = re.search(r'\n\s+' + re.escape(prop) + r'[?]?: ([^;]+);', s)
                return mm.group(1).strip() if mm else ''
            for one in [x.strip() for x in sel.split(',')]:
                out.setdefault(one, []).append({'class': cls, 'kind': m.group(1), 'file': os.path.relpath(p, ROOT),
                    'inputs': [{'prop': a, 'alias': b, 'required': c == 'true', 'type': typ(a)[:200]} for a, b, c in ins],
                    'outputs': [{'prop': a, 'alias': b, 'type': typ(a)[:200]} for a, b in outs], 'slots': slots})
json.dump(out, open(OUTF, 'w'), ensure_ascii=False, indent=1)
print(len(out), 'selectors')
