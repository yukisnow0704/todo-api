data "google_project" "current" {
  project_id = var.project_id
}

locals {
  compute_sa = "serviceAccount:${data.google_project.current.number}-compute@developer.gserviceaccount.com"
}

resource "google_secret_manager_secret_iam_member" "cloud_run_secret_access" {
  secret_id = google_secret_manager_secret.todo_db_password.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = local.compute_sa
}

resource "google_project_iam_member" "cloud_run_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = local.compute_sa
}
