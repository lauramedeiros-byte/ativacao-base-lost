import { useState, useEffect, useRef, useCallback, useReducer } from 'react'

// ─── Card definitions ──────────────────────────────────────────────────────────
const CARDS = {
  sz_timing:    { l: 'Timing', s: 'sz' },
  sz_conc:      { l: 'Concorrência', s: 'sz' },
  sz_corretor:  { l: 'Corretor/Imobiliária', s: 'sz' },
  sz_juridico:  { l: 'Perfil — Jurídico', s: 'sz' },
  sz_dup:       { l: 'Duplicado/Erro', s: 'sz' },
  sz_contato:   { l: 'Contato Inválido', s: 'sz' },
  sz_lgpd:      { l: 'LGPD', s: 'sz' },
  sz_hospede:   { l: 'Hóspede', s: 'sz' },
  sz_moradia:   { l: 'Perfil — Interesse em Moradia', s: 'sz' },
  sz_fgts:      { l: 'Perfil — FGTS/Financiamento', s: 'sz' },
  sz_pgto:      { l: 'Perfil — Forma de Pagamento', s: 'sz' },
  sz_entrada:   { l: 'Perfil — Valor de Entrada', s: 'sz' },
  sz_total:     { l: 'Perfil — Valor Total', s: 'sz' },
  sz_tam:       { l: 'Perfil — Tamanho', s: 'sz' },
  sz_garagem:   { l: 'Perfil — Garagem', s: 'sz' },
  sz_prazo:     { l: 'Perfil — Prazo de Entrega', s: 'sz' },
  sz_spe:       { l: 'Perfil — SPE', s: 'sz' },
  sz_cota:      { l: 'Cota Indisponível', s: 'sz' },
  sz_outra_cota:{ l: 'Seguiu com Outra Cota', s: 'sz' },
  sz_catch:     { l: 'Perfil — (descrição obrigatória)', s: 'sz' },
  sz_mkt:       { l: 'Encaminhado p/ Marketplace', s: 'sz' },
  sz_szs:       { l: 'Encaminhado p/ SZS', s: 'sz' },
  sz_decor_enc: { l: 'Encaminhado p/ Decor', s: 'sz' },
  sz_lanc_enc:  { l: 'Encaminhado p/ Lançamento', s: 'sz' },
  sz_cly:       { l: 'Encaminhado p/ Customer Loyalty', s: 'sz' },
  sz_enxoval:   { l: 'Enxoval', s: 'sz' },
  sz_taxa_adm:  { l: 'Taxa de Administração', s: 'sz' },
  sz_taxa_imp:  { l: 'Taxa de Implantação', s: 'sz' },
  sz_vendeu:    { l: 'Vendeu Imóvel', s: 'sz' },
  sz_regiao:    { l: 'Região Não Atendida', s: 'sz' },
  sz_anfitriao: { l: 'Quer ser Anfitrião → Franquias', s: 'sz' },
  sz_dcap:      { l: '[Decor] Chamada de Capital', s: 'sz' },
  sz_dproj:     { l: '[Decor] Projeto', s: 'sz' },
  sz_dobras:    { l: '[Decor] Spot/B2B Obras', s: 'sz' },
  sz_efut:      { l: '[Expansão] Lançamento Futuro', s: 'sz' },
  sz_esem:      { l: '[Expansão] Sem Lançamento Previsto', s: 'sz' },
  sz_icond:     { l: 'Imóvel fora Perfil — Condomínio', s: 'sz' },
  sz_idesc:     { l: 'Imóvel fora Perfil — Descrição', s: 'sz' },
  sz_iitens:    { l: 'Imóvel fora Perfil — Itens Obrigatórios', s: 'sz' },
  sz_mora:      { l: 'Perfil — Mora no Imóvel/Alugado', s: 'sz' },
  sz_b2b:       { l: 'Lead B2B sem Perfil', s: 'sz' },
  sz_parceiro:  { l: 'Parceiro fora do Perfil', s: 'sz' },
  sz_cliente:   { l: 'Já é Cliente', s: 'sz' },
  sz_resgate:   { l: 'Perdido em Resgate Parceiros', s: 'sz' },
  mk_naoresp:   { l: 'Não atende / Não responde', s: 'mk' },
  mk_origem:    { l: 'Não reconhece a Origem', s: 'mk' },
  mk_parou:     { l: 'Parou de Responder', s: 'mk' },
  mk_timing:    { l: 'Timing', s: 'mk' },
  mk_conc:      { l: 'Concorrência', s: 'mk' },
  mk_corretor:  { l: 'Corretor/Imobiliária', s: 'mk' },
  mk_loc:       { l: 'Localização do Spot', s: 'mk' },
  mk_moradia:   { l: 'Perfil — Interesse em Moradia', s: 'mk' },
  mk_prazo:     { l: 'Perfil — Prazo de Entrega', s: 'mk' },
  mk_cond:      { l: 'Perfil — Condições de Pagamento', s: 'mk' },
  mk_entrada:   { l: 'Perfil — Valor Mínimo Entrada', s: 'mk' },
  mk_total:     { l: 'Perfil — Valor Total', s: 'mk' },
  mk_juridico:  { l: 'Perfil — Jurídico', s: 'mk' },
  mk_tam:       { l: 'Perfil — Tamanho', s: 'mk' },
  mk_spe:       { l: 'Perfil — SPE', s: 'mk' },
  mk_catch:     { l: 'Perfil — (descrição obrigatória)', s: 'mk' },
  mk_dup:       { l: 'Duplicado/Erro', s: 'mk' },
  mk_lanc:      { l: 'Encaminhado p/ Lançamentos', s: 'mk' },
}

const DEFAULT_GROUPS = [
  { id: 'g1',  label: 'Timing / Momento',               cards: ['sz_timing','mk_timing'] },
  { id: 'g2',  label: 'Concorrência',                    cards: ['sz_conc','mk_conc'] },
  { id: 'g3',  label: 'Corretor / Imobiliária',          cards: ['sz_corretor','mk_corretor'] },
  { id: 'g4',  label: 'Jurídico / Contratual',           cards: ['sz_juridico','mk_juridico'] },
  { id: 'g5',  label: 'Duplicado / Erro Admin',          cards: ['sz_dup','mk_dup'] },
  { id: 'g6',  label: 'Sem Contato / Inatingível',       cards: ['sz_contato','mk_naoresp','mk_parou','mk_origem'] },
  { id: 'g7',  label: 'Perfil — Financeiro',             cards: ['sz_fgts','sz_pgto','sz_entrada','sz_total','mk_cond','mk_entrada','mk_total'] },
  { id: 'g8',  label: 'Perfil — Produto / Características', cards: ['sz_tam','sz_garagem','sz_prazo','sz_spe','sz_cota','sz_outra_cota','mk_tam','mk_prazo','mk_spe','mk_loc'] },
  { id: 'g9',  label: 'Perfil — Intenção Incompatível',  cards: ['sz_moradia','sz_hospede','sz_lgpd','sz_mora','mk_moradia'] },
  { id: 'g10', label: 'Redirecionamento Interno',        cards: ['sz_mkt','sz_szs','sz_decor_enc','sz_lanc_enc','sz_cly','sz_anfitriao','mk_lanc'] },
  { id: 'g11', label: 'Catch-all / Descrição Obrigatória', cards: ['sz_catch','mk_catch'] },
  { id: 'g12', label: 'Imóvel fora do Perfil SZS',       cards: ['sz_icond','sz_idesc','sz_iitens'] },
  { id: 'g13', label: 'Taxas / Custos Operacionais',     cards: ['sz_enxoval','sz_taxa_adm','sz_taxa_imp'] },
  { id: 'g14', label: 'Exclusivo — Decor',               cards: ['sz_dcap','sz_dproj','sz_dobras'] },
  { id: 'g15', label: 'Exclusivo — Expansão / B2B',      cards: ['sz_efut','sz_esem','sz_b2b','sz_parceiro','sz_cliente','sz_resgate'] },
  { id: 'g16', label: 'Sem Grupo',                       cards: ['sz_vendeu','sz_regiao'] },
]

// ─── Colours ───────────────────────────────────────────────────────────────────
const C = {
  blue: '#1d4ed8', blueSoft: '#eff6ff', blueBorder: '#bfdbfe',
  border: '#e2e8f0', borderHover: '#94a3b8',
  szBg: '#FAECE7', szBorder: '#F5C4B3', szText: '#993C1D', szBadge: '#F0997B', szBadgeText: '#4A1B0C',
  mkBg: '#E6F1FB', mkBorder: '#B5D4F4', mkText: '#185FA5', mkBadge: '#85B7EB', mkBadgeText: '#042C53',
  surface: '#fff', surfaceAlt: '#f8fafc',
}

// ─── Tag input with autocomplete ──────────────────────────────────────────────
function TagInput({ allTags, onAdd }) {
  const [val, setVal] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const handleChange = (e) => {
    const v = e.target.value
    setVal(v)
    if (v.trim().length > 0) {
      const matches = allTags.filter(t => t.toLowerCase().includes(v.toLowerCase()))
      setSuggestions(matches)
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const add = (tag) => {
    const t = tag.trim()
    if (!t) return
    onAdd(t)
    setVal('')
    setOpen(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); add(val) }
    if (e.key === 'Escape') { setOpen(false) }
  }

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1 }}>
      <input
        value={val}
        onChange={handleChange}
        onKeyDown={handleKey}
        onFocus={() => val && setOpen(true)}
        placeholder="Adicionar tag de etapa..."
        style={{
          width: '100%', padding: '5px 10px', border: `1px solid ${C.border}`,
          borderRadius: 6, fontSize: 12, outline: 'none', background: C.surface,
        }}
      />
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,.1)', marginTop: 2, maxHeight: 160, overflowY: 'auto',
        }}>
          {suggestions.length > 0 && suggestions.map(t => (
            <div
              key={t}
              onMouseDown={() => add(t)}
              style={{
                padding: '7px 12px', fontSize: 12, cursor: 'pointer', color: C.blue,
                borderBottom: `1px solid ${C.border}`,
              }}
              onMouseOver={e => e.currentTarget.style.background = C.blueSoft}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >
              {t}
            </div>
          ))}
          {val.trim() && !allTags.includes(val.trim()) && (
            <div
              onMouseDown={() => add(val)}
              style={{ padding: '7px 12px', fontSize: 12, cursor: 'pointer', color: '#64748b' }}
              onMouseOver={e => e.currentTarget.style.background = C.surfaceAlt}
              onMouseOut={e => e.currentTarget.style.background = ''}
            >
              Criar tag <strong style={{ color: C.blue }}>"{val.trim()}"</strong>
            </div>
          )}
          {suggestions.length === 0 && !val.trim() && (
            <div style={{ padding: '7px 12px', fontSize: 12, color: '#94a3b8' }}>
              Nenhuma tag encontrada
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Single message editor ────────────────────────────────────────────────────
function MessageEditor({ msg, allTags, onChange, onDelete, onAddTag }) {
  const isEmail = msg.type === 'email'
  const typeColor = isEmail ? { bg: '#f0fdf4', border: '#86efac', text: '#15803d' } : { bg: '#fff7ed', border: '#fdba74', text: '#c2410c' }

  return (
    <div style={{
      border: `1px solid ${typeColor.border}`, borderRadius: 10,
      background: typeColor.bg, padding: 12, marginBottom: 10,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{
          padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
          background: typeColor.border, color: typeColor.text, flexShrink: 0,
        }}>
          {isEmail ? '✉ E-mail' : '💬 WhatsApp'}
        </span>
        <span style={{ fontSize: 11, color: '#94a3b8', flex: 1 }}>
          {msg.tags.length > 0 ? msg.tags.map(t => (
            <span key={t} style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              background: C.blueSoft, color: C.blue, border: `1px solid ${C.blueBorder}`,
              borderRadius: 99, padding: '1px 7px', fontSize: 11, marginRight: 4, marginBottom: 2,
            }}>
              {t}
              <button
                onClick={() => onChange({ ...msg, tags: msg.tags.filter(x => x !== t) })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.blue, padding: 0, fontSize: 12, lineHeight: 1 }}
              >×</button>
            </span>
          )) : <span style={{ color: '#cbd5e1' }}>sem tags</span>}
        </span>
        <button
          onClick={() => onDelete(msg.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18, lineHeight: 1, padding: '0 2px' }}
          title="Remover mensagem"
        >×</button>
      </div>

      {/* Subject (email only) */}
      {isEmail && (
        <input
          value={msg.subject || ''}
          onChange={e => onChange({ ...msg, subject: e.target.value })}
          placeholder="Assunto do e-mail..."
          style={{
            width: '100%', padding: '6px 10px', border: `1px solid ${C.border}`,
            borderRadius: 6, fontSize: 12, marginBottom: 8, outline: 'none', background: C.surface,
          }}
        />
      )}

      {/* Content */}
      <textarea
        value={msg.content}
        onChange={e => onChange({ ...msg, content: e.target.value })}
        placeholder={isEmail ? 'Corpo do e-mail...' : 'Mensagem WhatsApp...'}
        rows={4}
        style={{
          width: '100%', padding: '7px 10px', border: `1px solid ${C.border}`,
          borderRadius: 6, fontSize: 12, resize: 'vertical', outline: 'none',
          background: C.surface, lineHeight: 1.5,
        }}
      />

      {/* Tag input */}
      <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
        <TagInput
          allTags={allTags}
          onAdd={tag => {
            if (!msg.tags.includes(tag)) onChange({ ...msg, tags: [...msg.tags, tag] })
            onAddTag(tag)
          }}
        />
      </div>
    </div>
  )
}

// ─── Messages panel ───────────────────────────────────────────────────────────
function MessagesPanel({ groupId, messages, allTags, onChange, onAddTag }) {
  const msgs = messages[groupId] || []
  const msgCtr = useRef(Date.now())

  const addMsg = (type) => {
    const newMsg = { id: `msg_${msgCtr.current++}`, type, content: '', subject: '', tags: [] }
    onChange({ ...messages, [groupId]: [...msgs, newMsg] })
  }

  const updateMsg = (updated) => {
    onChange({ ...messages, [groupId]: msgs.map(m => m.id === updated.id ? updated : m) })
  }

  const deleteMsg = (id) => {
    onChange({ ...messages, [groupId]: msgs.filter(m => m.id !== id) })
  }

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 12px 4px', background: '#fafbff' }}>
      {msgs.length === 0 && (
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10, textAlign: 'center' }}>
          Nenhuma mensagem neste grupo ainda.
        </p>
      )}
      {msgs.map(msg => (
        <MessageEditor
          key={msg.id}
          msg={msg}
          allTags={allTags}
          onChange={updateMsg}
          onDelete={deleteMsg}
          onAddTag={onAddTag}
        />
      ))}
      <div style={{ display: 'flex', gap: 6, paddingBottom: 8 }}>
        <button onClick={() => addMsg('email')} style={btnStyle('#f0fdf4', '#86efac', '#15803d')}>
          + E-mail
        </button>
        <button onClick={() => addMsg('whatsapp')} style={btnStyle('#fff7ed', '#fdba74', '#c2410c')}>
          + WhatsApp
        </button>
      </div>
    </div>
  )
}

function btnStyle(bg, border, text) {
  return {
    padding: '5px 12px', borderRadius: 7, border: `1px solid ${border}`,
    background: bg, color: text, fontSize: 12, fontWeight: 500, cursor: 'pointer',
  }
}

// ─── Group box ─────────────────────────────────────────────────────────────────
function GroupBox({
  group, dragging, dragFrom,
  onDragStart, onDragEnd, onDrop,
  onRename, onDelete,
  messages, allTags, onMessagesChange, onAddTag,
}) {
  const [over, setOver] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameVal, setRenameVal] = useState(group.label)
  const [showMsgs, setShowMsgs] = useState(false)
  const renameRef = useRef(null)

  useEffect(() => { if (renaming && renameRef.current) { renameRef.current.focus(); renameRef.current.select() } }, [renaming])

  const finishRename = () => { onRename(group.id, renameVal.trim() || group.label); setRenaming(false) }
  const msgCount = (messages[group.id] || []).length

  return (
    <div
      style={{
        background: C.surface, border: `1.5px solid ${over ? C.blue : C.border}`,
        borderRadius: 10, display: 'flex', flexDirection: 'column',
        transition: 'border-color .15s', boxShadow: over ? '0 0 0 3px #bfdbfe55' : 'none',
      }}
      onDragOver={e => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={() => { setOver(false); onDrop(group.id) }}
    >
      {/* Header */}
      <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${C.border}`, background: C.surfaceAlt, borderRadius: '9px 9px 0 0' }}>
        {renaming ? (
          <input
            ref={renameRef}
            value={renameVal}
            onChange={e => setRenameVal(e.target.value)}
            onBlur={finishRename}
            onKeyDown={e => { if (e.key === 'Enter') finishRename(); if (e.key === 'Escape') { setRenaming(false); setRenameVal(group.label) } }}
            style={{ flex: 1, fontSize: 11, fontWeight: 500, padding: '2px 6px', border: `1px solid ${C.blue}`, borderRadius: 4, outline: 'none', background: C.surface, textTransform: 'uppercase', letterSpacing: '.05em', color: '#64748b', fontFamily: 'inherit' }}
          />
        ) : (
          <span
            onClick={() => { setRenaming(true); setRenameVal(group.label) }}
            title="Clique para renomear"
            style={{ flex: 1, fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {group.label}
          </span>
        )}
        <span style={{ fontSize: 10, color: '#94a3b8', background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 99, padding: '1px 6px', flexShrink: 0 }}>
          {group.cards.length}
        </span>
        <button
          onClick={() => onDelete(group.id)}
          title="Remover grupo"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', fontSize: 14, lineHeight: 1, padding: '0 2px', flexShrink: 0 }}
          onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
          onMouseOut={e => e.currentTarget.style.color = '#cbd5e1'}
        >×</button>
      </div>

      {/* Cards */}
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4, minHeight: 36 }}>
        {group.cards.map(cid => {
          const card = CARDS[cid]
          if (!card) return null
          const isSz = card.s === 'sz'
          const isDragging = dragging === cid
          return (
            <div
              key={cid}
              draggable
              onDragStart={() => onDragStart(cid, group.id)}
              onDragEnd={onDragEnd}
              style={{
                padding: '5px 7px', borderRadius: 5, fontSize: 11, lineHeight: 1.35,
                cursor: 'grab', display: 'flex', alignItems: 'flex-start', gap: 5,
                userSelect: 'none', opacity: isDragging ? .3 : 1, transition: 'opacity .15s',
                background: isSz ? C.szBg : C.mkBg,
                border: `1px solid ${isSz ? C.szBorder : C.mkBorder}`,
                color: isSz ? C.szText : C.mkText,
              }}
            >
              <span style={{
                fontSize: 9, fontWeight: 700, flexShrink: 0, padding: '1px 3px',
                borderRadius: 2, marginTop: 1, letterSpacing: '.02em',
                background: isSz ? C.szBadge : C.mkBadge,
                color: isSz ? C.szBadgeText : C.mkBadgeText,
              }}>
                {isSz ? 'SZ' : 'MK'}
              </span>
              <span>{card.l}</span>
            </div>
          )
        })}
      </div>

      {/* Messages toggle */}
      <button
        onClick={() => setShowMsgs(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '7px 12px', fontSize: 11, fontWeight: 500, cursor: 'pointer',
          background: 'none', border: 'none', borderTop: `1px solid ${C.border}`,
          color: msgCount > 0 ? C.blue : '#94a3b8', width: '100%', textAlign: 'left',
        }}
      >
        <span>
          {showMsgs ? '▾' : '▸'} &nbsp;
          {msgCount > 0 ? `${msgCount} mensagem${msgCount > 1 ? 's' : ''}` : 'Mensagens'}
        </span>
        {msgCount > 0 && (
          <span style={{ background: C.blueSoft, color: C.blue, border: `1px solid ${C.blueBorder}`, borderRadius: 99, padding: '1px 6px', fontSize: 10 }}>
            {msgCount}
          </span>
        )}
      </button>

      {showMsgs && (
        <MessagesPanel
          groupId={group.id}
          messages={messages}
          allTags={allTags}
          onChange={onMessagesChange}
          onAddTag={onAddTag}
        />
      )}
    </div>
  )
}

// ─── Main board ────────────────────────────────────────────────────────────────
export default function Board() {
  const [groups, setGroups] = useState(null)
  const [messages, setMessages] = useState({})
  const [allTags, setAllTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState(false)
  const [dragging, setDragging] = useState(null)
  const [dragFrom, setDragFrom] = useState(null)
  const gctr = useRef(17)
  const saveTimer = useRef(null)
  const stateRef = useRef({ groups: null, messages: {}, tags: [] })

  // ── Load from API ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/board')
      .then(r => r.json())
      .then(d => {
        const g = d.groups || DEFAULT_GROUPS
        const m = d.messages || {}
        const t = d.tags || []
        setGroups(g); setMessages(m); setAllTags(t)
        stateRef.current = { groups: g, messages: m, tags: t }
        setLoading(false)
      })
      .catch(() => {
        setGroups(DEFAULT_GROUPS); setLoading(false)
      })
  }, [])

  // ── Debounced save ────────────────────────────────────────────────────────
  const scheduleSave = useCallback(() => {
    setSaving(true); setSaveErr(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      try {
        const r = await fetch('/api/board', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stateRef.current),
        })
        if (!r.ok) throw new Error()
        setSaving(false)
      } catch {
        setSaving(false); setSaveErr(true)
      }
    }, 1400)
  }, [])

  const updateGroups = useCallback((g) => {
    setGroups(g); stateRef.current = { ...stateRef.current, groups: g }; scheduleSave()
  }, [scheduleSave])

  const updateMessages = useCallback((m) => {
    setMessages(m); stateRef.current = { ...stateRef.current, messages: m }; scheduleSave()
  }, [scheduleSave])

  const addTag = useCallback((tag) => {
    setAllTags(prev => {
      if (prev.includes(tag)) return prev
      const next = [...prev, tag]
      stateRef.current = { ...stateRef.current, tags: next }
      scheduleSave()
      return next
    })
  }, [scheduleSave])

  // ── Drag and drop ─────────────────────────────────────────────────────────
  const handleDragStart = useCallback((cid, gid) => {
    setDragging(cid); setDragFrom(gid)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDragging(null); setDragFrom(null)
  }, [])

  const handleDrop = useCallback((toGid) => {
    if (!dragging || !dragFrom || dragFrom === toGid) return
    const g = stateRef.current.groups
    const from = g.find(x => x.id === dragFrom)
    const to = g.find(x => x.id === toGid)
    if (!from || !to) return
    const next = g.map(gr => {
      if (gr.id === dragFrom) return { ...gr, cards: gr.cards.filter(c => c !== dragging) }
      if (gr.id === toGid && !gr.cards.includes(dragging)) return { ...gr, cards: [...gr.cards, dragging] }
      return gr
    })
    updateGroups(next)
    setDragging(null); setDragFrom(null)
  }, [dragging, dragFrom, updateGroups])

  // ── Group management ──────────────────────────────────────────────────────
  const renameGroup = useCallback((gid, label) => {
    updateGroups(stateRef.current.groups.map(g => g.id === gid ? { ...g, label } : g))
  }, [updateGroups])

  const deleteGroup = useCallback((gid) => {
    const g = stateRef.current.groups.find(x => x.id === gid)
    if (!g) return
    const hasCards = g.cards.length > 0
    if (hasCards && !confirm(`Remover o grupo "${g.label}"? Os cards serão movidos para "Sem Grupo".`)) return
    let next = stateRef.current.groups.filter(x => x.id !== gid)
    if (hasCards) {
      next = next.map(x => x.id === 'g16' ? { ...x, cards: [...x.cards, ...g.cards] } : x)
    }
    updateGroups(next)
  }, [updateGroups])

  const addGroup = useCallback(() => {
    const newGroup = { id: `g${gctr.current++}`, label: 'Novo grupo', cards: [] }
    updateGroups([...stateRef.current.groups, newGroup])
  }, [updateGroups])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading || !groups) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }}>
        Carregando board...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '20px 16px 48px' }}>
      {/* ── Header ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: '#1e293b' }}>
            Motivos de Lost — Board
          </div>
          <div style={{ display: 'flex', gap: 8, flex: 1, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b' }}>
              <span style={{ background: '#FAECE7', color: '#993C1D', border: '1px solid #F5C4B3', padding: '2px 7px', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>SZ</span>
              Lançamentos
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#64748b' }}>
              <span style={{ background: '#E6F1FB', color: '#185FA5', border: '1px solid #B5D4F4', padding: '2px 7px', borderRadius: 3, fontSize: 10, fontWeight: 700 }}>MK</span>
              Marketplace
            </span>
          </div>
          <span style={{ fontSize: 12, color: saving ? '#f59e0b' : saveErr ? '#ef4444' : '#10b981', fontWeight: 500 }}>
            {saving ? '⟳ Salvando...' : saveErr ? '✕ Erro ao salvar' : '✓ Salvo'}
          </span>
          <button
            onClick={addGroup}
            style={{ padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${C.blue}`, background: C.blueSoft, color: C.blue, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            + Novo grupo
          </button>
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
          Arraste os cards entre grupos • Clique no nome do grupo para renomear • Clique em "Mensagens" para adicionar e-mails e WhatsApps segmentados
        </p>
      </div>

      {/* ── Board grid ── */}
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12, alignItems: 'start',
      }}>
        {groups.map(group => (
          <GroupBox
            key={group.id}
            group={group}
            dragging={dragging}
            dragFrom={dragFrom}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onRename={renameGroup}
            onDelete={deleteGroup}
            messages={messages}
            allTags={allTags}
            onMessagesChange={updateMessages}
            onAddTag={addTag}
          />
        ))}
      </div>
    </div>
  )
}
