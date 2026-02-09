# Scoped FIS Policy (replace Resource = "*")
resource "aws_iam_role_policy" "fis_scoped" {
  name = "${var.project_name}-${var.environment}-fis-scoped"
  role = aws_iam_role.fis.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:RebootInstances",
          "ec2:StopInstances",
          "ec2:StartInstances",
          "ec2:TerminateInstances",
          "ec2:DescribeInstances"
        ]
        Resource = "arn:aws:ec2:${var.aws_region}:${data.aws_caller_identity.current.account_id}:instance/*"
        Condition = {
          StringEquals = {
            "ec2:ResourceTag/Name" = "${var.project_name}-${var.environment}-haproxy"
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "autoscaling:SetInstanceHealth",
          "autoscaling:DescribeAutoScalingGroups"
        ]
        Resource = aws_autoscaling_group.haproxy.arn
      },
      {
        Effect = "Allow"
        Action = [
          "ssm:SendCommand",
          "ssm:ListCommands",
          "ssm:GetCommandInvocation"
        ]
        Resource = [
          "arn:aws:ssm:${var.aws_region}::document/AWSFIS-Run-CPU-Stress",
          "arn:aws:ssm:${var.aws_region}::document/AWSFIS-Run-Network-Latency",
          "arn:aws:ec2:${var.aws_region}:${data.aws_caller_identity.current.account_id}:instance/*"
        ]
        Condition = {
          StringEquals = {
            "ssm:resourceTag/Name" = "${var.project_name}-${var.environment}-haproxy"
          }
        }
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = aws_cloudwatch_log_group.fis.arn
      }
    ]
  })
}
