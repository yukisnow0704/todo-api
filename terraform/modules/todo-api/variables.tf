variable "project_id" {
  type        = string
}

variable "region" {
  type        = string
  description = "asia-northeast1"
}

variable "environment" {
  type        = string
  description = "staging"
}

variable "db_password" {
  type        = string
  sensitive = true
}

variable "alert_email" {
  type        = string
}

variable "image_tag" {
  type = string
  description = "..."
  default     = "latest"
}

locals {
  name_suffix = var.environment == "production" ? "" : "-${var.environment}"
}
