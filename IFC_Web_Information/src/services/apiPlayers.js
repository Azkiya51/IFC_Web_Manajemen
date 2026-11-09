import { supabase } from '../supabase'

export async function getPlayers() {
  const { data, error } = await supabase.from('players').select('*, teams(name)')
  if (error) throw new Error(error.message)
  return data
}

export async function createPlayer(newPlayer) {
  const { data, error } = await supabase.from('players').insert([newPlayer]).select()
  if (error) throw new Error(error.message)
  return data
}

export async function deletePlayer(id) {
  const { data, error } = await supabase.from('players').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return data
}