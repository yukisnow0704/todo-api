module "todo_api" {
  source = "../../modules/todo-api"

  project_id = var.project_id
  region = var.region
  environment = "production"
  db_password = var.db_password
  alert_email = var.alert_email
  image_tag = var.image_tag
}

output "cloud_run_url" {
  value       = module.todo_api.cloud_run_url
}
