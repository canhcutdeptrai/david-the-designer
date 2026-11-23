import re
W='/tmp/claude-0/sasswork/'
K='/home/claude/kit/prototype-kit-CATALOG-1012m/design-system/core/styles/utilities.css'
old=open(K).read()
def fmt(css):
  out=[];i=0;depth=0;buf=''
  # tách theo rule cấp cao; @media giữ trong một khối nhiều dòng
  for m in re.finditer(r'@media[^{]*\{((?:[^{}]*\{[^}]*\})*)\}|[^{}@]+\{[^}]*\}',css):
    t=m.group(0)
    if t.startswith('@media'):
      head=t[:t.index('{')+1]; body=t[len(head):-1]
      out.append(head); out+= ['  '+r for r in re.findall(r'[^{}]+\{[^}]*\}',body)]; out.append('}')
    else: out.append(t)
  return '\n'.join(out)
parts=[('spacing','margin / padding 0–200px (bước 1px) + auto — `mb-12` = 12px, KHÔNG phải thang Bootstrap/Tailwind'),
('sizing','w-/h- 0–200px, w-full, min-/max-'),('border','border, border-top/…, rounded-0…200, rounded-full'),
('typography','T10R…T48M, fs-0…200, font-weight-*, text-left/right/center/justify, text-uppercase…'),
('gap','gap-/gap-x-/gap-y- 0–200px'),('display','d-none · d-block · d-inline · d-inline-block · d-flex · d-inline-flex · d-grid'),
('flexbox','flex-row/column, flex-wrap, flex-1, align-items-*, justify-content-*, align-self-*…'),
('overflow','overflow-*'),('position','position-*'),('misc','align-* (vertical-align), cursor-*, visible/invisible'),
('grid','grid-cols-*, col-span-*, row-span-*, col-(sm|md|lg|xl)-*'),('elevation','mat-elevation-z0…z8 (bóng Material)'),
('color','text-/bg-/border- × primary·secondary·info·success·warning·error (+ -light/-dark), black100…500, black, dark, light, white'),
('image','sd-image-* — 15 ảnh trạng thái của thư viện (design-system/core/assets/images/)')]
# phần kit giữ lại = từ "Google Material Icons" trở xuống
tail=old[old.index('/* ── Google Material Icons'):]
H='''/* ============================================================
   UTILITIES — sd-core của @sd-angular/core 19.0.10 (Core UI)

   ĐỔI NGUỒN 2026-10-13 (rà soát style chung). Phần 1 là CSS BIÊN DỊCH NGUYÊN VĂN
   từ `assets/scss/core/utilities/*` + `core/color.scss` + `core/image.scss` của thư
   viện (sass 1.79, không sửa tay) — cùng bộ class mà portal thật nạp qua sd-core.scss,
   cùng `!important`, cùng thứ tự partial. Thang khoảng cách là PIXEL:
       mb-12 = 12px · gap-8 = 8px · px-16 = 16px · p-3 = 3px
   (STYLE-GUIDE của thư viện: "dùng bội số của 4"). Trước 2026-10-13 kit dùng thang
   Tailwind (`mb-3` = 12px) — 732 chỗ đã được viết lại sang số px tương ứng.

   Đừng sửa phần 1 bằng tay: muốn đổi thì biên dịch lại từ thư viện.
   Phần 2 là bí danh cũ của kit (Rule 18 — ngoại lệ 3) + icon font + a11y + sd-input-action:
   không có trong sd-core nhưng trang cũ đang dùng; trang MỚI dùng tên sd-core.
   ============================================================ */

'''
body=H
for p,d in parts:
  css=open(W+'p_%s.css'%p).read().strip()
  body+='/* ── 1.%s %s — %s ── */\n'%(parts.index((p,d))+1,p,d)+fmt(css)+'\n\n'
alias='''/* ============================================================
   2. BÍ DANH CỦA KIT — không có trong sd-core (Rule 18, ngoại lệ 3)
   Giữ cho trang viết trước 2026-10-13. Tên sd-core tương ứng ghi bên cạnh —
   trang mới dùng tên bên phải. Ba bí danh hiển thị (`flex`, `flex-col`,
   `hidden`) CỐ Ý không `!important`: prototype bật/tắt chúng bằng JS
   (`classList.toggle('hidden')`, `style.display`) — `d-flex` của sd-core là
   `!important` nên sẽ chặn mọi lần ẩn bằng `style.display='none'`.
   ============================================================ */

.flex          { display: flex; }                         /* ≈ d-flex (không !important) */
.inline-flex   { display: inline-flex; }                  /* ≈ d-inline-flex */
.flex-col      { display: flex; flex-direction: column; } /* ≈ d-flex flex-column */
.hidden        { display: none; }                         /* ≈ d-none */
.items-center  { align-items: center; }                   /* = align-items-center */
.justify-between { justify-content: space-between; }      /* = justify-content-between */
.relative      { position: relative; }                    /* = position-relative */
.border-b      { border-bottom: 1px solid var(--sd-black200); } /* = border-bottom */
.rounded-lg    { border-radius: 8px; }                    /* = rounded-8 */
.text-muted    { color: var(--sd-black400); }             /* = text-black400 */
.text-sm       { font-size: 12px; }                       /* = fs-12 */
.text-xs       { font-size: 12px; }                       /* = fs-12 */
.font-medium   { font-weight: 500; }                      /* = font-weight-medium */
.font-semibold { font-weight: 600; }                      /* = font-weight-bold (sd-core: bold = 600) */
.text-mono     { font-family: var(--font-family-mono); }  /* kit-only: số/mã dạng monospace */
.text-tabular  { font-variant-numeric: tabular-nums; }    /* kit-only */
.truncate      { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } /* kit-only */

'''
open(K,'w').write(body+alias+tail)
print(len(body+alias+tail))
