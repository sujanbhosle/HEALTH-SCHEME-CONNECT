
variable "aws_region" {
  default = "us-east-1"
}

variable "frontend_bucket_name" {
  description = "Unique name for your S3 bucket"
  default     = "health-scheme-frontend-demo-unique-id"
}
