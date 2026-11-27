'use client'

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { comicStories, type ComicStory } from '../data/comicStories'

type Step = 'stories' | 'upload' | 'design' | 'preview'
type Crop = { zoom: number; x: number; y: number; rotation: number }
type FaceSettings = { x: number; y: number; width: number; rotation: number; visible: boolean; imageIndex: number }
type ChildImage = { url: string; name: string }

const defaultCrop: Crop = { zoom: 1, x: 50, y: 50, rotation: 0 }
const defaultFace: FaceSettings = { x: 43, y: 38, width: 14, rotation: 0, visible: true, imageIndex: 0 }

function faceStyle(crop: Crop, size = 34): React.CSSProperties {
  return { width: '100%', height: '100%', left: 0, top: 0, objectFit: 'fill' }
}

function StoryImage({ src, alt, className = '', onError }: { src: string; alt: string; className?: string; onError?: () => void }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <div className={`comic-image-error ${className}`} role="img" aria-label={`${alt} غير متوفرة`}>صورة القصة غير متوفرة<br /><small>أضيفي ملفات الصفحات داخل مجلد القصة</small></div>
  return <img src={src} alt={alt} className={className} onError={() => { setFailed(true); onError?.() }} />
}

function Stepper({ step }: { step: Step }) {
  const steps: [Step, string][] = [['stories', 'اختيار القصة'], ['upload', 'رفع الصورة'], ['design', 'تصميم الصفحات'], ['preview', 'المعاينة النهائية']]
  const active = steps.findIndex(([value]) => value === step)
  return <div className="comic-stepper" aria-label="مراحل إنشاء الكوميكس">{steps.map(([value, label], index) => <div key={value} className={`comic-step ${index <= active ? 'is-active' : ''}`}><span>{index + 1}</span><small>{label}</small></div>)}</div>
}

export default function ComicCreator() {
  const [step, setStep] = useState<Step>('stories')
  const [story, setStory] = useState<ComicStory | null>(null)
  const [images, setImages] = useState<ChildImage[]>([])
  const [crop, setCrop] = useState<Crop>(defaultCrop)
  const [cropSize, setCropSize] = useState(34)
  const [activeCropImageIndex, setActiveCropImageIndex] = useState(0)
  const [imageCrops, setImageCrops] = useState<Record<string, Crop>>({})
  const [imageRatio, setImageRatio] = useState(1)
  const [croppedImages, setCroppedImages] = useState<Record<string, string>>({})
  const [page, setPage] = useState(0)
  const [previewSpread, setPreviewSpread] = useState(0)
  const [previewPage, setPreviewPage] = useState(0)
  const [faces, setFaces] = useState<FaceSettings[]>([])
  const [additionalFaces, setAdditionalFaces] = useState<Record<number, FaceSettings[]>>({})
  const [activeFaceIndex, setActiveFaceIndex] = useState(0)
  const [draggingFaceIndex, setDraggingFaceIndex] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [appendImages, setAppendImages] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => () => { images.forEach(item => URL.revokeObjectURL(item.url)) }, [])
  useEffect(() => { setActiveFaceIndex(0) }, [page])
  useEffect(() => {
    let cancelled = false
    const createCrop = (item: ChildImage) => new Promise<[string, string]>((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        const sourceSize = Math.min(image.naturalWidth, image.naturalHeight) * cropSize / 100
        const itemCrop = imageCrops[item.url] || crop
        const sourceX = (image.naturalWidth - sourceSize) * itemCrop.x / 100
        const sourceY = (image.naturalHeight - sourceSize) * itemCrop.y / 100
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        const context = canvas.getContext('2d')
        if (!context) return reject(new Error('Canvas is not available'))
        context.save()
        context.translate(canvas.width / 2, canvas.height / 2)
        context.rotate(itemCrop.rotation * Math.PI / 180)
        context.beginPath()
        context.ellipse(0, 0, canvas.width * 0.41, canvas.height * 0.5, 0, 0, Math.PI * 2)
        context.clip()
        context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
        context.restore()
        resolve([item.url, canvas.toDataURL('image/png')])
      }
      image.onerror = () => reject(new Error('Image could not be cropped'))
      image.src = item.url
    })
    Promise.all(images.map(createCrop)).then(entries => { if (!cancelled) setCroppedImages(Object.fromEntries(entries)) }).catch(() => { if (!cancelled) setCroppedImages({}) })
    return () => { cancelled = true }
  }, [images, crop.x, crop.y, crop.rotation, cropSize, imageCrops])

  const pages = useMemo(() => story ? Array.from({ length: story.pagesCount }, (_, index) => `${story.folder}/page-${index + 1}.png`) : [], [story])
  const currentFace = faces[page] || defaultFace
  const placedFaces = [currentFace, ...(additionalFaces[page] || [])]
  const activeFace = placedFaces[activeFaceIndex] || currentFace
  const faceImage = (index: number) => { const image = images[index] || images[0]; return image ? croppedImages[image.url] || image.url : '' }
  const imageBox = imageRatio >= 1
    ? { left: 0, top: (100 - 100 / imageRatio) / 2, width: 100, height: 100 / imageRatio }
    : { left: (100 - imageRatio * 100) / 2, top: 0, width: imageRatio * 100, height: 100 }
  const selectorSize = Math.min(imageBox.width, imageBox.height) * cropSize / 100

  const selectStory = (selected: ComicStory) => {
    setStory(selected); setFaces(Array.from({ length: selected.pagesCount }, () => ({ ...defaultFace }))); setAdditionalFaces({}); setActiveFaceIndex(0); setPage(0); setError(''); setStep('upload')
  }
  const openImagePicker = (append: boolean) => { setAppendImages(append); fileInput.current?.click() }
  const selectCropImage = (index: number) => {
    setActiveCropImageIndex(index)
    setCrop(imageCrops[images[index]?.url] || defaultCrop)
    const image = new Image()
    image.onload = () => setImageRatio(image.naturalWidth / Math.max(1, image.naturalHeight))
    image.src = images[index]?.url || ''
  }
  const updateCrop = (patch: Partial<Crop>) => {
    setCrop(value => {
      const next = { ...value, ...patch }
      const activeImage = images[activeCropImageIndex]
      if (activeImage) setImageCrops(crops => ({ ...crops, [activeImage.url]: next }))
      return next
    })
  }
  const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const invalid = files.find(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024)
    if (invalid) { setError('اختاري صور JPG أو PNG أو WebP، وكل صورة أقل من 8 ميجابايت.'); return }
    const nextImages = files.map(file => ({ url: URL.createObjectURL(file), name: file.name }))
    if (appendImages) setImages(value => [...value, ...nextImages])
    else { images.forEach(item => URL.revokeObjectURL(item.url)); setImages(nextImages) }
    setActiveCropImageIndex(appendImages ? images.length : 0)
    event.target.value = ''
    const firstImage = new Image()
    firstImage.onload = () => setImageRatio(firstImage.naturalWidth / Math.max(1, firstImage.naturalHeight))
    firstImage.src = nextImages[0]?.url || ''
    setAppendImages(false); setCrop(defaultCrop); setCroppedImages({}); setImageRatio(1); setError(''); setStep('upload')
  }
  const acceptImage = () => { if (!images.length) { setError('ارفعي صورة واضحة للوجه أولًا.'); return }; setStep('design') }
  const openPreview = () => { setPreviewSpread(Math.floor(page / 2)); setPreviewPage(page); setStep('preview') }
  const updateFace = (patch: Partial<FaceSettings>) => {
    if (activeFaceIndex === 0) setFaces(value => value.map((face, index) => index === page ? { ...face, ...patch } : face))
    else setAdditionalFaces(value => ({ ...value, [page]: (value[page] || []).map((face, index) => index === activeFaceIndex - 1 ? { ...face, ...patch } : face) }))
  }
  const addFace = () => {
    const offset = placedFaces.length
    setAdditionalFaces(value => ({ ...value, [page]: [...(value[page] || []), { ...defaultFace, x: Math.min(78, defaultFace.x + offset * 8), y: Math.min(78, defaultFace.y + offset * 7) }] }))
    setActiveFaceIndex(offset)
  }
  const resetFace = () => updateFace(defaultFace)
  const onCropPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.parentElement?.getBoundingClientRect(); if (!rect) return
    const startX = event.clientX; const startY = event.clientY; const initial = { x: crop.x, y: crop.y }
    const availableX = Math.max(1, imageBox.width - selectorSize)
    const availableY = Math.max(1, imageBox.height - selectorSize)
    const move = (moveEvent: PointerEvent) => setCrop(value => {
      const next = { ...value, x: Math.max(0, Math.min(100, initial.x + ((moveEvent.clientX - startX) / rect.width) * 10000 / availableX)), y: Math.max(0, Math.min(100, initial.y + ((moveEvent.clientY - startY) / rect.height) * 10000 / availableY)) }
      const activeImage = images[activeCropImageIndex]
      if (activeImage) setImageCrops(crops => ({ ...crops, [activeImage.url]: next }))
      return next
    })
    const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop) }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop)
  }
  const onFacePointerDown = (event: ReactPointerEvent<HTMLDivElement>, faceIndex: number) => {
    if (!images.length) return
    event.preventDefault()
    const faceElement = event.currentTarget
    faceElement.setPointerCapture?.(event.pointerId)
    setDraggingFaceIndex(faceIndex)
    const target = event.currentTarget.parentElement
    if (!target) return
    const face = placedFaces[faceIndex] || defaultFace
    const rect = target.getBoundingClientRect(); const startX = event.clientX; const startY = event.clientY; const initial = { x: face.x, y: face.y }
    setActiveFaceIndex(faceIndex)
    const move = (moveEvent: PointerEvent) => {
      const patch = { x: Math.max(0, Math.min(100 - face.width, initial.x + ((moveEvent.clientX - startX) / rect.width) * 100)), y: Math.max(0, Math.min(100 - face.width, initial.y + ((moveEvent.clientY - startY) / rect.height) * 100)) }
      if (faceIndex === 0) setFaces(value => value.map((item, index) => index === page ? { ...item, ...patch } : item))
      else setAdditionalFaces(value => ({ ...value, [page]: (value[page] || []).map((item, index) => index === faceIndex - 1 ? { ...item, ...patch } : item) }))
    }
    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
      faceElement.releasePointerCapture?.(event.pointerId)
      setDraggingFaceIndex(null)
    }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop); window.addEventListener('pointercancel', stop)
  }
  const renderPage = async (index: number) => {
    const pageFaces = [faces[index] || defaultFace, ...(additionalFaces[index] || [])]
    const selectedImage = images[pageFaces[0]?.imageIndex || 0]?.url || images[0]?.url
    if (!selectedImage || !pages[index]) return
    const canvas = document.createElement('canvas'); canvas.width = 1600; canvas.height = 1200
    const context = canvas.getContext('2d'); if (!context) return
    const load = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => { const loaded = new Image(); loaded.onload = () => resolve(loaded); loaded.onerror = reject; loaded.src = src })
    try {
      const base = await load(pages[index]); canvas.width = base.naturalWidth; canvas.height = base.naturalHeight; context.drawImage(base, 0, 0, canvas.width, canvas.height)
      const child = selectedImage ? await load(selectedImage) : null
      if (child) pageFaces.forEach(settings => { if (settings.visible) { const size = canvas.width * settings.width / 100; context.save(); context.translate(canvas.width * (settings.x + settings.width / 2) / 100, canvas.height * (settings.y + settings.width / 2) / 100); context.rotate(settings.rotation * Math.PI / 180); context.beginPath(); context.arc(0, 0, size / 2, 0, Math.PI * 2); context.clip(); const sourceSize = Math.min(child.naturalWidth, child.naturalHeight) * cropSize / 100; const sourceX = (child.naturalWidth - sourceSize) * crop.x / 100; const sourceY = (child.naturalHeight - sourceSize) * crop.y / 100; context.drawImage(child, sourceX, sourceY, sourceSize, sourceSize, -size / 2, -size / 2, size, size); context.restore() } })
      const link = document.createElement('a'); link.download = `${story?.id || 'malaz'}-page-${index + 1}.png`; link.href = canvas.toDataURL('image/png'); link.click()
    } catch { setError('تعذر تجهيز الصورة. تأكدي من وجود صفحة القصة.') }
  }
  if (!story) return <section id="comic" className="comic-section reveal-section" dir="rtl"><div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-20"><div className="comic-heading"><div><h2>✨ أنا بطل القصة ✨ </h2><small>اختاري حكاية، وضعي وجه طفلك داخل صفحاتها.</small></div></div><Stepper step={step} /><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={upload} hidden /><div className="comic-story-grid">{comicStories.map(item => <article key={item.id} className="comic-story-card"><StoryImage src={item.cover} alt={item.name} /><div><h3>{item.name}</h3><p>{item.description}</p><button onClick={() => selectStory(item)}>اختار القصة</button></div></article>)}</div></div></section>
  return <section id="comic" className="comic-section reveal-section" dir="rtl">
    <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-20">
      <div className="comic-heading"><div><h2>✨ أنا بطل القصة ✨</h2><small>{story.name}</small><button className="comic-change-story" onClick={() => { setStory(null); setStep('stories'); setPage(0) }}>اختيار قصة أخرى</button></div></div>
      <Stepper step={step} />
      <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={upload} hidden />
      {error && <div className="comic-error" role="alert">{error}</div>}

      {step === 'upload' && <div className="comic-upload-step">
        <div className="comic-upload-preview">
          {images.length ? <div className="comic-crop-window" onPointerDown={onCropPointerDown}>
            <img className="comic-full-crop-image" src={images[activeCropImageIndex]?.url || images[0].url} alt="الصورة الأصلية" style={{ transform: `rotate(${crop.rotation}deg)` }} />
            <div className="comic-crop-selector" style={{ left: `${imageBox.left + (imageBox.width - selectorSize) * crop.x / 100}%`, top: `${imageBox.top + (imageBox.height - selectorSize) * crop.y / 100}%`, width: `${selectorSize}%`, height: `${selectorSize}%` }} aria-label="منطقة قص الوجه" />
          </div> : <span>📷</span>}
        </div>
        <div className="comic-controls"><h3>ارفعي صورة واضحة للوجه</h3><p>اختاري صورة مضيئة وواضحة، ثم حرّكي الدائرة لتحديد الجزء المطلوب من الصورة.</p><div className="comic-actions"><button className="comic-primary" onClick={() => openImagePicker(false)}>{images.length ? 'تغيير الصور' : 'اختيار الصور'}</button>{images.length > 0 && <button onClick={() => openImagePicker(true)}>إضافة صورة أخرى</button>}</div>{images.length > 0 && <div className="comic-upload-images">{images.map((item, index) => <button className={`comic-upload-thumb ${activeCropImageIndex === index ? 'is-selected' : ''}`} key={item.url} onClick={() => selectCropImage(index)}><img src={item.url} alt={`اختيار الصورة ${index + 1}`} /><span>{index + 1}</span></button>)}</div>}<label className="crop-controls">حجم الدائرة<input type="range" min="18" max="70" value={cropSize} onChange={event => setCropSize(Number(event.target.value))} /></label><label className="crop-controls">تدوير الصورة<input type="range" min="-180" max="180" value={crop.rotation} onChange={event => updateCrop({ rotation: Number(event.target.value) })} /></label><div className="comic-actions"><button className="comic-primary" onClick={acceptImage}>ابدئي التصميم ←</button></div></div>
      </div>}

      {step === 'design' && <div className="comic-editor">
        <div><div className="comic-page-stage"><StoryImage src={pages[page]} alt={`صفحة ${page + 1}`} />{placedFaces.map((face, index) => <div key={`${page}-${index}`} className={`comic-face-layer ${draggingFaceIndex === index ? 'is-editing' : ''} ${face.visible ? '' : 'is-hidden'}`} style={{ left: `${face.x}%`, top: `${face.y}%`, width: `${face.width}%`, transform: `rotate(${face.rotation}deg) scaleX(.82)` }} onPointerDown={event => onFacePointerDown(event, index)} onClick={() => setActiveFaceIndex(index)}><div className="comic-face-crop"><img src={faceImage(face.imageIndex)} alt="وجه الطفل" style={faceStyle(crop, face.width)} /></div></div>)}</div><div className="comic-page-nav"><button disabled={page === 0} onClick={() => setPage(value => Math.max(0, value - 1))}>→ السابقة</button><strong>صفحة {page + 1} من {pages.length}</strong><button disabled={page === pages.length - 1} onClick={() => setPage(value => Math.min(pages.length - 1, value + 1))}>التالية ←</button></div></div>
        <aside className="comic-editor-tools"><h3>صفحة {page + 1} من {pages.length}</h3><p>اسحبي الوجه لمكانه، ثم اضبطي الحجم والدوران.</p><div className="comic-photo-picker"><strong>اختاري الوجه</strong><div>{images.map((item, index) => <button key={item.url} className={activeFace.imageIndex === index ? 'is-selected' : ''} onClick={() => updateFace({ imageIndex: index })}><img src={faceImage(index)} alt={`صورة ${index + 1}`} /><small>{index + 1}</small></button>)}<button className="comic-add-face" onClick={addFace}>＋</button></div></div><label>تكبير / تصغير<input type="range" min="7" max="34" value={activeFace.width} onChange={event => updateFace({ width: Number(event.target.value) })} /></label><label>تحريك أفقي<input type="range" min="0" max="90" value={activeFace.x} onChange={event => updateFace({ x: Number(event.target.value) })} /></label><label>تحريك رأسي<input type="range" min="0" max="90" value={activeFace.y} onChange={event => updateFace({ y: Number(event.target.value) })} /></label><label>تدوير<input type="range" min="-25" max="25" value={activeFace.rotation} onChange={event => updateFace({ rotation: Number(event.target.value) })} /></label><div className="comic-actions"><button onClick={resetFace}>إعادة ضبط الوجه</button><button onClick={() => updateFace({ visible: !activeFace.visible })}>{activeFace.visible ? 'إخفاء الوجه' : 'إظهار الوجه'}</button></div><button className="comic-primary comic-full-button py-4" onClick={openPreview}>معاينة القصة كاملة ✨</button></aside>
      </div>}

      {step === 'preview' && <div className="comic-preview"><p className="comic-preview-note">معاينة كاملة للقصة — اضغطي القلم للعودة إلى تعديل الصفحة</p><div className="comic-book-preview comic-book-preview-desktop"><button className="comic-book-arrow" disabled={previewSpread === 0} onClick={() => setPreviewSpread(value => Math.max(0, value - 1))}>←</button><div className="comic-book">{[previewSpread * 2, previewSpread * 2 + 1].map((index, side) => index < pages.length ? <div className={`comic-book-page comic-book-page-${side === 0 ? 'left' : 'right'}`} key={index}><div className="comic-book-page-art"><StoryImage src={pages[index]} alt={`صفحة ${index + 1}`} />{[faces[index] || defaultFace, ...(additionalFaces[index] || [])].map((face, faceIndex) => <div key={faceIndex} className="comic-face-layer" style={{ left: `${face.x}%`, top: `${face.y}%`, width: `${face.width}%`, transform: `rotate(${face.rotation}deg) scaleX(.82)`, display: face.visible ? undefined : 'none' }}><div className="comic-face-crop"><img src={faceImage(face.imageIndex)} alt="وجه الطفل" style={faceStyle(crop, face.width)} /></div></div>)}</div><button className="comic-edit-page" aria-label={`تعديل الصفحة ${index + 1}`} onClick={() => { setPage(index); setStep('design') }}>✎</button></div> : <div className="comic-book-page" key={index} />)}</div><button className="comic-book-arrow" disabled={previewSpread >= Math.ceil(pages.length / 2) - 1} onClick={() => setPreviewSpread(value => Math.min(Math.ceil(pages.length / 2) - 1, value + 1))}>→</button></div><div className="comic-mobile-preview"><button className="comic-book-arrow" disabled={previewPage === 0} onClick={() => setPreviewPage(value => Math.max(0, value - 1))}>←</button><div className="comic-mobile-book"><div className="comic-book-page"><div className="comic-book-page-art"><StoryImage src={pages[previewPage]} alt={`صفحة ${previewPage + 1}`} />{[faces[previewPage] || defaultFace, ...(additionalFaces[previewPage] || [])].map((face, faceIndex) => <div key={faceIndex} className="comic-face-layer" style={{ left: `${face.x}%`, top: `${face.y}%`, width: `${face.width}%`, transform: `rotate(${face.rotation}deg) scaleX(.82)`, display: face.visible ? undefined : 'none' }}><div className="comic-face-crop"><img src={faceImage(face.imageIndex)} alt="وجه الطفل" style={faceStyle(crop, face.width)} /></div></div>)}</div><button className="comic-edit-page" aria-label={`تعديل الصفحة ${previewPage + 1}`} onClick={() => { setPage(previewPage); setStep('design') }}>✎</button></div></div><button className="comic-book-arrow" disabled={previewPage >= pages.length - 1} onClick={() => setPreviewPage(value => Math.min(pages.length - 1, value + 1))}>→</button></div></div>}
    </div>
  </section>
}
