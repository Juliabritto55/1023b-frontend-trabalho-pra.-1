// src/App.tsx
import './App.css';
import api from './api/api';
import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import Header from './componentes/Header';
import Cart from './componentes/Cart';

type ProdutoType = { _id: string; nome: string; preco: number; urlfoto: string; descricao: string; category?: string };

function App() {
  const [produtos, setProdutos] = useState<ProdutoType[]>([]);
  const { role } = useAuth();

  useEffect(() => {
    api.get('/produtos')
      .then((response) => setProdutos(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const data = {
      nome: formData.get('nome') as string,
      preco: Number(formData.get('preco')),
      urlfoto: formData.get('urlfoto') as string,
      descricao: formData.get('descricao') as string,
      category: formData.get('category') as string
    };
    api.post('/produtos', data)
      .then((response) => setProdutos([...produtos, response.data]))
      .catch((error) => {
        console.error('Error posting data:', error);
        alert('Erro ao cadastrar produto: ' + (error?.response?.data?.mensagem || error?.message));
      });
    (event.currentTarget as HTMLFormElement).reset();
  }

  function adicionarCarrinho(produtoId: string) {
    api.post('/adicionarItem', { produtoId, quantidade: 1 })
      .then(() => alert('Produto adicionado ao carrinho!'))
      .catch((error) => {
        console.error('Error posting data:', error);
        alert('Erro ao adicionar: ' + (error?.response?.data?.mensagem || error?.message));
      });
  }

  return (
    <>
      <Header />
      <div> 
        {role === 'ADMIN' ? (
          <>
            <div>Cadastro de Produtos</div>
            <form onSubmit={handleForm}>
              <input type="text" name="nome" placeholder="Nome" />
              <input type="number" name="preco" placeholder="Preço" />
              <input type="text" name="urlfoto" placeholder="URL da Foto" />
              <input type="text" name="descricao" placeholder="Descrição" />
              <input type="text" name="category" placeholder="Categoria" />
              <button type="submit">Cadastrar</button>
            </form>
          </>
        ) : (
          <p>Somente administradores podem cadastrar produtos.</p>
        )}
      </div>

      <div>Lista de Produtos</div>
      {produtos.map((produto) => (
        <div key={produto._id}>
          <h2>{produto.nome}</h2>
          <p>R$ {produto.preco}</p>
          <img src={produto.urlfoto} alt={produto.nome} width="200" />
          <p>{produto.descricao}</p>
          <button onClick={() => adicionarCarrinho(produto._id)}>Adicionar ao carrinho</button>
        </div>
      ))}

      <Cart />
    </>
  );
}

export default App;
