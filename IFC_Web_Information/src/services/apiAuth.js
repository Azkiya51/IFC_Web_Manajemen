import { supabase } from '../supabase'

export async function loginUser(email, password) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (authError) throw new Error(authError.message)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single()

  if (profileError && profileError.code !== 'PGRST116') {
    throw new Error(profileError.message)
  }

  return {
    user: authData.user,
    role: profile?.role || 'peserta',
  }
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  return {
    user: session.user,
    role: profile?.role || 'peserta',
  }
}
export async function registerParticipant(email, password) {
  const { data: sessionData } = await supabase.auth.getSession()
  if (sessionData?.session) {
    return sessionData.session.user
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw new Error(error.message)

  if (data?.user) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email: data.user.email,
      role: 'peserta',
    })
  }

  return data.user
}