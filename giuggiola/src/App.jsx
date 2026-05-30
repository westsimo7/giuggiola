import { useState, useEffect, useCallback } from 'react'
import { ARTICLES, BOOKS } from './data'
import {
  Navbar, Hero, SectionHead, ArticleCard, BookCard,
  ChiSono, Footer, ArticleView, PurchaseModal, ArrowLink,
} from './components'
import {
  useTweaks, TweaksPanel, TweakSection, TweakRadio,
  TweakToggle, TweakColor, TweakSelect,
} from './TweaksPanel'

const TWEAK_DEFAULTS = {
  heroStyle: 'fullbleed',
  accent: '#1B3B6F',
  headlineFont: 'Newsreader',
  grain: true,
}

function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.is-in)')
    // Graceful fallback: if IntersectionObserver is unavailable (older browsers,
    // some embedded preview webviews), just reveal everything instead of crashing.
    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [dep])
}

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS)
  const [view, setView] = useState({ name: 'home' })
  const [library, setLibrary] = useState([])
  const [modalBook, setModalBook] = useState(null)

  useReveal(view.name + (view.article || ''))

  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty('--blue', t.accent)
    r.style.setProperty('--font-display', `"${t.headlineFont}", Georgia, serif`)
    document.body.classList.toggle('has-grain', !!t.grain)
  }, [t.accent, t.headlineFont, t.grain])

  const go = useCallback((name) => {
    if (name === 'home') window.scrollTo({ top: 0 })
    setView({ name })
    if (name !== 'home') window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const openArticle = useCallback((a) => {
    setView({ name: 'article', article: a.id })
    window.scrollTo({ top: 0 })
  }, [])

  const buy = useCallback((b) => setModalBook(b), [])
  const confirmBuy = useCallback((b) => {
    setLibrary((lib) => lib.includes(b.id) ? lib : [...lib, b.id])
  }, [])

  const currentArticle = view.name === 'article'
    ? ARTICLES.find((a) => a.id === view.article) : null
  const related = currentArticle
    ? ARTICLES.filter((a) => a.id !== currentArticle.id).slice(0, 2) : []

  return (
    <div className="site">
      <Navbar go={go} current={view.name === 'article' ? 'pensieri' : view.name}
        cartCount={library.length} onCart={() => go('libri')} />

      <main>
        {view.name === 'home' && (
          <>
            <Hero go={go} heroStyle={t.heroStyle} />

            <section className="band" id="pensieri-preview">
              <div className="wrap">
                <SectionHead kicker="Pensieri"
                  title="Pagine di diario, ad alta voce"
                  intro="Riflessioni nate tra lo studio, il tirocinio e le giornate normali. Le scrivo per capire, e le lascio qui per chi vuole leggerle."
                  action={<ArrowLink onClick={() => go('pensieri')}>Tutti i pensieri</ArrowLink>} />
                <div className="grid grid--articles">
                  {ARTICLES.slice(0, 3).map((a, i) => (
                    <ArticleCard key={a.id} article={a} index={i} onOpen={() => openArticle(a)} />
                  ))}
                </div>
              </div>
            </section>

            <section className="band band--tint" id="libri-preview">
              <div className="wrap">
                <SectionHead kicker="Libri"
                  title="Storie da portare con sé"
                  intro="Ebook nati dalla scrittura di tutti i giorni: narrativa, riflessioni e un pizzico di fantastico. Consegna immediata, lettura senza fretta."
                  action={<ArrowLink onClick={() => go('libri')}>Vai alla libreria</ArrowLink>} />
                <div className="grid grid--books">
                  {BOOKS.map((b, i) => (
                    <BookCard key={b.id} book={b} index={i} onBuy={buy} />
                  ))}
                </div>
              </div>
            </section>

            <section className="band">
              <div className="wrap">
                <ChiSono />
              </div>
            </section>

            <Quote />
          </>
        )}

        {view.name === 'pensieri' && (
          <section className="band band--top">
            <div className="wrap">
              <SectionHead kicker="Pensieri"
                title="Tutti i pensieri"
                intro="Un archivio in crescita. Nessuna fretta di pubblicare, solo cose vere quando arrivano." />
              <div className="grid grid--articles">
                {ARTICLES.map((a, i) => (
                  <ArticleCard key={a.id} article={a} index={i} onOpen={() => openArticle(a)} />
                ))}
              </div>
            </div>
          </section>
        )}

        {view.name === 'article' && currentArticle && (
          <section className="band band--top">
            <div className="wrap wrap--narrow">
              <ArticleView article={currentArticle} go={go} related={related} onOpen={openArticle} />
            </div>
          </section>
        )}

        {view.name === 'libri' && (
          <section className="band band--top">
            <div className="wrap">
              <SectionHead kicker="Libri"
                title="La libreria"
                intro="Ogni ebook arriva subito nella tua casella, in EPUB e PDF. Leggi dove e quando vuoi." />
              <div className="grid grid--books">
                {BOOKS.map((b, i) => (
                  <div key={b.id} className="book-wrap">
                    <BookCard book={b} index={i} onBuy={buy} />
                    {library.includes(b.id) && <span className="owned-tag">Nella tua libreria ✓</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {view.name === 'chi-sono' && (
          <section className="band band--top">
            <div className="wrap">
              <ChiSono full />
            </div>
          </section>
        )}
      </main>

      <Footer go={go} />

      {modalBook && (
        <PurchaseModal book={modalBook} onClose={() => setModalBook(null)} onConfirm={confirmBuy} />
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Hero" />
        <TweakRadio label="Stile hero" value={t.heroStyle}
          options={['fullbleed', 'split']}
          onChange={(v) => setTweak('heroStyle', v)} />
        <TweakToggle label="Grana fotografica" value={t.grain}
          onChange={(v) => setTweak('grain', v)} />
        <TweakSection label="Identità" />
        <TweakColor label="Blu" value={t.accent}
          options={['#1B3B6F', '#14305C', '#2E5A9E', '#23415C']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSelect label="Font titoli" value={t.headlineFont}
          options={['Newsreader', 'Spectral', 'Fraunces', 'Hanken Grotesk']}
          onChange={(v) => setTweak('headlineFont', v)} />
      </TweaksPanel>
    </div>
  )
}

function Quote() {
  return (
    <section className="quote reveal">
      <div className="wrap wrap--narrow">
        <p className="quote__text">
          "La calma non è non avere onde.<br />È imparare a non annegare quando arrivano."
        </p>
        <span className="quote__by">— dal diario</span>
      </div>
    </section>
  )
}
