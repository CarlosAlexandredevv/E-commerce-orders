# 🛒 E-commerce Orders

## 📋 Descrição

Este projeto é uma aplicação de back-end para gerenciamento e processamento de pedidos de um sistema de e-commerce. Ele foi desenvolvido com foco em escalabilidade, organização e boas práticas, utilizando **NestJS**, **TypeORM** e **Bull** para filas assíncronas, seguindo os princípios da **Clean Architecture**.

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **Bull (com Redis)**
- **Docker & Docker Compose**
- **Jest** (para testes)

## 🧱 Arquitetura

A estrutura do projeto segue a Clean Architecture, dividindo responsabilidades entre:

```
src/
├── application/      # Casos de uso (regras de negócio da aplicação).
├── config/           # Configuração do TypeORM.
├── domain/           # Entidades, interfaces e contratos da regra de negócio.
├── endpoints         # Arquivo base para realizar as requisições.
├── infrastructure/   # Implementações concretas: repositórios, filas, banco de dados, etc.
├── interfaces/       # Entrada e saída da aplicação: controllers, DTOs, validações
```

## 📝 Exemplos de Código

### Exemplo de Entidade

```typescript
// src/domain/entities/order.entity.ts
export class Order {
  id?: string;
  createdAt?: Date;
  status?: OrderStatus;
  processedAt?: Date;
  customer: Customer;
  products: Product[];
}
```

### Exemplo de Caso de uso

```typescript
// src/application/use-cases/create-order.usecase.ts
@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    // ...
  ) {}

  async execute(data: CreateOrderDto) {
    try {
      const customer = await this.upsertCustomer(data.customer);
      const products = await this.createProducts(data.products);

      const order = this.orderRepo.create({
        customer,
        products,
        status: OrderStatus.Pending,
      });

      const savedOrder = await this.orderRepo.save(order);

      await this.orderQueue.add('processOrder', { orderId: savedOrder.id });

      return { order: savedOrder };
    } catch {
      throw new BadRequestException('Failed to create order');
    }
  }
}
```

## 📦 Funcionalidades

- **Registrar Pedido**: Salva os dados do pedido no banco de dados.
- **Processamento Assíncrono**: Envia o pedido para uma fila (Bull) e processa em background.
  - Atualiza o status do pedido para `Processed`.
  - Registra a data e hora da finalização no log.
- **Consulta de Pedidos**:
  - Filtro por **status** (`Pending`, `Processed`)
  - Filtro por **intervalo de datas de criação**

## ⚙️ Como Executar

### 1. Clonar o Projeto

```bash
git clone https://github.com/CarlosAlexandredevv/E-commerce-orders.git
cd E-commerce-orders
```

### 2. Configurar Ambiente

Crie um arquivo `.env` na raiz com base no `.env.example` (copie e cole o exemplo abaixo para ambiente de desenvolvimento):

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=ecommerce
```

### 3. Executar Localmente

⚠️ **Atenção:**

> Certifique-se de que o **Docker Desktop** está instalado e rodando antes de executar o comando abaixo.  
> Se o Docker não estiver ativo, o comando irá falhar ao tentar subir os containers necessários.

No arquivo `package.json`, há um comando que facilita o setup do ambiente: ao executar `npm run start:dev`, o Docker Compose será iniciado automaticamente, subindo os containers do PostgreSQL e Redis, e em seguida a aplicação NestJS será iniciada em modo de desenvolvimento.

```bash
npm install
npm run start:dev
```

O comando utilizado é:

```json
"start:dev": "docker-compose up -d && nest start --env-file .env --watch"
```

Assim, você não precisa subir os serviços manualmente — basta rodar o comando acima para ter todo o ambiente pronto para desenvolvimento.

## 📬 Endpoints Disponíveis

### Registrar Pedido

`POST /orders`

#### Body:

```json
{
  "products": [{ "name": "Teclado Mecânico", "quantity": 1, "price": 300 }],
  "customer": {
    "name": "João da Silva",
    "telefone": "119888877764647",
    "cpf": "123.456.789-00",
    "email": "teste@gmail.com",
    "address": {
      "logradouro": "Rua Exemplo",
      "numero": "123",
      "complemento": "Apto 45",
      "bairro": "Centro",
      "cidade": "Fortaleza",
      "estado": "CE",
      "cep": "01000-000"
    }
  }
}
```

### Consultar Pedidos

`GET /orders`

#### Filtros opcionais via query params:

1. `status`: `Pending` ou `Processed`

2. `startDate` e `endDate`: intervalo de datas (em formato ISO)

## Exemplos de Uso:

### Buscar todos os pedidos processados:

```
GET http://localhost:3000/orders?status=Processed
```

### Buscar pedidos processados em 01/05/2025

```
GET http://localhost:3000/orders?status=Processed&startDate=2025-05-01T00:00:00Z&endDate=2025-05-01T23:59:59Z
```

### Buscar pedidos criados em 01/05/2024:

```
GET http://localhost:3000/orders?startDate=2024-05-01
```

### Buscar todos os pedidos criados em 01/05/2025:

```
GET http://localhost:3000/orders?startDate=2025-05-01T00:00:00Z&endDate=2025-05-01T23:59:59Z
```

### Buscar pedidos pendentes em 01/05/2025:

```
GET http://localhost:3000/orders?status=Pending&startDate=2025-05-01T00:00:00Z&endDate=2025-05-01T23:59:59Z
```

## 📖 Documentação Interativa (Swagger)

Acesse a documentação interativa dos endpoints pelo Swagger:

[http://localhost:3000/api](http://localhost:3000/api)

Nela, você pode visualizar todos os endpoints, exemplos de requisições e testar as operações diretamente pela interface web.

## 🧪 Testes

Para rodar os testes automatizados, utilize o comando abaixo:

```bash
npm run test
```

## 🧾 Extras

- ✅ Arquitetura limpa e escalável
- ✅ Processamento assíncrono com Bull
- ✅ Docker e Docker Compose
- ✅ Testes automatizados com Jest
