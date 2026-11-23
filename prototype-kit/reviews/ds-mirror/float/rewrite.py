import re,sys,json
TAGS=['sd-date-range','sd-datetime','sd-date','sd-chip-calendar','sd-autocomplete']
def split_top(s,ch=','):
    out=[];depth=0;cur=''
    for c in s:
        if c in '([': depth+=1
        elif c in ')]': depth-=1
        if c==ch and depth==0: out.append(cur);cur=''
        else: cur+=c
    out.append(cur);return out
def first_compound(sel):
    # returns (compound, combinator, rest) at top level
    depth=0
    for i,c in enumerate(sel):
        if c in '([': depth+=1
        elif c in ')]': depth-=1
        elif depth==0 and c in ' >+~':
            j=i
            while j<len(sel) and sel[j] in ' ': j+=1
            comb=' '
            if j<len(sel) and sel[j] in '>+~':
                comb=sel[j]; j+=1
                while j<len(sel) and sel[j]==' ': j+=1
            return sel[:i],comb,sel[j:]
    return sel,None,''
review=[]; changed=0
POPCLS=set()
for v in json.load(open('/home/claude/work/cbsw/popcls.json')).values(): POPCLS|=set(v)
POPCLS|={'open','other-month'}
POPTAGS={'div','button','span','sd-datetime-picker','sd-time-spinner','svg','polyline','input','circle','*'}
def strip_not(x):
    while True:
        m=re.search(r':not\(',x)
        if not m: return x
        i=m.end(); d=1
        while d and i<len(x):
            d+= (x[i]=='(') - (x[i]==')'); i+=1
        x=x[:m.start()]+x[i:]
def can_hit_popup(rest):
    r=strip_not(rest)
    r=re.sub(r'::?[\w-]+(\([^)]*\))?','',r)
    r=re.sub(r'\[[^\]]*\]','',r)
    cls=set(re.findall(r'\.([\w-]+)',r))
    if cls & POPCLS: return True
    if cls: return False
    types=set(t for t in re.findall(r'(?:^|[\s>+~(,])([a-z*][\w-]*)',r))
    return (not types) or types <= POPTAGS
def rw_sel(s):
    global changed
    lead=re.match(r'\s*',s).group(0); trail=re.search(r'\s*$',s).group(0); core=s.strip()
    comp,comb,rest=first_compound(core)
    if comb is None: 
        for t in TAGS:
            if re.search(r'(?<![\w-])'+t+r'(?![\w-])',core) and ('popup' in core or 'datepicker' in core or 'dropdown' in core): review.append(('nohost',core))
        return s
    if comb not in (' ','>'):
        for t in TAGS:
            if re.search(r'(?<![\w-])'+t+r'(?![\w-])',comp): review.append(('sibling',core))
        return s
    # case 1: compound starts with tag
    for t in TAGS:
        m=re.match(re.escape(t)+r'(?![\w-])',comp)
        if m:
            suffix=comp[len(t):]
            if not can_hit_popup(rest): return s
            if suffix=='' or re.fullmatch(r'(:is\('+re.escape(t)+r'\)|:not\(\._ng\))+',suffix):
                changed+=1
                return lead+':is('+comp+', :where(.'+t+'-pane))'+(' ' if comb==' ' else ' > ')+rest+trail
            review.append(('state',core)); return s
    # case 2: :is(...)/:where(...) list
    m=re.fullmatch(r':(is|where)\((.*)\)',comp)
    if m:
        args=[a.strip() for a in split_top(m.group(2))]
        add=[a for a in args if a in TAGS]
        if add and not can_hit_popup(rest): return s
        if add:
            changed+=1
            return lead+':'+m.group(1)+'('+', '.join(args+[':where(.'+a+'-pane)' for a in add])+')'+(' ' if comb==' ' else ' > ')+rest+trail
        if any(re.search(r'(?<![\w-])'+t+r'(?![\w-])',m.group(2)) for t in TAGS): review.append(('islist',core))
        return s
    # tag deeper in selector
    for t in TAGS:
        if re.search(r'(?<![\w-])'+t+r'(?![\w-])',rest): review.append(('deep',core))
    return s
def rw_file(path):
    css=open(path,encoding='utf-8').read()
    coms=[]
    def stash(m): coms.append(m.group(0)); return '\x00%d\x00'%(len(coms)-1)
    work=re.sub(r'/\*.*?\*/',stash,css,flags=re.S)
    def rule(m):
        pre=m.group(1)
        cm=re.match(r'((?:\s*\x00\d+\x00)*\s*)(.*)$',pre,re.S)
        head,sel=cm.group(1),cm.group(2)
        if '\x00' in sel or sel.strip().startswith('@') or not sel.strip(): return m.group(0)
        new=','.join(rw_sel(x) for x in split_top(sel))
        return head+new+'{'
    out=re.sub(r'([^{}]+)\{(?=[^{}]*\})',rule,work)
    out=re.sub(r'\x00(\d+)\x00',lambda m: coms[int(m.group(1))],out)
    return css,out
if __name__=='__main__':
    for p in sys.argv[1:]:
        css,out=rw_file(p)
        if '--write' in sys.argv: pass
        open(p+'.new','w',encoding='utf-8').write(out)
    print('changed',changed)
    for k,v in review: print(k,'|',v[:200])
