# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = var.project_name

  # Email sign-up
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # Password policy (Cognito defaults)
  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  # MFA disabled (per architecture doc)
  mfa_configuration = "OFF"

  # Email verification message
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "${var.project_name} - Verification Code"
    email_message        = "Your verification code is {####}"
  }

  # Schema: email is required
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  # Account recovery via email
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}

# App Client (SPA - no client secret)
resource "aws_cognito_user_pool_client" "spa" {
  name         = "${var.project_name}-spa"
  user_pool_id = aws_cognito_user_pool.main.id

  # No client secret for SPA
  generate_secret = false

  # Auth flows
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]

  # Token expiry (per architecture doc: Access 1h, Refresh 30d)
  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 30

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  # Prevent user existence errors (security best practice)
  prevent_user_existence_errors = "ENABLED"
}
