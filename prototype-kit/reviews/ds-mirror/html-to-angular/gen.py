# Sinh ai-instructions/html-to-angular-api.md từ 2 bản chụp: lib-api-19.0.10.json (từ .d.ts) + kit-api.json (từ sd-components.js)
import json, re, sys, datetime
LIB, KIT, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
lib = json.load(open(LIB)); kit = json.load(open(KIT))
n = lambda s: s.lower().replace('-', '')
NOISE = re.compile(r'^(data|aria)|^(id|style|tabindex|slot|for|class|role)$')
NOTE = {  # ghi chú tay cho thuộc tính chỉ kit có (đã kiểm từng cái)
 ('*','checked'): 'Không có input riêng — trạng thái chọn là `[(model)]`',
 ('*','suffix'): 'Không có input — Angular: `<ng-template sdSuffixDef>VNĐ</ng-template>` bên trong thẻ (directive `[sdSuffixDef]`)',
 ('*','suffixicon'): 'Không có input trong 19.0.10',
 ('sd-tab-group','label'): 'Thuộc `sd-tab` (`<sd-tab label>`), kit đọc khi dựng header', ('sd-tab-group','icon'): 'Thuộc `sd-tab`',
 ('sd-tab-group','badge'): 'Thuộc `sd-tab`', ('sd-tab-group','closable'): 'Thuộc `sd-tab`', ('sd-tab-group','disabled'): 'Thuộc `sd-tab`',
 ('sd-table','addable'): 'Kit-only — thư viện không có bảng thêm dòng; xem html-to-angular.md §4', ('sd-table','addlabel'): 'Kit-only (đi cùng `addable`)',
 ('sd-table','filterrequired'): 'Kit-only — chưa xác minh tương đương; xem html-to-angular.md §4', ('sd-table','total'): 'Tổng giả của prototype — chế độ server trả `{ items, total }`',
 ('sd-table','*'): 'Trải phẳng `[option]` (Rule 18 ngoại lệ 2) — xem mục sd-table của html-to-angular.md',
 ('sd-section','sdheaderleft'): 'Là vùng chiếu `[sdHeaderLeft]` (đặt trên phần tử con), không phải input',
 ('sd-section','sdheaderright'): 'Là vùng chiếu `[sdHeaderRight]`',
 ('sd-modal','*'): 'Là vùng chiếu `[sdHeaderLeft]` / `[sdFooterRight]`… đặt trên phần tử con, không phải input',
 ('sd-inform','type'): 'Tên cũ của kit (bí danh) — thư viện là `color`', ('sd-inform','dismissible'): 'Tên cũ (bí danh) — thư viện là `closable`',
 ('sd-inform','cta'): 'Kit-only',
 ('sd-preview-image','src'): 'Thư viện: `[items]` (mảng ảnh)', ('sd-preview-pdf','src'): 'Thư viện: `source`',
 ('sd-mini-editor','placeholder'): 'Thư viện: `[option]="{ placeholder }"` (SdMiniEditorOption)', ('sd-mini-editor','maxheight'): 'Thư viện: `[option]="{ maxHeight }"`',
 ('sd-radio','error'): 'Thư viện: `inlineError="…"`', ('sd-step','completed'): 'Không có input — trạng thái bước do `[stepControl]` (form hợp lệ) / `state` quyết định',
 ('sd-step','invalid'): 'Không có input — dùng `[stepControl]` / `state` / `errorMessage`',
 ('sd-input-number','focusforceblur'): 'Không có input — thư viện có output `(sdFocusForceBlur)`', ('sd-date-range','from'): 'Kit trải phẳng — thư viện là `[(model)]` = `{from,to}`',
 ('sd-date-range','to'): 'Như `from`', ('sd-avatar','name'): 'Kit-only',
}
def note(tag, a):
    return NOTE.get((tag, a)) or NOTE.get((tag, '*')) or NOTE.get(('*', a)) or 'Kit-only — 19.0.10 không có input này; trong Angular bỏ đi (cần tính năng thì hỏi PD)'
EV_SPECIAL = {'sd-tab-change': 'selectedIndexChange', 'sd-tab-close': 'tabClosed'}
def ev_match(tag, e, outs):
    on = {n(o['alias']): o['alias'] for o in outs}
    if e in EV_SPECIAL and n(EV_SPECIAL[e]) in on: return on[n(EV_SPECIAL[e])]
    if n(e) in on: return on[n(e)]
    if e.startswith('sd-') and n(e[3:]) in on: return on[n(e[3:])]
    if e == 'sd-change':
        for c in ('modelChange', 'valueChange', 'contentChange'):
            if n(c) in on: return on[n(c)]
    return None
def binding(i):
    t = i['type']; a = i['alias']
    if 'ModelSignal' in t: return f'`[({a})]="biến"`'
    if 'WithTransform<boolean' in t: return f'`{a}` (trơn) hoặc `[{a}]="bool"`'
    if re.search(r'InputSignal(WithTransform)?<string(\s*\|\s*(null|undefined))*[,>]', t): return f'`{a}="chữ"`'
    if 'WithTransform<number' in t: return f'`{a}="10"` hoặc `[{a}]="số"`'
    if not t: return f'`{a}="…"` (chuỗi) hoặc `[{a}]="biến"`'
    if re.search(r'\[\]|Record|Option|=>|Template|Signal<[^>]*\[|FormGroup|Validator|SdSearch|number|any|object|Date|\bT\b', t): return f'`[{a}]="biến"`'
    return f'`{a}="giá trị"` (một trong tập cho phép) hoặc `[{a}]="biến"`'
L = ['# Bảng tra theo component — HTML kit ↔ Angular `@sd-angular/core` 19.0.10', '',
     f'> **TỰ SINH** ({datetime.date.today().isoformat()}) từ khai báo `ɵcmp` trong `.d.ts` của gói 19.0.10 và từ `sd-components.js`',
     '> của kit (`observedAttributes` + thuộc tính đọc + `CustomEvent`). Đừng sửa tay — sửa script',
     '> `reviews/ds-mirror/html-to-angular/gen.py` rồi chạy lại. Quy tắc chung và các ca đặc biệt: `html-to-angular.md`.', '',
     '**Cách đọc:** cột "Angular" là cú pháp viết trong template. `[(model)]` = `value` của kit. Sự kiện: Angular nhận',
     '`$event` = **giá trị trơn** (thư viện `emit(value)`), kit nhận `e.detail.value` (checkbox/radio của kit: `e.detail.checked`).', '']
nolib = []
for tag in sorted(kit):
    k = kit[tag]; Ls = lib.get(tag)
    if not Ls: nolib.append(tag); continue
    Lc = Ls[0]
    lin = {n(i['alias']): i for i in Lc['inputs']}
    # kit-only chỉ tính theo observedAttributes; thuộc tính "đọc" (getAttribute) có thể là của phần tử con,
    # nên chỉ dùng để xác nhận các thuộc tính trùng tên với input thư viện
    kattrs = sorted(set(n(a) for a in k['observed']) | (set(n(a) for a in k['read']) & set(lin)))
    if 'value' in kattrs and 'model' in kattrs: kattrs.remove('model')
    L += [f'## `{tag}`', '', f'Nguồn thư viện: `{Lc["file"]}` (`{Lc["class"]}`)', '', '| Kit (HTML) | Angular | Ghi chú |', '|---|---|---|']
    done = set()
    for a in kattrs:
        if NOISE.search(a): continue
        if a in lin: L.append(f'| `{lin[a]["alias"]}` | {binding(lin[a])} | |'); done.add(a)
        elif a == 'value' and 'model' in lin: L.append(f'| `value` | `[(model)]="…"` | Giá trị hai chiều |'); done.add('model')
        else: L.append(f'| `{a}` | — | {note(tag, a)} |')
    for e in k['events']:
        m = ev_match(tag, e, Lc['outputs'])
        L.append(f'| sự kiện `{e}` | ' + (f'`({m})="fn($event)"` |' if m else '— |') + (' |' if m else ' Kit-only hoặc chưa đối chiếu được — tra `sd-components.js` |'))
    rest = [i for i in Lc['inputs'] if n(i['alias']) not in done and n(i['alias']) not in kattrs]
    if rest: L.append('| *(thư viện có, kit chưa mirror)* | ' + ' · '.join(f'`{i["alias"]}`' for i in rest) + ' | Dev dùng được trong Angular; prototype không thể hiện |')
    outs = [o['alias'] for o in Lc['outputs'] if o['alias'] not in [ev_match(tag, e, Lc['outputs']) for e in k['events']]]
    if outs: L.append('| *(output thư viện, kit không phát)* | ' + ' · '.join(f'`({o})`' for o in outs) + ' | |')
    if [x for x in Lc['slots'] if x != '*']: L.append('| *(vùng chiếu nội dung)* | ' + ' · '.join(f'`{s}`' for s in Lc['slots']) + ' | Đặt thuộc tính trên phần tử con, vd `<div sdHeaderRight>` |')
    L.append('')
if nolib:
    L += ['## Thẻ kit KHÔNG có trong thư viện 19.0.10', '', ' · '.join(f'`{t}`' for t in nolib), '',
          '> Dev phải dựng riêng theo `_dev-spec.md` của feature (Rule 0b nhóm B) — không có component Angular tương ứng.', '']
open(OUT, 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('wrote', OUT, len(L), 'lines; nolib', nolib)
