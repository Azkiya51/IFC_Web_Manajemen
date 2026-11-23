import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export function AppProvider({ children }) {
  const [st, setSt] = useState({
    T: [],
    M: [],
    P: [],
    B: {},
    me: '',
  })

  const fetchAll = async () => {
    const [
      { data: teams },
      { data: players },
      { data: matches },
      { data: slots },
      { data: sessionData },
    ] = await Promise.all([
      supabase.from('teams').select('*').order('created_at', { ascending: true }),
      supabase.from('players').select('*').order('created_at', { ascending: true }),
      supabase.from('matches').select('*').order('created_at', { ascending: true }),
      supabase.from('bracket_slots').select('*'),
      supabase.auth.getSession(),
    ])

    const email = sessionData?.session?.user?.email || null
    const listT = teams || []
    const myTeam = email ? listT.find(t => t.user_email === email) : null
    const bracketMap = {}
    ;(slots || []).forEach(row => {
      bracketMap[row.kode] = row
    })

    setSt({
      T: listT,
      P: (players || []).map(p => [p.name, p.nisn, p.team_name]),
      M: matches || [],
      B: bracketMap,
      me: myTeam ? myTeam.n : '',
    })
  }

  useEffect(() => {
    fetchAll()
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchAll()
    })
    return () => authListener.subscription.unsubscribe()
  }, [])

  const at = (arr, k, fn) => arr.map((x, i) => (i === k ? fn(x) : x))

  const actions = {
    addTeam: async (team, players, rawFiles = {}) => {
      const { data: sessionData } = await supabase.auth.getSession()
      const email = sessionData?.session?.user?.email || null

      const uploadDoc = async (fileObj, folder) => {
        if (!fileObj?.raw) return ''
        const ext = fileObj.name.split('.').pop()
        const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`
        const { error: upErr } = await supabase.storage.from('dokumen-tim').upload(path, fileObj.raw)
        if (upErr) {
          console.error('Upload gagal:', upErr.message)
          return ''
        }
        const { data } = supabase.storage.from('dokumen-tim').getPublicUrl(path)
        return data.publicUrl
      }

      const [doc_kartu, doc_logo, doc_bayar] = await Promise.all([
        uploadDoc(rawFiles[1]?.[0], 'kartu-pelajar'),
        uploadDoc(rawFiles[2]?.[0], 'logo-tim'),
        uploadDoc(rawFiles[3]?.[0], 'bukti-bayar'),
      ])

      const payload = {
        ...team,
        r: team.r || '',
        grup: team.grup || '',
        user_email: email,
        doc_kartu,
        doc_logo,
        doc_bayar,
      }

      const { data: insertedTeam, error } = await supabase.from('teams').insert([payload]).select().single()
      if (error) {
        alert('Gagal menyimpan tim: ' + error.message)
        return
      }

      if (players && players.length > 0) {
        const playerRows = players.map(p => ({ name: p[0], nisn: p[1], team_name: team.n }))
        await supabase.from('players').insert(playerRows)
      }

      setSt(s => ({
        ...s,
        me: insertedTeam.n,
        T: [...s.T, insertedTeam],
        P: [...s.P, ...(players || []).map(p => [p[0], p[1], team.n])],
      }))
    },

    updateTeam: async (k, patch) => {
      const target = st.T[k]
      if (!target) return
      setSt(s => ({ ...s, T: at(s.T, k, t => ({ ...t, ...patch })) }))
      if (target.id) {
        await supabase.from('teams').update(patch).eq('id', target.id)
      }
    },

    updateTeamGroup: async (teamId, grup) => {
      setSt(s => ({
        ...s,
        T: s.T.map(t => (t.id === teamId ? { ...t, grup } : t)),
      }))
      if (teamId) {
        await supabase.from('teams').update({ grup }).eq('id', teamId)
      }
    },

    autoAssignGroups: async () => {
      const grups = ['A', 'B', 'C', 'D']
      const verified = st.T.filter(t => t.s === 'Terverifikasi')
      if (!verified.length) {
        alert('Belum ada tim berstatus Terverifikasi untuk dibagi ke grup.')
        return
      }
      const updates = {}
      verified.forEach((t, idx) => {
        updates[t.id] = grups[idx % grups.length]
      })

      setSt(s => ({
        ...s,
        T: s.T.map(t => (updates[t.id] ? { ...t, grup: updates[t.id] } : t)),
      }))

      await Promise.all(
        verified.map(t => supabase.from('teams').update({ grup: updates[t.id] }).eq('id', t.id))
      )
    },

    renameTeam: async (k, baru) => {
      const target = st.T[k]
      if (!target) return
      const lama = target.n

      setSt(s => ({
        ...s,
        me: s.me === lama ? baru : s.me,
        T: at(s.T, k, t => ({ ...t, n: baru })),
        M: s.M.map(m => ({ ...m, a: m.a === lama ? baru : m.a, b: m.b === lama ? baru : m.b })),
        P: s.P.map(p => (p[2] === lama ? [p[0], p[1], baru] : p)),
      }))

      if (target.id) {
        await supabase.from('teams').update({ n: baru }).eq('id', target.id)
      }
      await supabase.from('players').update({ team_name: baru }).eq('team_name', lama)
      await supabase.from('matches').update({ a: baru }).eq('a', lama)
      await supabase.from('matches').update({ b: baru }).eq('b', lama)
    },

    deleteTeam: async k => {
      const target = st.T[k]
      if (!target) return
      setSt(s => ({
        ...s,
        T: s.T.filter((_, i) => i !== k),
        P: s.P.filter(p => p[2] !== target.n),
      }))
      if (target.id) {
        await supabase.from('teams').delete().eq('id', target.id)
      }
      await supabase.from('players').delete().eq('team_name', target.n)
    },

    addMatch: async m => {
      const payload = { ...m, babak: m.babak || 'Grup' }
      const { data: inserted, error } = await supabase.from('matches').insert([payload]).select().single()
      if (error) {
        alert('Gagal menambah jadwal: ' + error.message)
        return
      }
      setSt(s => ({ ...s, M: [...s.M, inserted] }))
    },

    editMatch: async (k, patch) => {
      const target = st.M[k]
      if (!target) return
      setSt(s => ({ ...s, M: at(s.M, k, m => ({ ...m, ...patch })) }))
      if (target.id) {
        await supabase.from('matches').update(patch).eq('id', target.id)
      }
    },

    deleteMatch: async k => {
      const target = st.M[k]
      if (!target) return
      setSt(s => ({ ...s, M: s.M.filter((_, i) => i !== k) }))
      if (target.id) {
        await supabase.from('matches').delete().eq('id', target.id)
      }
    },

    updateMatch: async (k, f, v) => {
      const target = st.M[k]
      if (!target) return
      const val = f === 's' ? v : Math.max(0, +v)

      let nextM = at(st.M, k, m => ({ ...m, [f]: val }))
      if (f === 's' && v === 'Berlangsung') {
        nextM = nextM.map((m, j) =>
          j === k ? { ...m, l: '1' } : m.s === 'Berlangsung' ? { ...m, s: 'Akan Datang' } : m
        )
      }
      setSt(s => ({ ...s, M: nextM }))

      if (target.id) {
        if (f === 's' && v === 'Berlangsung') {
          await supabase.from('matches').update({ s: 'Akan Datang' }).eq('s', 'Berlangsung')
          await supabase.from('matches').update({ s: 'Berlangsung', l: '1' }).eq('id', target.id)
        } else {
          await supabase.from('matches').update({ [f]: val }).eq('id', target.id)
        }
      }
    },

    saveBracketSlot: async (kode, patch) => {
      const row = {
        kode,
        tim_a: patch.tim_a ?? '',
        tim_b: patch.tim_b ?? '',
        skor_a: patch.skor_a === '' || patch.skor_a === null || patch.skor_a === undefined ? null : Number(patch.skor_a),
        skor_b: patch.skor_b === '' || patch.skor_b === null || patch.skor_b === undefined ? null : Number(patch.skor_b),
        updated_at: new Date().toISOString(),
      }

      setSt(s => ({
        ...s,
        B: { ...s.B, [kode]: row },
      }))

      const { error } = await supabase.from('bracket_slots').upsert([row], { onConflict: 'kode' })
      if (error) {
        alert('Gagal menyimpan bagan: ' + error.message)
      }
    },
  }

  return <Ctx.Provider value={{ ...st, ...actions }}>{children}</Ctx.Provider>
}