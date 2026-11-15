import { useEffect, useRef } from 'react'
import { wedding } from '../config/wedding'
import { Mandala } from '../components/art/Mandala'
import { Divider } from '../components/art/Ornaments'
import skyLantern from '../assets/sky-lantern.webp'
import { Elephant } from '../components/art/Elephant'
import toran from '../assets/toran.webp'
import doli from '../assets/el2-doli.webp'
import umbrella from '../assets/el2-umbrella.webp'
import lotusPond from '../assets/el2-lotus-pond.webp'
import peacock from '../assets/el-peacock.webp'
import { fx, gsap, ScrollTrigger, scrollToTop, useGsap } from '../lib/scroll'
import { fxBudget, isSmall, reducedMotion } from '../lib/env'
import { music } from '../lib/audio'
import { Sparkles } from '../components/Sparkles'

/* ───────── fireworks: runs only while the section is on screen ───────── */
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; c: string; px: number; py: number }
type Rocket = { x: number; y: number; vy: number; ty: number; c: string[] }
const PALETTES = [
  ['#D4AF37', '#B8901F', '#F4A300'],
  ['#F4A300', '#E07B00', '#FFC93C'],
  ['#E3364F', '#B3122E', '#F4A300'],
  ['#0E6F6B', '#3FA79D', '#D4AF37'],
]

function useFireworks(canvasRef: React.RefObject<HTMLCanvasElement | null>, sectionRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (reducedMotion || fxBudget === 0) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(devicePixelRatio || 1, isSmall ? 1.5 : 2)
    let W = 0
    let H = 0
    const resize = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
    }
    resize()
    let sparks: Spark[] = []
    let rockets: Rocket[] = []
    let raf = 0
    let running = false
    let nextLaunch = 0
    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const perBurst = Math.round(72 * Math.max(0.5, fxBudget))

    const launch = () => {
      rockets.push({ x: rand(W * 0.15, W * 0.85), y: H + 10, vy: rand(-11, -8.5) * (H / 800 + 0.4), ty: rand(H * 0.12, H * 0.42), c: PALETTES[(Math.random() * PALETTES.length) | 0] })
    }
    const explode = (r: Rocket) => {
      for (let i = 0; i < perBurst; i++) {
        const a = (i / perBurst) * Math.PI * 2 + rand(-0.05, 0.05)
        const sp = rand(1.8, 5.4) * (W < 500 ? 0.8 : 1)
        sparks.push({ x: r.x, y: r.y, px: r.x, py: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(50, 85), c: r.c[i % 3] })
      }
    }
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (t > nextLaunch) {
        launch()
        nextLaunch = t + rand(420, 1100)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'source-over'
      ctx.lineCap = 'round'
      rockets = rockets.filter((r) => {
        r.y += r.vy
        r.vy *= 0.985
        ctx.strokeStyle = 'rgba(184,144,31,.85)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(r.x, r.y)
        ctx.lineTo(r.x, r.y + 14)
        ctx.stroke()
        if (r.y <= r.ty || r.vy > -1.5) {
          explode(r)
          return false
        }
        return true
      })
      sparks = sparks.filter((s) => {
        s.px = s.x
        s.py = s.y
        s.vx *= 0.975
        s.vy = s.vy * 0.975 + 0.045
        s.x += s.vx
        s.y += s.vy
        s.life++
        const k = 1 - s.life / s.max
        if (k <= 0) return false
        ctx.globalAlpha = k
        ctx.strokeStyle = s.c
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.moveTo(s.px - s.vx * 2, s.py - s.vy * 2)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()
        return true
      })
      ctx.globalAlpha = 1
    }
    const start = () => {
      if (running) return
      running = true
      resize()
      // opening volley
      for (let i = 0; i < 3; i++) setTimeout(launch, i * 220)
      nextLaunch = performance.now() + 900
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
      sparks = []
      rockets = []
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 40%',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? start() : stop()),
    })
    return () => {
      st.kill()
      stop()
    }
  }, [canvasRef, sectionRef])
}

/** sky lanterns drifting upward behind the content (CSS only → GPU-cheap) */
function FloatingLanterns() {
  const items = Array.from({ length: isSmall ? 7 : 11 }, (_, i) => {
    const r = (n: number) => {
      const x = Math.sin((i + 1) * 91.7 + n * 12.9) * 43758.5
      return x - Math.floor(x)
    }
    return { left: 4 + r(1) * 92, size: 16 + r(2) * 16, delay: -r(3) * 18, dur: 16 + r(4) * 10, sway: r(5) > 0.5 ? 1 : -1 }
  })
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((d, i) => (
        <div
          key={i}
          className="cl-rise absolute bottom-0"
          style={{ left: `${d.left}%`, width: d.size, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s`, ['--sway' as string]: d.sway }}
        >
          <img src={skyLantern} alt="" className="block w-full" loading="lazy" decoding="async" width={120} height={149} />
        </div>
      ))}
    </div>
  )
}

export function Closing() {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const mono = useRef<HTMLDivElement>(null)
  useFireworks(canvas, root)

  useGsap(root, () => {
    ScrollTrigger.create({
      trigger: root.current,
      start: 'top 45%',
      onEnter: () => {
        fx.shower(70)
        music.swell(true)
      },
      onLeaveBack: () => music.swell(false),
    })
    if (reducedMotion) return
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: root.current, start: 'top 60%', once: true },
      onComplete: () => {
        if (!mono.current) return
        const r = mono.current.getBoundingClientRect()
        if (r.bottom > 0 && r.top < innerHeight) fx.burst(r.left + r.width / 2, r.top + r.height / 2, 44, true)
      },
    })
    tl.from('.cl-bells', { yPercent: -60, autoAlpha: 0, duration: 1.2, ease: 'power3.out' }, 0)
      .from('.cl-rays', { autoAlpha: 0, scale: 0.6, duration: 1.6 }, 0)
      .from('.cl-arch', { y: 70, autoAlpha: 0, duration: 1.1 }, 0.15)
      .fromTo('.cl-mandala', { scale: 0.4, rotate: -90 }, { scale: 1, rotate: 0, duration: 2, ease: 'expo.out' }, 0.3)
      .to('.cl-mandala .draw', { strokeDashoffset: 0, duration: 2.2, stagger: 0.1, ease: 'power2.inOut' }, 0.3)
      .from('.cl-peacock-l', { x: -40, autoAlpha: 0, duration: 0.9 }, 0.8)
      .from('.cl-peacock-r', { x: 40, autoAlpha: 0, duration: 0.9 }, 0.8)
      .from('.cl-mono > *', { autoAlpha: 0, scale: 0.5, y: 16, stagger: 0.18, duration: 1, ease: 'back.out(2)' }, 0.9)
      .from('.cl-in-arch', { autoAlpha: 0, y: 16, stagger: 0.12, duration: 0.8 }, 1.5)
      .from('.cl-fade', { autoAlpha: 0, y: 22, stagger: 0.12, duration: 0.9 }, 1.8)
      .from('.cl-ele-l', { xPercent: -120, autoAlpha: 0, duration: 1.6, ease: 'power2.out' }, 2.1)
      .from('.cl-ele-r', { xPercent: 120, autoAlpha: 0, duration: 1.6, ease: 'power2.out' }, 2.1)
      .from('.cl-doli', { y: 40, autoAlpha: 0, duration: 1 }, 2.5)
  })

  const { bride, groom, closing } = wedding

  return (
    <section
      ref={root}
      className="section flex flex-col items-center justify-center px-5 pb-[max(150px,20vw)] pt-[min(30vw,150px)] text-center sm:pb-28"
      style={{ background: '#f3f7f7' }}
      aria-label="Closing"
    >
      <div className="lattice pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: 'radial-gradient(90% 60% at 50% 38%, rgba(255,248,231,.97), rgba(255,248,231,.4) 70%, transparent)' }} />
      <FloatingLanterns />

      {/* temple bells across the top */}
      <div className="cl-bells pointer-events-none absolute inset-x-0 top-0 z-10 h-[clamp(64px,19vw,110px)] bg-repeat-x" style={{ backgroundImage: `url(${toran})`, backgroundSize: 'auto 100%', backgroundPosition: 'center top' }} aria-hidden />

      <img src={lotusPond} alt="" aria-hidden className="pointer-events-none absolute -left-[6%] bottom-0 z-10 w-[32vw] max-w-[210px]" loading="lazy" decoding="async" width={340} height={446} />
      <img src={lotusPond} alt="" aria-hidden className="pointer-events-none absolute -right-[6%] bottom-0 z-10 w-[30vw] max-w-[200px] -scale-x-100" loading="lazy" decoding="async" width={340} height={446} />
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />

      {/* the monogram in a glowing gold arch, two peacocks facing each other */}
      <div className="relative">
        <div
          className="cl-rays spin-slow pointer-events-none absolute left-1/2 top-[38%] h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 opacity-70"
          style={{
            background: 'repeating-conic-gradient(from 0deg, rgba(212,175,55,.18) 0deg 4deg, transparent 4deg 15deg)',
            WebkitMaskImage: 'radial-gradient(closest-side, #000 10%, transparent 60%)',
            maskImage: 'radial-gradient(closest-side, #000 10%, transparent 60%)',
          }}
          aria-hidden
        />
        <div className="cl-arch relative mx-auto w-[min(80vw,380px)]">
          <img src={peacock} alt="" aria-hidden className="cl-peacock-l pointer-events-none absolute -left-[16%] -top-[7%] z-10 w-[32%] max-w-[120px] -scale-x-100" loading="lazy" decoding="async" width={320} height={551} />
          <img src={peacock} alt="" aria-hidden className="cl-peacock-r pointer-events-none absolute -right-[16%] -top-[7%] z-10 w-[32%] max-w-[120px]" loading="lazy" decoding="async" width={320} height={551} />
          <div
            className="rounded-t-[999px] rounded-b-[20px] p-[3px] shadow-[0_30px_70px_-26px_rgba(90,15,27,.55),0_0_60px_rgba(244,163,0,.25)]"
            style={{ background: 'linear-gradient(160deg, #F3D98B, #B8901F 35%, #FFF1B8 55%, #A37A1C 80%, #E8C967)' }}
          >
            <div className="paper relative overflow-hidden rounded-t-[999px] rounded-b-[17px] px-4 pb-8 pt-[16%] text-center">
              <div className="pointer-events-none absolute inset-[7px] rounded-t-[999px] rounded-b-[13px] border border-gold/60" aria-hidden />
              <div ref={mono} className="relative mx-auto grid aspect-square w-[80%] max-w-[260px] place-items-center">
                <Mandala className="cl-mandala absolute inset-0 h-full w-full [filter:brightness(.72)_saturate(1.3)]" drawable strokeWidth={0.8} />
                <Sparkles className="absolute inset-0" count={5} seed={9} />
                {/* clean ivory medallion so the monogram sits inside the mandala, never on top of its lines */}
                <div className="cl-mono relative grid aspect-square w-[58%] place-items-center rounded-full bg-[#fffaf0] shadow-[0_0_0_1.5px_#D4AF37,0_0_0_5px_#fffaf0,0_0_0_6px_rgba(212,175,55,.55),0_6px_18px_rgba(140,106,22,.18)]">
                  <span className="flex items-baseline font-script text-[clamp(2.1rem,9.5vw,3.3rem)] leading-none text-sindoor">
                    <span>{bride.initial}</span>
                    <span className="mx-[0.12em] font-script text-[0.62em] normal-case text-gold-dark">&amp;</span>
                    <span>{groom.initial}</span>
                  </span>
                </div>
              </div>
              <p className="cl-in-arch relative mt-5 font-hindi text-[1.65rem] leading-none text-sindoor sm:text-[2.1rem]" lang="hi">
                {bride.hindi}
                <span className="mx-2 inline-block align-middle text-[0.45em]">❤</span>
                {groom.hindi}
              </p>
              <p className="cl-in-arch relative mt-2 font-serif text-base italic text-maroon/85">two souls · one sacred journey</p>
              <Divider className="cl-in-arch relative mx-auto mt-4 w-40" />
              <p className="cl-in-arch relative mt-3 font-display text-sm font-bold tracking-[0.18em] text-gold-dark">
                {wedding.weddingDate.numeric.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="cl-fade relative mt-10 max-w-lg font-script text-[1.75rem] leading-tight sm:text-[2.6rem]">
        <span className="maroon-foil foil-anim">{closing.line}</span>
      </h2>

      {/* royal procession */}
      <div className="relative mx-auto mt-6 flex w-full max-w-2xl items-end justify-center" aria-hidden>
        <Elephant className="cl-ele-l relative z-10 -mr-[4%] w-[33%] max-w-[220px]" />
        <div className="cl-doli relative w-[34%] max-w-[230px]">
          <img src={umbrella} alt="" className="absolute -top-[60%] left-1/2 w-[68%] -translate-x-1/2" loading="lazy" decoding="async" width={360} height={331} />
          <img src={doli} alt="" className="relative w-full" loading="lazy" decoding="async" width={560} height={302} />
        </div>
        <Elephant className="cl-ele-r relative z-10 -ml-[4%] w-[33%] max-w-[220px] -scale-x-100" />
      </div>

      <Divider className="cl-fade relative mx-auto my-6 w-56" />
      <p className="cl-fade relative font-serif text-sm uppercase tracking-[0.3em] text-gold-dark">{closing.signoff}</p>
      <p className="cl-fade relative mt-2 font-display text-xl font-bold text-maroon sm:text-2xl">{closing.families}</p>
      <p className="cl-fade relative mt-3 font-hindi text-xl text-sindoor" lang="hi">
        ॥ शुभम् भवतु ॥
      </p>

      <button type="button" onClick={scrollToTop} className="cl-fade btn-ghost relative z-20 mt-10 text-maroon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Relive the invitation
      </button>
    </section>
  )
}
