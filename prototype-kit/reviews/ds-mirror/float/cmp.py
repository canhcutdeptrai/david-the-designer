import json,collections,sys
A=json.load(open('float/before.json'));B=json.load(open('float/after.json'))
tot=collections.Counter(); ex={}
for pg in A:
    a,b=A[pg],B.get(pg)
    if a=='ERR' or b=='ERR' or b is None: print('ERR',pg); continue
    for i,(x,y) in enumerate(zip(a,b)):
        if not x or not y or 'nodes' not in x or 'nodes' not in y:
            if x!=y: print('mismatch',pg,i,x and x.get('err'),y and y.get('err'), (x or {}).get('t'),(y or {}).get('t'))
            continue
        if i<3 or True:
            pass
        if len(x['nodes'])!=len(y['nodes']): print('nodecount',pg,i,len(x['nodes']),len(y['nodes'])); continue
        for k,(n,m) in enumerate(zip(x['nodes'],y['nodes'])):
            for g in ('x','y','w','h'):
                if abs(n[g]-m[g])>1: tot[(x['t'],'geom.'+g)]+=1; ex.setdefault((x['t'],'geom.'+g),(pg,i,k,n['cls'],n[g],m[g]))
            for p,v in n['s'].items():
                if p.startswith('--'): continue
                if m['s'].get(p)!=v: tot[(x['t'],p)]+=1; ex.setdefault((x['t'],p),(pg,i,k,n['tag'],n['cls'][:40],v[:60],str(m['s'].get(p))[:60]))
print('inHost after:',set(y['inHost'] for pg in B if B[pg]!='ERR' for y in B[pg] if y and 'inHost' in y), 'before:',set(y['inHost'] for pg in A if A[pg]!='ERR' for y in A[pg] if y and 'inHost' in y))
for k,v in sorted(tot.items(),key=lambda z:-z[1]): print(v,k,ex[k])
