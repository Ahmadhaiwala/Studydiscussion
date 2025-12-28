import os

file_path = r"c:\Users\haiwa\fsd1\project1\backend\.env"

# Read current .env
with open(file_path, "r") as f:
    lines = f.readlines()

print("Current .env content:")
for line in lines:
    print(line.strip())

print("\n" + "="*50)
print("ISSUE DETECTED:")
print("="*50)
print("SUPABASE_SERVICE_ROLE_KEY appears to be set to 'ssb_publishable_...'")
print("This looks like it might be the ANON_KEY instead of the SERVICE_ROLE_KEY.")
print("\nService Role Keys typically:")
print("  - Start with 'eyJ' (JWT format)")
print("  - Are much longer than anon keys")
print("\nPlease check your Supabase dashboard:")
print("  1. Go to Project Settings > API")
print("  2. Copy the 'service_role' key (NOT the 'anon' key)")
print("  3. Update SUPABASE_SERVICE_ROLE_KEY in .env with the correct value")
