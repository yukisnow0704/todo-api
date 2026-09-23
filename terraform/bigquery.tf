resource "google_bigquery_dataset" "todo_api_logs" {
  dataset_id  = "todo_api_logs"
  location    = "asia-northeast1"
  description = "todo-apiの操作ログ(Cloud Loggingからのシンク先)"

  # 検証用データセットなので、テーブルを90日で自動的に掃除する
  default_table_expiration_ms = 7776000000 # 90日
}

resource "google_logging_project_sink" "todo_operations" {
  name        = "todo-operations-to-bigquery"
  destination = "bigquery.googleapis.com/projects/${var.project_id}/datasets/${google_bigquery_dataset.todo_api_logs.dataset_id}"

  filter = "resource.type=\"cloud_run_revision\" AND resource.labels.service_name=\"todo-api\" AND jsonPayload.event=\"todo_operation\""

  # ログシンク専用のサービスアカウントを自動発行してもらう
  unique_writer_identity = true

  bigquery_options {
    use_partitioned_tables = true
  }
}

resource "google_bigquery_dataset_iam_member" "sink_writer" {
  dataset_id = google_bigquery_dataset.todo_api_logs.dataset_id
  role       = "roles/bigquery.dataEditor"
  member     = google_logging_project_sink.todo_operations.writer_identity
}