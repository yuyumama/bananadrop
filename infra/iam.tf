# IAM resources for GitHub Actions CI/CD and Lambda execution roles
# (bootstrap fix applied: cognito-idp permissions now in place)
data "aws_caller_identity" "current" {}

locals {
  oidc_provider_arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
}

# --- infra.yml role (Terraform apply) ---

resource "aws_iam_role" "github_actions_infra" {
  name = "${var.project_name}-github-actions-infra"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = local.oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              "repo:${var.github_repo}:ref:refs/heads/main",
              "repo:${var.github_repo}:pull_request",
            ]
          }
        }
      }
    ]
  })
}

# Infra role: tfstate access
resource "aws_iam_role_policy" "infra_tfstate" {
  name = "tfstate-access"
  role = aws_iam_role.github_actions_infra.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket",
        ]
        Resource = [
          "arn:aws:s3:::${var.project_name}-tfstate",
          "arn:aws:s3:::${var.project_name}-tfstate/*",
        ]
      }
    ]
  })
}

# Infra role: manage AWS resources
# Scope to Phase 1 (S3 + CloudFront + IAM). Expand as later phases land.
resource "aws_iam_role_policy" "infra_resources" {
  name = "infra-resources"
  role = aws_iam_role.github_actions_infra.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3Management"
        Effect = "Allow"
        Action = [
          "s3:CreateBucket",
          "s3:DeleteBucket",
          "s3:Get*",
          "s3:List*",
          "s3:Put*",
          "s3:DeleteObject",
        ]
        Resource = [
          "arn:aws:s3:::${var.project_name}-*",
          "arn:aws:s3:::${var.project_name}-*/*",
        ]
      },
      {
        # CreateDistribution, ListOriginAccessControls 等はリソースレベルの制限を
        # サポートしていないため Resource = "*" が必要
        Sid    = "CloudFrontManagement"
        Effect = "Allow"
        Action = [
          "cloudfront:CreateDistribution",
          "cloudfront:DeleteDistribution",
          "cloudfront:GetDistribution",
          "cloudfront:GetDistributionConfig",
          "cloudfront:UpdateDistribution",
          "cloudfront:TagResource",
          "cloudfront:UntagResource",
          "cloudfront:ListTagsForResource",
          "cloudfront:CreateOriginAccessControl",
          "cloudfront:DeleteOriginAccessControl",
          "cloudfront:GetOriginAccessControl",
          "cloudfront:UpdateOriginAccessControl",
          "cloudfront:ListOriginAccessControls",
          "cloudfront:CreateInvalidation",
        ]
        Resource = "*"
      },
      {
        Sid    = "IAMRoleManagement"
        Effect = "Allow"
        Action = [
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:GetRole",
          "iam:UpdateRole",
          "iam:UpdateAssumeRolePolicy",
          "iam:PassRole",
          "iam:TagRole",
          "iam:UntagRole",
          "iam:ListRolePolicies",
          "iam:ListAttachedRolePolicies",
          "iam:ListInstanceProfilesForRole",
          "iam:PutRolePolicy",
          "iam:GetRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
        ]
        Resource = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/${var.project_name}-*"
      },
      {
        Sid      = "CognitoManagement"
        Effect   = "Allow"
        Action   = ["cognito-idp:*"]
        Resource = "arn:aws:cognito-idp:${var.aws_region}:${data.aws_caller_identity.current.account_id}:userpool/*"
      },
    ]
  })
}

# --- deploy.yml role (S3 sync + CloudFront invalidation) ---

resource "aws_iam_role" "github_actions_deploy" {
  name = "${var.project_name}-github-actions-deploy"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = local.oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo}:ref:refs/heads/main"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "deploy_s3_sync" {
  name = "s3-sync"
  role = aws_iam_role.github_actions_deploy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket",
        ]
        Resource = [
          aws_s3_bucket.frontend.arn,
          "${aws_s3_bucket.frontend.arn}/*",
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy" "deploy_cloudfront_invalidation" {
  name = "cloudfront-invalidation"
  role = aws_iam_role.github_actions_deploy.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
        ]
        Resource = aws_cloudfront_distribution.main.arn
      }
    ]
  })
}
