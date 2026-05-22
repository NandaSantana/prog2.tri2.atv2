import { Database } from "bun:sqlite";

const db = new Database("database.sqlite")

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT    NOT NULL
  )
`)

const querySelectItems = db.query("SELECT * FROM items")
const queryInsertItem  = db.query("INSERT INTO items (title) VALUES (?)")
const queryDeleteItem  = db.query("DELETE FROM items WHERE id = ?")
const queryUpdateItem  = db.query("UPDATE items SET title = ? WHERE id = ?")

class Item {
  constructor(public title: string) {}
}

class TodoList {

  addItem(item: Item) {
    queryInsertItem.run(item.title)
  }

  getItems() {
    return querySelectItems.all()
  }

  deleteItem(id: number) {
    queryDeleteItem.run(id)
  }

  updateItem(id: number, newTitle: string) {
    queryUpdateItem.run(newTitle, id)
  }
}

const todo = new TodoList()

todo.addItem(new Item("Estudar TypeScript"))
todo.addItem(new Item("Fazer a atividade"))
todo.addItem(new Item("Item para deletar"))

console.log("Após adicionar:", todo.getItems())

todo.deleteItem(3)
console.log("Após deletar id 3:", todo.getItems())

todo.updateItem(1, "Estudar TypeScript e Bun")
console.log("Após atualizar id 1:", todo.getItems())