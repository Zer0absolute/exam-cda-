"""Build the two printable CDA revision guides from curated, standalone lessons."""
from pathlib import Path
import json, re, html
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle, Preformatted, Flowable
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
fonts = [('Body','Arial.ttf'),('Bold','Arial Bold.ttf'),('Italic','Arial Italic.ttf'),('Mono','Courier New.ttf'),('MonoBold','Courier New Bold.ttf')]
if not all((font_dir / filename).exists() for _, filename in fonts):
    font_dir = Path(reportlab.__file__).parent / 'fonts'
    fonts = [('Body','Vera.ttf'),('Bold','VeraBd.ttf'),('Italic','VeraIt.ttf'),('Mono','Vera.ttf'),('MonoBold','VeraBd.ttf')]
for name, filename in fonts:
    pdfmetrics.registerFont(TTFont(name, str(font_dir / filename)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold',italic='Italic',boldItalic='Bold')

def clean(s):
    return str(s).replace('\u2011','-').replace('\u2013','-').replace('\u2014','-').replace('\u00a0',' ')

def esc(s):
    return html.escape(clean(s)).replace('\n','<br/>')

def styles(scale=1, cheat=False):
    size = (10.5 if cheat else 11.3) * scale
    return {
        'body':ParagraphStyle('body',fontName='Body',fontSize=size,leading=size*1.42,textColor=INK,spaceAfter=5*scale),
        'small':ParagraphStyle('small',fontName='Body',fontSize=8.6*scale,leading=12*scale,textColor=MUTED,spaceAfter=3),
        'title':ParagraphStyle('title',fontName='Bold',fontSize=(22 if cheat else 23)*scale,leading=27*scale,textColor=INK,spaceAfter=10*scale),
        'lead':ParagraphStyle('lead',fontName='Body',fontSize=11.3*scale,leading=16*scale,textColor=MUTED,spaceAfter=13*scale),
        'label':ParagraphStyle('label',fontName='Bold',fontSize=11*scale,leading=15*scale,textColor=ACCENT,spaceBefore=9*scale,spaceAfter=5*scale),
        'cell':ParagraphStyle('cell',fontName='Body',fontSize=9.8*scale,leading=13.7*scale,textColor=INK),
        'headcell':ParagraphStyle('headcell',fontName='Bold',fontSize=9.8*scale,leading=13.7*scale,textColor=INK),
        'code':ParagraphStyle('code',fontName='MonoBold',fontSize=9.3*scale,leading=13*scale,textColor=HexColor('#101914'),spaceAfter=4),
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
            c.setFillColor(INK);c.setFont('Bold',10.5);c.drawCentredString(x+w/2,y+h-19,clean(title))
            c.setFont('Body',9.4)
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
            box(CW-142,43,142,85,'EXEMPLAIRE',['exemplaire_id'])
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

def block_flows(b, ss):
    flows=[]
    if b.get('title'):flows.append(Paragraph(esc(b['title']),ss['label']))
    kind=b['type']
    if kind=='text':flows.append(Paragraph(esc(b['text']),ss['body']))
    elif kind=='bullets':
        for x in b['items']:flows.append(Paragraph('• '+esc(x),ss['body']))
    elif kind=='table':flows.append(table(b,ss,1))
    elif kind=='code':
        code=clean(b['code'])
        longest=max((pdfmetrics.stringWidth(line,ss['code'].fontName,ss['code'].fontSize) for line in code.splitlines()),default=0)
        if longest>CW-18:raise ValueError('Code line too wide: '+b.get('title','')+' / '+max(code.splitlines(),key=len))
        pre=Preformatted(code,ss['code'])
        t=Table([[pre]],colWidths=[CW])
        t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),CREAM),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9)]))
        flows.append(t)
    elif kind=='diagram':flows.append(Diagram(b['variant']))
    else:raise ValueError(kind)
    flows.append(Spacer(1,6))
    return flows

def source_flows(page, source_ids, ss):
    refs=[]
    for url in page.get('sources',[]):
        refs.append(f'<a href="{html.escape(url,quote=True)}" color="#526d49">[{source_ids[url][0]:02d}]</a>')
    return [Spacer(1,9),Paragraph('Pour approfondir : '+' '.join(refs)+' · Références détaillées à la fin.',ss['small'])] if refs else []

def prepare_page(page, source_ids, cheat=False, exid=None):
    """Paginate by complete teaching blocks; keep the font size constant."""
    ss=styles(cheat=cheat)
    groups=[block_flows(b,ss) for b in page['blocks']]
    if exid:
        exercise=[Paragraph('À TOI DE JOUER · '+exid,ss['label']),Paragraph(esc(page['exercise']['question']),ss['body']),Paragraph(f'<a href="#answer-{exid}" color="#526d49">Ouvrir le corrigé à la fin du cours.</a>',ss['small'])]
        if groups and measured(groups[-1]+exercise,CW)<500:groups[-1]+=exercise
        else:groups.append(exercise)
    refs=source_flows(page,source_ids,ss)
    pages=[];current=[];part=1
    def prefix(n):
        flows=[]
        if n>1:flows.append(Paragraph('SUITE DE LA LEÇON' if not cheat else 'SUITE DE LA FICHE',ss['small']))
        flows.append(Paragraph(esc(page['title']),ss['title']))
        if n==1 and page.get('lead'):flows.append(Paragraph(esc(page['lead']),ss['lead']))
        return flows
    for group in groups:
        if measured(prefix(part)+current+group+refs,CW)>710:
            if not current:raise ValueError('Teaching block too tall: '+page['title'])
            pages.append(prefix(part)+current+refs);part+=1;current=[]
        if measured(prefix(part)+group+refs,CW)>710:raise ValueError('Teaching block too tall: '+page['title'])
        current+=group
    if current:pages.append(prefix(part)+current+refs)
    return pages

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
    if not cheat:used.update(reading_basics()['sources'])
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
    c.setFont('Body',9);c.setFillColor(MUTED);c.drawString(M,104,'Édition révisée du 10 octobre 2026 · Exemples pédagogiques fictifs')
    c.drawString(M,85,'Documentations officielles, spécifications et références académiques citées')
    c.drawString(M,66,'À lire avec le recueil de cheatsheets pour le rappel rapide')
    c.bookmarkPage('cover');c.showPage()

def bibliography(c,refs,title,page_num,manifest):
    ss=styles();flows=[Paragraph('Lire les références',ss['title']),Paragraph('Les situations sont créées pour apprendre. Les liens ci-dessous donnent les références des notions : documentation des outils, spécification UML ou travaux académiques selon le sujet.',ss['body'])]
    ss['label']=ParagraphStyle('reference-label',parent=ss['label'],fontSize=9.8,leading=13,spaceBefore=3,spaceAfter=2)
    for url,(sid,source) in refs.items():
        kind={'official':'Documentation officielle','standard':'Norme / spécification','academic':'Référence académique'}[source['kind']]
        entry=[Paragraph(f'[{sid:02d}] {esc(source["label"])}',ss['label']),Paragraph(esc(kind),ss['small']),Paragraph(f'<a href="{html.escape(url,quote=True)}" color="#526d49">{esc(url)}</a>',ss['small']),Spacer(1,3)]
        if measured(flows+entry,CW)>710:
            header(c,title,'Références',page_num);draw_flows(c,flows);manifest.append({'page':page_num,'type':'sources'});c.showPage();page_num+=1;flows=[Paragraph('Références · suite',ss['title'])]
        flows+=entry
    if flows:
        header(c,title,'Références',page_num);draw_flows(c,flows);manifest.append({'page':page_num,'type':'sources'});c.showPage();page_num+=1
    return page_num

def reading_basics():
    return {
        'title':'Quelques repères pour lire le JavaScript',
        'lead':'Les exemples du cours utilisent JavaScript et TypeScript. Tu peux suivre leur fonctionnement sur papier : commence par reconnaître les valeurs, puis les instructions qui les utilisent.',
        'blocks':[
            {'type':'text','title':'1. Une variable donne un nom à une valeur','text':'Dans const prix = 10;, prix est le nom et 10 est la valeur. Le signe = affecte la valeur au nom : il ne pose pas une question. const signifie que ce nom ne sera pas réaffecté. Un texte se place entre guillemets, comme "Livre". true et false sont des valeurs booléennes : vrai et faux.'},
            {'type':'text','title':'2. Une fonction reçoit des valeurs et produit un résultat','text':'calculerTotal est une fonction. Ses paramètres prix et quantite sont les noms utilisés à l’intérieur. Quand on l’appelle avec calculerTotal(10, 2), ces paramètres valent 10 et 2. return renvoie le résultat 20 à l’endroit où la fonction a été appelée. console.log affiche une valeur ; // commence un commentaire, sans effet sur le calcul.'},
            {'type':'code','title':'Premier programme complet : calculer un total','code':'const prix = 10;\nconst quantite = 2;\nfunction calculerTotal(prix, quantite) {\n  return prix * quantite;\n}\nconst total = calculerTotal(prix, quantite);\nconsole.log(total); // affiche 20'},
            {'type':'text','title':'3. Une condition choisit ce qui sera exécuté','text':'if signifie « si ». === compare deux valeurs sans les convertir : avec total = 20, total === 20 est vrai. Le deuxième programme affiche donc Montant correct. Les accolades { } délimitent un bloc d’instructions ; else contient le cas contraire. Dans les chapitres, >= signifie « supérieur ou égal » et ! inverse un booléen.'},
            {'type':'code','title':'Deuxième programme, indépendant du premier','code':'const total = 20;\nif (total === 20) {\n  console.log("Montant correct");\n} else {\n  console.log("Autre montant");\n}'},
            {'type':'text','title':'4. Un objet regroupe des propriétés ; un tableau contient une liste','text':'Un objet peut réunir l’identifiant et le titre d’un livre. Une propriété associe un nom à une valeur : titre vaut "Le Phare". Ici les accolades écrivent un objet ; dans if, elles délimitaient des instructions. Un tableau est une liste ordonnée : [10, 12] contient deux nombres. Le programme suivant transforme chaque note en son double.'},
            {'type':'text','title':'Lire le point, les crochets et la flèche','text':'livre.titre lit la propriété titre de l’objet livre. Les crochets [ ] délimitent ici un tableau. map fabrique un nouveau tableau en appliquant une fonction à chaque élément : 10 devient 20 et 12 devient 24. note => note * 2 est une fonction courte : elle reçoit note et renvoie son double. Une fonction fournie à une autre fonction est souvent appelée callback.'},
            {'type':'code','title':'Troisième programme : objet, liste et transformation','code':'const livre = { id: 1, titre: "Le Phare" };\nconsole.log(livre.titre); // Le Phare\nconst notes = [10, 12];\nconst doubles = notes.map(note => note * 2);\nconsole.log(doubles); // [20, 24]'},
            {'type':'text','title':'5. Importer une fonction et lire un fragment','text':'import sert à récupérer ce qu’un autre fichier ou une bibliothèque exporte. export rend une valeur disponible à d’autres fichiers. Une bibliothèque est du code réutilisable, par exemple React. Le cours indique si un bloc est un programme autonome ou un fragment : un fragment illustre une étape et suppose le contexte annoncé. Tu n’as pas à deviner des variables cachées.'},
            {'type':'text','title':'Une manière de vérifier ta compréhension','text':'Pour chaque exemple, indique une valeur de départ, suis les instructions dans l’ordre et note le résultat. Dans le premier programme, remplace la quantité 2 par 3 : le résultat devient 30. Si un symbole te bloque, reviens à son explication avant de passer à la suite.'}
        ],'sources':[
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types',
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions',
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map',
            'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules'
        ]
    }

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
            pages=prepare_page(page,refs,cheat,exid)
            prepared[chapter['id']].append((page,exid,pages))
    if not cheat:
        cover(c);manifest.append({'page':number,'type':'cover'});number+=1
        ss=styles()
        guide=[Paragraph('Comprendre une étape à la fois',ss['title']),Paragraph('Une leçon commence par une idée, montre des données ou du code, puis explique comment on obtient le résultat. Les exemples sont fictifs : toutes les informations utiles sont données.',ss['lead'])]
        for heading,text in [
            ('1. Lire le vocabulaire avant l’exemple','Quand un mot est nouveau, reformule sa définition. Par exemple, une cardinalité indique combien de liens un objet précis peut avoir. Lis ensuite la situation qui utilise ce mot.'),
            ('2. Suivre les valeurs, pas seulement les lignes','Pour le code, note les valeurs de départ et ce qui change après chaque instruction. Pour une table, suis une ligne précise. Pour un schéma, lis chaque lien en faisant une phrase.'),
            ('3. Chercher avant de lire le corrigé','Les exercices réutilisent une règle expliquée juste avant. Leur correction montre les étapes du raisonnement ; le lien du corrigé et le lien de retour permettent de passer de l’un à l’autre.'),
            ('4. Utiliser le mémo après la leçon','La fiche mémo rappelle les règles et les syntaxes déjà expliquées. Cache-la ensuite et essaie de retrouver la règle avec un exemple.'),
            ('5. Lire les bases avant l’approfondissement','Les passages marqués « Approfondissement » détaillent des cas particuliers. Termine d’abord les exemples de base, puis reviens sur ces passages quand tu sais expliquer le cas simple.')
        ]:guide+= [Paragraph(heading,ss['label']),Paragraph(text,ss['body'])]
        guide+=[Paragraph('Les repères JavaScript qui suivent expliquent les symboles utilisés dans les chapitres. Le sommaire est cliquable ; les références documentaires sont regroupées à la fin.',ss['small'])]
        c.bookmarkPage('guide');c.addOutlineEntry('Comment lire le cours','guide',0,False)
        header(c,title,'Mode d’emploi',number);draw_flows(c,guide);manifest.append({'page':number,'type':'guide'});c.showPage();number+=1
        basic_pages=prepare_page(reading_basics(),refs)
        c.bookmarkPage('reading');c.addOutlineEntry('Lire les exemples JavaScript','reading',0,False)
        for flows in basic_pages:
            header(c,title,'Repères JavaScript',number);draw_flows(c,flows);manifest.append({'page':number,'type':'intro'});c.showPage();number+=1
        starts={};start=number+1
        for chapter in chapters:
            starts[chapter['id']]=start
            start+=sum(len(pages) for _,_,pages in prepared[chapter['id']])
        toc=[Paragraph('Choisir une matière',ss['title']),Paragraph('Dans chaque chapitre, les leçons suivent un ordre de lecture. Commence par la première si les bases sont encore floues.',ss['lead'])]
        for i,chapter in enumerate(chapters,1):
            toc.append(Paragraph(f'<a href="#{chapter["id"]}" color="#a3442c">{i:02d} · {esc(chapter["title"])}</a> <font color="#53635d">/ page {starts[chapter["id"]]}</font>',ss['label']))
            toc.append(Paragraph(esc(chapter['subtitle']),ss['body']))
        c.bookmarkPage('contents');c.addOutlineEntry('Sommaire cliquable','contents',0,False)
        header(c,title,'Sommaire',number);draw_flows(c,toc);manifest.append({'page':number,'type':'toc'});c.showPage();number+=1
    for chapter in chapters:
        c.bookmarkPage(chapter['id']);c.addOutlineEntry(chapter['title'],chapter['id'],0,False)
        for index,(page,exid,pages) in enumerate(prepared[chapter['id']],1):
            key='lesson-'+exid if exid else chapter['id']+'-cheat-'+str(index)
            c.bookmarkPage(key);c.addOutlineEntry(page['title'],key,1,False)
            for part,flows in enumerate(pages,1):
                header(c,title,chapter['title'],number);draw_flows(c,flows)
                manifest.append({'page':number,'type':'cheat' if cheat else 'lesson','technology':chapter['id'],'title':page['title'],'part':part,'parts':len(pages),'scale':1,'height':round(measured(flows,CW),1)})
                if exid and part==len(pages):corrections.append((exid,page['title'],page['exercise']['answer'],number))
                c.showPage();number+=1
    if corrections:
        c.bookmarkPage('corrections');c.addOutlineEntry('Corrigés des exercices','corrections',0,False)
        ss=styles();flows=[Paragraph('Corrigés des exercices',ss['title']),Paragraph('Compare les étapes du raisonnement, puis refais le cas en changeant une valeur. Chaque lien permet de revenir à la leçon.',ss['lead'])];answer_keys=[]
        for exid,heading,answer,origin in corrections:
            entry=[Paragraph(f'{esc(exid)} · {esc(heading)} <font color="#53635d">(exercice p. {origin})</font>',ss['label']),Paragraph(esc(answer),ss['body']),Paragraph(f'<a href="#lesson-{exid}" color="#526d49">Revenir à la leçon.</a>',ss['small']),Spacer(1,7)]
            if measured(flows+entry,CW)>710:
                for key in answer_keys:c.bookmarkPage('answer-'+key)
                header(c,title,'Corrigés',number);draw_flows(c,flows);manifest.append({'page':number,'type':'answers'});c.showPage();number+=1;flows=[Paragraph('Corrigés · suite',ss['title'])];answer_keys=[]
            flows+=entry
            answer_keys.append(exid)
        for key in answer_keys:c.bookmarkPage('answer-'+key)
        header(c,title,'Corrigés',number);draw_flows(c,flows);manifest.append({'page':number,'type':'answers'});c.showPage();number+=1
    c.bookmarkPage('references');c.addOutlineEntry('Références primaires','references',0,False)
    number=bibliography(c,refs,title,number,manifest)
    c.save()
    (TMP/(filename+'.manifest.json')).write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    return {'file':filename,'pages':number-1,'lessons':sum(len(ch['lessons']) for ch in chapters),'cheatsheets':sum(len(ch['cheats']) for ch in chapters),'sources':len(refs),'minimum_scale':1}

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
