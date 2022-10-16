# NodeJS Authentication using Phone Number
A NodeJS based Authentication system which uses Phone Number, OTP to login/SignUp into the system 


## API Endpoints
1. `/api/auth/register`
```
POST
body {
    phone: String,
    name: String,
}
```

2. `/api/auth/login`
```
POST
body {
    phone: String
}
```

3. `/api/auth/verify`
```
POST
body {
    otp: String,
    userId: String
}
```

4. `/api/auth/me`
```
GET
headers {
    Authorization: jwt_token
}
```

5. `/api/auth/admin`
```
GET (Admin Access)

headers {
    Authorization: jwt_token
}
```