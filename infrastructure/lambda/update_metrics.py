with open('metrics.py', 'r') as f:
    lines = f.readlines()

# Find the get_chaos_experiments function
in_function = False
start_line = 0
for i, line in enumerate(lines):
    if 'def get_chaos_experiments():' in line:
        start_line = i
        in_function = True
        break

# Replace with new version
new_function = '''def get_chaos_experiments():
    """Get FIS experiments - filters out authorization failures"""
    try:
        # Get all experiments by paginating
        all_experiments = []
        next_token = None
        
        while True:
            if next_token:
                experiments = fis.list_experiments(maxResults=100, nextToken=next_token)
            else:
                experiments = fis.list_experiments(maxResults=100)
            
            all_experiments.extend(experiments.get('experiments', []))
            next_token = experiments.get('nextToken')
            
            if not next_token:
                break
        
        # Filter and process experiments
        experiment_list = []
        for exp in all_experiments:
            status = exp['state']['status']
            reason = exp['state'].get('reason', '')

            if status == 'failed' and 'AuthorizationFailure' in reason:
                continue
            if status == 'failed' and 'does not have sufficient privileges' in reason:
                continue

            creation_time = exp.get('creationTime')
            experiment_list.append({
                'id': exp['id'],
                'status': status,
                'creationTime': creation_time.isoformat() if hasattr(creation_time, 'isoformat') else (str(creation_time) if creation_time else None),
                'templateId': exp.get('experimentTemplateId', 'N/A')
            })

        completed = sum(1 for e in experiment_list if e['status'] == 'completed')
        failed = sum(1 for e in experiment_list if e['status'] == 'failed')
        running = sum(1 for e in experiment_list if e['status'] == 'running')
        total_finished = completed + failed

        return success_response({
            'total': len(experiment_list),  # Now shows REAL total count
            'completed': completed,
            'failed': failed,
            'running': running,
            'successRate': round((completed / total_finished * 100) if total_finished > 0 else 0, 1),
            'experiments': experiment_list[:10],  # Still only return last 10 for display
            'timestamp': datetime.utcnow().isoformat()
        })
    except Exception as e:
        return error_response(500, str(e))

'''

# Find end of function (next function definition)
end_line = start_line + 1
for i in range(start_line + 1, len(lines)):
    if lines[i].startswith('def ') and not lines[i].startswith('    '):
        end_line = i
        break

# Replace
new_lines = lines[:start_line] + [new_function + '\n\n'] + lines[end_line:]

with open('metrics.py', 'w') as f:
    f.writelines(new_lines)

print("✅ Updated!")
