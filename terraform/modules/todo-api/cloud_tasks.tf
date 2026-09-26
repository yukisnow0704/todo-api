resource "google_project_service" "cloudtasks" {
    project = var.project_id
    service = "cloudtasks.googleapis.com"

    disable_on_destroy = false
}

resource "google_cloud_tasks_queue" "analyze_todo" {
    name = "analyze-todo-queue${local.name_suffix}"
    location = var.region

    rate_limits {
        max_dispatches_per_second = 5
        max_concurrent_dispatches = 5
    }

    retry_config {
        max_attempts = 5
        min_backoff = "5s"
        max_backoff = "60s"
    }

    depends_on = [google_project_service.cloudtasks]
}

resource "google_project_iam_member" "cloud_run_cloud_tasks_enqueuer" {
    project = var.project_id
    role = "roles/cloudtasks.enqueuer"
    member = local.compute_sa
}
