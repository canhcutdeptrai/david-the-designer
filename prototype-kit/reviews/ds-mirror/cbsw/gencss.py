import re,sys
def gen(name, sid, host, ng):
    css=open(f'/home/claude/catalog/Core UI/css/components/{name}.css',encoding='utf-8').read()
    css=re.sub(r'/\*.*?\*/','',css,flags=re.S)
    out=[]
    def mapsel(sel):
        sel=sel.strip()
        if sel=='#'+sid: return host
        assert sel.startswith('#'+sid), sel
        rest=sel[len(sid)+1:].lstrip()
        if rest.startswith(host+'['+ng+']'):
            # [_nghost] (0,1,0) + thẻ host (0,0,1) như catalog
            return host+':not(._ng):is('+host+')'+rest[len(host)+len(ng)+2:]
        assert not rest.startswith(host), sel
        return host+' '+rest
    for sel,decl in re.findall(r'([^{}]+)\{([^{}]*)\}',css):
        out.append(','.join(mapsel(s) for s in sel.split(','))+'{'+decl.strip()+'}')
    return out
cb=gen('checkbox','c-checkbox','sd-checkbox','_nghost-sd-cb')
sw=gen('switch','c-switch','sd-switch','_nghost-sd-sw')
open('/home/claude/work/cbsw/checkbox-mirror.css','w').write('\n'.join(cb)+'\n')
open('/home/claude/work/cbsw/switch-mirror.css','w').write('\n'.join(sw)+'\n')
print(len(cb),len(sw))
