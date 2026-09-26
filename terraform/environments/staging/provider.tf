provider "google" {
  project = var.project_id
  region = var.region
}

variable "project_id" {
  type        = string
  description = "my-hono-app-v2"
}

variable "region" {
  type        = string
  description = "asia-northeast1"
}

variable "db_password" {
  type        = string
  sensitive = true
}

variable "alert_email" {
  type        = string
}

variable "image_tag" {
  type        = string
  default     = "latest"
}