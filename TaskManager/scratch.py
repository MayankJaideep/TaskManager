import urllib.request
import json
import urllib.error

data = json.dumps({"username": "adminUser", "password": "password123"}).encode("utf-8")
req = urllib.request.Request("http://localhost:8080/api/auth/login", data=data, headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode())
        token = res.get("token")
        if token:
            req2 = urllib.request.Request("http://localhost:8080/api/admin/tasks", headers={"Authorization": "Bearer " + token})
            try:
                with urllib.request.urlopen(req2) as r2:
                    print(r2.status, r2.read().decode())
            except urllib.error.HTTPError as e:
                print("Admin endpoint error:", e.code, e.read().decode())
        else:
            print("No token")
except urllib.error.HTTPError as e:
    print("Login error:", e.code, e.read().decode())
