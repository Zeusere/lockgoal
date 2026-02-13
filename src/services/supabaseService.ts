import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

const supabaseUrl = extra.supabaseUrl;
const supabaseAnonKey = extra.supabaseAnonKey;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const signUpWithEmail = async (email: string, password: string) => {
  if (!hasSupabaseConfig) {
    return {ok: true, userId: `local-${Date.now()}`};
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${supabaseAnonKey!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password}),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'No se pudo registrar el usuario');
  }

  const data = (await response.json()) as {user?: {id?: string}};
  return {ok: true, userId: data.user?.id || `supa-${Date.now()}`};
};

export const saveSessionSnapshot = async (
  userId: string,
  payload: Record<string, unknown>,
) => {
  if (!hasSupabaseConfig) {
    return;
  }

  await fetch(`${supabaseUrl}/rest/v1/user_sessions`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${supabaseAnonKey!}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({user_id: userId, payload}),
  });
};
