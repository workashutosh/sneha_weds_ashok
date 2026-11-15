import { useRef } from 'react'
import { wedding } from '../config/wedding'
import { Mandala } from '../components/art/Mandala'
import toran from '../assets/toran.webp'
import varVadhu from '../assets/var-vadhu.webp'
import railing from '../assets/railing.webp'
import pavilion from '../assets/pavilion.webp'
import lotusBloom from '../assets/lotus-center.webp'
import hangingLotus from '../assets/hanging-lotus.webp'
import lotusPond from '../assets/el2-lotus-pond.webp'
import { fx, gsap, ScrollTrigger, useGsap } from '../lib/scroll'
import { Sparkles } from '../components/Sparkles'
import { reducedMotion } from '../lib/env'

export function Couple() {
  const root = useRef<HTMLElement>(null)
  const amp = useRef<HTMLSpanElement>(null)

  useGsap(root, () => {
    if (reducedMotion) {
      gsap.from('.cp-fade', { autoAlpha: 0, duration: 1, stagger: 0.2, scrollTrigger: { trigger: root.current, start: 'top 60%' } })
      return
    }
    // Plays once, on its own, when the section comes into view — the page never
    // holds the guest's scroll, and the whole reveal takes about 3 seconds.
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        if (!amp.current) return
        const r = amp.current.getBoundingClientRect()
        if (r.bottom > 0 && r.top < innerHeight) fx.burst(r.left + r.width / 2, r.top + r.height / 2, 40, true)
      },
    })
    tl.fromTo('.cp-bells', { yPercent: -80 }, { yPercent: 0, duration: 1 }, 0)
      .fromTo('.cp-mandala', { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.6 }, 0)
      .fromTo('.cp-eyebrow', { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.2)
      .fromTo('.cp-together', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.4)
      .fromTo('.cp-peacock-l, .cp-peacock-r', { yPercent: -40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.2 }, 0.3)
      .fromTo('.cp-name-l', { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8 }, 0.7)
      .fromTo('.cp-amp', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2.2)' }, 1.1)
      .fromTo('.cp-name-r', { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8 }, 1.2)
      .fromTo('.cp-hindi', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.7)
      .fromTo('.cp-tag', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.9)
    // the royal scene below plays when it scrolls into view
    const scene = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
    scene
      .fromTo('.cp-pool', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0)
      .fromTo('.cp-pav-l', { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1 }, 0)
      .fromTo('.cp-pav-r', { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1 }, 0)
      .fromTo('.cp-rail', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.2)
      .fromTo('.cp-couple', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1 }, 0.35)
      .fromTo('.cp-bloom', { scale: 0.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(2)' }, 0.8)
      .fromTo('.cp-pond-l', { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1 }, 0.7)
      .fromTo('.cp-pond-r', { x: 50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1 }, 0.7)
    ScrollTrigger.create({ trigger: '.cp-scene', start: 'top 85%', once: true, onEnter: () => scene.play() })
    ScrollTrigger.create({ trigger: root.current, start: 'top 65%', once: true, onEnter: () => tl.play() })
  })

  const { bride, groom } = wedding

  return (
    <section ref={root} className="section" style={{ background: '#CFAF4E' }} aria-label={`${bride.full} and ${groom.full}`}>
      {/* subtle damask-like texture + soft light in the centre */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><g fill='none' stroke='%238C6A16' stroke-width='1'><path d='M24 6 C30 14 34 18 42 24 C34 30 30 34 24 42 C18 34 14 30 6 24 C14 18 18 14 24 6Z'/><circle cx='24' cy='24' r='3'/></g></svg>\")",
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(80% 55% at 50% 38%, rgba(255,236,170,.45), transparent 70%)' }} aria-hidden />
      <div className="relative flex min-h-[100svh] pt-16 pb-0 flex-col items-center justify-end px-3">
        {/* temple bells across the top */}
        <div className="cp-bells pointer-events-none absolute inset-x-0 top-0 z-10 h-[clamp(64px,19vw,110px)] bg-repeat-x" style={{ backgroundImage: `url(${toran})`, backgroundSize: 'auto 100%', backgroundPosition: 'center top' }} aria-hidden />
        {/* hanging lotuses on both sides */}
        <img src={hangingLotus} alt="" aria-hidden className="cp-peacock-l sway-html pointer-events-none absolute left-[3%] top-[clamp(30px,10vw,70px)] z-0 w-[19vw] max-w-[125px]" loading="lazy" decoding="async" width={200} height={600} />
        <img src={hangingLotus} alt="" aria-hidden className="cp-peacock-r sway-html pointer-events-none absolute right-[3%] top-[clamp(30px,10vw,70px)] z-0 w-[19vw] max-w-[125px] [animation-delay:-2s]" loading="lazy" decoding="async" width={200} height={600} />
        {/* back layer: rotating mandala */}
        <div className="cp-back pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <div className="cp-mandala w-[min(135vw,860px)] opacity-0 will-change-transform">
            <Mandala className="spin-slower h-auto w-full opacity-25 [filter:brightness(.55)]" strokeWidth={0.6} />
          </div>
        </div>

        <p className="cp-eyebrow cp-fade relative mb-8 mt-[14vh] sm:mt-[10vh] font-display text-[0.8rem] font-bold tracking-[0.35em] text-maroon sm:text-base">
          SHUBH VIVAH
        </p>

        {/* names, simply and elegantly — no cards */}
        <div className="relative w-full max-w-[640px] text-center">
          <p className="cp-together font-serif text-base italic text-maroon-deep sm:text-lg">Together with their families</p>
          <h2 className="mt-3 leading-none" aria-label={`${bride.full} and ${groom.full}`}>
            <span className="cp-name-l block font-script text-[clamp(2.4rem,11vw,4.4rem)] normal-case tracking-[0.02em]">
              <span className="text-maroon-deep">{bride.first}</span>
            </span>
            <span ref={amp} className="cp-amp my-1 block font-script text-[clamp(1.8rem,8vw,3rem)] normal-case text-sindoor">
              &amp;
            </span>
            <span className="cp-name-r block font-script text-[clamp(2.4rem,11vw,4.4rem)] normal-case tracking-[0.02em]">
              <span className="text-maroon-deep">{groom.first}</span>
            </span>
          </h2>
          <p className="cp-tag mt-3 font-serif text-xs font-semibold uppercase tracking-[0.28em] text-maroon sm:text-sm">
            {bride.full} · {groom.full}
          </p>
        </div>

        <Sparkles className="cp-tag absolute inset-x-[8%] top-[22%] h-[46%]" count={8} seed={5} />
        <p className="cp-hindi cp-fade relative mt-8 sm:mt-10 font-hindi text-[1.9rem] leading-none sm:text-5xl" lang="hi">
          <span className="text-sindoor">{bride.hindi}</span>
          <span className="mx-3 inline-block align-middle text-[0.6em] text-sindoor">❤</span>
          <span className="text-sindoor">{groom.hindi}</span>
        </p>
        <p className="cp-tag cp-fade relative mt-4 font-serif text-sm italic text-maroon-deep sm:text-base">two souls · one sacred journey</p>

        {/* terrace scene — one fixed-proportion frame, every piece placed by %, so it looks the same on every screen */}
        <div
          className="cp-scene relative -mx-3 mt-10 aspect-[4/3] w-[calc(100%+1.5rem)] max-w-[720px] overflow-hidden sm:mx-0 sm:w-full sm:rounded-[24px]"
          role="img"
          aria-label="Illustration of the bride and groom on a palace terrace by a lotus pool"
        >
          {/* soft sky fading into the page */}
          <div className="absolute inset-x-0 top-0 h-[72%]" style={{ background: 'linear-gradient(180deg, rgba(207,175,78,0) 0%, rgba(255,246,220,.55) 55%, rgba(255,246,220,.8) 100%)' }} aria-hidden />
          {/* pavilions behind the railing */}
          <img src={pavilion} alt="" className="cp-pav-l absolute left-[-3%] top-[33%] w-[24%]" loading="lazy" decoding="async" width={360} height={414} />
          <img src={pavilion} alt="" className="cp-pav-r absolute right-[-2%] top-[38%] w-[21%]" loading="lazy" decoding="async" width={360} height={414} />
          {/* railing */}
          <div className="cp-rail absolute inset-x-0 top-[57%] h-[15%] bg-repeat-x" style={{ backgroundImage: `url(${railing})`, backgroundSize: 'auto 100%', backgroundPosition: 'center' }} aria-hidden />
          {/* pool */}
          <div
            className="cp-pool absolute inset-x-0 bottom-0 top-[71%]"
            style={{
              background:
                'repeating-linear-gradient(90deg, rgba(255,255,255,.18) 0 1px, transparent 1px 9%), repeating-linear-gradient(0deg, rgba(255,255,255,.18) 0 1px, transparent 1px 22%), linear-gradient(180deg, #8fd6dc 0%, #5fbcc7 100%)',
            }}
            aria-hidden
          />
          {/* the couple, standing at the railing */}
          <img src={varVadhu} alt="" className="cp-couple absolute left-[37%] top-[4%] w-[31%]" loading="lazy" decoding="async" width={560} height={963} />
          {/* lotuses in the pool */}
          <img src={lotusBloom} alt="" className="cp-bloom absolute left-[30%] top-[78%] w-[13%]" loading="lazy" decoding="async" width={520} height={366} />
          <img src={lotusBloom} alt="" className="cp-bloom absolute left-[54%] top-[84%] w-[11%]" loading="lazy" decoding="async" width={520} height={366} />
          <img src={lotusBloom} alt="" className="cp-bloom absolute left-[44%] top-[90%] w-[9%]" loading="lazy" decoding="async" width={520} height={366} />
          <img src={lotusPond} alt="" className="cp-pond-l absolute bottom-[-6%] left-[-5%] w-[31%]" loading="lazy" decoding="async" width={340} height={446} />
          <img src={lotusPond} alt="" className="cp-pond-r absolute bottom-[-6%] right-[-5%] w-[31%] -scale-x-100" loading="lazy" decoding="async" width={340} height={446} />
        </div>
      </div>
    </section>
  )
}
