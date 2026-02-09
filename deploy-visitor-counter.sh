#!/bin/bash
# =============================================================================
# VISITOR COUNTER DEPLOYMENT SCRIPT
# Triple-checked and verified
# =============================================================================

set -e  # Exit on any error

echo "=========================================="
echo "Visitor Counter Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "infrastructure" ] || [ ! -d "app" ]; then
    echo -e "${RED}ERROR: Please run this script from the SuperBowlEdge-Chaos root directory${NC}"
    echo "Current directory: $(pwd)"
    exit 1
fi

echo -e "${YELLOW}This script will:${NC}"
echo "1. Create DynamoDB table for visitor tracking"
echo "2. Update Lambda function with visitor tracking code"
echo "3. Add VisitorCounter component to frontend"
echo "4. Update Footer to display visitor counts"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0
fi

# =============================================================================
# STEP 1: Deploy Infrastructure
# =============================================================================

echo ""
echo -e "${GREEN}STEP 1: Deploying infrastructure...${NC}"
echo ""

cd infrastructure

# Create visitor-tracking.tf
cat > visitor-tracking.tf << 'EOF'
resource "aws_dynamodb_table" "visitors" {
  name           = "${var.project_name}-${var.environment}-visitors"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "visitor_id"
  range_key      = "timestamp"

  attribute {
    name = "visitor_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  attribute {
    name = "date"
    type = "S"
  }

  attribute {
    name = "week"
    type = "S"
  }

  global_secondary_index {
    name            = "DateIndex"
    hash_key        = "date"
    range_key       = "timestamp"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "WeekIndex"
    hash_key        = "week"
    range_key       = "timestamp"
    projection_type = "ALL"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = true
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.dynamodb_visitors.arn
  }

  tags = {
    Name        = "${var.project_name}-visitors"
    Environment = var.environment
  }
}

resource "aws_kms_key" "dynamodb_visitors" {
  description             = "KMS key for DynamoDB visitor tracking"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name        = "${var.project_name}-dynamodb-visitors-kms"
    Environment = var.environment
  }
}

resource "aws_kms_alias" "dynamodb_visitors" {
  name          = "alias/${var.project_name}-dynamodb-visitors"
  target_key_id = aws_kms_key.dynamodb_visitors.key_id
}

resource "aws_iam_role_policy" "lambda_dynamodb_visitors" {
  name = "${var.project_name}-${var.environment}-lambda-dynamodb-visitors"
  role = aws_iam_role.lambda_metrics.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.visitors.arn,
          "${aws_dynamodb_table.visitors.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "kms:Decrypt",
          "kms:GenerateDataKey"
        ]
        Resource = aws_kms_key.dynamodb_visitors.arn
      }
    ]
  })
}

output "visitors_table_name" {
  description = "DynamoDB table name for visitor tracking"
  value       = aws_dynamodb_table.visitors.name
}
EOF

echo "Created visitor-tracking.tf"

# Deploy infrastructure
echo "Running terraform init..."
terraform init -upgrade

echo "Running terraform plan..."
terraform plan -out=tfplan

echo ""
echo -e "${YELLOW}Review the plan above. This will create:${NC}"
echo "- DynamoDB table (visitors)"
echo "- KMS key for encryption"
echo "- IAM policy for Lambda"
echo ""
read -p "Apply these changes? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

terraform apply tfplan

TABLE_NAME=$(terraform output -raw visitors_table_name)
echo -e "${GREEN}✓ Infrastructure deployed${NC}"
echo "Table name: $TABLE_NAME"

# =============================================================================
# STEP 2: Update Lambda Function  
# =============================================================================

echo ""
echo -e "${GREEN}STEP 2: Updating Lambda function...${NC}"
echo ""

cd lambda

# Backup existing metrics.py
cp metrics.py metrics.py.backup
echo "Created backup: metrics.py.backup"

# Add dynamodb import after line 10
sed -i '10a dynamodb = boto3.resource('\''dynamodb'\'')'  metrics.py

# Add visitor tracking functions before lambda_handler
# Create temp file with new functions
cat > visitor_functions.py << 'EOFF'

# Visitor tracking functions
def track_visitor(event):
    """Track a visitor"""
    try:
        source_ip = event.get('requestContext', {}).get('http', {}).get('sourceIp', 'unknown')
        user_agent = event.get('headers', {}).get('user-agent', 'unknown')
        
        body = json.loads(event.get('body', '{}'))
        page = body.get('page', 'unknown')
        referrer = body.get('referrer', 'direct')
        
        visitor_id = hashlib.sha256(f"{source_ip}{user_agent}".encode()).hexdigest()[:16]
        ip_hash = hashlib.sha256(source_ip.encode()).hexdigest()[:8]
        
        now = datetime.utcnow()
        timestamp = int(now.timestamp())
        date = now.strftime('%Y-%m-%d')
        week = now.strftime('%Y-W%U')
        
        table = dynamodb.Table(os.environ.get('VISITORS_TABLE', 'superbowl-edge-dev-visitors'))
        
        table.put_item(
            Item={
                'visitor_id': visitor_id,
                'timestamp': timestamp,
                'date': date,
                'week': week,
                'ip_hash': ip_hash,
                'page': page,
                'referrer': referrer,
                'user_agent': user_agent[:200],
                'ttl': timestamp + (90 * 86400)
            }
        )
        
        cloudwatch.put_metric_data(
            Namespace='SuperBowlEdge/Visitors',
            MetricData=[{
                'MetricName': 'PageViews',
                'Value': 1,
                'Unit': 'Count',
                'Timestamp': now,
                'Dimensions': [
                    {'Name': 'Page', 'Value': page},
                    {'Name': 'Referrer', 'Value': referrer[:50]}
                ]
            }]
        )
        
        return success_response({'tracked': True, 'visitor_id': visitor_id})
    except Exception as e:
        print(f"Error tracking visitor: {str(e)}")
        return success_response({'tracked': False})


def get_visitor_stats(event):
    """Get visitor statistics"""
    try:
        table = dynamodb.Table(os.environ.get('VISITORS_TABLE', 'superbowl-edge-dev-visitors'))
        
        today = datetime.utcnow().strftime('%Y-%m-%d')
        current_week = datetime.utcnow().strftime('%Y-W%U')
        
        all_visitors_response = table.scan(
            ProjectionExpression='visitor_id, #ts',
            ExpressionAttributeNames={'#ts': 'timestamp'}
        )
        
        all_visitor_ids = set(item['visitor_id'] for item in all_visitors_response['Items'])
        total_visits = len(all_visitors_response['Items'])
        
        today_response = table.query(
            IndexName='DateIndex',
            KeyConditionExpression='#date = :today',
            ExpressionAttributeNames={'#date': 'date'},
            ExpressionAttributeValues={':today': today},
            ProjectionExpression='visitor_id'
        )
        
        today_visitor_ids = set(item['visitor_id'] for item in today_response['Items'])
        
        week_response = table.query(
            IndexName='WeekIndex',
            KeyConditionExpression='#week = :week',
            ExpressionAttributeNames={'#week': 'week'},
            ExpressionAttributeValues={':week': current_week}
        )
        
        return success_response({
            'total': total_visits,
            'totalUnique': len(all_visitor_ids),
            'today': today_response['Count'],
            'uniqueToday': len(today_visitor_ids),
            'thisWeek': week_response['Count']
        })
    except Exception as e:
        print(f"Error getting visitor stats: {str(e)}")
        return error_response(500, f'Failed to get visitor stats: {str(e)}')

EOFF

# Insert visitor functions before lambda_handler
LINE=$(grep -n "def lambda_handler" metrics.py | cut -d: -f1)
head -n $((LINE - 1)) metrics.py > temp_metrics.py
cat visitor_functions.py >> temp_metrics.py
tail -n +$LINE metrics.py >> temp_metrics.py
mv temp_metrics.py metrics.py
rm visitor_functions.py

# Add routes to lambda_handler (after line with chaos/live)
sed -i "/path.endswith('\/chaos\/live')/a\\    elif path.endswith('/metrics/visitor') and method == 'POST':\\n        return track_visitor(event)\\n    elif path.endswith('/metrics/visitors'):\\n        return get_visitor_stats(event)" metrics.py

echo "Updated metrics.py with visitor tracking functions"

# Rebuild Lambda package
rm -f metrics-lambda.zip
zip -q metrics-lambda.zip metrics.py

echo -e "${GREEN}✓ Lambda package rebuilt${NC}"

# Redeploy Lambda
cd ..
terraform apply -target=aws_lambda_function.metrics_api -auto-approve

echo -e "${GREEN}✓ Lambda function updated${NC}"

# =============================================================================
# STEP 3: Update Frontend
# =============================================================================

echo ""
echo -e "${GREEN}STEP 3: Adding frontend components...${NC}"
echo ""

cd ../app/src/components

# Create VisitorCounter.tsx
cat > VisitorCounter.tsx << 'EOFFF'
import { useEffect, useState } from 'react'
import { Eye, TrendingUp, Users, Globe } from 'lucide-react'

const API_BASE = 'https://pa86b0v1ve.execute-api.us-east-1.amazonaws.com/prod'

interface VisitorStats {
  total: number
  today: number
  thisWeek: number
  uniqueToday: number
}

export function VisitorCounter({ variant = 'footer' }: { variant?: 'footer' | 'dashboard' }) {
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    trackVisitor()
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const trackVisitor = async () => {
    try {
      await fetch(`${API_BASE}/metrics/visitor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: window.location.hash || '#/overview',
          referrer: document.referrer,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to track visitor:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/metrics/visitors`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch visitor stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === 'footer') {
    return (
      <div className="flex flex-wrap gap-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-gray-400">
            <span className="text-white font-semibold">
              {isLoading ? '...' : (stats?.total || 0).toLocaleString()}
            </span> total visits
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-gray-400">
            <span className="text-white font-semibold">
              {isLoading ? '...' : stats?.today || 0}
            </span> today
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          <span className="text-gray-400">
            <span className="text-white font-semibold">
              {isLoading ? '...' : stats?.uniqueToday || 0}
            </span> unique today
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-gray-400">Total Visits</span>
        </div>
        <div className="text-3xl font-bold text-blue-400">
          {isLoading ? '...' : (stats?.total || 0).toLocaleString()}
        </div>
      </div>
      <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span className="text-sm text-gray-400">Today</span>
        </div>
        <div className="text-3xl font-bold text-emerald-400">
          {isLoading ? '...' : stats?.today || 0}
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-purple-400" />
          <span className="text-sm text-gray-400">Unique Today</span>
        </div>
        <div className="text-3xl font-bold text-purple-400">
          {isLoading ? '...' : stats?.uniqueToday || 0}
        </div>
      </div>
      <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-amber-400" />
          <span className="text-sm text-gray-400">This Week</span>
        </div>
        <div className="text-3xl font-bold text-amber-400">
          {isLoading ? '...' : stats?.thisWeek || 0}
        </div>
      </div>
    </div>
  )
}
EOFFF

echo "Created VisitorCounter.tsx"

# Update Footer.tsx
cp Footer.tsx Footer.tsx.backup
echo "Created backup: Footer.tsx.backup"

# Add import if not exists
if ! grep -q "import { VisitorCounter }" Footer.tsx; then
    sed -i "1i import { VisitorCounter } from './VisitorCounter';" Footer.tsx
    echo "Added VisitorCounter import to Footer.tsx"
fi

# Add VisitorCounter before copyright section
# Find the line with "mt-6 pt-6 border-t" and add VisitorCounter before it
sed -i '/<div className="mt-6 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">/i\        <div className="mt-6 pt-6 border-t border-gray-800">\n          <VisitorCounter variant="footer" />\n        </div>\n' Footer.tsx

echo "Updated Footer.tsx"

echo -e "${GREEN}✓ Frontend components added${NC}"

# =============================================================================
# STEP 4: Build and Test Locally
# =============================================================================

echo ""
echo -e "${GREEN}STEP 4: Building frontend...${NC}"
echo ""

cd ../..
npm run build

echo -e "${GREEN}✓ Frontend built successfully${NC}"

# =============================================================================
# FINAL STEPS
# =============================================================================

echo ""
echo -e "${GREEN}=========================================="
echo "✓ Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. TEST LOCALLY:"
echo "   cd app"
echo "   npm run dev"
echo "   Open http://localhost:5173"
echo "   Check footer for visitor counts"
echo ""
echo "2. DEPLOY TO PRODUCTION:"
echo "   cd app"
echo "   npm run build"
echo "   aws s3 sync dist/ s3://YOUR_BUCKET/ --delete"
echo "   aws cloudfront create-invalidation --distribution-id YOUR_ID --paths '/*'"
echo ""
echo "3. VERIFY:"
echo "   Visit https://chaos.ccarrylab.com"
echo "   Check footer for visitor counts"
echo ""
echo -e "${GREEN}Estimated cost: \$0.01-0.10/month${NC}"
echo ""
