import { useState, useRef, useCallback, useEffect } from 'react'

export function useTweaks(defaults) {
  const [values, setValues] = useState(defaults)
  const setTweak = useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val }
    setValues((prev) => ({ ...prev, ...edits }))
  }, [])
  return [values, setTweak]
}

export function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = useState(false)
  const dragRef = useRef(null)
  const offsetRef = useRef({ x: 16, y: 16 })
  const PAD = 16

  const clamp = useCallback(() => {
    const panel = dragRef.current
    if (!panel) return
    const w = panel.offsetWidth, h = panel.offsetHeight
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD)
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD)
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    }
    panel.style.right = offsetRef.current.x + 'px'
    panel.style.bottom = offsetRef.current.y + 'px'
  }, [])

  useEffect(() => {
    if (!open) return
    clamp()
    window.addEventListener('resize', clamp)
    return () => window.removeEventListener('resize', clamp)
  }, [open, clamp])

  const onDragStart = (e) => {
    const panel = dragRef.current
    if (!panel) return
    const r = panel.getBoundingClientRect()
    const sx = e.clientX, sy = e.clientY
    const startRight = window.innerWidth - r.right
    const startBottom = window.innerHeight - r.bottom
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      }
      clamp()
    }
    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  if (!open) {
    return (
      <button className="twk-open-btn" onClick={() => setOpen(true)}>
        ✦ Tweaks
      </button>
    )
  }

  return (
    <div ref={dragRef} className="twk-panel"
         style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
      <div className="twk-hd" onMouseDown={onDragStart}>
        <b>{title}</b>
        <button className="twk-x" aria-label="Chiudi tweaks"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => setOpen(false)}>✕</button>
      </div>
      <div className="twk-body">{children}</div>
    </div>
  )
}

export function TweakSection({ label }) {
  return <div className="twk-sect">{label}</div>
}

function TweakRow({ label, children }) {
  return (
    <div className="twk-row">
      <div className="twk-lbl"><span>{label}</span></div>
      {children}
    </div>
  )
}

export function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  )
}

export function TweakRadio({ label, value, options, onChange }) {
  const n = options.length
  const idx = Math.max(0, options.indexOf(value))
  return (
    <TweakRow label={label}>
      <div className="twk-seg">
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {options.map((o) => (
          <button key={o} type="button" role="radio" aria-checked={o === value}
                  onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    </TweakRow>
  )
}

export function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </TweakRow>
  )
}

export function TweakColor({ label, value, options, onChange }) {
  const key = (o) => String(o).toLowerCase()
  const cur = key(value)
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const on = key(o) === cur
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    style={{ background: o }}
                    onClick={() => onChange(o)}>
              {on && (
                <svg viewBox="0 0 14 14" aria-hidden="true" style={{position:'absolute',top:6,left:6,width:13,height:13,filter:'drop-shadow(0 1px 1px rgba(0,0,0,.3))'}}>
                  <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round" stroke="#fff" />
                </svg>
              )}
            </button>
          )
        })}
      </div>
    </TweakRow>
  )
}
