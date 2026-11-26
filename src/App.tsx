'use client'

import { useState, type ReactNode } from 'react'

const whatsapp = 'https://wa.me/@ayamagdy93'
const facebook = 'https://www.facebook.com/groups/1060581723439619/'
const nav = [
  ['الرئيسية', '#home'], ['التشكيلات', '#collections'], ['كتب التلوين', '#coloring'],
  ['للمدارس', '#school'], ['حكاية ملاذ', '#story'],
]
const shell = 'mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-20'
const heading = 'text-[28px] font-extrabold leading-[1.45] md:text-4xl'

function Button({ children, href = whatsapp, outline = false, className = '' }: { children: ReactNode; href?: string; outline?: boolean; className?: string }) {
  return <a href={href} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined} className={`inline-flex min-h-14 items-center justify-center rounded-full border border-plum px-7 py-3 text-center text-base font-bold transition-colors md:text-lg ${outline ? 'bg-cream text-plum hover:bg-pink' : 'bg-plum text-white hover:bg-[#703b59]'} ${className}`}>{children}</a>
}

function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? <div role="img" aria-label={alt} className={`flex items-center justify-center bg-pink p-4 text-center ${className}`}>{alt}</div> : <img src={src} alt={alt} onError={() => setFailed(true)} className={className} />
}

// Original vector studies stand in for book artwork until the print files are supplied.
function Mandala({ variant = 0, gold = false }: { variant?: number; gold?: boolean }) {
  const count = variant % 2 ? 16 : 12
  return <svg viewBox="0 0 300 380" role="img" aria-label="معاينة توضيحية لزخارف التلوين" className="h-full w-full" fill="none" stroke={gold ? '#aa792e' : '#322b2c'} strokeWidth="1.1">
    <rect width="300" height="380" fill="#fffdf7" stroke="none" />
    <rect x="9" y="9" width="282" height="362" strokeWidth="1" />
    <g transform={`translate(150 190) rotate(${variant * 13})`}>
      {[0, 1, 2].map(ring => <g key={ring}>{Array.from({ length: count }, (_, i) => <g key={i} transform={`rotate(${i * 360 / count + ring * 9})`}>
        <path d={`M0 ${-24-ring*28} C${-20-ring*9} ${-55-ring*21} ${-25-ring*12} ${-100-ring*19} 0 ${-113-ring*21} C${25+ring*12} ${-100-ring*19} ${20+ring*9} ${-55-ring*21} 0 ${-24-ring*28}Z`} fill={gold && ring === 0 ? '#f7e6b8' : '#fffdf7'} />
        <path d={`M0 ${-40-ring*28} Q${-20-ring*7} ${-85-ring*22} 0 ${-101-ring*21} Q${20+ring*7} ${-85-ring*22} 0 ${-40-ring*28}Z`} />
        <path d={`M0 ${-52-ring*28} L0 ${-95-ring*21}`} />
        <circle cy={-118-ring*21} r="3" />
      </g>)}</g>)}
      <circle r="34" fill="#fffdf7" /><circle r="28" /><circle r="19" />
      {Array.from({ length: 12 }, (_, i) => <ellipse key={i} rx="5" ry="16" cy="-13" transform={`rotate(${i*30})`} />)}
      <circle r="6" fill={gold ? '#aa792e' : '#fffdf7'} />
    </g>
    {[0, 1, 2, 3].map(i => <g key={i} transform={`translate(${i%2 ? 279 : 21} ${i<2 ? 21 : 359}) rotate(${i*90})`}><path d="M0 0Q40 2 42 42Q2 40 0 0ZM4 4Q29 10 34 34M0 0Q-3 32 18 43M0 0Q32-3 43 18" /></g>)}
  </svg>
}

function Cover({ back = false }: { back?: boolean }) {
  return <div className="relative flex h-full w-full flex-col items-center overflow-hidden border border-plum bg-[#fffaf1] p-[7%] text-center shadow-[3px_6px_0_#d8c9b2]" dir="ltr">
    <div className="pointer-events-none absolute inset-[4%] border border-[#b89046]" />
    <img src="/logo.png" alt="شعار ملاذ" className="z-10 h-[16%] rounded-full object-contain" />
    {!back && <><div className="z-10 mt-2 text-[clamp(25px,3.2vw,46px)] leading-none font-bold italic text-[#3f2e27]" style={{ fontFamily: 'Georgia, serif' }}>Mandala</div><div className="z-10 mt-2 bg-[#edd79c] px-3 text-[clamp(10px,1.2vw,17px)] font-bold italic" style={{ fontFamily: 'Georgia, serif' }}>Coloring Book</div></>}
    <div className={`w-full flex-1 overflow-hidden ${back ? 'mt-6' : 'mt-2'}`}><Mandala gold variant={back ? 1 : 0} /></div>
    {back && <p className="z-10 my-3 text-sm font-bold text-[#765020]" style={{ fontFamily: 'Georgia, serif' }}>Relax • Color • Create</p>}
    <div className="absolute right-0 bottom-0 left-0 h-[10%] bg-[#203047]" />
    <span className="absolute right-[9%] bottom-[2%] h-[35%] w-[6%] rotate-[33deg] rounded-t-full bg-gradient-to-r from-[#a37b32] via-[#f4d58d] to-[#aa7527]" />
  </div>
}

function Collage({ yellow = false, small = false }: { yellow?: boolean; small?: boolean }) {
  return <div className={`relative mx-auto w-full max-w-[590px] ${small ? 'h-[310px]' : 'h-[470px] sm:h-[560px]'}`} aria-label="عرض توضيحي لكتاب ملاذ">
    <div className={`absolute top-[7%] right-[5%] bottom-[12%] left-[3%] -rotate-[4deg] ${yellow ? 'rounded-[50%] bg-cream' : 'rounded-[95px] bg-pink'}`} />
    <div className="absolute top-[15%] left-[8%] h-[65%] w-[43%] -rotate-[11deg] overflow-hidden border border-plum bg-cream shadow-md">{yellow ? <Cover back /> : <Mandala variant={1} />}</div>
    <div className="absolute top-[9%] right-[13%] h-[75%] w-[48%] rotate-[8deg]">{small ? <Mandala variant={2} /> : <Cover />}</div>
    <span className={`absolute bottom-[6%] left-[9%] z-10 -rotate-[5deg] px-6 py-4 text-center text-base font-bold md:text-lg ${yellow ? 'bg-pink' : 'bg-yellow'}`}>{small ? 'اسم طفلك… بيفرّق ♡' : yellow ? 'وقت صغير… ليكي إنتِ' : 'شوية ألوان… كتير من البهجة'}</span>
    {!yellow && !small && <><span aria-hidden="true" className="absolute top-3 right-0 text-5xl">✦</span><span aria-hidden="true" className="absolute bottom-20 -left-1 text-6xl">✧</span></>}
  </div>
}

function Gallery() {
  const [page, setPage] = useState(2)
  return <section id="inside" className="bg-blue py-12 md:py-14">
    <div className={shell}>
      <h2 className={`${heading} text-center`}>كل صفحة… بداية لفكرة جديدة</h2>
      <p className="mt-3 text-center text-base text-muted">نظرة من جوّه عالم الألوان — مساحة لرسوماتك المبهجة</p>
      <div className="mx-auto mt-10 flex max-w-[1100px] items-center justify-center gap-2 sm:gap-8" dir="ltr">
        <button aria-label="الصفحات السابقة" onClick={() => setPage((page+5)%6)} className="flex size-11 shrink-0 items-center justify-center rounded-full text-3xl transition-colors hover:bg-white">←</button>
        <div className="relative grid aspect-[1.8] w-full max-w-[834px] grid-cols-2 gap-3 border-2 border-plum bg-cream p-3 shadow-[7px_7px_0_#fffaf1] sm:gap-7 sm:p-5" aria-live="polite" aria-label={`معاينة الصفحات ${page+1} و${(page+1)%6+1}`}>
          {[page, (page+1)%6].map((p,i) => <div key={`${p}-${i}`} className="overflow-hidden border border-[#b69ca3]">{p === 0 || p === 5 ? <Cover back={p===5} /> : <Mandala variant={p} />}</div>)}
          <div className="absolute inset-y-0 left-1/2 w-px bg-[#d7cbbc]" />
        </div>
        <button aria-label="الصفحات التالية" onClick={() => setPage((page+1)%6)} className="flex size-11 shrink-0 items-center justify-center rounded-full text-3xl transition-colors hover:bg-white">→</button>
      </div>
      <div className="mt-9 flex justify-center gap-2 sm:gap-4" dir="ltr">
        {Array.from({length:6}, (_, i) => <button key={i} aria-label={`عرض المعاينة ${i+1}`} aria-pressed={page===i} onClick={() => setPage(i)} className={`h-[72px] w-11 overflow-hidden border bg-cream transition-transform sm:h-[85px] sm:w-[60px] ${page===i ? '-translate-y-1 border-[3px] border-plum' : 'border-[#a18a91] hover:-translate-y-1'}`}>{i===0 || i===5 ? <Cover back={i===5} /> : <Mandala variant={i} />}</button>)}
      </div>
      <p className="mt-5 text-center text-sm text-muted">معاينات توضيحية مؤقتة — صور صفحات الكتاب الأصلية تُضاف عند توفيرها.</p>
    </div>
  </section>
}

export default function App() {
  const [menu, setMenu] = useState(false)
  return <div dir="rtl" id="home" className="min-h-screen overflow-x-clip bg-cream text-plum">
    <header className={shell}>
      <div className="flex min-h-[104px] items-center justify-between gap-5 border-b border-plum/70">
        <a href="#home" aria-label="ملاذ — الرئيسية" className="shrink-0 leading-none"><span className="block text-[42px] font-extrabold">ملاذ</span><span className="mt-2 block text-sm">هدايا وحكايات</span></a>
        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-5 text-base font-bold lg:flex">{nav.map(([text, href]) => <a className="py-3 transition-colors hover:text-[#a14e71]" key={href} href={href}>{text}</a>)}</nav>
        <Button className="hidden sm:inline-flex">خلّينا نفرّح حد ↗</Button>
        <button onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="mobile-nav" aria-label={menu ? 'إغلاق القائمة' : 'فتح القائمة'} className="size-11 rounded-full border border-plum text-2xl lg:hidden">{menu ? '×' : '☰'}</button>
      </div>
      {menu && <nav id="mobile-nav" aria-label="قائمة الموبايل" className="grid gap-1 border-b border-plum py-4 lg:hidden">{nav.map(([text,href]) => <a key={href} href={href} onClick={() => setMenu(false)} className="min-h-11 rounded-lg px-3 py-3 font-bold hover:bg-pink">{text}</a>)}</nav>}
    </header>
    <main>
      <section className={`${shell} grid items-center gap-6 pt-12 pb-14 md:min-h-[690px] md:grid-cols-2 md:gap-8 md:pt-10 md:pb-16`}>
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
      <section id="collections" className={`${shell} py-14 md:py-16`}>
        <div className="flex flex-wrap items-end justify-between gap-5"><div><h2 className={heading}>حاجات حلوة… لناس غالية</h2><p className="mt-3 text-lg text-muted">لكل حد بتحبيه، هتلاقي هنا حاجة شبهه.</p></div><a className="flex min-h-11 items-center font-bold underline-offset-8 hover:underline" href={facebook} target="_blank" rel="noreferrer">شوفي كل التشكيلات ←</a></div>
        <div className="mt-9 grid gap-7 md:grid-cols-3">
          {[{title:'توزيعات لكل مناسبة',desc:'تفاصيل صغيرة تكمل الفرحة.',img:1,bg:'bg-[#f3e8d4]'}, {title:'هدايا بلمسة شخصية',desc:'اسم، رسالة، وذكرى بتفضل.',img:12,bg:'bg-pink'}, {title:'كتب تلوين وخيال',desc:'وقت هادي، ومساحة لكل الألوان.',img:0,bg:'bg-[#dce8f1]'}].map(item => <a key={item.title} href={item.img ? whatsapp : '#coloring'} className={`group rounded-[20px] p-4 pb-6 transition-transform hover:-translate-y-1 ${item.bg}`}>
            <div className="h-[230px] overflow-hidden rounded-xl border-[1.5px] border-plum">{item.img ? <Photo src={`/images/image-${item.img}.jpg`} alt={item.title} className="h-full w-full object-cover" /> : <div className="h-full scale-[1.7] bg-cream"><Mandala variant={1} /></div>}</div>
            <h3 className="mx-2 mt-4 text-[23px] font-bold">{item.title}</h3><p className="mx-2 mt-2 text-[15px]">{item.desc}</p>
          </a>)}
        </div>
      </section>
      <section id="coloring" className="bg-yellow">
        <div className={`${shell} grid items-center gap-5 py-14 md:min-h-[650px] md:grid-cols-2 md:gap-12`}>
          <div><p className="font-bold">جديد في عالم ملاذ / كتب التلوين</p><h2 className="mt-6 text-[34px] font-extrabold leading-[1.45] lg:text-[45px]">افصلي شوية…<br />ولوّني الدنيا بطريقتك.</h2><h3 className="mt-5 text-[23px] font-bold" dir="ltr" style={{textAlign:'right'}}>Mandala Coloring Book</h3><p className="mt-5 text-lg leading-relaxed">رسومات ماندالا، زهور وحيوانات بتفاصيل تستاهل وقتك.<br />هدية لنفسك أو لحد بيحب يسيب لخياله مساحة.</p><div className="mt-8 flex flex-wrap gap-3">{['رسومات متنوعة','تفاصيل ملهمة','لحظات هادية'].map(t => <span key={t} className="rounded-full bg-cream px-6 py-2 text-sm font-bold">{t}</span>)}</div><div className="mt-9 flex flex-wrap items-center gap-6"><Button>اطلبي كتابك عبر واتساب ↗</Button><a href="#inside" className="flex min-h-11 items-center font-bold">شاهدي الصفحات من الداخل ↓</a></div></div>
          <Collage yellow />
        </div>
      </section>
      <Gallery />
      <section id="school" className={`${shell} grid items-center gap-10 py-14 md:min-h-[440px] md:grid-cols-2 md:gap-16`}>
        <div><p className="font-bold">للأبطال الصغيرين</p><h2 className={`${heading} mt-6`}>فرحة على مقاس خيالهم.</h2><p className="mt-5 max-w-[600px] text-xl leading-relaxed text-muted">توزيعات للمدارس والحضانات، أدوات باسم الطفل،<br className="hidden lg:block" /> وأنشطة تلوين تخلّي كل يوم حكاية ألطف.</p><Button className="mt-8">جهّزي توزيعاتهم مع ملاذ ←</Button></div>
        <div className="relative mx-auto h-[300px] w-full max-w-[520px] rounded-[28px] bg-pink"><Photo src="/images/image-5.jpg" alt="أدوات مدرسية مخصصة باسم وصورة الطفل من ملاذ" className="absolute top-0 left-[12%] h-[250px] w-[39%] -rotate-[8deg] rounded-sm border border-plum object-cover" /><Photo src="/images/image-10.jpg" alt="كراسة تلوين شخصية للأطفال" className="absolute top-6 right-[12%] h-[250px] w-[39%] rotate-[8deg] rounded-sm border border-plum object-cover" /><span className="absolute bottom-5 left-1/2 w-max max-w-[90%] -translate-x-1/2 -rotate-[4deg] rounded-lg bg-yellow px-7 py-4 text-lg font-bold">اسم طفلك… بيفرّق ♡</span></div>
      </section>
      <section id="story" className={`${shell} pt-5 pb-16`}>
        <h2 className={`${heading} text-center md:text-[34px]`}>من فكرة في بالك… لفرحة بين إيديكي</h2>
        <div className="mt-10 grid gap-7 md:grid-cols-3">{[
          ['01','احكي لنا فكرتك','اختاري هديتك أو كتابك، وابعتيلنا على واتساب.'],
          ['02','نظبط التفاصيل سوا','الألوان، الاسم، والرسالة… كل حاجة على ذوقك.'],
          ['03','نجهّزها بحب','ننسّق ونغلّف كل تفصيلة، علشان تليق بالفرحة.'],
        ].map(([n,title,desc], i) => <article key={n} className={`min-h-[205px] rounded-[20px] border border-[#d9c9cd] p-6 ${i===1 ? 'bg-yellow' : ''}`}><span className="text-3xl font-extrabold">{n}</span><h3 className="mt-3 text-[22px] font-bold">{title}</h3><p className="mt-3 leading-7 text-muted">{desc}</p></article>)}</div>
      </section>
      <section id="contact" className="bg-pink px-6 py-12 text-center">
        <h2 className={heading}>عندك مناسبة؟ ولا نفسك تفرّحي حد وخلاص؟</h2><p className="mt-5 text-lg">احكي لنا فكرتك… ونحوّلها سوا لهدية ليها حكاية.</p><Button className="mt-7">ابدئي الحكاية على واتساب ←</Button><p className="mt-8 text-[15px] font-bold leading-8">عيد ميلاد &nbsp;·&nbsp; خطوبة وزفاف &nbsp;·&nbsp; تخرج ونجاح &nbsp;·&nbsp; مولود جديد &nbsp;·&nbsp; شكر وتقدير</p>
      </section>
    </main>
    <footer className="bg-plum text-cream"><div className={`${shell} pt-8 pb-6`}><div className="grid gap-8 pb-8 md:grid-cols-[1fr_1.5fr_1fr]"><div><a href="#home" className="text-[38px] font-extrabold">ملاذ</a><p className="mt-2">هدايا وحكايات، معمولة بحب.</p></div><nav aria-label="روابط أسفل الصفحة" className="flex flex-wrap items-start gap-x-5 gap-y-2 pt-4 text-[15px] font-bold">{nav.slice(1).map(([t,h]) => <a key={h} href={h} className="py-3 hover:underline">{t}</a>)}</nav><div className="md:text-left"><h3 className="pt-3 text-lg font-bold">خلّينا على تواصل</h3><div className="mt-3 flex gap-3 text-sm md:justify-end"><a href={whatsapp} target="_blank" rel="noreferrer" className="py-3 hover:underline">واتساب</a><span className="py-3">/</span><a href={facebook} target="_blank" rel="noreferrer" className="py-3 hover:underline">جروب فيسبوك</a></div></div></div><div className="flex flex-wrap justify-between gap-4 border-t border-[#8e647d] pt-6 text-sm"><p>© {new Date().getFullYear()} ملاذ للهدايا — جميع الحقوق محفوظة.</p><p>فرحة صغيرة… أثر كبير ♡</p></div></div></footer>
  </div>
}
