resource "google_artifact_registry_repository" "todo_api" {
  repository_id = "todo-api-repo"
  location      = var.region
  format        = "DOCKER"
  description   = "todo-api docker images"
}