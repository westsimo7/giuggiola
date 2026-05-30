import { useState, useEffect, useMemo } from 'react'

/* ---------- Intro animation ---------- */

const INTRO_LINES = ['100%', '92%', '97%', '85%', '100%', '78%', '94%']
const INTRO_SRC = 'GIUGGIOLA’STHINKPENSIERIPAROLELIBRI'.split('')

export function Intro({ onDone }) {
  const [phase, setPhase] = useState('far')

  // Letters fired hard from the centre to random spots across the whole page.
  // Computed once per play so each visit scatters differently.
  const letters = useMemo(() => {
    const out = []
    const N = 56
    for (let i = 0; i < N; i++) {
      const ang = Math.random() * Math.PI * 2
      const dist = 28 + Math.random() * 42 // viewport-relative throw distance
      out.push({
        ch: INTRO_SRC[i % INTRO_SRC.length],
        tx: (Math.cos(ang) * dist).toFixed(1) + 'vw',
        ty: (Math.sin(ang) * dist).toFixed(1) + 'vh',
        rot: (Math.random() * 760 - 380).toFixed(0) + 'deg',
        sz: (16 + Math.random() * 34).toFixed(0) + 'px',
        delay: (Math.random() * 240).toFixed(0) + 'ms',
        dur: (480 + Math.random() * 420).toFixed(0) + 'ms',
      })
    }
    return out
  }, [])

  useEffect(() => {
    const reduce = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { onDone(); return }

    // Timeline (ms): far → approach (zoom onto the closed cover) → open
    //  → (linger on the open book) → burst → zoom into the page → out → done
    const seq = [
      [250, 'approach'],
      [2300, 'open'],
      [3900, 'burst'],
      [5200, 'zoom'],
      [6400, 'out'],
      [6950, '__done'],
    ]
    const timers = seq.map(([t, p]) =>
      setTimeout(() => (p === '__done' ? onDone() : setPhase(p)), t)
    )
    document.body.style.overflow = 'hidden'
    return () => {
      timers.forEach(clearTimeout)
      document.body.style.overflow = ''
    }
  }, [onDone])

  const showBurst = phase === 'burst' || phase === 'zoom'

  return (
    <div className={'intro intro--' + phase} role="presentation">
      <div className="intro__scene">
        <div className="intro__book">
          {/* inner page, revealed when the cover opens */}
          <div className="intro__page intro__page--r" aria-hidden="true">
            <div className="intro__lines">
              {INTRO_LINES.map((w, i) => <span key={i} style={{ width: w }} />)}
            </div>
            <div className="intro__leaves">
              <span className="intro__leaf" />
              <span className="intro__leaf" />
              <span className="intro__leaf" />
              <span className="intro__leaf" />
            </div>
          </div>

          {/* front cover: closed at first (we zoom onto it), then swings open
              and stays open — its inside face remains in view */}
          <div className="intro__cover" aria-hidden="true">
            <div className="intro__face intro__face--front">
              <span className="intro__genre">Pensieri, parole e libri</span>
              <span className="intro__title">Giuggiola&rsquo;s Think</span>
              <span className="intro__author">Giuggiola</span>
            </div>
            <div className="intro__face intro__face--back" />
          </div>
        </div>
      </div>

      {showBurst && (
        <div className="intro__burst" aria-hidden="true">
          {letters.map((l, i) => (
            <span key={i} className="intro__letter"
              style={{
                '--tx': l.tx, '--ty': l.ty, '--rot': l.rot,
                fontSize: l.sz, animationDelay: l.delay, animationDuration: l.dur,
              }}>
              {l.ch}
            </span>
          ))}
        </div>
      )}

      <div className="intro__flash" aria-hidden="true" />
      <button className="intro__skip" onClick={onDone}>Salta intro</button>
    </div>
  )
}

/* ---------- Small atoms ---------- */

export function Kicker({ children }) {
  return <span className="kicker">{children}</span>
}

export function ArrowLink({ children, onClick }) {
  return (
    <a className="arrow-link" onClick={onClick} role="button" tabIndex={0}>
      {children}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}

/* ---------- Navbar ---------- */

export function Navbar({ go, current, cartCount, onCart }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    ['home', 'Home'],
    ['pensieri', 'Pensieri'],
    ['libri', 'Libri'],
    ['chi-sono', 'Chi sono'],
  ]

  return (
    <header className={'nav ' + (scrolled ? 'nav--scrolled' : '')}>
      <div className="nav__inner">
        <a className="brand" onClick={() => go('home')} role="button" tabIndex={0}>
          <span className="brand__mark" aria-hidden="true">G</span>
          <span className="brand__name">Giuggiola's&nbsp;<em>Think</em></span>
        </a>

        <nav className="nav__links" aria-label="Principale">
          {links.map(([id, label]) => (
            <a key={id}
              className={'nav__link ' + (current === id ? 'is-active' : '')}
              onClick={() => go(id)} role="button" tabIndex={0}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="cart-btn" onClick={onCart} aria-label="Libreria">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 5h11l-1 9H6L5 5zM5 5l-.7-2H2.5M8 19a1 1 0 100 .01M14 19a1 1 0 100 .01"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="btn btn--solid nav__cta" onClick={() => go('libri')}>
            Scopri i miei libri
          </button>
          <button className="nav__burger" onClick={() => setOpen(!open)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {open && (
        <div className="nav__mobile">
          {links.map(([id, label]) => (
            <a key={id} onClick={() => { go(id); setOpen(false) }} role="button" tabIndex={0}>
              {label}
            </a>
          ))}
          <button className="btn btn--solid" onClick={() => { go('libri'); setOpen(false) }}>
            Scopri i miei libri
          </button>
        </div>
      )}
    </header>
  )
}

/* ---------- Hero ---------- */

export function Hero({ go, heroStyle }) {
  return (
    <section className={'hero hero--' + heroStyle}>
      <div className="hero__media" aria-hidden="true">
        <div className="hero__img" />
        <div className="hero__veil" />
      </div>

      <div className="hero__content">
        <span className="hero__eyebrow">Pensieri, parole e libri</span>
        <h1 className="hero__title">
          Scrivo per capire<br />ciò che il silenzio<br />
          <em>non riesce a dire.</em>
        </h1>
        <p className="hero__sub">
          Sto diventando Tecnico della Riabilitazione Psichiatrica.
          Qui raccolgo i miei pensieri, le esperienze di ogni giorno e i libri
          che nascono da loro. Un diario tenuto a voce alta, con cura.
        </p>
        <div className="hero__cta">
          <button className="btn btn--solid" onClick={() => go('pensieri')}>
            Leggi i pensieri
          </button>
          <button className="btn btn--ghost" onClick={() => go('libri')}>
            Scopri i libri
          </button>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>scorri</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  )
}

/* ---------- Section header ---------- */

export function SectionHead({ kicker, title, intro, action }) {
  return (
    <div className="sec-head reveal">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="sec-head__title">{title}</h2>
      </div>
      {intro && <p className="sec-head__intro">{intro}</p>}
      {action}
    </div>
  )
}

/* ---------- Article card ---------- */

export function ArticleCard({ article, onOpen, index }) {
  return (
    <article className="card reveal" style={{ transitionDelay: index * 60 + 'ms' }}
      onClick={onOpen} role="button" tabIndex={0}>
      <div className="card__meta">
        <Kicker>{article.kicker}</Kicker>
        <span className="card__dot" />
        <span className="card__date">{article.date}</span>
      </div>
      <h3 className="card__title">{article.title}</h3>
      <p className="card__preview">{article.preview}</p>
      <div className="card__foot">
        <ArrowLink>Continua a leggere</ArrowLink>
        <span className="card__read">{article.read}</span>
      </div>
    </article>
  )
}

/* ---------- Book cover ---------- */

export function BookCover({ book, small }) {
  return (
    <div className={'cover ' + (small ? 'cover--sm' : '')} style={{ '--accent': book.accent }}>
      <div className="cover__spine" />
      <div className="cover__face">
        <span className="cover__genre">{book.genre}</span>
        <span className="cover__title">{book.title}</span>
        <span className="cover__author">Giuggiola</span>
      </div>
    </div>
  )
}

/* ---------- Book card ---------- */

export function BookCard({ book, onBuy, index }) {
  return (
    <article className="book reveal" style={{ transitionDelay: index * 70 + 'ms' }}>
      <BookCover book={book} />
      <div className="book__body">
        <span className="book__genre">{book.genre}</span>
        <h3 className="book__title">{book.title}</h3>
        <p className="book__blurb">{book.blurb}</p>
        <span className="book__pages">{book.pages}</span>
        <div className="book__foot">
          <span className="book__price">€ {book.price}</span>
          <button className="btn btn--solid btn--sm" onClick={() => onBuy(book)}>Acquista</button>
        </div>
      </div>
    </article>
  )
}

/* ---------- Chi sono ---------- */

export function ChiSono({ full }) {
  return (
    <section className={'about reveal ' + (full ? 'about--page' : '')}>
      <div className="about__grid">
        <div className="about__portrait" aria-hidden="true">
          <div className="about__portrait-img" />
          <span className="about__tag">Giuggiola</span>
        </div>
        <div className="about__text">
          <Kicker>Chi sono</Kicker>
          <h2 className="about__title">Mi chiamo Giuggiola, e imparo a stare accanto alle persone.</h2>
          <p>
            Sto studiando per diventare Tecnico della Riabilitazione Psichiatrica.
            È un percorso che mi insegna ogni giorno che la cura non è aggiustare
            qualcuno, ma fargli spazio: ascoltare senza fretta, restare anche nel silenzio,
            credere nelle persone prima che ci credano loro stesse.
          </p>
          <p>
            Scrivo da quando ero bambina. Prima per non sentirmi sola dentro la mia testa,
            poi perché ho capito che mettere in parole il caos è già una forma di guarigione.
            Su questo sito trovi i miei pensieri e i libri che nascono da loro — alcuni
            personali, altri inventati, tutti veri a modo loro.
          </p>
          <p className="about__sign">— con cura, G.</p>
        </div>
      </div>
    </section>
  )
}

/* ---------- Footer ---------- */

export function Footer({ go }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="brand__mark" aria-hidden="true">G</span>
          <span className="footer__name">Giuggiola's Think</span>
          <p className="footer__tagline">Pensieri, parole e libri. Tenuti a voce alta, con cura.</p>
        </div>
        <div className="footer__col">
          <span className="footer__h">Naviga</span>
          <a onClick={() => go('home')} role="button" tabIndex={0}>Home</a>
          <a onClick={() => go('pensieri')} role="button" tabIndex={0}>Pensieri</a>
          <a onClick={() => go('libri')} role="button" tabIndex={0}>Libri</a>
          <a onClick={() => go('chi-sono')} role="button" tabIndex={0}>Chi sono</a>
        </div>
        <div className="footer__col">
          <span className="footer__h">Resta in contatto</span>
          <a href="mailto:ciao@giuggiolasthink.it">ciao@giuggiolasthink.it</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Newsletter</a>
        </div>
      </div>
      <div className="footer__base">
        <span>© 2026 Giuggiola's Think — Tutti i diritti riservati.</span>
        <span>Fatto con cura.</span>
      </div>
    </footer>
  )
}

/* ---------- Article reader ---------- */

export function ArticleView({ article, go, related, onOpen }) {
  useEffect(() => { window.scrollTo(0, 0) }, [article.id])

  return (
    <article className="reader">
      <button className="reader__back" onClick={() => go('pensieri')}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H6M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Tutti i pensieri
      </button>
      <div className="reader__head">
        <div className="reader__meta">
          <Kicker>{article.kicker}</Kicker>
          <span className="card__dot" />
          <span>{article.date}</span>
          <span className="card__dot" />
          <span>{article.read} di lettura</span>
        </div>
        <h1 className="reader__title">{article.title}</h1>
        <p className="reader__lede">{article.preview}</p>
      </div>
      <div className="reader__body">
        {article.body.map((p, i) => <p key={i}>{p}</p>)}
        <p className="reader__sign">— G.</p>
      </div>

      {related.length > 0 && (
        <div className="reader__related">
          <Kicker>Continua a leggere</Kicker>
          <div className="reader__related-grid">
            {related.map((a, i) => (
              <ArticleCard key={a.id} article={a} index={i} onOpen={() => onOpen(a)} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

/* ---------- Purchase modal ---------- */

export function PurchaseModal({ book, onClose, onConfirm }) {
  const [stage, setStage] = useState('form')
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!book) return null

  const submit = (e) => {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setErr("Inserisci un'email valida per ricevere l'ebook.")
      return
    }
    setErr('')
    setStage('processing')
    setTimeout(() => { setStage('done'); onConfirm(book) }, 1100)
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__card" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Chiudi">✕</button>

        {stage !== 'done' ? (
          <div className="modal__grid">
            <div className="modal__left">
              <BookCover book={book} small />
            </div>
            <div className="modal__right">
              <Kicker>{book.genre} · ebook</Kicker>
              <h3 className="modal__title">{book.title}</h3>
              <p className="modal__blurb">{book.blurb}</p>
              <div className="modal__row">
                <span>Formato</span><span>EPUB + PDF</span>
              </div>
              <div className="modal__row">
                <span>Consegna</span><span>Subito via email</span>
              </div>
              <div className="modal__row modal__row--total">
                <span>Totale</span><span>€ {book.price}</span>
              </div>
              <form onSubmit={submit} className="modal__form">
                <label>La tua email</label>
                <input type="email" placeholder="nome@email.it" value={email}
                  onChange={(e) => setEmail(e.target.value)} />
                {err && <span className="modal__err">{err}</span>}
                <button type="submit" className="btn btn--solid btn--block"
                  disabled={stage === 'processing'}>
                  {stage === 'processing' ? 'Elaborazione…' : `Acquista · € ${book.price}`}
                </button>
                <span className="modal__fine">
                  Pagamento sicuro · Soddisfatti o rimborsati entro 14 giorni
                </span>
              </form>
            </div>
          </div>
        ) : (
          <div className="modal__done">
            <div className="modal__check" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="modal__title">Grazie di cuore.</h3>
            <p className="modal__blurb">
              Ho inviato <strong>{book.title}</strong> a <strong>{email}</strong>.
              Spero che queste pagine ti facciano un po' di compagnia.
            </p>
            <button className="btn btn--solid" onClick={onClose}>Torna ai libri</button>
          </div>
        )}
      </div>
    </div>
  )
}
