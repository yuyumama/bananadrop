output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.main.id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "s3_bucket_name" {
  description = "Frontend S3 bucket name"
  value       = aws_s3_bucket.frontend.id
}

output "github_actions_infra_role_arn" {
  description = "IAM role ARN for infra.yml"
  value       = aws_iam_role.github_actions_infra.arn
}

output "github_actions_deploy_role_arn" {
  description = "IAM role ARN for deploy.yml"
  value       = aws_iam_role.github_actions_deploy.arn
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.main.id
}

output "cognito_client_id" {
  description = "Cognito App Client ID"
  value       = aws_cognito_user_pool_client.spa.id
}
