resource "google_secret_manager_secret" "todo_db_password" {
  secret_id = "todo-db-password${local.name_suffix}"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "worker_secret" {
  secret_id = "worker-secret${local.name_suffix}"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_iam_member" "cloud_run_worker_secret_access" {
  secret_id = google_secret_manager_secret.worker_secret.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = local.compute_sa
}