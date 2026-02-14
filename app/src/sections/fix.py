with open('ChaosExperiments.tsx', 'r') as f:
    lines = f.readlines()

# Fix line 138 (index 137)
lines[137] = lines[137].replace('fetch`', 'fetch(`')

# Fix line 177 (index 176) 
lines[176] = lines[176].replace('fetch`', 'fetch(`')

# Fix line 205 (index 204)
lines[204] = lines[204].replace('fetch`', 'fetch(`')

# Fix line 236 (index 235)
lines[235] = lines[235].replace('fetch`', 'fetch(`')

with open('ChaosExperiments.tsx', 'w') as f:
    f.writelines(lines)

print("Fixed!")
