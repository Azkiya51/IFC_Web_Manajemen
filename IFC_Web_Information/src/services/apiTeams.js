import { supabase } from '../supabase'

// Mengambil semua data tim
export async function getTeams() {
  const { data, error } = await supabase.from('teams').select('*')
  if (error) throw new Error(error.message)
  return data
}

// Menambah tim baru
export async function createTeam(newTeam) {
  const { data, error } = await supabase.from('teams').insert([newTeam]).select()
  if (error) throw new Error(error.message)
  return data
}

// Menghapus tim
export async function deleteTeam(id) {
  const { data, error } = await supabase.from('teams').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return data
}