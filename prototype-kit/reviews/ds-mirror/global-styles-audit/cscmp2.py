import json,sys,collections,difflib,re
A=json.load(open(sys.argv[1]));B=json.load(open(sys.argv[2]))
P=A['P'];GEO=set(sys.argv[3].split(','));ZF=sys.argv[4] if len(sys.argv)>4 else ''
N=int(sys.argv[5]) if len(sys.argv)>5 else 50
groups=collections.defaultdict(list)
for f,ea in A['res'].items():
  eb=B['res'].get(f); 
  if not eb: continue
  sm=difflib.SequenceMatcher(None,[x[0] for x in ea],[x[0] for x in eb],autojunk=False)
  for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag!='equal': continue
    for k in range(i2-i1):
      a=ea[i1+k];b=eb[j1+k]; z=a[3] if len(a)>3 else ''
      zc='C' if z.startswith('sd-') else ('S' if z.startswith('@') else 'P')
      if ZF and zc not in ZF: continue
      for pi,p in enumerate(P):
        if p in GEO and a[2][pi]!=b[2][pi]:
          sig=a[0].split('#')[0]+'.'+'.'.join(sorted(set(a[1].split()))[:4])
          groups[(zc,z,sig,p,a[2][pi][:40],b[2][pi][:40])].append(f.split('/')[-1])
items=sorted(groups.items(),key=lambda x:-len(x[1]))
for k,v in items[:N]: print(len(v),k,sorted(set(v))[:3])
print('groups',len(groups),'diffs',sum(len(v) for v in groups.values()))
