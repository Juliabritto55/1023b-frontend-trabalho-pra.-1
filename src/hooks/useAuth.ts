// src/hooks/useAuth.ts
import jwt_decode from 'jwt-decode';

export function useAuth() {
  const token = localStorage.getItem('token');
  if (!token) return { logado: false, token: null, usuario: null, role: null };

  try {
    const decoded: any = jwt_decode(token);
    // decoded deve conter usuarioId, nome, role (conforme token gerado backend)
    return { logado: true, token, usuario: decoded, role: decoded.role || 'USER' };
  } catch {
    return { logado: false, token: null, usuario: null, role: null };
  }
}