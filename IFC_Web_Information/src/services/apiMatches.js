import { supabase } from '../supabase'

export async function getMatches() {
  const { data, error } = await supabase.from('matches').select(`
    *,
    home_team:home_team_id(name, logo_url),
    away_team:away_team_id(name, logo_url)
  `)
  if (error) throw new Error(error.message)
  return data
}

export async function createMatch(newMatch) {
  const { data, error } = await supabase.from('matches').insert([newMatch]).select()
  if (error) throw new Error(error.message)
  return data
}

export async function updateMatchScore(id, homeScore, awayScore, status) {
  const { data, error } = await supabase
    .from('matches')
    .update({ home_score: homeScore, away_score: awayScore, status: status })
    .eq('id', id)
    .select()
  
  if (error) throw new Error(error.message)
  return data
}

export async function deleteMatch(id) {
  const { data, error } = await supabase.from('matches').delete().eq('id', id)
  if (error) throw new Error(error.message)
  return data
}