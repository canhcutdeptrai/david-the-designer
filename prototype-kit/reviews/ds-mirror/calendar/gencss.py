import re,json,sys
CAT='/home/claude/catalog/Core UI/css/components/'
panes=json.load(open('/home/claude/work/cal/catpanes.json'))
CFG={'c-date':'sd-date-pane','c-date-range':'sd-date-range-pane','c-datetime':'sd-datetime-pane','c-chip-calendar':'sd-chip-calendar-pane'}
PANE_ELEM_CLS={'cdk-overlay-pane','mat-datepicker-popup','sd-datetime-overlay-panel','fx-pane'}
def split_top(s):
    out=[];d=0;cur=''
    for c in s:
        if c in '([':d+=1
        elif c in ')]':d-=1
        if c==',' and d==0: out.append(cur);cur=''
        else: cur+=c
    out.append(cur);return out
def strip_not(x):
    while True:
        m=re.search(r':not\(',x)
        if not m: return x
        i=m.end();d=1
        while d and i<len(x): d+=(x[i]=='(')-(x[i]==')');i+=1
        x=x[:m.start()]+x[i:]
def gen(sid):
    pane=CFG[sid]; P='.cdk-overlay-pane.'+pane
    html=panes[sid][0]
    cls=set(c for m in re.finditer(r'class="([^"]*)"',html) for c in m.group(1).split())
    tags=set(t.lower() for t in re.findall(r'<([a-zA-Z][\w-]*)',html))|{'*'}
    def ok_cls(c): return c in cls or c.startswith('mat-calendar') or c.startswith('mat-datepicker') or c in ('cdk-keyboard-focused','cdk-program-focused','mat-mdc-button-disabled','mat-mdc-button-disabled-interactive')
    css=open(CAT+sid[2:]+'.css',encoding='utf-8').read()
    css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
    kf=re.findall(r'@keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)[^{}]*\}',css)
    css2=re.sub(r'@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}','',css)
    out=[];used_kf=set()
    def do_rules(text):
        res=[]
        for sel,decl in re.findall(r'([^{}]+)\{([^{}]*)\}',text):
            keep=[]
            for s in split_top(sel):
                s=s.strip()
                if s=='#'+sid: keep.append(P); continue
                if not s.startswith('#'+sid+' ') : continue
                if re.search(r'fx-|demo-|\.stage|\.variant',s): continue
                rest=s[len(sid)+2:].strip()
                rest=re.sub(r'\[_ng(content|host)-[\w-]+\]',':not(._ng)',rest)
                r=strip_not(rest); r=re.sub(r'::?[\w-]+(\([^)]*\))?','',r); r=re.sub(r'\[[^\]]*\]','',r)
                cl=set(re.findall(r'\.([\w-]+)',r)); tg=set(re.findall(r'(?:^|[\s>+~])([a-z*][\w-]*)',r))
                if not all(ok_cls(c) or c in PANE_ELEM_CLS for c in cl): continue
                if not tg<=tags: continue
                first=re.match(r'[^\s>+~]+',rest).group(0)
                fc=set(re.findall(r'\.([\w-]+)',first))
                if fc and fc<=PANE_ELEM_CLS:
                    extra=''.join('.'+c for c in fc if c not in ('cdk-overlay-pane','fx-pane'))
                    keep.append(P+extra+rest[len(first):])
                else:
                    keep.append(P+' '+rest)
            if keep:
                res.append(','.join(keep)+'{'+decl.strip()+'}')
                for k,_ in kf:
                    if k in decl: used_kf.add(k)
        return res
    # @media blocks
    for m in re.finditer(r'(@media[^{]*)\{((?:[^{}]*\{[^{}]*\})*)\s*\}',css2):
        r=do_rules(m.group(2))
        if r: out.append(m.group(1)+'{'+'\n'.join(r)+'}')
    css3=re.sub(r'@media[^{]*\{(?:[^{}]*\{[^{}]*\})*\s*\}','',css2)
    out=do_rules(css3)+out
    for k,body in kf:
        if k in used_kf: out.append('@keyframes '+k+'{'+body+'}')
    return out
allout={}
for sid in CFG:
    o=gen(sid); allout[sid]=o
    open('/home/claude/work/cal/'+sid+'-mirror.css','w').write('\n'.join(o)+'\n')
    print(sid,len(o))
