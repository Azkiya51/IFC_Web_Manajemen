import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { INITIAL } from '../data/initialData'

const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

export function AppProvider({ children }) {
  const [st, setSt] = useState({
    T: INITIAL.T,
    M: INITIAL.M,
    P: INITIAL.P,
    me: INITIAL.me,
  })

  const fetchAll = async () => {
    const [{ data: teams }, { data: players }, { data: matches }, { data: sessionData }] = await Promise.all([
      supabase.from('teams').select('*').order('created_at', { ascending: true }),
      supabase.from('players').select('*').order('created_at', { ascending: true }),
      supabase.from('matches').select('*').order('created_at', { ascending: true }),
      supabase.auth.getSession(),
    ])

    const email = sessionData?.session?.user?.email || null
    const listT = teams || []
    const myTeam = email ? listT.find(t => t.user_email === email) : null

    setSt({
      T: listT,
      P: (players || []).map(p => [p.name, p.nisn, p.team_name]),
      M: matches || [],
      me: myTeam ? myTeam.n : (email ? '' : INITIAL.me),
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
      const { data: inserted, error } = await supabase.from('matches').insert([m]).select().single()
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
  }

  return <Ctx.Provider value={{ ...st, ...actions }}>{children}</Ctx.Provider>
}