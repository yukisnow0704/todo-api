resource "google_sql_database_instance" "todo_api_db" {
  name             = "todo-api-db"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier              = "db-f1-micro"
    activation_policy = "ALWAYS"

    disk_size = 10
    disk_type = "PD_HDD"

    backup_configuration {
      enabled = false
    }
  }

  # 誤ってterraform destroyしても即消えないようにする安全弁
  deletion_protection = true
}

resource "google_sql_database" "todoapp" {
  name     = "todoapp"
  instance = google_sql_database_instance.todo_api_db.name
}

resource "google_sql_user" "appuser" {
  name     = "appuser"
  instance = google_sql_database_instance.todo_api_db.name
  password = var.db_password
}