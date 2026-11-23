import json
K='/home/claude/kit/prototype-kit-CATALOG-1012m/design-system/core/styles/'
cat_root=open('/home/claude/catalog/Core UI/css/catalog.css').read()
import re
m=re.search(r'(--sd-primary:[\s\S]*?--sd-black100:[^;]*;)',cat_root).group(1)
common='''<script>window.__CLS=%s;</script>'''%open('classes.json').read()
open('ref.html','w').write('<!DOCTYPE html><html><head><meta charset="utf-8"><link rel="stylesheet" href="sdcore.css"><style>:root{%s}</style></head><body><div id="box" style="width:1000px;font-size:14px;line-height:20px;font-family:Roboto;color:#000;display:block"></div>%s</body></html>'%(m,common))
links=''.join('<link rel="stylesheet" href="%s%s.css">'%(K,f) for f in ['tokens','layout','components','utilities','page-patterns','sd-tokens'])
open('kit.html','w').write('<!DOCTYPE html><html><head><meta charset="utf-8">%s</head><body><div id="box" style="width:1000px;font-size:14px;line-height:20px;font-family:Roboto;color:#000;display:block"></div>%s</body></html>'%(links,common))
