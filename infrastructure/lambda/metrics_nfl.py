import json, boto3, os, urllib.request, urllib.parse, base64
from datetime import datetime, timedelta
# Paste YOUR full existing imports/clients here from cat metrics.py lines 1-50
cloudwatch = boto3.client('cloudwatch')
# ... all your boto3 clients ...
def lambda_handler(event, context):
    path = event.get('rawPath', '')
    if path == '/prod/nfl-scores':
        key = '669e5a8a43b3423692bd42be989af571'
        url = f"https://nfl.sportsdata.io/v3/nfl/scores/json/Scores/2026POST?key={key}"
        try:
            req = urllib.request.Request(url)
            data = json.loads(urllib.request.urlopen(req).read())
            game = next((g for g in data if g.get('Status') == 'InProgress'), data[0] if data else {})
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'nfl': {'away': f"{game.get('AwayTeam', 'N/A')}: {game.get('AwayScore', 0)}", 'home': f"{game.get('HomeTeam', 'N/A')}: {game.get('HomeScore', 0)}", 'status': game.get('Status', 'No games')}})}
        except Exception as e:
            return {'statusCode': 500, 'body': json.dumps({'error': str(e)})}
    return {'statusCode': 404, 'body': json.dumps({'error': 'Route not found'})}
