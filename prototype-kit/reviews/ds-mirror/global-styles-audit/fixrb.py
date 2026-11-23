import json,collections,difflib,re,os
ROOT='/home/claude/kit/prototype-kit-CATALOG-1012m/'
A=json.load(open('csA.json'));B=json.load(open('csB.json'));P=A['P']
CONT={'','sd-section','sd-tab','sd-step','sd-side-drawer','sd-modal','sd-anchor-item','sd-tab-group','sd-stepper','sd-splitter','sd-splitter-panel','sd-modal-resizable','sd-popover'}
need=collections.defaultdict(lambda: collections.defaultdict(set))
for f,ea in A['res'].items():
  eb=B['res'][f];sm=difflib.SequenceMatcher(None,[x[0] for x in ea],[x[0] for x in eb],autojunk=False)
  for t,i1,i2,j1,j2 in sm.get_opcodes():
    if t!='equal':continue
    for k in range(i2-i1):
      a=ea[i1+k];b=eb[j1+k];tag=a[0].split('#')[0]
      if a[3] not in CONT or tag not in ('p','label','ul','ol','h1','h2','h3','h4','h5','h6','button'): continue
      if f.endswith('side-drawer.html') and 'T14R' in b[1]: continue   # khối DOM catalog
      ch={p for p in P if p.startswith(('margin','padding')) and a[2][P.index(p)]!=b[2][P.index(p)]}
      if not ch: continue
      add=set()
      if 'margin-bottom' in ch: add.add('mb-0')
      if 'margin-top' in ch: add.add('mt-0')
      if ch & {'padding-left'} and tag in ('ul','ol'): add.add('pl-0')
      if tag=='button' and ch & {'padding-left','padding-right','padding-top','padding-bottom'}: add.add('p-0')
      need[f][(tag,b[1].strip())]|=add
tot=0
for f,combos in need.items():
  path=ROOT+f; s=open(path).read(); o=s
  for (tag,cls),add in combos.items():
    if not add: continue
    if cls:
      rx=re.compile(r'(<'+tag+r'\b[^>]*?\bclass=(\\?["\']))'+re.escape(cls)+r'(\2)')
      def rep(m):
        global tot; tot+=1
        return m.group(1)+cls+' '+' '.join(sorted(add))+m.group(3)
      s=rx.sub(rep,s)
    else:
      rx=re.compile(r'<'+tag+r'(?=[\s>])(?![^>]*\bclass=)')
      def rep2(m):
        global tot; tot+=1
        return m.group(0)+' class="'+' '.join(sorted(add))+'"'
      s=rx.sub(rep2,s)
  if s!=o: open(path,'w').write(s); print(f, sum(1 for x,y in zip(o.split('\n'),s.split('\n')) if x!=y))
print('tot',tot)
