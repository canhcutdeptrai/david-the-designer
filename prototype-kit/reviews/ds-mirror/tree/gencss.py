import re
css=open('/home/claude/catalog/Core UI/css/components/tree.css',encoding='utf-8').read()
css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
css=re.sub(r'@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}','',css)   # keyframes c-tree-* đã có trong kit
SKIP=re.compile(r'sd-button|quick-action|c-bg-length|c-message|demo-|mdc-button|mat-mdc-unelevated|mat-mdc-outlined|progress|circular|#c-tree \.(text|bg|border)-|#c-tree \.(d-flex|align-items-center|ml-4|mr-8|ml-8|T14R)\b')
P=':is(sd-tree, :where(.sd-tree-pane))'
out=[];skipped=[]
def mapsel(s):
    s=s.strip()
    if s=='#c-tree': return 'sd-tree, .sd-tree-pane'
    assert s.startswith('#c-tree'),s
    rest=s[len('#c-tree'):].lstrip()
    if rest.startswith('sd-tree'): return 'sd-tree'+rest[len('sd-tree'):]
    return P+' '+rest
for sel,decl in re.findall(r'([^{}]+)\{([^{}]*)\}',css):
    sels=[];d=0;cur=''
    for ch in sel:
        d+=(ch=='(')-(ch==')')
        if ch==',' and d==0: sels.append(cur);cur=''
        else: cur+=ch
    sels.append(cur)
    keep=[x for x in sels if not SKIP.search(x)]
    if len(keep)!=len(sels): skipped.append(sel.strip()[:120])
    if not keep: continue
    out.append(','.join(mapsel(x) for x in keep)+'{'+decl.strip()+'}')
open('/home/claude/work/tree/tree-mirror.css','w').write('\n'.join(out)+'\n')
print(len(out),'skipped',len(skipped))
