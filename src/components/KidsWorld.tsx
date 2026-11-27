import { useEffect, useRef, useState } from 'react'

type GameId = 'memory' | 'balloons' | 'puzzle' | 'coloring' | 'sorting' | 'differences' | 'xo' | 'photoPuzzle' | 'ordering'
type GameProps = { onComplete: () => void; onBack: () => void }

const icons = ['🐰', '🦊', '🐼', '🦁', '🐸', '🐯', '🐨', '🐙']
const colors = ['#f7c8d6', '#f9df73', '#b9dff2', '#c9e8c6', '#e7c8ef', '#ffd2ad']
const puzzleSets = [
  { name: 'أصدقاء الغابة', pieces: ['🐶', '🐱', '🦊', '🐼'] },
  { name: 'شخصيات مرحة', pieces: ['🧸', '🧒', '🤖', '👸'] },
  { name: 'مغامرة الحيوانات', pieces: ['🦁', '🐯', '🐸', '🐵'] },
]

function tone(frequency = 520, duration = 0.08) {
  if (typeof window === 'undefined') return
  try {
    const AudioContext = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.frequency.value = frequency
    oscillator.type = 'sine'
    gain.gain.setValueAtTime(0.04, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + duration)
  } catch { /* Audio is optional. */ }
}

function GameFrame({ title, emoji, onBack, onRestart, children }: { title: string; emoji: string; onBack: () => void; onRestart?: () => void; children: React.ReactNode }) {
  return <div className="kids-game-frame" dir="rtl">
    <div className="kids-game-frame-head"><button className="kids-small-button" onClick={onBack}>← كل الألعاب</button><h3>{emoji} {title}</h3>{onRestart ? <button className="kids-small-button" onClick={onRestart}>إعادة اللعب</button> : <span />}</div>
    {children}
  </div>
}

function MemoryGame({ onComplete, onBack }: GameProps) {
  const [level, setLevel] = useState<4 | 6 | 8>(4)
  const [cards, setCards] = useState(() => makeMemoryCards(4))
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [busy, setBusy] = useState(false)
  const won = matched.length === cards.length
  const reset = () => { setCards(makeMemoryCards(level)); setFlipped([]); setMatched([]); setBusy(false) }
  useEffect(() => { setCards(makeMemoryCards(level)); setFlipped([]); setMatched([]); setBusy(false) }, [level])
  useEffect(() => { if (won) onComplete() }, [won, onComplete])
  const choose = (index: number) => {
    if (busy || flipped.includes(index) || matched.includes(index)) return
    const next = [...flipped, index]
    setFlipped(next)
    tone(450 + next.length * 80)
    if (next.length === 2) {
      setBusy(true)
      if (cards[next[0]] === cards[next[1]]) { setMatched(value => [...value, ...next]); setFlipped([]); setBusy(false); tone(760, .14) }
      else setTimeout(() => { setFlipped([]); setBusy(false) }, 700)
    }
  }
  return <GameFrame title="مملكة الذاكرة" emoji="🧠" onBack={onBack} onRestart={reset}>
    <div className="kids-levels"><span>اختاري المستوى:</span>{([4, 6, 8] as const).map(value => <button key={value} className={level === value ? 'is-selected' : ''} onClick={() => setLevel(value)}>{value} أزواج</button>)}</div>
    <p className="kids-hint">اقلبي كرتين وابحثي عن الحيوانين المتشابهين ♡</p>
    <div className={`memory-grid memory-grid-${level}`}>{cards.map((card, index) => { const open = flipped.includes(index) || matched.includes(index); return <button key={`${card}-${index}`} className={`memory-card ${open ? 'is-open' : ''} ${matched.includes(index) ? 'is-matched' : ''}`} onClick={() => choose(index)} aria-label={open ? `بطاقة ${card}` : 'بطاقة مخفية'}><span>{open ? card : '؟'}</span></button> })}</div>
    {won && <SuccessMessage text="برافو! ذاكرتك قوية جدًا ⭐" />}
  </GameFrame>
}

function makeMemoryCards(pairs: number) { return [...icons.slice(0, pairs), ...icons.slice(0, pairs)].sort(() => Math.random() - .5) }

function TicTacToeGame({ onComplete, onBack }: GameProps) {
  const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null))
  const [turn, setTurn] = useState<'X' | 'O'>('X')
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
  const winner = lines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c])
  const finished = Boolean(winner) || board.every(Boolean)
  useEffect(() => { if (winner) onComplete() }, [winner, onComplete])
  const play = (index: number) => { if (board[index] || finished) return; const next = [...board]; next[index] = turn; setBoard(next); setTurn(turn === 'X' ? 'O' : 'X'); tone(turn === 'X' ? 540 : 700) }
  const reset = () => { setBoard(Array(9).fill(null)); setTurn('X') }
  return <GameFrame title="إكس أو" emoji="⭕" onBack={onBack} onRestart={reset}><p className="kids-hint">العبي مع صديقتك أو أخوكي، والفائز يكسب نجمة! اختاري X أو O بالتناوب.</p><div className="xo-status">{winner ? `الفائز: ${board[winner[0]]} 🎉` : finished ? 'تعادل لطيف!' : `دور اللاعب ${turn}`}</div><div className="xo-board">{board.map((cell, index) => <button key={index} className={`xo-cell ${cell ? `is-${cell.toLowerCase()}` : ''}`} onClick={() => play(index)} aria-label={`خانة إكس أو ${index + 1}`}>{cell}</button>)}</div>{winner && <SuccessMessage text="يا سلام! كسبتي الجولة ⭐" />}</GameFrame>
}

function OrderingGame({ onComplete, onBack }: GameProps) {
  const modes = { numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'], arabic: ['أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع'], english: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'] }
  const stageSizes = [9, 12, 15, 18]
  const [mode, setMode] = useState<keyof typeof modes>('numbers')
  const [stage, setStage] = useState(1)
  const [tiles, setTiles] = useState(() => shuffle(modes.numbers.slice(0, stageSizes[0])))
  const [next, setNext] = useState(0)
  const values = modes[mode].slice(0, stageSizes[stage - 1])
  const done = next === values.length
  useEffect(() => { if (done) onComplete() }, [done, onComplete])
  const reset = (newMode = mode, newStage = stage) => { const list = modes[newMode].slice(0, stageSizes[newStage - 1]); setTiles(shuffle(list)); setNext(0) }
  const chooseMode = (value: keyof typeof modes) => { setMode(value); setStage(1); reset(value, 1) }
  const chooseStage = (value: number) => { setStage(value); reset(mode, value) }
  const choose = (value: string) => { if (value !== values[next]) { tone(220, .07); return } setNext(current => current + 1); setTiles(current => current.filter(tile => tile !== value)); tone(620 + next * 30, .08) }
  return <GameFrame title="رتّبيها صح" emoji="🔢" onBack={onBack} onRestart={() => reset()}><p className="kids-hint">اضغطي العناصر بالترتيب الصحيح من البداية للنهاية.</p><div className="order-options"><div><span>النوع:</span>{[['numbers', 'أرقام'], ['arabic', 'حروف عربي'], ['english', 'English']].map(([value, label]) => <button key={value} className={mode === value ? 'is-selected' : ''} onClick={() => chooseMode(value as keyof typeof modes)}>{label}</button>)}</div><div><span>المرحلة:</span>{stageSizes.map((size, index) => <button key={size} className={stage === index + 1 ? 'is-selected' : ''} onClick={() => chooseStage(index + 1)}>مرحلة {size}</button>)}</div></div><div className="ordering-board" style={{ gridTemplateRows: `repeat(${Math.ceil(tiles.length / 3)}, 1fr)` }}>{tiles.map(value => <button key={value} className="ordering-tile" onClick={() => choose(value)}>{value}</button>)}{Array.from({ length: Math.max(0, 9 - tiles.length) }, (_, index) => <span key={`empty-${index}`} className="ordering-empty" />)}</div><p className="order-next">{done ? 'أحسنتِ! المرحلة اكتملت ⭐' : `ابحثي عن: ${values[next]}`}</p>{done && <SuccessMessage text="ترتيب رائع! نجمة جديدة ⭐" />}</GameFrame>
}

function BalloonGame({ onComplete, onBack }: GameProps) {
  const [active, setActive] = useState(false)
  const [time, setTime] = useState(30)
  const [score, setScore] = useState(0)
  const [balloons, setBalloons] = useState<{ id: number; left: number; color: string; duration: number }[]>([])
  const finished = !active && time === 0
  useEffect(() => { if (!active) return; const spawn = window.setInterval(() => setBalloons(value => [...value.slice(-8), { id: Date.now(), left: 6 + Math.random() * 86, color: colors[Math.floor(Math.random() * colors.length)], duration: Math.max(2.4, 5 - score / 18) }]), 620); const clock = window.setInterval(() => setTime(value => Math.max(0, value - 1)), 1000); return () => { clearInterval(spawn); clearInterval(clock) } }, [active, score])
  useEffect(() => { if (time === 0 && active) { setActive(false); onComplete() } }, [time, active, onComplete])
  const start = () => { setTime(30); setScore(0); setBalloons([]); setActive(true) }
  return <GameFrame title="فرقّعي البالونات" emoji="🎈" onBack={onBack} onRestart={start}>
    <div className="balloon-score"><b>النقاط: {score}</b><span>الوقت: {time} ثانية</span></div>
    {!active && <div className="game-start"><p>{finished ? `نتيجتك ${score} بالونة!` : 'جاهزة للمرح؟'}</p><button className="kids-primary-button" onClick={start}>{finished ? 'جولة جديدة' : 'ابدئي اللعب'}</button></div>}
    <div className={`balloon-arena ${active ? 'is-active' : ''}`} aria-label="منطقة البالونات">{balloons.map(balloon => <button key={balloon.id} className="balloon" style={{ left: `${balloon.left}%`, background: balloon.color, animationDuration: `${balloon.duration}s` }} onClick={() => { setBalloons(value => value.filter(item => item.id !== balloon.id)); setScore(value => value + 1); tone(760, .06) }} aria-label="فرقّعي البالونة">🎈</button>)}</div>
    {finished && <SuccessMessage text="وقت جميل! كل بالونة بنجمة ⭐" />}
  </GameFrame>
}

function PuzzleGame({ onComplete, onBack }: GameProps) {
  const [picture, setPicture] = useState(0)
  const [pieces, setPieces] = useState(() => shuffle(puzzleSets[0].pieces))
  const [placed, setPlaced] = useState<(string | null)[]>([null, null, null, null])
  const [selected, setSelected] = useState<string | null>(null)
  const done = placed.every(Boolean)
  const target = puzzleSets[picture].pieces
  useEffect(() => { if (done) onComplete() }, [done, onComplete])
  const place = (piece: string, slot: number) => { if (placed[slot]) return; if (piece === target[slot]) { setPlaced(value => value.map((item, index) => index === slot ? piece : item)); setPieces(value => value.filter(item => item !== piece)); setSelected(null); tone(700, .12) } else tone(220, .08) }
  const reset = () => { setPieces(shuffle(target)); setPlaced([null, null, null, null]); setSelected(null) }
  const choosePicture = (index: number) => { setPicture(index); setPieces(shuffle(puzzleSets[index].pieces)); setPlaced([null, null, null, null]); setSelected(null) }
  return <GameFrame title="ركّبي الصورة" emoji="🧩" onBack={onBack} onRestart={reset}>
    <div className="puzzle-choices">{puzzleSets.map((set, index) => <button className={picture === index ? 'is-selected' : ''} key={set.name} onClick={() => choosePicture(index)}>{set.pieces.join('')}<small>{set.name}</small></button>)}</div><p className="kids-hint">اسحبي أجزاء الشخصية لمكانها، أو اختاري القطعة ثم اضغطي على المكان الصحيح.</p>
    <div className="puzzle-board"><div className="puzzle-pieces">{pieces.map(piece => <button key={piece} draggable onDragStart={event => event.dataTransfer.setData('text/plain', piece)} className={`puzzle-piece ${selected === piece ? 'is-selected' : ''}`} onClick={() => setSelected(piece)}>{piece}</button>)}</div><div className="puzzle-slots">{placed.map((piece, index) => <button key={index} className={`puzzle-slot ${piece ? 'is-correct' : ''}`} onDragOver={event => event.preventDefault()} onDrop={event => place(event.dataTransfer.getData('text/plain'), index)} onClick={() => selected && place(selected, index)}>{piece ? piece : <span className="puzzle-slot-guide" aria-hidden="true">{target[index]}</span>}</button>)}</div></div>
    {done && <SuccessMessage text="الصورة اكتملت! ممتازة ⭐" />}
  </GameFrame>
}

function PhotoPuzzleGame({ onComplete, onBack }: GameProps) {
  const levels = [9, 12, 15, 18]
  const [image, setImage] = useState<string | null>(null)
  const [level, setLevel] = useState(9)
  const [pieces, setPieces] = useState<number[]>([])
  const [placed, setPlaced] = useState<(number | null)[]>(Array(9).fill(null))
  const [selected, setSelected] = useState<number | null>(null)
  const done = Boolean(image) && placed.every((piece, index) => piece === index)
  useEffect(() => { if (done) onComplete() }, [done, onComplete])
  const start = (source: string, count = level) => { setImage(source); setPieces(shuffle(Array.from({ length: count }, (_, index) => index))); setPlaced(Array(count).fill(null)); setSelected(null) }
  const upload = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => start(String(reader.result)); reader.readAsDataURL(file) }
  const place = (piece: number, slot: number) => { if (!image || placed[slot] !== null) return; if (piece === slot) { setPlaced(value => value.map((item, index) => index === slot ? piece : item)); setPieces(value => value.filter(item => item !== piece)); setSelected(null); tone(700, .12) } else tone(220, .08) }
  const chooseLevel = (count: number) => { setLevel(count); if (image) start(image, count) }
  const reset = () => image && start(image, level)
  const rows = level / 3
  const pieceStyle = (piece: number): React.CSSProperties => ({ backgroundImage: `url(${image})`, backgroundPosition: `${(piece % 3) * 50}% ${Math.floor(piece / 3) * (100 / (rows - 1))}%`, backgroundSize: `300% ${rows * 100}%` })
  return <GameFrame title="Puzzle من صورتك" emoji="🖼️" onBack={onBack} onRestart={reset}>
    {!image ? <label className="photo-puzzle-upload"><span>🧩</span><strong>ارفعي صورة وحوّليها إلى Puzzle</strong><small>اختاري صورة حيوان، شخصية أو صورة عائلية من جهازك</small><input type="file" accept="image/*" onChange={upload} /></label> : <><div className="photo-puzzle-levels"><span>اختاري المستوى:</span>{levels.map(count => <button key={count} className={level === count ? 'is-selected' : ''} onClick={() => chooseLevel(count)}>{count} قطعة</button>)}</div><p className="kids-hint">رتّبي أجزاء صورتك ({level} قطعة) في أماكنها الصحيحة.</p><div className="photo-puzzle-layout"><div className="photo-puzzle-pieces">{pieces.map(piece => <button key={piece} draggable onDragStart={event => event.dataTransfer.setData('text/plain', String(piece))} onClick={() => setSelected(piece)} className={selected === piece ? 'is-selected' : ''} style={pieceStyle(piece)} aria-label={`قطعة Puzzle ${piece + 1}`} />)}</div><div className="photo-puzzle-board" style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}>{placed.map((piece, slot) => <button key={slot} className={`photo-puzzle-slot ${piece !== null ? 'is-filled' : ''}`} onDragOver={event => event.preventDefault()} onDrop={event => place(Number(event.dataTransfer.getData('text/plain')), slot)} onClick={() => selected !== null && place(selected, slot)}>{piece !== null && <span style={pieceStyle(piece)} />}</button>)}</div></div>{done && <SuccessMessage text="صورتك اكتملت! Puzzle ممتاز ⭐" />}</>}
  </GameFrame>
}

function ColoringGame({ onComplete, onBack }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [color, setColor] = useState('#52273f')
  const [drawing, setDrawing] = useState(false)
  const [saved, setSaved] = useState(false)
  const drawBase = () => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.fillStyle = '#fdf5ea'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.strokeStyle = '#52273f'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(260, 205, 125, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(205, 190, 12, 0, Math.PI * 2); ctx.arc(315, 190, 12, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(260, 235, 42, 0, Math.PI); ctx.stroke(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ctx.beginPath(); ctx.moveTo(260 + Math.cos(a) * 135, 205 + Math.sin(a) * 135); ctx.lineTo(260 + Math.cos(a) * 185, 205 + Math.sin(a) * 185); ctx.stroke() } }
  useEffect(() => { drawBase() }, [])
  const point = (event: React.PointerEvent<HTMLCanvasElement>) => { const canvas = canvasRef.current; if (!canvas) return; const rect = canvas.getBoundingClientRect(); return [(event.clientX - rect.left) * canvas.width / rect.width, (event.clientY - rect.top) * canvas.height / rect.height] as const }
  const paint = (event: React.PointerEvent<HTMLCanvasElement>) => { if (!drawing) return; const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); const coordinates = point(event); if (!ctx || !coordinates) return; ctx.strokeStyle = color; ctx.lineWidth = color === '#fdf5ea' ? 24 : 18; ctx.lineTo(coordinates[0], coordinates[1]); ctx.stroke() }
  const clear = () => { const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (canvas && ctx) { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#fdf5ea'; ctx.fillRect(0, 0, canvas.width, canvas.height) } }
  const save = () => { const canvas = canvasRef.current; if (!canvas) return; const link = document.createElement('a'); link.download = 'malaz-coloring.png'; link.href = canvas.toDataURL('image/png'); link.click(); setSaved(true); onComplete() }
  return <GameFrame title="عالم التلوين" emoji="🎨" onBack={onBack} onRestart={drawBase}><div className="coloring-layout"><div className="coloring-tools"><p>اختاري لونًا ثم لوّني بالرسم بإصبعك أو بالماوس ♡</p><div className="color-palette">{['#f7c8d6', '#f9df73', '#78b9dc', '#7cae78', '#aa792e', '#52273f', '#fdf5ea'].map(value => <button key={value} aria-label={`لون ${value}`} className={color === value ? 'is-selected' : ''} style={{ background: value }} onClick={() => setColor(value)} />)}</div><div className="coloring-actions"><button onClick={() => setColor('#fdf5ea')}>ممحاة</button><button onClick={clear}>مسح</button><button onClick={drawBase}>إعادة الرسم</button><button className="kids-primary-button" onClick={save}>حفظ الصورة ↓</button></div></div><canvas ref={canvasRef} width="520" height="390" className="coloring-canvas" onPointerDown={event => { const ctx = canvasRef.current?.getContext('2d'); const coordinates = point(event); if (ctx && coordinates) { ctx.beginPath(); ctx.moveTo(coordinates[0], coordinates[1]); setDrawing(true); event.currentTarget.setPointerCapture(event.pointerId) } }} onPointerMove={paint} onPointerUp={() => setDrawing(false)} onPointerCancel={() => setDrawing(false)} /></div>{saved && <SuccessMessage text="رسـمتك اتحفظت! فرحتينا ⭐" />}</GameFrame>
}

function SortingGame({ onComplete, onBack }: GameProps) {
  const initial = [{ id: 'apple', emoji: '🍎', target: 'fruit' }, { id: 'banana', emoji: '🍌', target: 'fruit' }, { id: 'cat', emoji: '🐱', target: 'animal' }, { id: 'lion', emoji: '🦁', target: 'animal' }]
  const [items, setItems] = useState(initial)
  const [selected, setSelected] = useState<typeof initial[number] | null>(null)
  const done = items.length === 0
  useEffect(() => { if (done) onComplete() }, [done, onComplete])
  const place = (target: string, item = selected) => { if (!item) return; if (item.target === target) { setItems(value => value.filter(entry => entry.id !== item.id)); setSelected(null); tone(760, .12) } else tone(220, .08) }
  return <GameFrame title="حطيها في مكانها" emoji="🍎" onBack={onBack} onRestart={() => { setItems(initial); setSelected(null) }}><p className="kids-hint">اسحبي كل شيء للصندوق المناسب، أو اضغطي عليه ثم اختاري الصندوق.</p><div className="sorting-items">{items.map(item => <button key={item.id} draggable onDragStart={event => event.dataTransfer.setData('text/plain', item.id)} onClick={() => setSelected(item)} className={selected?.id === item.id ? 'is-selected' : ''}>{item.emoji}</button>)}</div><div className="sorting-bins">{[['fruit', '🍎 سلة الفاكهة'], ['animal', '🌳 بيت الحيوانات']].map(([target, label]) => <button key={target} className="sorting-bin" onDragOver={event => event.preventDefault()} onDrop={event => place(target, items.find(item => item.id === event.dataTransfer.getData('text/plain')))} onClick={() => place(target)}>{label}</button>)}</div>{done && <SuccessMessage text="كل حاجة في مكانها! شاطرة ⭐" />}</GameFrame>
}

function DifferencesGame({ onComplete, onBack }: GameProps) {
  const [found, setFound] = useState<number[]>([])
  const differences = [{ top: 25, left: 24, label: 'النجمة' }, { top: 58, left: 68, label: 'الزهرة' }, { top: 34, left: 48, label: 'السحابة' }, { top: 72, left: 30, label: 'البالونة' }]
  useEffect(() => { if (found.length === differences.length) onComplete() }, [found, onComplete])
  const tap = (index: number) => { if (!found.includes(index)) { setFound(value => [...value, index]); tone(700, .12) } }
  return <GameFrame title="اكتشفي الاختلافات" emoji="🔍" onBack={onBack} onRestart={() => setFound([])}><p className="kids-hint">اضغطي على الأماكن المختلفة في الصورة اليمنى. باقي {differences.length - found.length} اختلافات!</p><div className="difference-pictures"><DifferenceScene side="الأصل" /><DifferenceScene side="ابحثي هنا" differences={differences} found={found} onTap={tap} /></div>{found.length === differences.length && <SuccessMessage text="وجدتيهم كلهم! عينك قوية ⭐" />}</GameFrame>
}

function DifferenceScene({ side, differences = [], found = [], onTap }: { side: string; differences?: { top: number; left: number; label: string }[]; found?: number[]; onTap?: (index: number) => void }) { const search = side === 'ابحثي هنا'; return <div className="difference-scene"><span className="scene-title">{side}</span><div className="scene-sky"><span className="scene-sun">{search ? '🌙' : '☀️'}</span><span className="scene-cloud">{search ? '🌤️' : '☁️'}</span><span className="scene-house">{search ? '🏡' : '🏠'}</span><span className="scene-tree">{search ? '🌲' : '🌳'}</span><span className="scene-child">{search ? '👧' : '🧒'}</span>{differences.map((difference, index) => <button key={difference.label} className={`difference-spot ${found.includes(index) ? 'is-found' : ''}`} style={{ top: `${difference.top}%`, left: `${difference.left}%` }} onClick={() => onTap?.(index)} aria-label={difference.label}>{found.includes(index) ? '✓' : ''}</button>)}</div></div> }

function SuccessMessage({ text }: { text: string }) { return <div className="kids-success" role="status">🎉 {text} 🎉</div> }
function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - .5) }

const gameCards: { id: GameId; emoji: string; title: string; description: string; color: string }[] = [
  { id: 'memory', emoji: '🧠', title: 'مملكة الذاكرة', description: 'اقلبي الكروت واكتشفي الأزواج.', color: '#f7c8d6' },
  { id: 'xo', emoji: '⭕', title: 'إكس أو', description: 'جولة لطيفة مع صديق أو أحد أفراد العائلة.', color: '#e7c8ef' },
  { id: 'balloons', emoji: '🎈', title: 'فرقّعي البالونات', description: 'اجري وراء البالونات قبل أن تطير!', color: '#b9dff2' },
  { id: 'puzzle', emoji: '🧩', title: 'ركّبي الصورة', description: 'كل قطعة لها مكان مناسب.', color: '#f9df73' },
  { id: 'coloring', emoji: '🎨', title: 'عالم التلوين', description: 'لوّني واحفظي رسمتك الجميلة.', color: '#c9e8c6' },
  { id: 'sorting', emoji: '🍎', title: 'حطيها في مكانها', description: 'ساعدي كل شيء يرجع لبيته.', color: '#ffd2ad' },
  { id: 'differences', emoji: '🔍', title: 'اكتشفي الاختلافات', description: 'ركّزي جيدًا وابحثي عن الأربعة.', color: '#e7c8ef' },
  { id: 'photoPuzzle', emoji: '🖼️', title: 'Puzzle من صورتك', description: 'ارفعي صورة وحوّليها إلى لعبة تركيب.', color: '#f9df73' },
  { id: 'ordering', emoji: '🔢', title: 'رتّبيها صح', description: 'أرقام وحروف عربية وإنجليزية في مراحل ممتعة.', color: '#c9e8c6' },
]

export default function KidsWorld() {
  const [active, setActive] = useState<GameId | null>(null)
  const [stars, setStars] = useState(0)
  const [completed, setCompleted] = useState<string[]>([])
  const [celebration, setCelebration] = useState(false)
  useEffect(() => { setStars(Number(localStorage.getItem('malaz-kids-stars') || 0)); setCompleted(JSON.parse(localStorage.getItem('malaz-kids-completed') || '[]')) }, [])
  const award = (game: GameId) => { if (completed.includes(game)) return; const next = [...completed, game]; setCompleted(next); setStars(value => { const total = value + 1; localStorage.setItem('malaz-kids-stars', String(total)); return total }); localStorage.setItem('malaz-kids-completed', JSON.stringify(next)); setCelebration(true); window.setTimeout(() => setCelebration(false), 2600) }
  const close = () => setActive(null)
  const game = active && gameCards.find(item => item.id === active)
  return <section id="games" className="kids-world-section reveal-section" dir="rtl">
    <div className="kids-world-pattern" aria-hidden="true" />
    <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-20">
      <div className="kids-world-heading"><span className="kids-world-mascot" aria-hidden="true">🧸</span><div><p className="font-bold">Malaz Kids World</p><h2>يلا نلعب في عالم ملاذ! 🎉</h2><p>اختاري لعبة صغيرة، اجمعي النجوم، وخلي الخيال ياخدك في جولة حلوة.</p></div><div className="kids-reward" aria-label={`جمعت ${stars} نجوم`}>⭐ <strong>{stars}</strong><small>نجومك</small></div></div>
      {!active ? <div className="kids-games-grid">{gameCards.map(gameItem => <article key={gameItem.id} className="kids-game-card" role="button" tabIndex={0} aria-label={`فتح لعبة ${gameItem.title}`} onClick={() => setActive(gameItem.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActive(gameItem.id) } }} style={{ '--game-color': gameItem.color } as React.CSSProperties}><div className="kids-game-art" aria-hidden="true">{gameItem.emoji}</div><h3>{gameItem.title}</h3><p>{gameItem.description}</p></article>)}</div> : <div className="kids-active-area">{game?.id === 'memory' && <MemoryGame onComplete={() => award('memory')} onBack={close} />}{game?.id === 'xo' && <TicTacToeGame onComplete={() => award('xo')} onBack={close} />}{game?.id === 'balloons' && <BalloonGame onComplete={() => award('balloons')} onBack={close} />}{game?.id === 'puzzle' && <PuzzleGame onComplete={() => award('puzzle')} onBack={close} />}{game?.id === 'photoPuzzle' && <PhotoPuzzleGame onComplete={() => award('photoPuzzle')} onBack={close} />}{game?.id === 'ordering' && <OrderingGame onComplete={() => award('ordering')} onBack={close} />}{game?.id === 'coloring' && <ColoringGame onComplete={() => award('coloring')} onBack={close} />}{game?.id === 'sorting' && <SortingGame onComplete={() => award('sorting')} onBack={close} />}{game?.id === 'differences' && <DifferencesGame onComplete={() => award('differences')} onBack={close} />}<button className="kids-close-game" onClick={close}>العودة إلى كل الألعاب</button></div>}
    </div>
    {celebration && <div className="kids-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--i': index } as React.CSSProperties}>✦</i>)}</div>}
  </section>
}
