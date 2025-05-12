# eMutua Digital - Frontend Produtos

Este repositório contém o frontend do teste técnico para a plataforma de e-commerce da eMutua Digital, desenvolvido em Next.js, React e Shadcn/ui.

### Tecnologias Utilizadas

O projeto utiliza **Next.js** (React) para aproveitar renderização SSR, roteamento otimizado e melhor performance, além de **Shadcn/ui** para componentes acessíveis e customizáveis, acelerando o desenvolvimento com visual moderno. O uso de **TypeScript** garante maior segurança e produtividade no código.

### Funcionalidades

- CRUD de produtos (criar, listar, editar, excluir)
- Busca e filtro de produtos
- Validação de formulários
- Interface responsiva e feedback visual

### Como rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/emutua-frontend.git
   cd emutua-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as variáveis de ambiente criando um arquivo `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

O frontend estará disponível em `http://localhost:3000` e já estará pronto para consumir o backend (Laravel) conforme as rotas especificadas.

### Observações

- O backend (Laravel + Doctrine) está em outro repositório `https://github.com/ribeirosacarlos/emutua-backend`.
- O frontend consome as rotas REST do backend para todas as operações de produto.
- Caso queira customizar endpoints, ajuste a variável `NEXT_PUBLIC_API_URL`.
