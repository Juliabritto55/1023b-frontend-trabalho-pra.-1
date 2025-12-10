// src/componentes/Cart.tsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';

type Item = { produtoId: string; quantidade: number; precoUnitario: number; nome: string };
type CartType = { usuarioId: string; itens: Item[]; total: number };

export default function Cart() {
  const { usuario } = useAuth();
  const [cart, setCart] = useState<CartType | null>(null);

  async function loadCart() {
    try {
      if (!usuario?.usuarioId) return;
      const res = await api.get(`/carrinho/${usuario.usuarioId}`);
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { loadCart(); }, [usuario?.usuarioId]);

  async function updateQuantity(produtoId: string, quantidade: number) {
    try {
      await api.put('/atualizarQuantidade', { usuarioId: usuario.usuarioId, produtoId, quantidade });
      await loadCart();
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar quantidade');
    }
  }

  async function removeItem(produtoId: string) {
    try {
      await api.post('/removerItem', { usuarioId: usuario.usuarioId, produtoId });
      await loadCart();
    } catch (err) {
      console.error(err);
      alert('Erro ao remover item');
    }
  }

  if (!cart) return <div>Carregando carrinho...</div>;

  return (
    <div>
      <h2>Meu Carrinho</h2>
      {cart.itens.length === 0 ? <p>Carrinho vazio</p> : cart.itens.map(item => (
        <div key={item.produtoId} style={{ border: '1px solid #ccc', padding: '.5rem', marginBottom: '.5rem' }}>
          <div>{item.nome}</div>
          <div>R$ {item.precoUnitario}</div>
          <div>
            <input type="number" value={item.quantidade} min={1}
              onChange={(e) => updateQuantity(item.produtoId, Number(e.target.value))} />
            <button onClick={() => removeItem(item.produtoId)}>Remover</button>
          </div>
        </div>
      ))}
      <div><strong>Total: R$ {cart.total.toFixed(2)}</strong></div>
    </div>
  );
}
