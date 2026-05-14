import { useState, useEffect, useRef, useCallback } from 'react'

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

// ─── Colours ───────────────────────────────────────────────────────────────────
const C = {
  blue: '#1d4ed8', blueSoft: '#eff6ff', blueBorder: '#bfdbfe',
  border: '#e2e8f0', borderHover: '#94a3b8',
  szBg: '#FAECE7', szBorder: '#F5C4B3', szText: '#993C1D', szBadge: '#F0997B', szBadgeText: '#4A1B0C',
  mkBg: '#E6F1FB', mkBorder: '#B5D4F4', mkText: '#185FA5', mkBadge: '#85B7EB', mkBadgeText: '#042C53',
  surface: '#fff', surfaceAlt: '#f8fafc',
  sectionFazer: '#059669', sectionFazerBg: '#ecfdf5', sectionFazerBorder: '#6ee7b7',
  sectionNaoFazer: '#64748b', sectionNaoFazerBg: '#f1f5f9', sectionNaoFazerBorder: '#cbd5e1',
  curtoBg: '#fffbeb', curtoBorder: '#fcd34d', curtoColor: '#b45309',
  longoBg: '#eff6ff', longoBorder: '#93c5fd', longoColor: '#1e40af',
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

// ─── Drag handle for message reorder ─────────────────────────────────────────
function DragHandle({ style }) {
  return (
    <div style={{ cursor: 'grab', color: '#cbd5e1', fontSize: 16, padding: '0 4px', flexShrink: 0, userSelect: 'none', ...style }}
      title="Arraste para reordenar"
    >
      ⠿
    </div>
  )
}

// ─── Single message editor ────────────────────────────────────────────────────
function MessageEditor({ msg, allTags, onChange, onDelete, onAddTag }) {
  const isEmail = msg.type === 'email'
  const typeColor = isEmail ? { bg: '#f0fdf4', border: '#86efac', text: '#15803d' } : { bg: '#fff7ed', border: '#fdba74', text: '#c2410c' }
  const [showComment, setShowComment] = useState(!!msg.comment)
  const [imagePreview, setImagePreview] = useState(msg.image || null)
  const fileRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const b64 = ev.target.result
      setImagePreview(b64)
      onChange({ ...msg, image: b64 })
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    onChange({ ...msg, image: null })
  }

  return (
    <div style={{
      border: `1px solid ${typeColor.border}`, borderRadius: 10,
      background: typeColor.bg, padding: 12, marginBottom: 10,
    }}>
      {/* Header row with drag handle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <DragHandle />
        <span style={{
          padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
          background: typeColor.border, color: typeColor.text, flexShrink: 0,
        }}>
          {isEmail ? '✉ E-mail' : '💬 WhatsApp'}
        </span>
        <span style={{ fontSize: 11, color: '#94a3b8', flex: 1, display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
          {msg.comment && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047',
              borderRadius: 99, padding: '1px 7px', fontSize: 11, cursor: 'pointer',
            }}
              onClick={() => setShowComment(v => !v)}
              title="Ver comentário"
            >
              💬 {msg.comment.slice(0, 30)}{msg.comment.length > 30 ? '...' : ''}
            </span>
          )}
        </span>
        <button
          onClick={() => onDelete(msg.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 18, lineHeight: 1, padding: '0 2px', flexShrink: 0 }}
          title="Remover mensagem"
        >×</button>
      </div>

      {/* Subject (email only) */}
      {isEmail && (
        <div style={{ marginBottom: 8 }}>
          <input
            value={msg.subject || ''}
            onChange={e => onChange({ ...msg, subject: e.target.value })}
            placeholder="Assunto do e-mail..."
            style={{
              width: '100%', display: 'block',
              padding: '6px 10px',
              border: `1px solid ${C.border}`,
              borderRadius: 6, fontSize: 12, outline: 'none', background: C.surface,
              boxSizing: 'border-box',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              minWidth: 0,
            }}
          />
        </div>
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
          background: C.surface, lineHeight: 1.5, boxSizing: 'border-box',
        }}
      />

      {/* Image preview */}
      {imagePreview && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 8 }}>
          <img src={imagePreview} alt="Imagem da mensagem" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 6, border: `1px solid ${C.border}` }} />
          <div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Imagem anexada</div>
            <button
              onClick={removeImage}
              style={{ marginTop: 4, padding: '3px 10px', borderRadius: 6, border: `1px solid #fca5a5`, background: '#fef2f2', color: '#dc2626', fontSize: 11, cursor: 'pointer' }}
            >
              Remover imagem
            </button>
          </div>
        </div>
      )}

      {/* Actions row: image upload + comment toggle */}
      <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => fileRef.current?.click()}
          style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid #cbd5e1`, background: C.surface, color: '#64748b', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          title="Inserir imagem"
        >
          🖼️ Imagem
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

        <button
          onClick={() => setShowComment(v => !v)}
          style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid #cbd5e1`, background: msg.comment ? '#fef9c3' : C.surface, color: msg.comment ? '#854d0e' : '#64748b', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          {msg.comment ? '💬 Ver comentário' : '💬 Comentar'}
        </button>
      </div>

      {/* Comment area */}
      {showComment && (
        <div style={{ marginTop: 8 }}>
          <textarea
            value={msg.comment || ''}
            onChange={e => onChange({ ...msg, comment: e.target.value })}
            placeholder="Adicione um comentário sobre esta mensagem (ex: ajustar texto, mudar tom, referência da Laura...)"
            rows={2}
            style={{
              width: '100%', padding: '7px 10px', border: `1px solid #fde047`,
              borderRadius: 6, fontSize: 12, resize: 'vertical', outline: 'none',
              background: '#fef9c3', lineHeight: 1.5, boxSizing: 'border-box',
              color: '#854d0e',
            }}
          />
        </div>
      )}
    </div>
  )
}

// ─── Messages panel with drag-to-reorder ─────────────────────────────────────
function MessagesPanel({ groupId, messages, allTags, onChange, onAddTag }) {
  const msgs = messages[groupId] || []
  const msgCtr = useRef(Date.now())
  const [dragMsg, setDragMsg] = useState(null)

  const addMsg = (type) => {
    const newMsg = { id: `msg_${msgCtr.current++}`, type, content: '', subject: '', tags: [], comment: '', image: null }
    onChange({ ...messages, [groupId]: [...msgs, newMsg] })
  }

  const updateMsg = (updated) => {
    onChange({ ...messages, [groupId]: msgs.map(m => m.id === updated.id ? updated : m) })
  }

  const deleteMsg = (id) => {
    onChange({ ...messages, [groupId]: msgs.filter(m => m.id !== id) })
  }

  const handleMsgDragStart = (msgId) => setDragMsg(msgId)
  const handleMsgDragEnd = () => setDragMsg(null)

  const handleMsgDrop = (targetId) => {
    if (!dragMsg || dragMsg === targetId) { setDragMsg(null); return }
    const arr = [...msgs]
    const fromIdx = arr.findIndex(m => m.id === dragMsg)
    const toIdx = arr.findIndex(m => m.id === targetId)
    if (fromIdx === -1 || toIdx === -1) { setDragMsg(null); return }
    const [moved] = arr.splice(fromIdx, 1)
    arr.splice(toIdx, 0, moved)
    onChange({ ...messages, [groupId]: arr })
    setDragMsg(null)
  }

  return (
    <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 12px 4px', background: '#fafbff' }}>
      {msgs.length === 0 && (
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 10, textAlign: 'center' }}>
          Nenhuma mensagem neste grupo ainda. Adicione abaixo.
        </p>
      )}
      {msgs.map((msg, idx) => (
        <div
          key={msg.id}
          draggable
          onDragStart={() => handleMsgDragStart(msg.id)}
          onDragEnd={handleMsgDragEnd}
          onDragOver={e => { e.preventDefault(); e.stopPropagation() }}
          onDrop={e => { e.preventDefault(); e.stopPropagation(); handleMsgDrop(msg.id) }}
          style={{ opacity: dragMsg === msg.id ? 0.4 : 1, transition: 'opacity .15s' }}
        >
          <MessageEditor
            msg={msg}
            allTags={allTags}
            onChange={updateMsg}
            onDelete={deleteMsg}
            onAddTag={onAddTag}
          />
        </div>
      ))}
      <div style={{ display: 'flex', gap: 6, paddingBottom: 8 }}>
        <button onClick={() => addMsg('email')} style={btnStyle('#f0fdf4', '#86efac', '#15803d')}>
          + E-mail
        </button>
        <button onClick={() => addMsg('whatsapp')} style={btnStyle('#fff7ed', '#fdba74', '#c2410c')}>
          + WhatsApp
        </button>
      </div>
      {msgs.length > 1 && (
        <p style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', marginBottom: 4 }}>
          ⠿ Arraste as mensagens para reordenar a sequência de envio
        </p>
      )}
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
  onRename, onDelete, onMoveSection,
  messages, allTags, onMessagesChange, onAddTag,
  section,
}) {
  const [over, setOver] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameVal, setRenameVal] = useState(group.label)
  const [showMsgs, setShowMsgs] = useState(false)
  const renameRef = useRef(null)

  useEffect(() => { if (renaming && renameRef.current) { renameRef.current.focus(); renameRef.current.select() } }, [renaming])

  const finishRename = () => { onRename(group.id, renameVal.trim() || group.label); setRenaming(false) }
  const msgCount = (messages[group.id] || []).length

  const sectionColor = getSectionColor(section)
  const sectionBorderColor = getSectionBorderColor(section)

  return (
    <div
      style={{
        background: C.surface, border: `1.5px solid ${over ? sectionColor : sectionBorderColor}`,
        borderRadius: 10, display: 'flex', flexDirection: 'column',
        transition: 'border-color .15s, opacity .15s',
        boxShadow: over ? `0 0 0 3px ${sectionColor}33` : 'none',
      }}
      onDragOver={e => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={() => { setOver(false); onDrop(group.id, section) }}
    >
      {/* Header */}
      <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `2px solid ${sectionBorderColor}`, background: getSectionBg(section), borderRadius: '9px 9px 0 0' }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: sectionColor, background: `${sectionColor}15`, padding: '2px 6px', borderRadius: 4 }}>
          {getSectionLabel(section)}
        </span>
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
        <button
          onClick={() => onMoveSection(group.id, getNextSection(section))}
          title="Mover para outra seção"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', fontSize: 11, padding: '2px 6px', flexShrink: 0, borderRadius: 4 }}
          onMouseOver={e => { e.currentTarget.style.background = section === 'naoFazer' ? '#dcfce7' : '#fee2e2'; e.currentTarget.style.color = section === 'naoFazer' ? '#22c55e' : '#ef4444' }}
          onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#cbd5e1' }}
        >
          {section === 'naoFazer' ? '←' : '→'}
        </button>
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

function getSectionColor(section) {
  if (section === 'curtoPrazo') return C.curtoColor
  if (section === 'longoPrazo') return C.longoColor
  if (section === 'fazer') return C.sectionFazer
  return C.sectionNaoFazer
}

function getSectionBorderColor(section) {
  if (section === 'curtoPrazo') return C.curtoBorder
  if (section === 'longoPrazo') return C.longoBorder
  if (section === 'fazer') return C.sectionFazerBorder
  return C.sectionNaoFazerBorder
}

function getSectionBg(section) {
  if (section === 'curtoPrazo') return C.curtoBg
  if (section === 'longoPrazo') return C.longoBg
  if (section === 'fazer') return '#f0fdf4'
  return '#f8fafc'
}

function getSectionLabel(section) {
  if (section === 'curtoPrazo') return '⚡ CURTO PRAZO'
  if (section === 'longoPrazo') return '📆 LONGO PRAZO'
  if (section === 'fazer') return '✓ FAZER'
  return '✗ NÃO FAZER'
}

function getNextSection(current) {
  const order = ['curtoPrazo', 'longoPrazo', 'fazer', 'naoFazer']
  const idx = order.indexOf(current)
  return order[(idx + 1) % order.length]
}

// ─── Data sources header ──────────────────────────────────────────────────────
function DataSources() {
  return (
    <div style={{
      maxWidth: 1280, margin: '0 auto 24px',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      borderRadius: 16, padding: '24px 32px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>📊</span>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Fontes de Dados</span>
        <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 8 }}>Base para classificação de losts</span>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <a
          href="https://seazone-fund.slack.com/docs/TDLTVAWQ6/F0891A2JX1S"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 10, padding: '12px 20px', textDecoration: 'none',
            transition: 'all .2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <span style={{ fontSize: 24 }}>💬</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>Motivos de Perda — Marketplace</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Slack • Seazone Fund</div>
          </div>
          <span style={{ marginLeft: 8, color: '#94a3b8', fontSize: 14 }}>↗</span>
        </a>
        <a
          href="https://docs.google.com/spreadsheets/d/1J-aMXiH4P3pQ4nQlN79emsNBNSBx5sOp7JsILLGI_MY/edit?gid=956697078"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 10, padding: '12px 20px', textDecoration: 'none',
            transition: 'all .2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <span style={{ fontSize: 24 }}>📈</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#fff' }}>Motivos de Perda — SZI Lançamentos</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>Google Sheets • Classificação SZ</div>
          </div>
          <span style={{ marginLeft: 8, color: '#94a3b8', fontSize: 14 }}>↗</span>
        </a>
      </div>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle, color, bgColor, count }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '16px 20px', borderRadius: '12px 12px 0 0',
      background: bgColor, borderBottom: `3px solid ${color}`,
    }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color }}>{title}</div>
        <div style={{ fontSize: 12, color: '#64748b' }}>{subtitle}</div>
      </div>
      {count !== undefined && (
        <span style={{ background: `${color}22`, color, border: `1px solid ${color}44`, borderRadius: 99, padding: '3px 12px', fontSize: 12, fontWeight: 600 }}>
          {count} grupo{count !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}

// ─── Section block (used for curto prazo, longo prazo, nao fazer) ────────────
function SectionBlock({ sectionKey, icon, title, subtitle, color, bgColor, borderColor, groups, allGroups, dragging, dragFrom, handleDragStart, handleDragEnd, handleDrop, renameGroup, deleteGroup, moveGroupSection, messages, allTags, onMessagesChange, onAddTag }) {
  const sectionGroups = groups.filter(g => (g.section || 'fazer') === sectionKey)
  const filteredAll = allGroups.filter(g => (g.section || 'fazer') === sectionKey)

  const addGroup = () => {
    // accessed via parent
  }

  return (
    <div style={{
      background: bgColor,
      border: `2px solid ${borderColor}`,
      borderRadius: 16,
      overflow: 'hidden',
      opacity: 0.92,
    }}>
      <SectionHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        color={color}
        bgColor={bgColor}
        count={sectionGroups.length}
      />
      <div style={{ padding: 16 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12, alignItems: 'start',
        }}>
          {sectionGroups.map(group => (
            <GroupBox
              key={group.id}
              group={group}
              section={sectionKey}
              dragging={dragging}
              dragFrom={dragFrom}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onRename={renameGroup}
              onDelete={deleteGroup}
              onMoveSection={moveGroupSection}
              messages={messages}
              allTags={allTags}
              onMessagesChange={onMessagesChange}
              onAddTag={onAddTag}
            />
          ))}
        </div>
        {sectionGroups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div>Nenhum grupo nesta seção</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Use as setas nos grupos para mover para cá</div>
          </div>
        )}
      </div>
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

  const handleDrop = useCallback((toGid, toSection) => {
    if (!dragging || !dragFrom) return
    const g = stateRef.current.groups
    const fromGroup = g.find(x => x.id === dragFrom)
    const toGroup = g.find(x => x.id === toGid)
    if (!fromGroup || !toGroup) return
    if (dragFrom === toGid) {
      setDragging(null); setDragFrom(null)
      return
    }
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

  const addGroup = useCallback((section = 'curtoPrazo') => {
    const newGroup = { id: `g${gctr.current++}`, section, label: 'Novo grupo', cards: [] }
    updateGroups([...stateRef.current.groups, newGroup])
  }, [updateGroups])

  const moveGroupSection = useCallback((gid, newSection) => {
    const g = stateRef.current.groups.map(group =>
      group.id === gid ? { ...group, section: newSection } : group
    )
    updateGroups(g)
  }, [updateGroups])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading || !groups) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 14 }}>
        Carregando board...
      </div>
    )
  }

  const curtoGroups = groups.filter(g => g.section === 'curtoPrazo' || g.section === 'fazer' || g.section == null)
  const longoGroups = groups.filter(g => g.section === 'longoPrazo')
  const naoFazerGroups = groups.filter(g => g.section === 'naoFazer')

  // Build all groups for all sections
  const allGroups = groups

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '20px 16px 48px' }}>
      {/* ── Data Sources Header ── */}
      <DataSources />

      {/* ── Main Header ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto 24px' }}>
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
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
          Arraste os cards entre grupos • Clique no nome do grupo para renomear • Arraste mensagens para reordenar envio • Use as setas para mover grupos entre seções
        </p>
      </div>

      {/* ── SEÇÃO: FAZER MENSAGEM → dividida em Curto e Longo ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto 32px' }}>
        <div style={{
          background: '#f0fdf4',
          border: `2px solid ${C.sectionFazerBorder}`,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(5, 150, 105, 0.1)',
        }}>
          <SectionHeader
            icon="✅"
            title="Fazer Mensagem"
            subtitle={`${curtoGroups.length + longoGroups.length} grupos • Curto prazo (ação imediata) e longo prazo (planejamento)`}
            color={C.sectionFazer}
            bgColor="#f0fdf4"
          />
          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Curto Prazo */}
            <div style={{
              background: C.curtoBg,
              border: `2px solid ${C.curtoBorder}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: `2px solid ${C.curtoBorder}`, background: `${C.curtoBorder}33` }}>
                <span style={{ fontSize: 22 }}>⚡</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.curtoColor }}>Curto Prazo</div>
                  <div style={{ fontSize: 11, color: '#92400e' }}>Ação imediata — urgência de contato</div>
                </div>
                <span style={{ marginLeft: 'auto', background: `${C.curtoColor}22`, color: C.curtoColor, border: `1px solid ${C.curtoColor}44`, borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>
                  {curtoGroups.length} grupo{curtoGroups.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, alignItems: 'start' }}>
                  {curtoGroups.map(group => (
                    <GroupBox
                      key={group.id}
                      group={group}
                      section="curtoPrazo"
                      dragging={dragging}
                      dragFrom={dragFrom}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDrop={handleDrop}
                      onRename={renameGroup}
                      onDelete={deleteGroup}
                      onMoveSection={moveGroupSection}
                      messages={messages}
                      allTags={allTags}
                      onMessagesChange={updateMessages}
                      onAddTag={addTag}
                    />
                  ))}
                </div>
                {curtoGroups.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 20px', color: '#b45309' }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>⚡</div>
                    <div style={{ fontSize: 12 }}>Nenhum grupo de curto prazo</div>
                    <div style={{ fontSize: 11, marginTop: 2, color: '#92400e' }}>Use as setas nos grupos ou adicione abaixo</div>
                  </div>
                )}
              </div>
              <div style={{ padding: '10px 16px', background: `${C.curtoBorder}33`, borderTop: `1px solid ${C.curtoBorder}55` }}>
                <button
                  onClick={() => addGroup('curtoPrazo')}
                  style={{ padding: '6px 14px', borderRadius: 8, border: `1.5px dashed ${C.curtoColor}`, background: 'transparent', color: C.curtoColor, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                >
                  + Novo grupo — Curto Prazo
                </button>
              </div>
            </div>

            {/* Longo Prazo */}
            <div style={{
              background: C.longoBg,
              border: `2px solid ${C.longoBorder}`,
              borderRadius: 12,
              overflow: 'hidden',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: `2px solid ${C.longoBorder}`, background: `${C.longoBorder}33` }}>
                <span style={{ fontSize: 22 }}>📆</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.longoColor }}>Longo Prazo</div>
                  <div style={{ fontSize: 11, color: '#1e40af' }}>Planejamento — follow-up往后</div>
                </div>
                <span style={{ marginLeft: 'auto', background: `${C.longoColor}22`, color: C.longoColor, border: `1px solid ${C.longoColor}44`, borderRadius: 99, padding: '2px 10px', fontSize: 11, fontWeight: 600 }}>
                  {longoGroups.length} grupo{longoGroups.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, alignItems: 'start' }}>
                  {longoGroups.map(group => (
                    <GroupBox
                      key={group.id}
                      group={group}
                      section="longoPrazo"
                      dragging={dragging}
                      dragFrom={dragFrom}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDrop={handleDrop}
                      onRename={renameGroup}
                      onDelete={deleteGroup}
                      onMoveSection={moveGroupSection}
                      messages={messages}
                      allTags={allTags}
                      onMessagesChange={updateMessages}
                      onAddTag={addTag}
                    />
                  ))}
                </div>
                {longoGroups.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 20px', color: '#1e40af' }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>📆</div>
                    <div style={{ fontSize: 12 }}>Nenhum grupo de longo prazo</div>
                    <div style={{ fontSize: 11, marginTop: 2, color: '#1e40af' }}>Use as setas nos grupos ou adicione abaixo</div>
                  </div>
                )}
              </div>
              <div style={{ padding: '10px 16px', background: `${C.longoBorder}33`, borderTop: `1px solid ${C.longoBorder}55` }}>
                <button
                  onClick={() => addGroup('longoPrazo')}
                  style={{ padding: '6px 14px', borderRadius: 8, border: `1.5px dashed ${C.longoColor}`, background: 'transparent', color: C.longoColor, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                >
                  + Novo grupo — Longo Prazo
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Section: NÃO FAZER MENSAGEM ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionBlock
          sectionKey="naoFazer"
          icon="⏸️"
          title="Não Fazer Mensagem"
          subtitle="Motivos que não fazem sentido no momento para ativação"
          color={C.sectionNaoFazer}
          bgColor={C.sectionNaoFazerBg}
          borderColor={C.sectionNaoFazerBorder}
          groups={groups}
          allGroups={allGroups}
          dragging={dragging}
          dragFrom={dragFrom}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          handleDrop={handleDrop}
          renameGroup={renameGroup}
          deleteGroup={deleteGroup}
          moveGroupSection={moveGroupSection}
          messages={messages}
          allTags={allTags}
          onMessagesChange={updateMessages}
          onAddTag={addTag}
        />
        <div style={{ padding: '12px 16px', background: '#f8fafc', borderTop: `1px solid ${C.border}`, borderRadius: '0 0 16px 16px', border: `2px solid ${C.sectionNaoFazerBorder}`, borderTop: 'none' }}>
          <button
            onClick={() => addGroup('naoFazer')}
            style={{ padding: '8px 16px', borderRadius: 8, border: `1.5px dashed ${C.sectionNaoFazer}`, background: 'transparent', color: C.sectionNaoFazer, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            + Novo grupo — Não Fazer
          </button>
        </div>
      </div>
    </div>
  )
}

// Default groups — migrate fazer groups to curtoPrazo (new default)
const DEFAULT_GROUPS = [
  { id: 'g1',  section: 'curtoPrazo', label: 'Timing / Momento',               cards: ['sz_timing','mk_timing'] },
  { id: 'g2',  section: 'curtoPrazo', label: 'Concorrência',                   cards: ['sz_conc','mk_conc'] },
  { id: 'g3',  section: 'curtoPrazo', label: 'Corretor / Imobiliária',         cards: ['sz_corretor','mk_corretor'] },
  { id: 'g4',  section: 'curtoPrazo', label: 'Jurídico / Contratual',          cards: ['sz_juridico','mk_juridico'] },
  { id: 'g5',  section: 'naoFazer',  label: 'Duplicado / Erro Admin',          cards: ['sz_dup','mk_dup'] },
  { id: 'g6',  section: 'curtoPrazo', label: 'Sem Contato / Inatingível',      cards: ['sz_contato','mk_naoresp','mk_parou','mk_origem'] },
  { id: 'g7',  section: 'curtoPrazo', label: 'Perfil — Financeiro',            cards: ['sz_fgts','sz_pgto','sz_entrada','sz_total','mk_cond','mk_entrada','mk_total'] },
  { id: 'g8',  section: 'curtoPrazo', label: 'Perfil — Produto / Características', cards: ['sz_tam','sz_garagem','sz_prazo','sz_spe','sz_cota','sz_outra_cota','mk_tam','mk_prazo','mk_spe','mk_loc'] },
  { id: 'g9',  section: 'naoFazer',  label: 'Perfil — Intenção Incompatível', cards: ['sz_moradia','sz_hospede','sz_lgpd','sz_mora','mk_moradia'] },
  { id: 'g10', section: 'naoFazer',  label: 'Redirecionamento Interno',       cards: ['sz_mkt','sz_szs','sz_decor_enc','sz_lanc_enc','sz_cly','sz_anfitriao','mk_lanc'] },
  { id: 'g11', section: 'curtoPrazo', label: 'Catch-all / Descrição Obrigatória', cards: ['sz_catch','mk_catch'] },
  { id: 'g12', section: 'naoFazer',  label: 'Imóvel fora do Perfil SZS',      cards: ['sz_icond','sz_idesc','sz_iitens'] },
  { id: 'g13', section: 'curtoPrazo', label: 'Taxas / Custos Operacionais',    cards: ['sz_enxoval','sz_taxa_adm','sz_taxa_imp'] },
  { id: 'g14', section: 'curtoPrazo', label: 'Exclusivo — Decor',             cards: ['sz_dcap','sz_dproj','sz_dobras'] },
  { id: 'g15', section: 'naoFazer',  label: 'Exclusivo — Expansão / B2B',     cards: ['sz_efut','sz_esem','sz_b2b','sz_parceiro','sz_cliente','sz_resgate'] },
  { id: 'g16', section: 'naoFazer',  label: 'Sem Grupo',                      cards: ['sz_vendeu','sz_regiao'] },
]