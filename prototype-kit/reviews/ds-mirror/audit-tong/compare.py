import json, re, sys, collections
cat=json.load(open('cat.json')); kit=json.load(open('kit.json')); M=json.load(open('map.json'))
P=cat['PROPS']; PI={p:i for i,p in enumerate(P)}
def ff(v): return v.split(',')[0].strip().strip('"\'').lower()
DEMO_CLS=re.compile(r'-cat-(touch|focus)$')
def sig(n): return (n['d'],n['t'],tuple(sorted(c for c in n['c'] if not DEMO_CLS.search(c))))
def words(t): return set(re.findall(r'\w+',t))
def pair(C,Kt):
    used=set(); out=[]
    for ci,c in enumerate(C):
        best=None
        for ki,k in enumerate(Kt):
            if ki in used: continue
            if k['text']==c['text']: 
                # ưu tiên cùng cấu trúc
                sc=2+(1 if [sig(n) for n in k['nodes']]==[sig(n) for n in c['nodes']] else 0)
            else:
                a,b=words(c['text']),words(k['text'])
                j=len(a&b)/max(1,len(a|b)) if (a or b) else (1 if not a and not b else 0)
                sc=j if j>=0.8 else 0
            if sc and (best is None or sc>best[0]): best=(sc,ki)
        if best: used.add(best[1]); out.append((ci,best[1]))
        else: out.append((ci,None))
    return out
IGN_PROPS={'text-align','cursor'}
def prune(nodes, side):
    out=[]; skip_d=None
    for n in nodes:
        if skip_d is not None:
            if n['d']>skip_d: continue
            skip_d=None
        if (side=='c' and any(x.startswith('demo-') for x in n['c'])) or (side=='k' and n['t']=='sd-tab'):
            skip_d=n['d']; continue
        out.append(n)
    return out
def cmp(c,k):
    c=dict(c, nodes=prune(c['nodes'],'c')); k=dict(k, nodes=prune(k['nodes'],'k'))
    cs=[sig(n) for n in c['nodes']]; ks=[sig(n) for n in k['nodes']]
    if cs!=ks:
        i=0
        while i<min(len(cs),len(ks)) and cs[i]==ks[i]: i+=1
        a=cs[i] if i<len(cs) else None; b=ks[i] if i<len(ks) else None
        return 'struct',f'nút #{i}: catalog {fmt(a)} ↔ kit {fmt(b)} (catalog {len(cs)} nút, kit {len(ks)})'
    order=[ (n['t'],n['c']) for n in c['nodes']]!=[(n['t'],n['c']) for n in k['nodes']]
    attr=[n['a'] for n in c['nodes'][1:]]!=[n['a'] for n in k['nodes'][1:]]
    diffs=[]
    for i,(a,b) in enumerate(zip(c['nodes'],k['nodes'])):
        if a['s'][PI['display']]=='none' and b['s'][PI['display']]=='none': continue
        for p in P:
            if p in IGN_PROPS: continue
            va,vb=a['s'][PI[p]],b['s'][PI[p]]
            if p=='font-family': va,vb=ff(va),ff(vb)
            if va!=vb: diffs.append((i,a['t']+'.'+'.'.join(a['c'][:3]),p,va,vb))
        if abs(a['h']-b['h'])>0.6: diffs.append((i,a['t']+'.'+'.'.join(a['c'][:3]),'height(box)',a['h'],b['h']))
        if a['w']<400 and abs(a['w']-b['w'])>0.6 and i>0: diffs.append((i,a['t']+'.'+'.'.join(a['c'][:3]),'width(box)',a['w'],b['w']))
    extra=[]
    if order: extra.append('thứ tự lớp khác')
    if attr:
        for i,(a,b) in enumerate(zip(c['nodes'],k['nodes'])):
            if i==0: continue
            if a['a']!=b['a']: extra.append(f"thuộc tính nút #{i} {a['t']}: catalog {sorted(set(a['a'])-set(b['a']))} / kit {sorted(set(b['a'])-set(a['a']))}"); break
    return ('style' if diffs else 'ok'), (diffs, extra)
def fmt(s): return '—' if s is None else f"<{s[1]} .{'.'.join(s[2][:4])}> (sâu {s[0]})"
R=[]
for sid,m in M.items():
    row={'sid':sid,'page':m['page'],'tags':m['tags']}
    if not m['page']: row['status']='kit chưa có trang mẫu'; R.append(row); continue
    if sid not in kit['data'] or 'error' in kit['data'].get(sid,{}): row['status']='lỗi mở trang kit'; R.append(row); continue
    res=collections.Counter(); notes=[]; unp=0; tot=0
    for t in m['tags']:
        C=cat['data'].get(sid,{}).get(t,[]); Kt=kit['data'][sid].get(t,[])
        if not C: notes.append(f'catalog không có {t} tĩnh trong .stage'); continue
        for ci,ki in pair(C,Kt):
            tot+=1
            if ki is None: unp+=1; continue
            st,info=cmp(C[ci],Kt[ki]); res[st]+=1
            if st=='struct': notes.append(f'[{t} «{C[ci]["text"][:30]}»] LỆCH CẤU TRÚC — {info}')
            elif st=='style':
                diffs,extra=info
                props=collections.Counter(d[2] for d in diffs)
                ex='; '.join(f'{d[1]} {d[2]}: {d[3]} → {d[4]}' for d in diffs[:3])
                notes.append(f'[{t} «{C[ci]["text"][:30]}»] lệch {len(diffs)} giá trị ({", ".join(p for p,_ in props.most_common(4))}) vd: {ex}' + (' · '+'; '.join(extra) if extra else ''))
            else:
                diffs,extra=info
                if extra: notes.append(f'[{t} «{C[ci]["text"][:30]}»] hình khớp · '+'; '.join(extra))
    row.update(total=tot,unpaired=unp,ok=res['ok'],style=res['style'],struct=res['struct'],notes=notes)
    R.append(row)
json.dump(R,open('result.json','w'),ensure_ascii=False,indent=1)
for r in R:
    if 'status' in r: print(r['sid'],'—',r['status']); continue
    print(f"{r['sid']:22} mẫu catalog {r['total']:3} · ghép được {r['total']-r['unpaired']:3} · khớp {r['ok']:3} · lệch style {r['style']:3} · lệch cấu trúc {r['struct']:3}")
