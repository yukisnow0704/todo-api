resource "google_secret_manager_secret" "todo_db_password" {
  secret_id = "todo-db-password"

  replication {
    auto {}
  }
}