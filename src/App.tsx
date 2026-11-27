'use client'

import { useState, type ReactNode } from 'react'
import KidsWorld from './components/KidsWorld'

const whatsapp = 'https://wa.me/@ayamagdy93'
const facebook = 'https://www.facebook.com/share/1GA6oKPgUd/'
const nav = [
  ['الرئيسية', '#home'], ['التشكيلات', '#collections'], ['كتب التلوين', '#coloring'],
  ['للمدارس', '#school'], ['ألعاب الأطفال', '#games'], ['حكاية ملاذ', '#story'],
]
const shell = 'mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-20'
const heading = 'text-[28px] font-extrabold leading-[1.45] md:text-4xl'

function Button({ children, href = whatsapp, outline = false, className = '' }: { children: ReactNode; href?: string; outline?: boolean; className?: string }) {
  return <a href={href} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined} className={`inline-flex min-h-14 items-center justify-center rounded-sm border border-plum px-7 py-3 text-center text-base font-bold transition-colors md:text-lg ${outline ? 'bg-cream text-plum hover:bg-pink' : 'bg-plum text-white hover:bg-[#703b59]'} ${className}`}>{children}</a>
}

function ChatWidget() {
  return <a className="chat-widget" href={facebook} target="_blank" rel="noopener noreferrer" aria-label="تحدثي مع ملاذ على فيسبوك"><span className="chat-bubble">أهلاً! أنا ملاذ 👋<small>تعالي نتكلم على الماسنجر</small></span><img className="chat-boy" src="/chat-boy.png" alt="شخصية ملاذ الكرتونية" /><span className="chat-button"><span className="chat-status" aria-hidden="true" /><span>كلّمني</span><b aria-hidden="true">✦</b></span></a>
}

function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? <div role="img" aria-label={alt} className={`flex items-center justify-center bg-pink p-4 text-center ${className}`}>{alt}</div> : <img src={src} alt={alt} onError={() => setFailed(true)} className={className} />
}

// Original vector studies stand in for book artwork until the print files are supplied.
function Mandala({ variant = 0, gold = false }: { variant?: number; gold?: boolean }) {
  const count = variant % 2 ? 16 : 12
  return <svg viewBox="0 0 300 380" role="img" aria-label="معاينة توضيحية لزخارف التلوين" className="h-full w-full" fill="none" stroke={gold ? '#c69a4a' : '#dba5b2'} strokeWidth="1.1">
    <rect width="300" height="380" fill="#fdf5ea" stroke="none" />
    <rect x="9" y="9" width="282" height="362" strokeWidth="1" />
    <g transform={`translate(150 190) rotate(${variant * 13})`}>
      {[0, 1, 2].map(ring => <g key={ring}>{Array.from({ length: count }, (_, i) => <g key={i} transform={`rotate(${i * 360 / count + ring * 9})`}>
        <path d={`M0 ${-24-ring*28} C${-20-ring*9} ${-55-ring*21} ${-25-ring*12} ${-100-ring*19} 0 ${-113-ring*21} C${25+ring*12} ${-100-ring*19} ${20+ring*9} ${-55-ring*21} 0 ${-24-ring*28}Z`} fill={gold && ring === 0 ? '#f1dfb3' : '#fdf5ea'} />
        <path d={`M0 ${-40-ring*28} Q${-20-ring*7} ${-85-ring*22} 0 ${-101-ring*21} Q${20+ring*7} ${-85-ring*22} 0 ${-40-ring*28}Z`} />
        <path d={`M0 ${-52-ring*28} L0 ${-95-ring*21}`} />
        <circle cy={-118-ring*21} r="3" />
      </g>)}</g>)}
      <circle r="34" fill="#fdf5ea" /><circle r="28" /><circle r="19" />
      {Array.from({ length: 12 }, (_, i) => <ellipse key={i} rx="5" ry="16" cy="-13" transform={`rotate(${i*30})`} />)}
      <circle r="6" fill={gold ? '#c69a4a' : '#fdf5ea'} />
    </g>
    {[0, 1, 2, 3].map(i => <g key={i} transform={`translate(${i%2 ? 279 : 21} ${i<2 ? 21 : 359}) rotate(${i*90})`}><path d="M0 0Q40 2 42 42Q2 40 0 0ZM4 4Q29 10 34 34M0 0Q-3 32 18 43M0 0Q32-3 43 18" /></g>)}
  </svg>
}

function Cover({ back = false }: { back?: boolean }) {
  return <div className="relative flex h-full w-full flex-col items-center overflow-hidden border border-plum bg-[#fdf5ea] p-[7%] text-center shadow-[3px_6px_0_#d8c9b2]" dir="ltr">
    <div className="pointer-events-none absolute inset-[4%] border border-[#c69a4a]" />
    <img src="/logo.png" alt="شعار ملاذ" className="z-10 h-[16%] rounded-sm object-contain" />
    {!back && <><div className="z-10 mt-2 text-[clamp(25px,3.2vw,46px)] leading-none font-bold italic text-[#9b6673]" style={{ fontFamily: 'Georgia, serif' }}>Mandala</div><div className="z-10 mt-2 bg-[#e7ca82] px-3 text-[clamp(10px,1.2vw,17px)] font-bold italic" style={{ fontFamily: 'Georgia, serif' }}>Coloring Book</div></>}
    <div className={`w-full flex-1 overflow-hidden ${back ? 'mt-6' : 'mt-2'}`}><Mandala gold variant={back ? 1 : 0} /></div>
    {back && <p className="z-10 my-3 text-sm font-bold text-[#a37b32]" style={{ fontFamily: 'Georgia, serif' }}>Relax • Color • Create</p>}
    <div className="absolute right-0 bottom-0 left-0 h-[10%] bg-[#dba5b2]" />
    <span className="absolute right-[9%] bottom-[2%] h-[35%] w-[6%] rotate-[33deg] rounded-t-full bg-gradient-to-r from-[#a37b32] via-[#f4d58d] to-[#aa7527]" />
  </div>
}

function Collage({ yellow = false, small = false, cards = false }: { yellow?: boolean; small?: boolean; cards?: boolean }) {
  return <div className={`hero-art relative mx-auto w-full max-w-[590px] ${small ? 'h-[310px]' : 'h-[320px] sm:h-[560px]'}`} aria-label="عرض توضيحي لكتاب ملاذ">
    <div className={`pattern-backdrop absolute top-[7%] right-[5%] bottom-[12%] left-[3%] -rotate-[4deg] ${yellow ? 'rounded-[50%] bg-cream' : 'rounded-[95px] bg-pink'}`} />
    {cards ? <CardStack /> : <BookPair />}
    <span className={`absolute bottom-[6%] left-[9%] z-10 -rotate-[5deg] px-6 py-4 text-center text-base font-bold md:text-lg ${yellow ? 'bg-pink' : 'bg-yellow'}`}>{small ? 'اسم طفلك… بيفرّق ♡' : yellow ? 'وقت صغير… ليكي إنتِ' : 'شوية ألوان… كتير من البهجة'}</span>
    {!yellow && !small && <><span aria-hidden="true" className="creative-spark absolute top-3 right-0 text-5xl">✦</span><span aria-hidden="true" className="creative-spark creative-spark-delay absolute bottom-20 -left-1 text-6xl">✧</span></>}
  </div>
}

function BookPair() {
  return <><div className="collage-card collage-card-left absolute -top-[5px] lg:top-[15%] left-[8%] h-[90%] w-[60%] lg:h-[65%] lg:w-[43%] -rotate-[11deg] overflow-hidden border-4 rounded-sm border-plum bg-cream"><Photo src="/images/book-left.png" alt="صفحة من كتاب ملاذ" className="h-full w-full object-cover" /></div><div className="collage-card collage-card-right absolute top-[9%] right-[13%] h-[90%] w-[60%] lg:h-[75%] lg:w-[48%] rotate-[8deg] overflow-hidden border-4 rounded-sm border-plum bg-cream"><Photo src="/images/book-right.png" alt="غلاف كتاب ملاذ" className="h-full w-full object-cover" /></div></>
}

const cardReelImages = ['card-right.jpg', 'pattern-card-0014.jpg', 'pattern-card-0015.jpg', 'pattern-card-0016.jpg', 'pattern-card-0017.jpg', 'card-left.jpg']

function CardStack() {
  return <div className="card-stack" aria-label="صور كتاب التلوين">{cardReelImages.map((image, index) => <div className="card-stack-card" key={image} style={{ zIndex: index + 1 }}><Photo src={`/images/${image}`} alt="صفحة من كتاب ملاذ للتلوين" className="card-stack-image" /></div>)}</div>
}

function Gallery() {
  const [page, setPage] = useState(2)
  return <section id="inside" className="bg-blue py-12 md:py-14">
    <div className={shell}>
      <h2 className={`${heading} text-center`}>كل صفحة… بداية لفكرة جديدة</h2>
      <p className="mt-3 text-center text-base text-muted">نظرة من جوّه عالم الألوان — مساحة لرسوماتك المبهجة</p>
      <div className="mx-auto mt-10 flex max-w-[1100px] items-center justify-center gap-2 sm:gap-8" dir="ltr">
        <button aria-label="الصفحات السابقة" onClick={() => setPage((page+5)%6)} className="lg:flex hidden size-11 shrink-0 items-center justify-center rounded-sm text-3xl transition-colors hover:bg-white">←</button>
        <div className="relative grid lg:aspect-16/9 aspect-[1] w-full max-w-[834px] grid-cols-2 gap-3 border-2 border-plum bg-cream p-3 shadow-[7px_7px_0_#fffaf1] sm:gap-7 sm:p-5" aria-live="polite" aria-label={`معاينة الصفحات ${page+1} و${(page+1)%6+1}`}>
          {[page, (page+1)%6].map((p,i) => <div key={`${p}-${i}`} className="overflow-hidden border border-[#b69ca3]"><Photo src={`/images/${cardReelImages[p]}`} alt={`صفحة تلوين ${p + 1}`} className="h-full w-full object-contain" /></div>)}
          <div className="absolute inset-y-0 left-1/2 w-px bg-[#d7cbbc]" />
        </div>
        <button aria-label="الصفحات التالية" onClick={() => setPage((page+1)%6)} className="lg:flex hidden size-11 shrink-0 items-center justify-center rounded-sm text-3xl transition-colors hover:bg-white">→</button>
      </div>
      <div className="mt-9 flex justify-center gap-2 sm:gap-4" dir="ltr">
        {Array.from({length:6}, (_, i) => <button key={i} aria-label={`عرض المعاينة ${i+1}`} aria-pressed={page===i} onClick={() => setPage(i)} className={`h-[72px] w-11 overflow-hidden border bg-cream transition-transform sm:h-[85px] sm:w-[60px] ${page===i ? '-translate-y-1 border-[3px] border-plum' : 'border-[#a18a91] hover:-translate-y-1'}`}><Photo src={`/images/${cardReelImages[i]}`} alt={`صفحة تلوين ${i + 1}`} className="h-full w-full object-contain" /></button>)}
      </div>
      <p className="mt-5 text-center text-sm text-muted">معاينات توضيحية مؤقتة — صور صفحات الكتاب الأصلية تُضاف عند توفيرها.</p>
    </div>
  </section>
}

export default function App() {
  const [menu, setMenu] = useState(false)
  return <div dir="rtl" id="home" className="relative min-h-screen overflow-x-clip bg-cream text-plum">
    <div className="creative-background" aria-hidden="true"><span className="creative-orb creative-orb-one" /><span className="creative-orb creative-orb-two" /></div>
    <div className="site-content">
    <header className={`site-header ${shell}`}>
      <div className="flex min-h-[104px] items-center justify-between gap-5 border-b border-plum/70">
        <a href="#home" aria-label="ملاذ — الرئيسية" className="brand shrink-0 leading-none"><img src="/logo.png" alt="شعار ملاذ" className="h-[76px] w-[76px] object-contain" /></a>
        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-5 text-base font-bold lg:flex">{nav.map(([text, href]) => <a className="py-3 transition-colors hover:text-[#a14e71]" key={href} href={href}>{text}</a>)}</nav>
        <button onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="mobile-nav" aria-label={menu ? 'إغلاق القائمة' : 'فتح القائمة'} className="menu-toggle rounded-sm border border-plum lg:hidden"><span className={menu ? 'is-open' : ''}><i /><i /><i /></span></button>
      </div>
      {menu && <nav id="mobile-nav" aria-label="قائمة الموبايل" className="grid gap-1 border-b border-plum py-4 lg:hidden">{nav.map(([text,href]) => <a key={href} href={href} onClick={() => setMenu(false)} className="min-h-11 rounded-lg px-3 py-3 font-bold hover:bg-pink">{text}</a>)}</nav>}
    </header>
    <main>
      <section className={`${shell} reveal-section grid items-center gap-6 pt-12 pb-14 md:min-h-[690px] md:grid-cols-2 md:gap-8 md:pt-10 md:pb-16`}>
        <div className="pb-5">
          <p className="text-lg font-bold">صُنع بحب… علشانك</p>
          <h1 className="mt-6 text-[42px] font-extrabold leading-[1.45] sm:text-[52px] lg:text-[61px]">مش بس هدية،<br />دي حتّة من القلب.</h1>
          <p className="mt-7 max-w-[560px] text-lg leading-[1.7] text-muted md:text-[21px]">هدايا بتشبه أحبابك، وكتب تلوين تفتح باب الخيال.<br className="hidden xl:block" /> في ملاذ، كل تفصيلة بتعمل فرحة كبيرة.</p>
          <div className="mt-10 flex flex-wrap gap-4"><Button href="#collections">اكتشفي عالم ملاذ ←</Button><Button href="#coloring" outline>قلّبي في كتب التلوين</Button></div>
          <p className="mt-9 text-sm font-bold leading-7">تخصيص على ذوقك&nbsp; · &nbsp;تغليف بعناية&nbsp; · &nbsp;طلب عبر واتساب</p>
        </div>
        <Collage />
      </section>
      <div className="bg-plum px-6 py-6 text-center text-base font-bold leading-8 text-cream md:text-xl">هدايا ليها معنى <span className="px-3 md:px-6">✦</span> كتب تلوين وخيال <span className="px-3 md:px-6">✦</span> تفاصيل على ذوقك <span className="px-3 md:px-6">✦</span> فرحة معمولة بحب</div>
      <section id="collections" className={`${shell} reveal-section py-14 md:py-16`}>
        <div className="flex flex-wrap items-end justify-between gap-5"><div><h2 className={heading}>حاجات حلوة… لناس غالية</h2><p className="mt-3 text-lg text-muted">لكل حد بتحبيه، هتلاقي هنا حاجة شبهه.</p></div><a className="flex min-h-11 items-center font-bold underline-offset-8 hover:underline" href={facebook} target="_blank" rel="noreferrer">شوفي كل التشكيلات ←</a></div>
        <div className="mt-9 grid gap-7 md:grid-cols-3">
          {[{title:'توزيعات لكل مناسبة',desc:'تفاصيل صغيرة تكمل الفرحة.',img:1,bg:'bg-[#f3e8d4]'}, {title:'هدايا بلمسة شخصية',desc:'اسم، رسالة، وذكرى بتفضل.',img:12,bg:'bg-pink'}, {title:'كتب تلوين وخيال',desc:'وقت هادي، ومساحة لكل الألوان.',img:0,bg:'bg-[#dce8f1]'}].map(item => <a key={item.title} href={item.img ? whatsapp : '#coloring'} className={`pattern-card group rounded-[10px] p-4 pb-6 transition-transform hover:-translate-y-1 ${item.bg}`}>
            <div className="h-[380px] overflow-hidden rounded-xl border-[1.5px] border-plum">{item.img ? <Photo src={`/images/image-${item.img}.jpg`} alt={item.title} className="h-full w-full object-cover" /> : <div className="h-full scale-[1.7] bg-cream"><Mandala variant={1} /></div>}</div>
            <h3 className="mx-2 mt-4 text-[23px] font-bold">{item.title}</h3><p className="mx-2 mt-2 text-[15px]">{item.desc}</p>
          </a>)}
        </div>
      </section>
      <section id="coloring" className="reveal-section bg-yellow">
        <div className={`${shell} grid items-center gap-5 py-14 md:min-h-[650px] md:grid-cols-2 md:gap-12`}>
          <div><p className="font-bold">جديد في عالم ملاذ / كتب التلوين</p><h2 className="mt-6 text-[34px] font-extrabold leading-[1.45] lg:text-[45px]">افصلي شوية…<br />ولوّني الدنيا بطريقتك.</h2><h3 className="mt-5 text-[23px] font-bold" dir="ltr" style={{textAlign:'right'}}>Mandala Coloring Book</h3><p className="mt-5 text-lg leading-relaxed">رسومات ماندالا، زهور وحيوانات بتفاصيل تستاهل وقتك.<br />هدية لنفسك أو لحد بيحب يسيب لخياله مساحة.</p><div className="mt-8 flex flex-wrap gap-3">{['رسومات متنوعة','تفاصيل ملهمة','لحظات هادية'].map(t => <span key={t} className="rounded-sm bg-cream px-6 py-2 text-sm font-bold">{t}</span>)}</div><div className="mt-9 flex flex-wrap items-center gap-6"><Button>اطلبي كتابك عبر واتساب ↗</Button><a href="#inside" className="flex min-h-11 items-center font-bold">شاهدي الصفحات من الداخل ↓</a></div></div>
          <Collage yellow />
        </div>
      </section>
      <Gallery />
      <section id="school" className={`${shell} reveal-section grid items-center gap-10 py-14 md:min-h-[440px] md:grid-cols-2 md:gap-16`}>
        <div><p className="font-bold">للأبطال الصغيرين</p><h2 className={`${heading} mt-6`}>فرحة على مقاس خيالهم.</h2><p className="mt-5 max-w-[600px] text-xl leading-relaxed text-muted">توزيعات للمدارس والحضانات، أدوات باسم الطفل，<br className="hidden lg:block" /> وأنشطة تلوين تخلّي كل يوم حكاية ألطف.</p><Button className="mt-8">جهّزي توزيعاتهم مع ملاذ ←</Button></div>
        <div className="pattern-card relative mx-auto h-[290px] lg:h-[460px] w-full max-w-[520px] rounded-[12px] bg-pink"><Photo src="/images/image-5.jpg" alt="أدوات مدرسية مخصصة باسم وصورة الطفل من ملاذ" className="absolute top-0 left-[12%] h-[230px] lg:h-[350px] w-[45%] -rotate-[8deg] rounded-sm border border-plum object-contain" /><Photo src="/images/image-10.jpg" alt="كراسة تلوين شخصية للأطفال" className="absolute top-6 right-[12%] h-[240px] lg:h-[370px] w-[50%] rotate-[8deg] rounded-sm border border-plum object-contain" /><span className="absolute bottom-5 left-1/2 w-max max-w-[90%] -translate-x-1/2 -rotate-[4deg] rounded-lg bg-yellow px-7 py-4 text-lg font-bold">اسم طفلك… بيفرّق ♡</span></div>
      </section>
      <KidsWorld />
      <section id="story" className={`${shell} reveal-section pt-5 pb-16`}>
        <h2 className={`${heading} text-center md:text-[34px]`}>من فكرة في بالك… لفرحة بين إيديكي</h2>
        <div className="mt-10 grid gap-7 md:grid-cols-3">{[
          ['01','احكي لنا فكرتك','اختاري هديتك أو كتابك، وابعتيلنا على واتساب.'],
          ['02','نظبط التفاصيل سوا','الألوان، الاسم، والرسالة… كل حاجة على ذوقك.'],
          ['03','نجهّزها بحب','ننسّق ونغلّف كل تفصيلة، علشان تليق بالفرحة.'],
        ].map(([n,title,desc], i) => <article key={n} className={`min-h-[205px] rounded-[20px] border border-[#d9c9cd] p-6 ${i===1 ? 'bg-yellow' : ''}`}><span className="text-3xl font-extrabold">{n}</span><h3 className="mt-3 text-[22px] font-bold">{title}</h3><p className="mt-3 leading-7 text-muted">{desc}</p></article>)}</div>
      </section>
      <section id="contact" className="reveal-section bg-pink px-6 py-12 text-center">
        <h2 className={heading}>عندك مناسبة؟ ولا نفسك تفرّحي حد وخلاص؟</h2><p className="mt-5 text-lg">احكي لنا فكرتك… ونحوّلها سوا لهدية ليها حكاية.</p><Button className="mt-7">ابدئي الحكاية على واتساب ←</Button><p className="mt-8 text-[15px] font-bold leading-8">عيد ميلاد &nbsp;·&nbsp; خطوبة وزفاف &nbsp;·&nbsp; تخرج ونجاح &nbsp;·&nbsp; مولود جديد &nbsp;·&nbsp; شكر وتقدير</p>
      </section>
    </main>
    <footer className="bg-plum text-cream"><div className={`${shell} pt-8 pb-6`}><div className="grid gap-8 pb-8 md:grid-cols-[1fr_1.5fr_1fr]"><div><a href="#home" className="text-[38px] font-extrabold">ملاذ</a><p className="mt-2">هدايا وحكايات، معمولة بحب.</p></div><nav aria-label="روابط أسفل الصفحة" className="flex flex-wrap items-start gap-x-5 gap-y-2 pt-4 text-[15px] font-bold">{nav.slice(1).map(([t,h]) => <a key={h} href={h} className="py-3 hover:underline">{t}</a>)}</nav><div className="md:text-left"><h3 className="pt-3 text-lg font-bold">خلّينا على تواصل</h3><div className="mt-3 flex gap-3 text-sm md:justify-end"><a href={whatsapp} target="_blank" rel="noreferrer" className="py-3 hover:underline">واتساب</a><span className="py-3">/</span><a href={facebook} target="_blank" rel="noreferrer" className="py-3 hover:underline">جروب فيسبوك</a></div></div></div><div className="flex flex-wrap justify-between gap-4 border-t border-[#8e647d] pt-6 text-sm"><p>© {new Date().getFullYear()} ملاذ للهدايا — جميع الحقوق محفوظة.</p><p>فرحة صغيرة… أثر كبير ♡</p></div></div></footer>
    </div>
    <ChatWidget />
  </div>
}
