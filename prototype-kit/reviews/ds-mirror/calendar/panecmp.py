import json,difflib,collections,sys
d=json.load(open('/home/claude/work/cal/panes.json')); P=d['PROPS']
only=sys.argv[1:] 
for sid in d['cat']:
    if only and sid not in only: continue
    C=d['cat'][sid]; K=d['kit'][sid]
    if not C or not isinstance(K,list): print(sid,'missing',type(K), K if isinstance(K,str) else ''); continue
    sa=[(n['t'],tuple(n['c'])) for n in C]; sb=[(n['t'],tuple(n['c'])) for n in K]
    sm=difflib.SequenceMatcher(None,sa,sb,autojunk=False)
    print('=====',sid,'nodes',len(C),len(K),'ratio %.3f'%sm.ratio())
    for op,i1,i2,j1,j2 in sm.get_opcodes():
        if op!='equal': print('  ',op,[f"{n['t']}.{'.'.join(n['c'][:3])}" for n in C[i1:i2]][:5],'|',[f"{n['t']}.{'.'.join(n['c'][:3])}" for n in K[j1:j2]][:5])
    diff=collections.Counter(); ex={}
    for op,i1,i2,j1,j2 in sm.get_opcodes():
        if op!='equal': continue
        for a,b in zip(C[i1:i2],K[j1:j2]):
            if a['a']!=b['a']: k=('ATTR',a['t'],tuple(sorted(set(a['a'])^set(b['a'])))[:4]); diff[k]+=1
            for i,p in enumerate(P):
                if a['s'][i]!=b['s'][i]: k=(a['t']+'.'+'.'.join(a['c'][:2]),p); diff[k]+=1; ex.setdefault(k,(a['s'][i],b['s'][i]))
            for g in 'wh':
                if abs(a[g]-b[g])>0.6: k=(a['t']+'.'+'.'.join(a['c'][:2]),g); diff[k]+=1; ex.setdefault(k,(a[g],b[g]))
            for g in 'xy':
                if abs(a[g]-b[g])>0.6: k=(a['t']+'.'+'.'.join(a['c'][:2]),'pos-'+g); diff[k]+=1; ex.setdefault(k,(a[g],b[g]))
    for k,v in diff.most_common(25): print('   ',v,k,ex.get(k,''))
