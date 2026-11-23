# Sinh CSS mirror cho DOM dòng / ô của sd-table từ css/components/table.css của catalog (2026-10-14).
# Ngoài khối do script này sinh, sd-tokens.css còn chép tay (cùng cách đổi phạm vi) luật #60–64, #224–231 (tiêu đề /
# mũi tên sắp xếp) và #84–92, #291–295 cho nút ‹ › (phạm vi `sd-table .mat-mdc-paginator-range-actions`). Số luật = số dòng catrules.txt.
# Chỉ các luật cấu trúc mat-table (ô, dòng, dính, ô chọn mat-checkbox thuần, nút lệnh mat-icon-button) —
# phần ô lọc / paginator / section / badge / button của mục #c-table kit đã có bản riêng, KHÔNG lấy.
import re
CAT='/home/claude/catalog/Core UI/css/'
css=open(CAT+'components/table.css',encoding='utf-8').read()
css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
def parse(s):
    res=[];i=0
    while i<len(s):
        j=s.find('{',i)
        if j<0: break
        sel=s[i:j].strip()
        if sel.startswith('@'):
            d=1;k=j+1
            while d:
                d+=(s[k]=='{')-(s[k]=='}');k+=1
            res.append((sel,None)); i=k
        else:
            k=s.find('}',j); res.append((sel,s[j+1:k].strip())); i=k+1
    return res
R=parse(css)
def split_top(s):
    out=[];d=0;cur=''
    for c in s:
        if c in '([':d+=1
        elif c in ')]':d-=1
        if c==',' and d==0: out.append(cur);cur=''
        else: cur+=c
    out.append(cur);return [x.strip() for x in out]
def first_compound(x):
    m=re.match(r'[^\s>+~]+',x); return m.group(0)
def scope(sel, mode):
    out=[]
    for s in split_top(sel):
        assert s.startswith('#c-table'),s
        rest=s[len('#c-table'):].strip()
        if mode=='plain':        # #c-table X → sd-table X
            out.append('sd-table '+rest)
        elif mode=='host':       # #c-table sd-table X → sd-table X
            assert rest.startswith('sd-table'),s; out.append(rest)
        elif mode=='sel':        # ô chọn: chỉ mat-checkbox.c-selection của bảng
            fc=first_compound(rest)
            if fc.startswith('.mat-mdc-checkbox'): out.append('sd-table '+fc+'.c-selection'+rest[len(fc):])
            else: out.append('sd-table .c-selection '+rest)
        elif mode=='cmd':        # nút lệnh: chỉ trong desktop-command
            out.append('sd-table desktop-command '+rest if not rest.startswith('desktop-command') else 'sd-table '+rest)
    return ','.join(out)
PICK=[(1,'sel')]+[(i,'plain') for i in range(48,60)]+[(i,'sel') for i in range(65,84)]+[(i,'cmd') for i in range(84,93)] \
    +[(i,'host') for i in (211,212,213,214,215,216,217,235,236)]+[(i,'cmd') for i in (241,242,243,289,291,292,294,295)]
out=[]
# biến của #c-table: tách theo nhóm, mỗi nhóm đặt đúng chỗ dùng
v0=R[0][1]
decls=[d.strip() for d in v0.split(';') if d.strip()]
grp={'sd-table':[], 'sd-table .c-selection':[], 'sd-table desktop-command':[]}
for d in decls:
    n=d.split(':')[0]
    if n.startswith('--mat-table-'): grp['sd-table'].append(d)
    elif n.startswith('--mat-checkbox-'): grp['sd-table .c-selection'].append(d)
    elif n.startswith('--mat-icon-button-'): grp['sd-table desktop-command'].append(d)
body=[]
for i,m in PICK:
    sel,dec=R[i]
    assert dec is not None,(i,sel)
    if not dec: continue
    body.append(scope(sel,m)+'{'+dec+'}')
# --mat-sys-* dùng trong các luật trên → giá trị từ material-tokens.css (.sd-scope)
used=sorted(set(re.findall(r'var\(--(mat-sys-[\w-]+)',' '.join(body))))
tok=open(CAT+'material-tokens.css',encoding='utf-8').read()
sysv=[]
for n in used:
    m=re.search(r'--'+n+r'\s*:\s*([^;]+);',tok)
    if m: sysv.append('--'+n+':'+m.group(1).strip())
    else: print('MISSING',n)
grp['sd-table']=sysv+grp['sd-table']
for k,v in grp.items():
    out.append(k+'{'+';'.join(v)+'}')
out+=body
open('/home/claude/work/tbl/table-mirror.css','w').write('\n'.join(out)+'\n')
print(len(out),'rules; sys vars',len(sysv))
