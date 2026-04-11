terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # NOTE: bucket name must match "${var.project_name}-tfstate" (default: bananadrop-tfstate).
  # Backend blocks do not support variables — keep in sync manually.
  backend "s3" {
    bucket       = "bananadrop-tfstate"
    key          = "bananadrop/terraform.tfstate"
    region       = "ap-northeast-1"
    encrypt      = true
    use_lockfile = true
  }
}
