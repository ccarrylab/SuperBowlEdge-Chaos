import json
import boto3
from datetime import datetime, timedelta
import random
import os

cloudwatch = boto3.client('cloudwatch')
fis = boto3.client('fis')
elbv2 = boto3.client('elbv2')
autoscaling = boto3.client('autoscaling')

# FIS Experiment Template IDs (set via environment variables or hardcode after deployment)
EXPERIMENT_TEMPLATES = {
    'cpu-stress': os.environ.get('FIS_CPU_STRESS_TEMPLATE', ''),
    'ec2-stop': os.environ.get('FIS_EC2_STOP_TEMPLATE', ''),
    'network-latency': os.environ.get('FIS_NETWORK_LATENCY_TEMPLATE', ''),
    'alb-blackout': os.environ.get('FIS_ALB_BLACKOUT_TEMPLATE', '')
}

def lambda_handler(event, context):
    """Fetch real-time metrics from AWS services"""
    
    path = event.get('rawPath', '')
    method = event.get('requestContext', {}).get('http', {}).get('method', 'GET')
    
    # Existing routes
    if path.endswith('/metrics/cloudfront'):
        return get_cloudfront_metrics()
    elif path.endswith('/metrics/cloudfront/regions'):
        return get_cloudfront_regional_metrics()
    elif path.endswith('/metrics/alb'):
        return get_alb_metrics()
    elif path.endswith('/metrics/infrastructure'):
        return get_infrastructure_status()
    elif path.endswith('/chaos/experiments'):
        return get_chaos_experiments()
    
    # New chaos control routes
    elif path.endswith('/chaos/start') and method == 'POST':
        return start_chaos_experiment(event)
    elif path.endswith('/chaos/stop') and method == 'POST':
        return stop_chaos_experiment(event)
    elif '/chaos/status/' in path:
        experiment_id = path.split('/chaos/status/')[-1]
        return get_experiment_status(experiment_id)
    elif path.endswith('/chaos/templates'):
        return get_experiment_templates()
    elif path.endswith('/chaos/live'):
        return get_live_chaos_status()
    else:
        return error_response(404, 'Route not found')


# =============================================================================
# NEW: Chaos Experiment Control Functions
# =============================================================================

def start_chaos_experiment(event):
    """Start a FIS experiment"""
    try:
        body = json.loads(event.get('body', '{}'))
        experiment_type = body.get('experimentType')
        
        if not experiment_type:
            return error_response(400, 'experimentType is required')
        
        # Map friendly names to template IDs
        template_id = EXPERIMENT_TEMPLATES.get(experiment_type)
        
        if not template_id:
            # Try to find template by tag
            templates = fis.list_experiment_templates()
            for t in templates.get('experimentTemplates', []):
                if experiment_type in t.get('id', '').lower() or experiment_type in str(t.get('tags', {})).lower():
                    template_id = t['id']
                    break
        
        if not template_id:
            return error_response(400, f'Unknown experiment type: {experiment_type}. Available: {list(EXPERIMENT_TEMPLATES.keys())}')
        
        # Start the experiment
        response = fis.start_experiment(
            experimentTemplateId=template_id,
            tags={
                'StartedBy': 'chaos-dashboard',
                'StartTime': datetime.utcnow().isoformat()
            }
        )
        
        experiment = response['experiment']
        
        return success_response({
            'message': 'Experiment started successfully',
            'experimentId': experiment['id'],
            'status': experiment['state']['status'],
            'templateId': template_id,
            'startTime': datetime.utcnow().isoformat()
        })
        
    except fis.exceptions.ConflictException:
        return error_response(409, 'An experiment is already running. Please wait for it to complete.')
    except Exception as e:
        return error_response(500, f'Failed to start experiment: {str(e)}')


def stop_chaos_experiment(event):
    """Stop a running FIS experiment"""
    try:
        body = json.loads(event.get('body', '{}'))
        experiment_id = body.get('experimentId')
        
        if not experiment_id:
            return error_response(400, 'experimentId is required')
        
        response = fis.stop_experiment(id=experiment_id)
        
        return success_response({
            'message': 'Experiment stopped',
            'experimentId': experiment_id,
            'status': response['experiment']['state']['status']
        })
        
    except Exception as e:
        return error_response(500, f'Failed to stop experiment: {str(e)}')


def get_experiment_status(experiment_id):
    """Get detailed status of a specific experiment"""
    try:
        response = fis.get_experiment(id=experiment_id)
        exp = response['experiment']
        
        # Get action states
        actions = []
        for action_name, action_data in exp.get('actions', {}).items():
            actions.append({
                'name': action_name,
                'status': action_data.get('state', {}).get('status', 'unknown'),
                'startTime': action_data.get('startTime', '').isoformat() if action_data.get('startTime') else None,
                'endTime': action_data.get('endTime', '').isoformat() if action_data.get('endTime') else None
            })
        
        return success_response({
            'experimentId': exp['id'],
            'status': exp['state']['status'],
            'statusReason': exp['state'].get('reason', ''),
            'startTime': exp.get('startTime', '').isoformat() if exp.get('startTime') else None,
            'endTime': exp.get('endTime', '').isoformat() if exp.get('endTime') else None,
            'actions': actions,
            'templateId': exp.get('experimentTemplateId', '')
        })
        
    except fis.exceptions.ResourceNotFoundException:
        return error_response(404, f'Experiment {experiment_id} not found')
    except Exception as e:
        return error_response(500, f'Failed to get experiment status: {str(e)}')


def get_experiment_templates():
    """List available FIS experiment templates"""
    try:
        response = fis.list_experiment_templates()
        
        templates = []
        for t in response.get('experimentTemplates', []):
            # Get full template details
            detail = fis.get_experiment_template(id=t['id'])
            template = detail['experimentTemplate']
            
            templates.append({
                'id': t['id'],
                'description': template.get('description', 'No description'),
                'tags': template.get('tags', {}),
                'actions': list(template.get('actions', {}).keys()),
                'targets': list(template.get('targets', {}).keys())
            })
        
        return success_response({
            'templates': templates,
            'count': len(templates)
        })
        
    except Exception as e:
        return error_response(500, f'Failed to list templates: {str(e)}')


def get_live_chaos_status():
    """Get current chaos status including running experiments and infrastructure health"""
    try:
        # Get running experiments
        experiments = fis.list_experiments(maxResults=10)
        running_experiments = [
            {
                'id': exp['id'],
                'status': exp['state']['status'],
                'templateId': exp.get('experimentTemplateId', ''),
                'startTime': exp.get('startTime', '').isoformat() if exp.get('startTime') else None
            }
            for exp in experiments.get('experiments', [])
            if exp['state']['status'] in ['running', 'initiating', 'pending']
        ]
        
        # Get ASG health
        asg = autoscaling.describe_auto_scaling_groups(
            AutoScalingGroupNames=['superbowl-edge-dev-haproxy-asg']
        )
        asg_data = asg['AutoScalingGroups'][0] if asg['AutoScalingGroups'] else {}
        instances = asg_data.get('Instances', [])
        
        healthy_instances = sum(1 for i in instances if i['HealthStatus'] == 'Healthy' and i['LifecycleState'] == 'InService')
        total_instances = len(instances)
        
        # Get ALB health
        try:
            target_groups = elbv2.describe_target_groups(Names=['superbowl-edge-dev-tg'])
            tg_arn = target_groups['TargetGroups'][0]['TargetGroupArn']
            health = elbv2.describe_target_health(TargetGroupArn=tg_arn)
            
            healthy_targets = sum(1 for t in health['TargetHealthDescriptions'] 
                                 if t['TargetHealth']['State'] == 'healthy')
            total_targets = len(health['TargetHealthDescriptions'])
        except:
            healthy_targets = 0
            total_targets = 0
        
        # Determine overall status
        if running_experiments:
            overall_status = 'chaos-active'
        elif healthy_instances < total_instances or healthy_targets < total_targets:
            overall_status = 'recovering'
        else:
            overall_status = 'healthy'
        
        return success_response({
            'overallStatus': overall_status,
            'runningExperiments': running_experiments,
            'infrastructure': {
                'asg': {
                    'healthy': healthy_instances,
                    'total': total_instances,
                    'desired': asg_data.get('DesiredCapacity', 0)
                },
                'alb': {
                    'healthyTargets': healthy_targets,
                    'totalTargets': total_targets
                }
            },
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        return error_response(500, f'Failed to get live status: {str(e)}')


# =============================================================================
# Existing Functions (unchanged)
# =============================================================================

def get_cloudfront_metrics():
    """Get real CloudFront metrics"""
    try:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=1)
        
        requests = get_metric('AWS/CloudFront', 'Requests', 'E3EHW9FZ4D82AY', start_time, end_time)
        bandwidth = get_metric('AWS/CloudFront', 'BytesDownloaded', 'E3EHW9FZ4D82AY', start_time, end_time)
        error_4xx = get_metric('AWS/CloudFront', '4xxErrorRate', 'E3EHW9FZ4D82AY', start_time, end_time, stat='Average')
        error_5xx = get_metric('AWS/CloudFront', '5xxErrorRate', 'E3EHW9FZ4D82AY', start_time, end_time, stat='Average')
        
        return success_response({
            'requests': int(requests / 300) if requests > 0 else 0,
            'bandwidth': int(bandwidth / 1024 / 1024) if bandwidth > 0 else 0,
            'errorRate4xx': round(error_4xx, 2),
            'errorRate5xx': round(error_5xx, 2),
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return error_response(500, str(e))

def get_cloudfront_regional_metrics():
    """Get simulated regional CloudFront metrics"""
    try:
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(minutes=5)
        
        total_requests = get_metric('AWS/CloudFront', 'Requests', 'E3EHW9FZ4D82AY', start_time, end_time)
        total_bandwidth = get_metric('AWS/CloudFront', 'BytesDownloaded', 'E3EHW9FZ4D82AY', start_time, end_time)
        
        regions = {
            'US-East': {'weight': 0.35, 'latency_base': 23, 'hitRate_base': 96.2},
            'US-West': {'weight': 0.22, 'latency_base': 34, 'hitRate_base': 94.8},
            'Europe': {'weight': 0.20, 'latency_base': 45, 'hitRate_base': 93.5},
            'Asia-Pacific': {'weight': 0.15, 'latency_base': 67, 'hitRate_base': 91.2},
            'South America': {'weight': 0.08, 'latency_base': 89, 'hitRate_base': 89.7}
        }
        
        regional_data = []
        for region, config in regions.items():
            variance = random.uniform(-0.1, 0.1)
            requests = int((total_requests / 300) * config['weight'] * (1 + variance))
            bandwidth = int((total_bandwidth / 1024 / 1024 / 300) * config['weight'] * (1 + variance))
            latency = int(config['latency_base'] * (1 + variance * 0.2))
            hitRate = round(config['hitRate_base'] * (1 + variance * 0.05), 1)
            
            regional_data.append({
                'region': region,
                'requests': max(0, requests),
                'bandwidth': max(0, bandwidth),
                'latency': max(1, latency),
                'hitRate': max(85, min(99, hitRate)),
                'timestamp': datetime.utcnow().isoformat()
            })
        
        return success_response({
            'regions': regional_data,
            'totalRequests': int(total_requests / 300) if total_requests > 0 else 0,
            'totalBandwidth': int(total_bandwidth / 1024 / 1024 / 300) if total_bandwidth > 0 else 0,
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return error_response(500, str(e))

def get_alb_metrics():
    """Get ALB health"""
    try:
        target_groups = elbv2.describe_target_groups(Names=['superbowl-edge-dev-tg'])
        tg_arn = target_groups['TargetGroups'][0]['TargetGroupArn']
        health = elbv2.describe_target_health(TargetGroupArn=tg_arn)
        
        healthy = sum(1 for t in health['TargetHealthDescriptions'] 
                     if t['TargetHealth']['State'] == 'healthy')
        total = len(health['TargetHealthDescriptions'])
        
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=1)
        
        target_response_time = get_alb_metric('TargetResponseTime', start_time, end_time)
        request_count = get_alb_metric('RequestCount', start_time, end_time)
        
        return success_response({
            'healthyTargets': healthy,
            'totalTargets': total,
            'healthPercentage': round((healthy / total * 100) if total > 0 else 0, 1),
            'averageResponseTime': round(target_response_time * 1000, 2),
            'requestCount': int(request_count),
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return error_response(500, str(e))

def get_infrastructure_status():
    """Get ASG status"""
    try:
        asg = autoscaling.describe_auto_scaling_groups(
            AutoScalingGroupNames=['superbowl-edge-dev-haproxy-asg']
        )
        
        asg_data = asg['AutoScalingGroups'][0]
        instances = asg_data['Instances']
        
        running = sum(1 for i in instances if i['LifecycleState'] == 'InService')
        healthy = sum(1 for i in instances if i['HealthStatus'] == 'Healthy')
        
        instance_details = [
            {
                'id': i['InstanceId'][-8:],
                'state': i['LifecycleState'],
                'health': i['HealthStatus'],
                'az': i['AvailabilityZone']
            }
            for i in instances
        ]
        
        return success_response({
            'haproxy': {
                'runningInstances': running,
                'healthyInstances': healthy,
                'totalInstances': len(instances),
                'desiredCapacity': asg_data['DesiredCapacity'],
                'minSize': asg_data['MinSize'],
                'maxSize': asg_data['MaxSize'],
                'instances': instance_details
            },
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return error_response(500, str(e))

def get_chaos_experiments():
    """Get FIS experiments - filters out authorization failures"""
    try:
        experiments = fis.list_experiments(maxResults=20)
        
        experiment_list = []
        for exp in experiments.get('experiments', []):
            # Get detailed info to check failure reason
            status = exp['state']['status']
            reason = exp['state'].get('reason', '')
            
            # Skip experiments that failed due to IAM/authorization issues
            if status == 'failed' and 'AuthorizationFailure' in reason:
                continue
            if status == 'failed' and 'does not have sufficient privileges' in reason:
                continue
                
            experiment_list.append({
                'id': exp['id'],
                'status': status,
                'creationTime': exp['creationTime'].isoformat(),
                'templateId': exp.get('experimentTemplateId', 'N/A')
            })
        
        completed = sum(1 for e in experiment_list if e['status'] == 'completed')
        failed = sum(1 for e in experiment_list if e['status'] == 'failed')
        running = sum(1 for e in experiment_list if e['status'] == 'running')
        total_finished = completed + failed
        
        return success_response({
            'total': len(experiment_list),
            'completed': completed,
            'failed': failed,
            'running': running,
            'successRate': round((completed / total_finished * 100) if total_finished > 0 else 0, 1),
            'experiments': experiment_list[:10],
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return error_response(500, str(e))
def get_metric(namespace, metric_name, distribution_id, start_time, end_time, stat='Sum'):
    """Helper to get CloudWatch metric"""
    response = cloudwatch.get_metric_statistics(
        Namespace=namespace,
        MetricName=metric_name,
        Dimensions=[{'Name': 'DistributionId', 'Value': distribution_id}],
        StartTime=start_time,
        EndTime=end_time,
        Period=300,
        Statistics=[stat]
    )
    return response['Datapoints'][-1][stat] if response['Datapoints'] else 0

def get_alb_metric(metric_name, start_time, end_time, stat='Average'):
    """Helper to get ALB metrics"""
    response = cloudwatch.get_metric_statistics(
        Namespace='AWS/ApplicationELB',
        MetricName=metric_name,
        Dimensions=[
            {'Name': 'LoadBalancer', 'Value': 'app/superbowl-edge-dev-alb/4de49584541c5284'}
        ],
        StartTime=start_time,
        EndTime=end_time,
        Period=300,
        Statistics=[stat]
    )
    return response['Datapoints'][-1][stat] if response['Datapoints'] else 0

def success_response(data):
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(data)
    }

def error_response(status_code, message):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': message})
    }
