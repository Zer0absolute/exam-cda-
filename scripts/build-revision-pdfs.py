"""Build the two printable CDA revision guides from curated, standalone lessons."""
from pathlib import Path
import json, re, html, textwrap
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, Preformatted, Flowable, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
TMP = ROOT / 'tmp/pdfs'
OUT = ROOT / 'output/pdf'
TMP.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
W, H = A4
M = 45
CW = W - 2*M
INK = HexColor('#24312d')
MUTED = HexColor('#53635d')
ACCENT = HexColor('#a3442c')
SAGE = HexColor('#edf2e9')
LINE = HexColor('#d7dfd6')
CREAM = HexColor('#f9f6ee')
import reportlab
font_dir = Path('/System/Library/Fonts/Supplemental')
fonts = [('Body','Arial.ttf'),('Bold','Arial Bold.ttf'),('Italic','Arial Italic.ttf'),('Mono','Courier New.ttf')]
if not all((font_dir / filename).exists() for _, filename in fonts):
    font_dir = Path(reportlab.__file__).parent / 'fonts'
    fonts = [('Body','Vera.ttf'),('Bold','VeraBd.ttf'),('Italic','VeraIt.ttf'),('Mono','Vera.ttf')]
for name, filename in fonts:
    pdfmetrics.registerFont(TTFont(name, str(font_dir / filename)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold',italic='Italic',boldItalic='Bold')

def clean(s):
    return str(s).replace('\u2011','-').replace('\u2013','-').replace('\u2014','-').replace('\u00a0',' ')

def esc(s):
    return html.escape(clean(s)).replace('\n','<br/>')

def styles(scale=1, cheat=False):
    size = (10.1 if cheat else 10.5) * scale
    return {
        'body':ParagraphStyle('body',fontName='Body',fontSize=size,leading=size*1.42,textColor=INK,spaceAfter=5*scale),
        'small':ParagraphStyle('small',fontName='Body',fontSize=8.1*scale,leading=11*scale,textColor=MUTED,spaceAfter=3),
        'title':ParagraphStyle('title',fontName='Bold',fontSize=(22 if cheat else 23)*scale,leading=27*scale,textColor=INK,spaceAfter=10*scale),
        'lead':ParagraphStyle('lead',fontName='Body',fontSize=11*scale,leading=15.5*scale,textColor=MUTED,spaceAfter=15*scale),
        'label':ParagraphStyle('label',fontName='Bold',fontSize=10.5*scale,leading=14*scale,textColor=ACCENT,spaceBefore=8*scale,spaceAfter=5*scale),
        'cell':ParagraphStyle('cell',fontName='Body',fontSize=9.1*scale,leading=12.4*scale,textColor=INK),
        'headcell':ParagraphStyle('headcell',fontName='Bold',fontSize=9.1*scale,leading=12.4*scale,textColor=INK),
        'code':ParagraphStyle('code',fontName='Mono',fontSize=8.5*scale,leading=11.1*scale,textColor=INK,spaceAfter=4),
    }

class Diagram(Flowable):
    def __init__(self, variant):
        Flowable.__init__(self)
        self.variant=variant
        self.width=CW
        self.height={'mcd':150,'models':94,'ternary':122,'usecases':148,'docker':150,'request':111,'tests':102}.get(variant,100)
    def draw(self):
        c=self.canv
        def box(x,y,w,h,title,lines=(),fill=SAGE):
            c.setFillColor(fill);c.setStrokeColor(LINE);c.roundRect(x,y,w,h,7,fill=1,stroke=1)
            c.setFillColor(INK);c.setFont('Bold',10);c.drawCentredString(x+w/2,y+h-19,clean(title))
            c.setFont('Body',8.8)
            for i,line in enumerate(lines):c.drawCentredString(x+w/2,y+h-35-i*13,clean(line))
        def arrow(x1,y1,x2,y2,label='',uml=False):
            c.setStrokeColor(MUTED);c.setLineWidth(1.2)
            if uml:c.setDash(4,3)
            c.line(x1,y1,x2,y2);c.setDash()
            import math
            angle=math.atan2(y2-y1,x2-x1)
            for off in [-.5,.5]:c.line(x2,y2,x2-7*math.cos(angle+off),y2-7*math.sin(angle+off))
            if label:c.setFillColor(MUTED);c.setFont('Body',8.5);c.drawCentredString((x1+x2)/2,(y1+y2)/2+9,clean(label))
        v=self.variant
        if v=='mcd':
            box(0,43,142,85,'LIVRE',['livre_id','titre'])
            box(CW-142,43,142,85,'EXEMPLAIRE',['exemplaire_id','etat'])
            c.setFillColor(CREAM);c.setStrokeColor(LINE);c.ellipse(192,66,CW-192,109,fill=1,stroke=1)
            c.setFont('Body',9);c.setFillColor(INK);c.drawCentredString(CW/2,83,'posséder')
            c.line(142,86,192,86);c.line(CW-192,86,CW-142,86)
            c.setFont('Bold',10);c.drawCentredString(165,100,'0,n');c.drawCentredString(CW-165,100,'1,1')
            c.setFont('Body',9);c.drawString(0,18,'Un livre : de zéro à plusieurs exemplaires.')
            c.drawString(0,4,'Un exemplaire : exactement un livre.')
        elif v=='models':
            bw=136
            for x,title,lines in [(0,'MCD',['Objets et liens','Règles du domaine']),(184,'MLD',['Relations, PK et FK','Structure logique']),(CW-bw,'MPD',['Types et contraintes','Moteur PostgreSQL'])]:box(x,12,bw,73,title,lines)
            arrow(bw,48,184,48);arrow(320,48,CW-bw,48)
        elif v=='ternary':
            box(0,47,236,68,'Faits autorisés',['Alice - SQL - C1','Alice - JavaScript - C2','Bob - SQL - C2'])
            box(CW-230,47,230,68,'Trois listes de paires',['Rejoindre les trois listes','peut inventer Alice - SQL - C2'],CREAM)
            c.setFont('Body',9);c.setFillColor(INK);c.drawString(0,20,'Les trois paires existent ; le triplet Alice - SQL - C2 n’existe pas.')
            c.drawString(0,4,'Conserver une affectation complète, ou justifier la décomposition.')
        elif v=='usecases':
            def usecase(x,y,w,h,label):
                c.setFillColor(SAGE);c.setStrokeColor(LINE);c.ellipse(x,y,x+w,y+h,fill=1,stroke=1)
                c.setFont('Bold',10);c.setFillColor(INK);c.drawCentredString(x+w/2,y+h/2-3,label)
            usecase(0,52,161,61,'Retirer de l’argent')
            usecase(CW-178,86,178,58,'Vérifier le code')
            usecase(CW-178,6,178,58,'Imprimer un reçu')
            arrow(161,83,CW-178,115,'« include »',uml=True)
            arrow(CW-178,35,161,83,'« extend »',uml=True)
            c.setFont('Body',8.7);c.drawString(0,12,'Relations UML entre les cas du distributeur.')
        elif v=='request':
            widths=[87,97,87,108,77];gap=12;xx=0
            for i,(title,sub) in enumerate([('Navigateur','Requête HTTP'),('Contrôleur','Transport'),('Service','Règle métier'),('Repository','Accès données'),('Base','Stockage')]):
                box(xx,36,widths[i],62,title,[sub]);
                if i<4:arrow(xx+widths[i],67,xx+widths[i]+gap,67)
                xx+=widths[i]+gap
            c.setFont('Body',9);c.setFillColor(MUTED);c.drawString(0,12,'La réponse revient vers le navigateur : statut HTTP et données utiles.')
        elif v=='docker':
            box(0,44,142,72,'Machine locale',['localhost:8080','localhost:15432'])
            box(215,85,126,61,'api',['port interne 3000'])
            box(215,5,126,61,'db',['PostgreSQL : 5432'])
            arrow(142,102,215,112,'8080')
            arrow(142,57,215,35,'15432')
            arrow(341,109,341,35)
            c.setFont('Body',8.6);c.setFillColor(MUTED);c.drawString(354,99,'Réseau Compose')
            c.drawString(354,81,'api joint db:5432')
        elif v=='tests':
            for x,title,sub in [(0,'Unitaire',['Une règle','Dépendances remplacées']),(184,'Intégration',['Composants réunis','Base ou HTTP réels']),(CW-136,'Parcours',['Action utilisateur','Résultat visible'])]:box(x,17,136,77,title,sub)
        else:raise ValueError(v)

def measured(flows,width):
    total=0
    for f in flows:
        fw,fh=f.wrap(width,10000)
        if fw>width+1:raise ValueError(f'Flow exceeds width: {fw} > {width}')
        total+=fh+f.getSpaceBefore()+f.getSpaceAfter()
    return total

def table(block,ss,scale):
    headers=block.get('headers',[])
    rows=block['rows']
    n=len(headers) if headers else len(rows[0])
    widths=block.get('widths')
    if not widths:
        if headers == ['Code','Minimum','Maximum','Lecture']: widths=[.13,.14,.17,.56]
        elif headers == ['Donnée','Sens et domaine','Exemple']: widths=[.22,.53,.25]
        elif n == 2: widths=[.30,.70]
    if widths:widths=[CW*v/sum(widths) for v in widths]
    else:widths=[CW/n]*n
    data=[]
    if headers:data.append([Paragraph(esc(x),ss['headcell']) for x in headers])
    data += [[Paragraph(esc(x),ss['cell']) for x in row] for row in rows]
    t=Table(data,colWidths=widths,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),SAGE if headers else white),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7*scale),('RIGHTPADDING',(0,0),(-1,-1),7*scale),('TOPPADDING',(0,0),(-1,-1),5*scale),('BOTTOMPADDING',(0,0),(-1,-1),5*scale),('LINEBELOW',(0,0),(-1,-1),.5,LINE)]))
    return t

def page_flows(page, chapter, source_ids, scale=1,cheat=False,exid=None):
    ss=styles(scale,cheat)
    flows=[Paragraph(esc(page['title']),ss['title']),Paragraph(esc(page.get('lead','')),ss['lead'])]
    for b in page['blocks']:
        if b.get('title'):flows.append(Paragraph(esc(b['title']),ss['label']))
        kind=b['type']
        if kind=='text':flows.append(Paragraph(esc(b['text']),ss['body']))
        elif kind=='bullets':
            for x in b['items']:flows.append(Paragraph('• '+esc(x),ss['body']))
        elif kind=='table':flows.append(table(b,ss,scale))
        elif kind=='code':
            # Keep the syntax intact: report the offending source line instead of wrapping it.
            code = clean(b['code'])
            longest = max((pdfmetrics.stringWidth(line, 'Mono', 8.5*scale) for line in code.splitlines()), default=0)
            if longest > CW-18:
                raise ValueError(f'Code line exceeds the page width: {page["title"]}')
            pre=Preformatted(code,ss['code'])
            t=Table([[pre]],colWidths=[CW]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),CREAM),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9)]));flows.append(t)
        elif kind=='diagram':flows.append(Diagram(b['variant']))
        else:raise ValueError(kind)
        flows.append(Spacer(1,5*scale))
    if exid:
        e=page['exercise']
        flows.append(Paragraph('ESSAIE SANS REGARDER LE CORRIGÉ · '+exid,ss['label']))
        flows.append(Paragraph(esc(e['question']),ss['body']))
        flows.append(Paragraph('Correction dans la partie « Corrigés », à la fin du cours.',ss['small']))
    refs=[]
    for url in page.get('sources',[]):
        sid,source=source_ids[url]
        refs.append(f'<a href="{html.escape(url,quote=True)}" color="#526d49">[{sid:02d}] {esc(source["label"])}</a>')
    flows.append(Spacer(1,6))
    if len(refs) > 3:
        refs = [f'<a href="{html.escape(url,quote=True)}" color="#526d49">[{source_ids[url][0]:02d}]</a>' for url in page.get('sources',[])]
        flows.append(Paragraph('RÉFÉRENCES · '+ ' '.join(refs) + ' · Notices complètes à la fin ; liens cliquables.',ss['small']))
    else:
        flows.append(Paragraph('RÉFÉRENCES · '+'<br/>'.join(refs),ss['small']))
    return flows

def draw_flows(c,flows,y=764,maxheight=710):
    height=measured(flows,CW)
    if height>maxheight:raise ValueError(f'Page too tall: {height:.1f} > {maxheight}')
    for f in flows:
        y-=f.getSpaceBefore()
        fw,fh=f.wrap(CW,10000)
        f.drawOn(c,M,y-fh)
        y-=fh+f.getSpaceAfter()
    return y

def header(c,title,chapter,page_num):
    c.setFillColor(ACCENT);c.setFont('Bold',10);c.drawString(M,H-32,'CDA STUDIO')
    c.setFillColor(MUTED);c.setFont('Body',9);c.drawRightString(W-M,H-32,clean(chapter))
    c.setStrokeColor(LINE);c.line(M,H-43,W-M,H-43)
    c.setFont('Body',8);c.setFillColor(MUTED);c.drawString(M,29,clean(title));c.drawRightString(W-M,29,str(page_num))

def refs_for(chapters,all_sources,cheat=False):
    used={url for ch in chapters for p in ch['cheats' if cheat else 'lessons'] for url in p['sources']}
    for url in used:
        if url not in all_sources:raise ValueError('Unknown primary source: '+url)
    return {u:(i+1,all_sources[u]) for i,u in enumerate(sorted(used))}

def cover(c):
    c.setFillColor(CREAM);c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(ACCENT);c.rect(M,H-95,48,6,fill=1,stroke=0)
    c.setFont('Bold',11);c.drawString(M,H-130,'CDA STUDIO · RÉVISION DU TITRE PROFESSIONNEL')
    ss=styles();ss['title'].fontSize=40;ss['title'].leading=46
    p=Paragraph('Comprendre<br/>les notions.<br/><font color="#a3442c">Puis les expliquer.</font>',ss['title']);pw,ph=p.wrap(CW,400);p.drawOn(c,M,H-190-ph)
    p=Paragraph('Un cours progressif, des exemples autonomes<br/>et des exercices pour vérifier ce que tu as compris.',ss['lead']);pw,ph=p.wrap(CW,120);p.drawOn(c,M,348-ph)
    topics='Merise · TypeScript · SQL · Docker<br/>Tests JavaScript · Backend · React'
    p=Paragraph(topics,ss['body']);pw,ph=p.wrap(CW,100);p.drawOn(c,M,237-ph)
    c.setFont('Body',9);c.setFillColor(MUTED);c.drawString(M,104,'Édition du 9 octobre 2026 · Exemples pédagogiques fictifs')
    c.drawString(M,85,'Documentations officielles, spécifications et références académiques citées')
    c.drawString(M,66,'À lire avec le recueil de cheatsheets pour le rappel rapide')
    c.bookmarkPage('cover');c.showPage()

def bibliography(c,refs,title,page_num,manifest):
    ss=styles();flows=[Paragraph('Lire les références',ss['title']),Paragraph('Les situations sont créées pour apprendre. Les liens ci-dessous donnent les références des notions : documentation des outils, spécification UML ou travaux académiques selon le sujet.',ss['body'])]
    for url,(sid,source) in refs.items():
        kind={'official':'Documentation officielle','standard':'Norme / spécification','academic':'Référence académique'}[source['kind']]
        entry=[Paragraph(f'[{sid:02d}] {esc(source["label"])}',ss['label']),Paragraph(esc(kind),ss['small']),Paragraph(f'<a href="{html.escape(url,quote=True)}" color="#526d49">{esc(url)}</a>',ss['small']),Spacer(1,5)]
        if measured(flows+entry,CW)>710:
            header(c,title,'Références',page_num);draw_flows(c,flows);manifest.append({'page':page_num,'type':'sources'});c.showPage();page_num+=1;flows=[Paragraph('Références · suite',ss['title'])]
        flows+=entry
    if flows:
        header(c,title,'Références',page_num);draw_flows(c,flows);manifest.append({'page':page_num,'type':'sources'});c.showPage();page_num+=1
    return page_num

def create(chapters,all_sources,cheat=False):
    filename='CDA-cheatsheets.pdf' if cheat else 'CDA-cours-progressif.pdf'
    title='Fiches mémo · CDA' if cheat else 'Cours progressif · CDA'
    c=canvas.Canvas(str(OUT/filename),pagesize=A4,pageCompression=1)
    c.setTitle(title);c.setAuthor('CDA Studio');c.setSubject('Notions, exemples autonomes et références primaires')
    refs=refs_for(chapters,all_sources,cheat)
    manifest=[];number=1;corrections=[]
    prepared={}
    for chapter in chapters:
        prepared[chapter['id']]=[]
        for index,page in enumerate(chapter['cheats' if cheat else 'lessons'],1):
            exid=None if cheat else chapter['id'].upper()[:3]+'-'+str(index).zfill(2)
            height=measured(page_flows(page,chapter,refs,.92,cheat,exid),CW)
            if height<=710:
                prepared[chapter['id']].append((page,exid,page['title']))
            else:
                if cheat:raise ValueError('Cheatsheet too tall: '+page['title'])
                split=len(page['blocks'])//2
                for part,blocks in enumerate([page['blocks'][:split],page['blocks'][split:]],1):
                    item={**page,'title':page['title']+f' ({part}/2)','blocks':blocks}
                    prepared[chapter['id']].append((item,exid if part==2 else None,page['title']))
    if not cheat:
        cover(c);manifest.append({'page':number,'type':'cover'});number+=1
        starts={};start=3
        for chapter in chapters:starts[chapter['id']]=start;start+=len(prepared[chapter['id']])
        ss=styles();toc=[Paragraph('Comment travailler avec ce PDF',ss['title']),Paragraph('Une notion à la fois : lis la définition, explique le cas fourni, puis tente l’exercice. Les corrections sont rassemblées après les chapitres pour pouvoir chercher avant de lire la réponse.',ss['lead'])]
        for i,chapter in enumerate(chapters,1):toc.append(Paragraph(f'{i:02d} · {esc(chapter["title"])} <font color="#53635d">/ page {starts[chapter["id"]]}</font>',ss['label']));toc.append(Paragraph(esc(chapter['subtitle']),ss['body']))
        toc += [Spacer(1,12),Paragraph('Les trois supports ont des rôles différents',ss['label']),Paragraph('Cours : comprendre avec les explications et les exemples. Cheatsheets : retrouver rapidement une règle ou une syntaxe. Cartes du site : vérifier la mémoire sans regarder la réponse.',ss['body']),Paragraph('Les exemples ne demandent aucun souvenir de tes projets. Un extrait de code signale son contexte ; il n’est pas toujours une application complète à lancer. Le cours ne constitue pas un sujet officiel d’examen.',ss['small'])]
        header(c,title,'Mode d’emploi',number);draw_flows(c,toc);manifest.append({'page':number,'type':'toc'});c.showPage();number+=1
    for chapter in chapters:
        c.bookmarkPage(chapter['id']);c.addOutlineEntry(chapter['title'],chapter['id'],0,False)
        for page,exid,original_title in prepared[chapter['id']]:
            for scale in [1,.98,.96,.94,.92]:
                flows=page_flows(page,chapter,refs,scale,cheat,exid)
                height=measured(flows,CW)
                if height<=710:break
            if height>710:raise ValueError(f'{chapter["id"]} / {page["title"]}: height {height:.1f}, shorten page')
            header(c,title,chapter['title'],number);draw_flows(c,flows)
            manifest.append({'page':number,'type':'cheat' if cheat else 'lesson','technology':chapter['id'],'title':page['title'],'scale':scale,'height':round(height,1)})
            if exid:corrections.append((exid,original_title,page['exercise']['answer'],number))
            c.showPage();number+=1
    if corrections:
        c.bookmarkPage('corrections');c.addOutlineEntry('Corrigés des exercices','corrections',0,False)
        ss=styles();flows=[Paragraph('Corrigés des exercices',ss['title']),Paragraph('Compare ton raisonnement, puis reformule la correction avec tes propres mots. Le numéro renvoie à l’exercice de la leçon.',ss['lead'])]
        for exid,heading,answer,origin in corrections:
            entry=[Paragraph(f'{esc(exid)} · {esc(heading)} <font color="#53635d">(p. {origin})</font>',ss['label']),Paragraph(esc(answer),ss['body']),Spacer(1,5)]
            if measured(flows+entry,CW)>710:
                header(c,title,'Corrigés',number);draw_flows(c,flows);manifest.append({'page':number,'type':'answers'});c.showPage();number+=1;flows=[Paragraph('Corrigés · suite',ss['title'])]
            flows+=entry
        header(c,title,'Corrigés',number);draw_flows(c,flows);manifest.append({'page':number,'type':'answers'});c.showPage();number+=1
    c.bookmarkPage('references');c.addOutlineEntry('Références primaires','references',0,False)
    number=bibliography(c,refs,title,number,manifest)
    c.save()
    (TMP/(filename+'.manifest.json')).write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    return {'file':filename,'pages':number-1,'sources':len(refs),'minimum_scale':min(x.get('scale',1) for x in manifest)}

if __name__=='__main__':
    content=json.loads((ROOT/'data/printable-revisions.json').read_text())
    byid={x['id']:x for x in content['chapters']}
    chapters=[byid[x] for x in ['merise','typescript','sql','docker','tests','backend','react']]
    assert set(byid)=={'merise','typescript','sql','docker','tests','backend','react'}
    sources={s['url']:s for s in content['sources']}
    for chapter in chapters:
        assert chapter['lessons'] and chapter['cheats']
        assert not re.search(r'OQuiz|Oddit|Gamer\s*Challenge|mongodb|graphql|socket\.io|i18next',json.dumps(chapter),re.I),chapter['id']
        for page in chapter['lessons']:
            assert page['exercise']['question'] and page['exercise']['answer']
    print(json.dumps([create(chapters,sources),create(chapters,sources,cheat=True)],ensure_ascii=False))
