variable "project_id" {
    type = string
    description = "GCPプロジェクトID"
}

variable "region" {
    type = string
    default = "asia-northeast1"
}

provider "google" {
    project = var.project_id
    region = var.region
}

variable "db_password" {
    type = string
    sensitive = true
    description = "20260922PW"
}