
# Simple in-memory visitor tracking (resets when Lambda cold starts)
visitor_data = {
    'total': 0,
    'today': 0,
    'unique_ips': set()
}

def track_visitor(event):
    """Track a visitor POST"""
    try:
        visitor_data['total'] += 1
        visitor_data['today'] += 1
        
        # Track unique by IP
        source_ip = event.get('requestContext', {}).get('http', {}).get('sourceIp', 'unknown')
        visitor_data['unique_ips'].add(source_ip)
        
        return success_response({'tracked': True})
    except Exception as e:
        return error_response(500, str(e))

def get_visitor_stats():
    """Get visitor stats"""
    try:
        return success_response({
            'total': visitor_data['total'],
            'today': visitor_data['today'],
            'uniqueToday': len(visitor_data['unique_ips'])
        })
    except Exception as e:
        return error_response(500, str(e))
