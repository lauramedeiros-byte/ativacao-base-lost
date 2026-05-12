import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const KEY = 'seazone:lost_board_v1'

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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await redis.get(KEY)
      return res.status(200).json(data || { groups: DEFAULT_GROUPS, messages: {}, tags: [] })
    } catch (e) {
      console.error('Redis GET error:', e)
      return res.status(500).json({ error: 'Erro ao carregar dados' })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      await redis.set(KEY, body)
      return res.status(200).json({ ok: true })
    } catch (e) {
      console.error('Redis SET error:', e)
      return res.status(500).json({ error: 'Erro ao salvar dados' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
