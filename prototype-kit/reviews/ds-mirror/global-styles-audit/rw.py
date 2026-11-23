import re,os,sys,json
ROOT='/home/claude/kit/prototype-kit-CATALOG-1012m'
SP={'mt-1':'mt-4','mt-2':'mt-8','mt-3':'mt-12','mt-4':'mt-16','mt-6':'mt-24',
'mb-1':'mb-4','mb-2':'mb-8','mb-3':'mb-12','mb-4':'mb-16','mb-6':'mb-24',
'mr-2':'mr-8','p-4':'p-16','p-5':'p-20','p-6':'p-24','px-4':'px-16','py-2':'py-8',
'gap-1':'gap-4','gap-2':'gap-8','gap-3':'gap-12','gap-6':'gap-24'}
MODE=sys.argv[1]  # 'dry' or 'apply'
EXCL=('vendor','reviews','_memory')
def files():
  for d,ds,fs in os.walk(ROOT):
    ds[:]=[x for x in ds if x not in EXCL]
    for f in fs:
      p=os.path.join(d,f)
      if f in('sd-components.js','CHANGELOG.md') or f.startswith('DS-MIRROR'): continue
      if f.endswith(('.html','.js','.md')): yield p
stats={}
def fix_tokens(s,path,ts):
  def rep(m):
    t=m.group(0)
    if t in SP:
      stats[t]=stats.get(t,0)+1; return SP[t]
    if ts and t=='text-secondary':
      stats[t]=stats.get(t,0)+1; return 'text-black400'
    return t
  return re.sub(r'(?<![\w-])[a-z][\w-]*(?![\w-])',rep,s)
CTX=[re.compile(r'(class\s*=\s*\\?")(.*?)(\\?")',re.S),
     re.compile(r"(class\s*=\s*\\?')(.*?)(\\?')",re.S),
     re.compile(r'(className\s*\+?=\s*)([\'"`].*?[\'"`])()'),
     re.compile(r'(classList\.(?:add|remove|toggle|contains|replace)\()([^)]*)(\))'),
     re.compile(r'(setAttribute\(\s*[\'"]class[\'"]\s*,\s*)([^)]*)(\))')]
changed={}
for p in files():
  src=open(p,encoding='utf-8').read(); s=src
  rel=os.path.relpath(p,ROOT)
  ts = not rel.startswith('design-system/patterns/') and not rel.endswith('.md')
  for rx in CTX:
    s=rx.sub(lambda m:m.group(1)+fix_tokens(m.group(2),p,ts)+m.group(3),s)
  if s!=src:
    changed[rel]=sum(1 for a,b in zip(src.split('\n'),s.split('\n')) if a!=b)
    if MODE=='apply': open(p,'w',encoding='utf-8').write(s)
print(json.dumps(stats,indent=0)); print(len(changed),'files'); 
for k,v in sorted(changed.items()): print(v,k)
