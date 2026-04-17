# APP COMPRINHAS

Aplicativo mobile de planejamento alimentar e lista de compras desenvolvido com **React Native + Expo**, permitindo ao usuário organizar receitas, planejar refeições semanais e gerar listas de compras automaticamente.

---

## Tecnologias

### Frontend
- React Native + Expo
- TypeScript
- Redux Toolkit — gerenciamento de estado global
- React Navigation — navegação entre telas

### Backend
- Node.js + Express
- PostgreSQL — dados de usuários
- MongoDB — receitas
- JWT + Refresh Token — autenticação

### Outros
- Docker — ambiente de desenvolvimento
- WatermelonDB (planejado) — persistência offline
- Cloudinary (planejado) — imagens de receitas

---


## ⚙️ Configuração

### Instalar dependências
```
cd frontend && npm install
cd backend && npm install
```

### Rodar com Docker
```
docker-compose up -d
```

### Rodar frontend
```
cd frontend
npx expo start
```

### Rodar backend
```
cd backend
npm run 
```

---

## Funcionalidades Atuais

- **RF01** — Cadastro de usuário com preferências alimentares  
- **RF03** — Dashboard com resumo semanal  
- **RF04** — Cadastro de receitas  
- **RF05** — Listagem de receitas com informações básicas  
- **RF06** — Visualização detalhada de receitas  
- **RF07** — Favoritar receitas  
- **RF08** — Planejamento semanal de refeições  
- **RF09** — Geração automática de lista de compras  
- **RF10** — Edição manual da lista de compras  

---

## Requisitos Funcionais <a name="requisitos-funcionais"></a>

| Número | Descrição |
| :---: | :--- |
| **RF1** | Cadastro de usuário com preferências alimentares (vegetariano, sem glúten, sem lactose). |
| **RF2** | Login com biometria (impressão digital ou reconhecimento facial). |
| **RF3** | Dashboard com resumo semanal (receitas planejadas, lista de compras e dicas). |
| **RF4** | Cadastro de receitas com ingredientes, modo de preparo, tempo, porções e categoria. |
| **RF5** | Listagem de receitas com busca e filtros por nome, categoria, tempo e preferências. |
| **RF6** | Visualização detalhada da receita com ingredientes, passos e ações (favoritar/compartilhar). |
| **RF7** | Favoritar receitas com sincronização local e remota. |
| **RF8** | Planejamento semanal de refeições (arrastar receitas para dias da semana). |
| **RF9** | Geração automática de lista de compras baseada no planejamento. |
| **RF10** | Edição manual da lista de compras com persistência e compartilhamento. |
| **RF11** | Scanner de código de barras para adicionar produtos automaticamente à lista. |
| **RF12** | Navegação por comandos de voz durante o preparo da receita. |
| **RF13** | Timer com alerta vibratório para etapas da receita. |
| **RF14** | Compartilhamento de receitas via link (deep linking). |
| **RF15** | Modo offline para receitas e listas com sincronização posterior. |
| **RF16** | Sugestão de receitas baseada nos ingredientes disponíveis. |
| **RF17** | Ajuste automático de porções com recalculo de ingredientes. |
| **RF18** | Conversão automática de unidades de medida via API externa. |
| **RF19** | Mapa de supermercados próximos com rotas. |
| **RF20** | Histórico de receitas preparadas pelo usuário. |
| **RF21** | Avaliação e comentários em receitas. |
| **RF22** | Sistema de gamificação com desafios e recompensas. |
| **RF23** | Modo escuro automático baseado no sensor de luz. |
| **RF24** | Exportação da lista de compras em PDF. |
| **RF25** | Suporte a múltiplas listas de compras. |
| **RF26** | Duplicar e editar receitas existentes. |
| **RF27** | Lembretes push para preparo de refeições. |
| **RF28** | Sugestão de receitas baseada no clima (API externa). |
| **RF29** | Recuperação de senha via e-mail. |
| **RF30** | Onboarding inicial com apresentação do app. |

---

## Requisitos Não Funcionais <a name="requisitos-nao-funcionais"></a>

| Número | Descrição |
| :---: | :--- |
| **RNF1** | O aplicativo deve ser desenvolvido em React Native com TypeScript. |
| **RNF2** | O gerenciamento de estado deve utilizar Redux Toolkit. |
| **RNF3** | O backend deve ser uma API REST em Node.js com Express. |
| **RNF4** | O sistema deve utilizar PostgreSQL para usuários e MongoDB para receitas. |
| **RNF5** | A autenticação deve ser baseada em JWT com refresh token. |
| **RNF6** | O app deve funcionar offline utilizando WatermelonDB e sincronizar quando online. |
| **RNF7** | Imagens devem ser armazenadas em serviço externo (Cloudinary). |
| **RNF8** | Integrações com APIs externas devem ser feitas via backend (proxy). |
| **RNF9** | O sistema deve ser responsivo e adaptável a diferentes tamanhos de tela. |
| **RNF10** | O projeto deve possuir versionamento no Git com CI/CD automatizado. |

## Autor

Issami Umeoka
