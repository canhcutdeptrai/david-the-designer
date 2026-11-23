# So riêng sd-table catalog ↔ kit: bỏ cây con column-filter (ô lọc — component riêng), selector-action; đổi bankId→bank
import json,re,sys,collections
sys.argv=[sys.argv[0]]
src=open('/home/claude/work/audit/compare.py').read()
src=src[:src.index('R=[]')]
exec(src)
def norm(nodes, side):
    out=[];skip=None
    for n in nodes:
        if skip is not None:
            if n['d']>skip: continue
            skip=None
        if n['t'] in ('column-filter','selector-action') or (n['t'] in ('svg','mat-icon') and 'mat-mdc-paginator-icon' in n['c']+['mat-mdc-paginator-icon'] and nodes[0] is not None and False): skip=n['d']; continue
        if n['t']=='svg' and 'mat-mdc-paginator-icon' in n['c']: continue
        if n['t']=='mat-icon' and n['d']==8 and side=='k' and out and out[-1]['t']=='span' and 'mdc-icon-button__ripple' in out[-1]['c']: continue
        n=dict(n); n['c']=[c.replace('mat-column-bankId','mat-column-bank') for c in n['c'] if c not in ('sd-disabled','mat-sort-header-sorted','mat-mdc-checkbox-checked','selected','mdc-checkbox--selected')]
        out.append(n)
    return out
C=cat['data']['c-table']['sd-table']; K=kit['data']['c-table']['sd-table']
for ci,ki in [(0,0),(1,1),(2,2)]:
    c=dict(C[ci],nodes=norm(C[ci]['nodes'],'c')); k=dict(K[ki],nodes=norm(K[ki]['nodes'],'k'))
    L=min(len(c['nodes']),len(k['nodes'])); c['nodes']=c['nodes'][:L]; k['nodes']=k['nodes'][:L]
    st,info=cmp(c,k)
    print('== mẫu',ci,st, len(c['nodes']),len(k['nodes']))
    if st=='struct': print('  ',info)
    else:
        diffs,extra=info
        cnt=collections.Counter((d[1],d[2]) for d in diffs)
        for (el,p),n in cnt.most_common(40):
            ex=[d for d in diffs if d[1]==el and d[2]==p][0]
            print('  ',n,el,p,ex[3],'→',ex[4])
        for e in extra: print('   *',e)
