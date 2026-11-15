import { useEffect, useRef } from 'react'
import { wedding } from '../config/wedding'
import { Mandala } from '../components/art/Mandala'
import { Divider } from '../components/art/Ornaments'
import { Lantern } from '../components/art/Lantern'
import lotusA from '../assets/el-lotus-a.webp'
import lotusB from '../assets/el-lotus-b.webp'
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

export function Closing() {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
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
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 55%' } })
    tl.fromTo('.cl-mandala', { scale: 0.3, rotate: -90, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 2.4, ease: 'expo.out' })
      .to('.cl-mandala .draw', { strokeDashoffset: 0, duration: 2.6, stagger: 0.12, ease: 'power2.inOut' }, 0)
      .from('.cl-mono > *', { autoAlpha: 0, scale: 0.6, y: 20, stagger: 0.18, duration: 1.2, ease: 'back.out(1.8)' }, 0.6)
      .from('.cl-fade', { autoAlpha: 0, y: 24, stagger: 0.14, duration: 1.1 }, 1.1)
  })

  const { bride, groom, closing } = wedding

  return (
    <section
      ref={root}
      className="section flex flex-col items-center justify-center px-5 pb-16 pt-24 text-center"
      style={{ background: '#f3f7f7' }}
      aria-label="Closing"
    >
      <div className="lattice pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: 'radial-gradient(90% 60% at 50% 40%, rgba(255,248,231,.95), rgba(255,248,231,.35) 70%, transparent)' }} />
      <Lantern className="absolute left-[4%] top-0 w-10 sm:left-[10%] sm:w-14" />
      <Lantern className="absolute right-[4%] top-0 w-10 sm:right-[10%] sm:w-14" />
      <img src={lotusA} alt="" aria-hidden className="pointer-events-none absolute -left-8 bottom-[8%] w-[26vw] max-w-[160px]" loading="lazy" decoding="async" width={380} height={606} />
      <img src={lotusB} alt="" aria-hidden className="pointer-events-none absolute -right-8 bottom-[12%] w-[26vw] max-w-[160px]" loading="lazy" decoding="async" width={380} height={535} />
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />

      <div className="relative grid w-[min(78vw,380px)] place-items-center">
        <Mandala className="cl-mandala absolute inset-0 h-full w-full [filter:brightness(.7)_saturate(1.3)]" drawable strokeWidth={0.8} />
        <img src={peacock} alt="" aria-hidden className="absolute -right-[4%] -top-[6%] z-10 w-[26%] max-w-[110px]" loading="lazy" decoding="async" width={320} height={551} />
        <Sparkles className="absolute inset-0" count={6} seed={9} />
        <div className="cl-mono relative flex aspect-square items-center justify-center font-script text-[clamp(4.2rem,20vw,7.5rem)] leading-none">
          <span className="text-sindoor">{bride.initial}</span>
          <span className="mx-1 text-[0.42em] text-sindoor">❤</span>
          <span className="text-sindoor">{groom.initial}</span>
        </div>
      </div>

      <h2 className="cl-fade relative mt-8 max-w-lg font-script text-[2.6rem] leading-tight text-sindoor sm:text-6xl">{closing.line}</h2>
      <Divider className="cl-fade relative mx-auto my-6 w-56" />
      <p className="cl-fade relative font-serif text-sm uppercase tracking-[0.3em] text-gold-dark">{closing.signoff}</p>
      <p className="cl-fade relative mt-2 font-display text-lg font-bold text-maroon sm:text-xl">{closing.families}</p>
      <p className="cl-fade relative mt-4 font-hindi text-lg text-sindoor" lang="hi">
        ॥ शुभम् भवतु ॥
      </p>

      <button
        type="button"
        onClick={scrollToTop}
        className="cl-fade btn-ghost relative mt-12 text-maroon"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Relive the invitation
      </button>
      <p className="relative mt-10 font-serif text-[0.8rem] tracking-[0.2em] text-maroon/85">
        {bride.first.toUpperCase()} &amp; {groom.first.toUpperCase()} · {wedding.weddingDate.numeric.join(' · ')}
      </p>
    </section>
  )
}
