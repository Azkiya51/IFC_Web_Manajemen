import { createContext, useContext, useEffect, useState } from 'react'
import { INITIAL } from '../data/initialData'

const KEY = 'ifc_state_v2'
const Ctx = createContext(null)
export const useApp = () => useContext(Ctx)

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* pakai data default */ }
  return structuredClone(INITIAL)
}

// State global (tim, pertandingan, pemain) + aksi untuk mengubahnya.
// Disimpan di localStorage sampai backend siap.
export function AppProvider({ children }) {
  const [st, setSt] = useState(load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(st)) } catch { /* abaikan */ }
  }, [st])

  const at = (arr, k, fn) => arr.map((x, i) => (i === k ? fn(x) : x))

  const actions = {
    addTeam: (team, players) => setSt(s => ({
      ...s, me: team.n, T: [...s.T, team],
      P: [...s.P, ...players.map(p => [p[0], p[1], team.n])],
    })),
    updateTeam: (k, patch) => setSt(s => ({ ...s, T: at(s.T, k, t => ({ ...t, ...patch })) })),
    renameTeam: (k, baru) => setSt(s => {
      const lama = s.T[k].n
      return {
        ...s,
        me: s.me === lama ? baru : s.me,
        T: at(s.T, k, t => ({ ...t, n: baru })),
        M: s.M.map(m => ({ ...m, a: m.a === lama ? baru : m.a, b: m.b === lama ? baru : m.b })),
        P: s.P.map(p => (p[2] === lama ? [p[0], p[1], baru] : p)),
      }
    }),
    deleteTeam: k => setSt(s => ({ ...s, T: s.T.filter((_, i) => i !== k) })),
    addMatch: m => setSt(s => ({ ...s, M: [...s.M, m] })),
    editMatch: (k, patch) => setSt(s => ({ ...s, M: at(s.M, k, m => ({ ...m, ...patch })) })),
    deleteMatch: k => setSt(s => ({ ...s, M: s.M.filter((_, i) => i !== k) })),
    // ubah skor/status; hanya satu pertandingan boleh "Berlangsung"
    updateMatch: (k, f, v) => setSt(s => {
      let M = at(s.M, k, m => ({ ...m, [f]: f === 's' ? v : Math.max(0, +v) }))
      if (f === 's' && v === 'Berlangsung') {
        M = M.map((m, j) => j === k ? { ...m, l: '1' } : m.s === 'Berlangsung' ? { ...m, s: 'Akan Datang' } : m)
      }
      return { ...s, M }
    }),
  }

  return <Ctx.Provider value={{ ...st, ...actions }}>{children}</Ctx.Provider>
}
