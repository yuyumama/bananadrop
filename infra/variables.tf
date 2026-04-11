variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "bananadrop"
}

variable "github_repo" {
  description = "GitHub repository in owner/repo format"
  type        = string
  default     = "yuyumama/bananadrop"
}
