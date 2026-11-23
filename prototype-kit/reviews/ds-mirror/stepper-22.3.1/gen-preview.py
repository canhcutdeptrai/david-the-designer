import sys, re, html, os
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,HERE)
from examples import EX, SCRIPT, PAGECSS
P=os.path.join(HERE,'../../../design-system/preview/components/stepper.html')  # chạy MỘT lần trên bản trước 2026-10-14
src=open(P,encoding='utf-8').read()
lines=src.split('\n')
# đổi tên lớp demo để không đụng utilities.css (.row là lưới của kit)
REN=[('full','stp-full'),('step-body','stp-body'),('step-form','stp-form'),('row','stp-row'),('hint','stp-hint'),('output','stp-output'),('color-stack','stp-color-stack')]
def ren_html(s):
    def f(m):
        cls=m.group(1).split()
        d=dict(REN)
        return 'class="%s"'%' '.join(d.get(c,c) for c in cls)
    return re.sub(r'class="([^"]*)"',f,s)
def ren_css(s):
    for a,b in REN:
        s=re.sub(r'\.'+re.escape(a)+r'(?![\w-])','.'+b,s)
    s=re.sub(r'^(\s*)code \{', r'\1.stp-ex code {', s, flags=re.M)
    return s
css=ren_css(PAGECSS)
css=css.replace('/* = stepper-demo.component.scss của trang tài liệu 3.1 (CHỈ của trang demo) */',
 '/* = stepper-demo.component.scss của trang tài liệu 3.1 — CHỈ của trang preview.\n     Lớp đổi tiền tố stp- vì `.row` của kit là lưới (utilities.css). */')
css+='\n  /* demo-section__body của tài liệu: cột, giãn ngang, gap 16px */\n  .stp-ex { display: flex; flex-direction: column; align-items: stretch; gap: 16px; }'
script=SCRIPT
for a,b in [("class=\"output\"",'class="stp-output"'),("class=\"hint\"",'class="stp-hint"')]:
    script=script.replace(a,b)
assert 'class="hint"' not in script and 'class="output"' not in script
script=script.replace('<script>','<script>\n  /* Nối dây các ví dụ = stepper-demo.component.ts của trang tài liệu 3.1 */',1)

out=[]
head='\n'.join(lines[:19])
out.append(head)
out.append('  <style>\n'+css+'\n  </style>')
i=lines.index('</head>')
shell='\n'.join(lines[i:42])
shell=re.sub(r'data-subtitle="[^"]*"','data-subtitle="Theo @sdcorejs/angular 22.3.1 (MatStepper 22.1) — 9 ví dụ của trang tài liệu Core UI 3.1: horizontal, vertical, linear, optional, error, labelPosition, color, điều khiển từ ngoài, editable=false"',shell)
out.append(shell)
out.append('      <div class="tab-panel" data-tab-panel="0">\n')
out.append('        <!-- ── Theo https://sdcorejs.github.io/sdcorejs-angular/3.1/v/22.3.1/components/stepper/examples (2026-10-14) ── -->')
for (h,props,note,body) in EX:
    b=ren_html(body)
    b='\n'.join(('            '+l) if l.strip() else l for l in b.split('\n'))
    sub=' subtitle="%s"'%html.escape(props,quote=True)
    out.append('        <sd-section title="%s"%s>'%(html.escape(h,quote=True),sub))
    out.append('          <div class="stp-ex">')
    if note and h=='Error state': note+=' (Thư viện 22.3.1 không bật showError nên trên thực tế không hiện X đỏ / errorMessage — trang tài liệu cũng vậy.)'
    if note: out.append('          <p class="stp-hint">%s</p>'%html.escape(note,quote=False))
    out.append(b)
    out.append('          </div>')
    out.append('        </sd-section>\n')
out.append('      </div><!-- /tab-panel: Preview -->\n')
GUIDE=open(os.path.join(HERE,'guide-tabs.html'),encoding='utf-8').read()
out.append(GUIDE.rstrip('\n'))
j=[k for k,l in enumerate(lines) if '<!-- /tab-panel: Dev -->' in l][0]
k=[k for k,l in enumerate(lines) if 'Demo wiring: Tiếp' in l][0]
tail='\n'.join(lines[j+1:k]).rstrip()
tail=tail.rstrip()
out.append(tail+'\n</script>\n')
out.append(script)
out.append('</body>\n</html>\n')
open(P,'w',encoding='utf-8').write('\n'.join(out))
print('ok')
