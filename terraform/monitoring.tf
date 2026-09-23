resource "google_monitoring_notification_channel" "email" {
  display_name = "todo-api Alert Email"
  type = "email"

  labels = {
    email_address = var.alert_email
  }
}

resource "google_monitoring_uptime_check_config" "todo_api" {
  display_name = "todo-api uptime check"
  timeout = "10s"
  period = "60s"

  http_check {
    path = "/api/todos"
    port = 443
    use_ssl = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host = replace(replace(google_cloud_run_v2_service.todo_api.uri, "https://", ""), "/", "")
    }
  }
}

resource "google_monitoring_alert_policy" "todo_api_down" {
  display_name = "todo-api is down"
  combiner = "OR"

  conditions {
    display_name = "Uptime check failed"

    condition_threshold {
      filter = "resource.type=\"uptime_url\" AND metric.type=\"monitoring.googleapis.com/uptime_check/check_passed\" AND metric.label.check_id=\"${google_monitoring_uptime_check_config.todo_api.uptime_check_id}\""
      comparison = "COMPARISON_LT"
      threshold_value = 1
      duration = "60s"
      
      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_FRACTION_TRUE"
        cross_series_reducer = "REDUCE_MEAN"
        group_by_fields      = ["resource.label.host"]
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.id]

  alert_strategy {
    auto_close = "1800s"
  }
}