/*
| FRONTEND ACTION / PAGE                                 | BACKEND ENDPOINT / CONTROLLER                                                                        |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Signup Page                                            | POST /api/auth/register                                                                               |
| - Grab name, email, password                           | - Validate data, hash password, generate verification token                                            |
| - Send data to backend                                 | - Save user, send verification email                                                                  |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Email Verification Page                                | GET /api/auth/verify-email                                                                            |
| - User clicks verification link                        | - Extract token, verify user, update emailVerified: true                                               |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Login Page                                             | POST /api/auth/login                                                                                  |
| - User enters email, password                          | - Validate credentials, generate accessToken & refreshToken                                            |
| - Save accessToken to localStorage                     | - Set refreshToken as HTTP-only cookie                                                                 |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Axios Request Wrapper                                  | Middleware (authMiddleware.js)                                                                         |
| - Attach accessToken on each request                   | - Check if accessToken is present and valid                                                            |
| - On 401 Unauthorized error                            | - If token is expired, respond with custom error ("TokenExpiredError")                                 |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Axios Response Interceptor                             | POST /api/auth/refresh-token                                                                          |
| - Detect "TokenExpiredError" in response               | - Grab refreshToken (from HTTP-only cookie or storage)                                                 |
| - Resend original request to /refresh-token            | - Validate refreshToken, issue new accessToken + refreshToken                                          |
| - Save new accessToken to localStorage                 | - Return new tokens                                                                                   |
| - Retry the original request                           | - Send the original response from retried request                                                      |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Logout Button                                          | GET /api/auth/logout                                                                                  |
| - Clear accessToken from localStorage                  | - Clear refreshToken cookie, optionally remove from DB                                                 |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Forgot Password Page                                   | POST /api/auth/forgot-password                                                                        |
| - User enters email                                    | - Verify email, generate 4-digit OTP, set otp + otpExpiry                                              |
| - Submit to backend                                    | - Send OTP to user's email                                                                             |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| OTP Verification Page                                  | POST /api/auth/verify-otp                                                                             |
| - User enters email + OTP                              | - Verify if OTP matches and not expired                                                                |
| - If verified, show reset password UI                  | - Return success response                                                                              |
|--------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Reset Password Page                                    | POST /api/auth/reset-password                                                                         |
| - User submits email, OTP, new password                | - Validate, hash new password, update user                                                             |
| - Show success message                                 | - Clear otp & otpExpiry fields                                                                         |

Perfect 🔥 — this is exactly how you refine understanding: by turning your note into **practice questions**.
I’ll make **50 questions** (a mix of **True/False, MCQ, and Fill-in-the-Blank**) based on your note.

---

# 📝 50 Practice Questions on JWT Auth Flow (MERN)

---

## ✅ True / False (15 Questions)

1. **T/F**: The signup page should directly send hashed passwords to the backend.
2. **T/F**: Email verification ensures that only valid users can activate accounts.
3. **T/F**: The refresh token should be stored in localStorage for security.
4. **T/F**: The access token is typically short-lived, while the refresh token has a longer lifetime.
5. **T/F**: The login endpoint issues both access and refresh tokens if credentials are valid.
6. **T/F**: Access tokens should always be saved in the database with the user.
7. **T/F**: The Axios request wrapper is responsible for attaching access tokens on each request.
8. **T/F**: A `TokenExpiredError` usually triggers the refresh token flow.
9. **T/F**: Logout should clear both the access token in localStorage and the refresh token cookie.
10. **T/F**: The OTP verification step is optional and is only part of the password reset flow.
11. **T/F**: Refresh tokens are always returned in the response body for the client to store.
12. **T/F**: The forgot password flow generates a new OTP and saves it in the user’s record with an expiry time.
13. **T/F**: The reset password endpoint should hash the new password before saving it.
14. **T/F**: If an OTP has expired, the backend should reject the verification attempt.
15. **T/F**: Once an OTP is used successfully, it should be cleared from the database.

---

## 🎯 Multiple Choice Questions (20 Questions)

16. During signup, which step should occur **first** in the backend?
    a) Send verification email
    b) Hash the password
    c) Generate access token
    d) Save refresh token in DB

17. Which token is typically sent in an **HTTP-only cookie**?
    a) Access Token
    b) Refresh Token
    c) Verification Token
    d) OTP

18. Which field is added to the user model during email verification?
    a) `isVerified`
    b) `isAdmin`
    c) `otpCode`
    d) `lastLogin`

19. Which of the following is **NOT** a responsibility of the login endpoint?
    a) Validating email & password
    b) Generating access token
    c) Generating refresh token
    d) Sending OTP

20. The Axios request wrapper attaches the:
    a) Refresh token
    b) Access token
    c) Email verification token
    d) OTP

21. When the backend responds with `TokenExpiredError`, the frontend should:
    a) Redirect to login page immediately
    b) Trigger the refresh token endpoint
    c) Delete all tokens
    d) Send another OTP

22. The refresh token endpoint:
    a) Issues new access & refresh tokens
    b) Clears localStorage
    c) Resets the password
    d) Verifies the OTP

23. Which is the **securest place** to store refresh tokens?
    a) LocalStorage
    b) HTTP-only cookies
    c) Redux state
    d) Query params

24. What should the logout endpoint do with the refresh token?
    a) Save it in DB
    b) Clear the cookie
    c) Hash it again
    d) Send it to frontend

25. The forgot password endpoint should:
    a) Hash the new password
    b) Generate OTP and send it to email
    c) Issue new access token
    d) Delete the user account

26. The OTP verification endpoint checks:
    a) If OTP matches
    b) If OTP is not expired
    c) If OTP belongs to that user
    d) All of the above

27. After successful OTP verification, the backend should:
    a) Immediately log user in
    b) Allow user to reset password
    c) Clear refresh tokens
    d) Send verification email again

28. Which HTTP method is best for login?
    a) GET
    b) POST
    c) PUT
    d) DELETE

29. Which error typically indicates the access token is expired?
    a) 401 Unauthorized
    b) 500 Internal Server Error
    c) 403 Forbidden
    d) 404 Not Found

30. Which middleware validates the access token on each request?
    a) errorMiddleware.js
    b) validateMiddleware.js
    c) authMiddleware.js
    d) otpMiddleware.js

31. Which of the following is **true** about refresh tokens?
    a) They last longer than access tokens
    b) They are optional in JWT auth
    c) They are used to issue new access tokens
    d) All of the above

32. In reset password flow, which fields must be submitted?
    a) Email + old password
    b) Email + OTP + new password
    c) Email + username + new password
    d) OTP + refresh token

33. Which backend endpoint generates OTP?
    a) /api/auth/register
    b) /api/auth/forgot-password
    c) /api/auth/refresh-token
    d) /api/auth/logout

34. What happens if a user tries to login but hasn’t verified email?
    a) Backend rejects login until verified
    b) Backend generates tokens anyway
    c) Backend auto-verifies email
    d) User is deleted

35. Which library is commonly used for hashing passwords in Node.js?
    a) crypto-js
    b) bcrypt
    c) jwt-decode
    d) axios

---

## ✍️ Fill-in-the-Blank (15 Questions)

36. During signup, the backend should hash the \_\_\_\_\_\_\_\_\_\_ before saving the user.
37. After signup, a verification \_\_\_\_\_\_\_\_\_\_ is sent to the user’s email.
38. The login endpoint returns both an access token and a \_\_\_\_\_\_\_\_\_\_ token.
39. Access tokens are usually stored in \_\_\_\_\_\_\_\_\_\_ on the frontend.
40. Refresh tokens are often stored in \_\_\_\_\_\_\_\_\_\_-only cookies.
41. The Axios request wrapper attaches the \_\_\_\_\_\_\_\_\_\_ token to each request.
42. When an access token expires, the backend responds with \_\_\_\_\_\_\_\_\_\_ error.
43. The frontend then calls the \_\_\_\_\_\_\_\_\_\_ endpoint to get new tokens.
44. On logout, the backend should clear the \_\_\_\_\_\_\_\_\_\_ cookie.
45. In forgot password flow, backend generates a(n) \_\_\_\_\_\_\_\_\_\_ and stores it with an expiry.
46. The OTP verification endpoint checks if the submitted OTP is \_\_\_\_\_\_\_\_\_\_ and not expired.
47. After OTP verification, user can access the \_\_\_\_\_\_\_\_\_\_ password page.
48. The reset password endpoint should hash the \_\_\_\_\_\_\_\_\_\_ password before saving.
49. Once password is reset, the backend clears the fields \_\_\_\_\_\_\_\_\_\_ & \_\_\_\_\_\_\_\_\_\_ from the user.
50. The middleware responsible for verifying JWTs on protected routes is \_\_\_\_\_\_\_\_\_\_.

---

👉 These 50 will force you to think about **frontend actions, backend endpoints, token lifecycle, and security best practices**.

Do you want me to also **prepare an answer key** so you can self-check while practicing, or do you want to try answering them yourself first and then I’ll review?


*/