resource "google_secret_manager_secret" "todo_db_password" {
  secret_id = "todo-db-password${local.name_suffix}"

  replication {
    auto {}
  }
}