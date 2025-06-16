import requests
import json

# Test registration
register_data = {
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "confirm_password": "testpass123",
    "full_name": "Test User"
}

print("Testing registration...")
response = requests.post(
    "http://localhost:8000/api/v1/users/register",
    json=register_data
)
print(f"Registration response: {response.status_code}")
print(response.json())
print("\n")

# Test login
login_data = {
    "email": "test@example.com",
    "password": "testpass123"
}

print("Testing login...")
response = requests.post(
    "http://localhost:8000/api/v1/users/login",
    json=login_data
)
print(f"Login response: {response.status_code}")
print(response.json()) 