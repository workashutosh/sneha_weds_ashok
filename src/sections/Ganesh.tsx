import { useEffect, useRef } from 'react'
import { wedding } from '../config/wedding'
import ganpati from '../assets/ganpati.webp'
import { Lantern } from '../components/art/Lantern'
import lotusA from '../assets/el-lotus-a.webp'
import lotusB from '../assets/el-lotus-b.webp'
import lotusCenter from '../assets/lotus-center.webp'
import elephantL from '../assets/elephant-left.webp'
import elephantR from '../assets/elephant-right.webp'
import { gsap, useGsap } from '../lib/scroll'
import { reducedMotion } from '../lib/env'


export function Ganesh({ opened }: { opened: boolean }) {
  const root = useRef<HTMLElement>(null)

  // One gentle, time-based intro as the page loads — no scroll-locking.
  useGsap(root, () => {
    if (reducedMotion) return
    gsap.set('.gn-title, .gn-hint', { autoAlpha: 0, y: 18 })
    gsap.set('.shloka p', { autoAlpha: 0, y: 14 })
    // the scroll hint disappears as soon as the guest starts scrolling
    gsap.to('.gn-hint', { autoAlpha: 0, scrollTrigger: { trigger: root.current, start: 'top -40', toggleActions: 'play none none reverse' } })
  })

  useEffect(() => {
    if (!opened || reducedMotion || !root.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 })
      tl.from('.gn-ganpati', { scale: 0.6, autoAlpha: 0, y: 20, transformOrigin: '50% 80%', duration: 1.2, ease: 'back.out(1.6)' })
        .from('.gn-ele-l', { x: -60, autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 0.4)
        .from('.gn-ele-r', { x: 60, autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 0.4)
        .from('.gn-lotus', { scale: 0.4, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.8)' }, 0.7)
        .to('.gn-title', { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out' }, 0.9)
        .to('.shloka p', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.3, ease: 'power2.out' }, 1.1)
        .to('.gn-hint', { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.2')
    }, root)
    return () => ctx.revert()
  }, [opened])

  return (
    <section ref={root} className="section" style={{ background: '#f3f7f7' }} aria-label="Shri Ganesh invocation">
      <div className="lattice pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="pointer-events-none absolute inset-0" aria-hidden style={{ background: 'radial-gradient(90% 60% at 50% 40%, rgba(255,248,231,.95), rgba(255,248,231,.35) 70%, transparent)' }} />
      <Lantern className="absolute left-[4%] top-0 w-10 sm:left-[10%] sm:w-14" />
      <Lantern className="absolute right-[4%] top-0 w-10 sm:right-[10%] sm:w-14" />
      <img src={lotusA} alt="" aria-hidden className="pointer-events-none absolute -left-8 bottom-[46%] w-[24vw] sm:bottom-[24%] max-w-[150px] -scale-x-100 opacity-90" loading="lazy" decoding="async" width={380} height={606} />
      <img src={lotusB} alt="" aria-hidden className="pointer-events-none absolute -right-8 bottom-[49%] w-[24vw] sm:bottom-[27%] max-w-[150px] -scale-x-100 opacity-90" loading="lazy" decoding="async" width={380} height={535} />
      <img src={elephantL} alt="" aria-hidden className="gn-ele-l pointer-events-none absolute bottom-[3%] left-[3%] z-10 w-[30vw] max-w-[190px]" loading="eager" decoding="async" width={460} height={287} />
      <img src={elephantR} alt="" aria-hidden className="gn-ele-r pointer-events-none absolute bottom-[3%] right-[3%] z-10 w-[30vw] max-w-[190px]" loading="eager" decoding="async" width={460} height={287} />
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pb-[max(110px,12svh)] pt-[8svh] text-center">
        <div
          className="gn-glow pointer-events-none absolute left-1/2 top-[38%] h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(244,163,0,.22), rgba(244,163,0,.08) 45%, transparent 70%)' }}
          aria-hidden
        />
        <div
          className="gn-rays spin-slow pointer-events-none absolute left-1/2 top-[34%] h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 opacity-60"
          style={{
            background: 'repeating-conic-gradient(from 0deg, rgba(212,175,55,.16) 0deg 4deg, transparent 4deg 15deg)',
            WebkitMaskImage: 'radial-gradient(closest-side, #000 8%, transparent 62%)',
            maskImage: 'radial-gradient(closest-side, #000 8%, transparent 62%)',
          }}
          aria-hidden
        />
        {/* Ganpati Bappa */}
        <img
          src={ganpati}
          alt="Shri Ganesha seated on a lotus"
          className="gn-ganpati relative w-[30vw] max-w-[150px]"
          loading="eager"
          decoding="async"
          width={420}
          height={654}
        />

        {/* lotus above the invocation */}
        <img src={lotusCenter} alt="" aria-hidden className="gn-lotus relative mt-[6svh] w-[24vw] max-w-[120px]" loading="eager" decoding="async" width={520} height={366} />

        <h2 className="gn-title mt-2 font-hindi text-[1.65rem] leading-tight sm:text-4xl">
          <span className="text-sindoor">{wedding.invocation.title}</span>
        </h2>

        <div className="shloka mt-4 space-y-2 font-hindi text-[1.22rem] leading-relaxed text-maroon sm:text-2xl">
          {wedding.invocation.shloka.map((line, i) => (
            <p key={i} className={`shloka-${i}`}>
              {line}
            </p>
          ))}
        </div>


        <div className="gn-hint absolute bottom-[max(16px,env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 text-center text-maroon">
          <span className="font-hindi text-base" lang="hi">
            नीचे देखें
          </span>
          <span className="font-serif text-xs uppercase tracking-[0.2em] opacity-90">Scroll down</span>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden className="float-y mt-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>
    </section>
  )
}
