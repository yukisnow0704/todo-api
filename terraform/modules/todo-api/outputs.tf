output "cloud_run_url" {
  value = google_cloud_run_v2_service.todo_api.uri
}
