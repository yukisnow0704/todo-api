resource "google_cloud_run_v2_service" "todo_api" {
  name     = "todo-api"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      # イメージはCI/CDが書き換える前提なので、ここでは現在のタグを指定
      image = "asia-northeast1-docker.pkg.dev/${var.project_id}/todo-api-repo/todo-api:latest"

      env {
        name  = "INSTANCE_CONNECTION_NAME"
        value = "${var.project_id}:${var.region}:todo-api-db"
      }
      env {
        name  = "DB_USER"
        value = "appuser"
      }
      env {
        name  = "DB_NAME"
        value = "todoapp"
      }
      env {
        name = "DB_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.todo_db_password.secret_id
            version = "latest"
          }
        }
      }
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.todo_api_db.connection_name]
      }
    }
  }

  lifecycle {
    # docker build & push はCI/CDが行うので、Terraformがイメージタグの差分で
    # 余計なplanを出さないよう無視する
    ignore_changes = [template[0].containers[0].image]
  }
}

resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.todo_api.location
  service  = google_cloud_run_v2_service.todo_api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}