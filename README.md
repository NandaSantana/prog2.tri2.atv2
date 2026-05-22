# prog2.tri2.atv2

# To-Do List com SQLite — prog2.tri2.ativ2

Projeto de lista de tarefas usando **Bun** como runtime e **SQLite** como banco de dados, sem uso de arquivo JSON.

---

## Como rodar

### Pré-requisitos
  Bun instalado na máquina

### Passos

```bash
# 1. Entre na pasta do projeto
cd prog2.tri2.ativ2

# 2. Rode o arquivo
bun run index.ts
```

O arquivo `database.sqlite` será criado automaticamente na primeira execução.

---

## Como testar as rotas

Ao rodar o arquivo, o próprio código já executa um teste automático no final, mostrando no terminal o resultado de cada operação:

```bash
bun run todo.ts
```

Saída esperada no terminal:

```
Após adicionar: [
  { id: 1, title: "Estudar TypeScript" },
  { id: 2, title: "Fazer a atividade" },
  { id: 3, title: "Item para deletar" }
]
Após deletar id 3: [
  { id: 1, title: "Estudar TypeScript" },
  { id: 2, title: "Fazer a atividade" }
]
Após atualizar id 1: [
  { id: 1, title: "Estudar TypeScript e Bun" },
  { id: 2, title: "Fazer a atividade" }
]
```

---

## Estrutura de arquivos

```
prog2.tri2.ativ2/
├── todo.ts          → código principal com banco de dados
├── database.sqlite  → banco SQLite (criado automaticamente)
└── README.md        → este arquivo
```

---

## Como o código funciona

### Conexão com o banco

```ts
const db = new Database("database.sqlite")
```

Abre (ou cria) o arquivo `database.sqlite`. Todo dado salvo fica nesse arquivo.

---

### Criação da tabela

```ts
db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT    NOT NULL
  )
`)
```

- `CREATE TABLE IF NOT EXISTS` — cria a tabela só se ela ainda não existir, então é seguro rodar várias vezes.
- `id` — número gerado automaticamente pelo banco para cada item.
- `title` — o texto da tarefa, obrigatório.

---

### Queries preparadas

```ts
const querySelectItems = db.query("SELECT * FROM items")
const queryInsertItem  = db.query("INSERT INTO items (title) VALUES (?)")
const queryDeleteItem  = db.query("DELETE FROM items WHERE id = ?")
const queryUpdateItem  = db.query("UPDATE items SET title = ? WHERE id = ?")
```

As queries são **preparadas uma vez** quando o programa inicia e reutilizadas em cada chamada de função. O `?` é um placeholder — o valor real é passado na hora de executar, evitando erros e problemas de segurança.

---

### Classe `Item`

```ts
class Item {
  constructor(public title: string) {}
}
```

Representa uma tarefa. Só tem o `title` (o `id` é gerado pelo banco automaticamente).

---

### Classe `TodoList`

#### `addItem(item: Item)`

```ts
addItem(item: Item) {
  queryInsertItem.run(item.title)
}
```

Recebe um objeto `Item` e insere o título dele no banco com `INSERT`. O banco gera o `id` sozinho.

---

#### `getItems()`

```ts
getItems() {
  return querySelectItems.all()
}
```

Executa um `SELECT * FROM items` e retorna um array com todos os itens salvos no banco.

---

#### `deleteItem(id: number)`

```ts
deleteItem(id: number) {
  queryDeleteItem.run(id)
}
```

Recebe o `id` do item e executa `DELETE FROM items WHERE id = ?`, removendo aquele registro do banco.

---

#### `updateItem(id: number, newTitle: string)`

```ts
updateItem(id: number, newTitle: string) {
  queryUpdateItem.run(newTitle, id)
}
```

Recebe o `id` e o novo título, e executa `UPDATE items SET title = ? WHERE id = ?`. A ordem dos parâmetros no `.run()` segue a ordem dos `?` no SQL: primeiro o título, depois o id.
