resource "aws_dynamodb_table" "main" {
  name         = var.project_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  attribute {
    name = "leaderboardKey"
    type = "S"
  }

  attribute {
    name = "score"
    type = "N"
  }

  global_secondary_index {
    name            = "leaderboard-index"
    hash_key        = "leaderboardKey"
    range_key       = "score"
    projection_type = "INCLUDE"
    non_key_attributes = [
      "userName",
    ]
  }
}
