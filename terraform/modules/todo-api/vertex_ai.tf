resource "google_project_iam_member" "cloud_run_vertex_ai_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${data.google_project.current.number}-compute@developer.gserviceaccount.com"
}