// src/componentes/Header.tsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Header() {
  const navigate = useNavigate();
  const { logado, usuario, role } = useAuth();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <div><Link to="/"><strong>Loja Home Office</strong></Link></div>
      <div>
        {logado ? (
          <>
            <span>Olá, {usuario?.nome || 'Usuário'} — {role}</span>
            <button style={{ marginLeft: '1rem' }} onClick={handleLogout}>Logout</button>
            <Link style={{ marginLeft: '1rem' }} to="/cart">Carrinho</Link>
          </>
        ) : (
          <button onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    </header>
  );
}
