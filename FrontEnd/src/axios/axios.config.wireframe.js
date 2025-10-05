/*
Perfect 🚀 — your Axios setup is solid and has lots of learning points to turn into practice questions. I’ll create **30 questions** (mix of **True/False, MCQ, and Fill-in-the-Blank**) based on your `api.js` code snippet.

---

# 📝 30 Practice Questions (Axios Interceptor Logic)

---

## ✅ True / False (10)

1. **T/F**: The Axios instance is created with a `baseURL` and `timeout`. true
2. **T/F**: The request interceptor attaches the refresh token to every outgoing request. false
3. **T/F**: The access token is retrieved from localStorage in the request interceptor. true
4. **T/F**: If there is no access token in localStorage, the request still proceeds without `Authorization` header.
5. **T/F**: The response interceptor automatically retries failed requests if the status code is 401 and message mentions "access token has expired".
6. **T/F**: `initialRequest._isTokenRefreshed` is used to prevent multiple simultaneous refresh token calls.
7. **T/F**: If the refresh token endpoint fails, the user is logged out and redirected to `/login`.
8. **T/F**: The interceptor uses `Axios.post("/api/refresh-token")` to refresh tokens.
9. **T/F**: When a new access token is received, it is stored in localStorage and also attached to the retried request.
10. **T/F**: The interceptor will handle all errors globally, including network errors without responses.

---

## 🎯 Multiple Choice Questions (10)

11. What is the default timeout for requests in this Axios instance?
    a) 5000 ms
    b) 2000 ms
    c) 3000 ms
    d) None

12. In the request interceptor, where is the access token retrieved from?
    a) Cookie
    b) Redux store
    c) localStorage
    d) Session storage

13. What header is added when a token is present?
    a) `x-access-token`
    b) `Authorization: Bearer <token>`
    c) `authToken`
    d) `Set-Cookie`

14. What error status code triggers the refresh logic?
    a) 403 Forbidden
    b) 401 Unauthorized
    c) 500 Internal Server Error
    d) 400 Bad Request

15. What condition must be true before retrying the request?
    a) `_isTokenRefreshed` must be false
    b) Access token must not exist
    c) Status code must be 200
    d) User must be logged out

16. How does the interceptor prevent infinite refresh attempts?
    a) By setting a cookie
    b) By using `_isTokenRefreshed` flag
    c) By limiting retry count to 3
    d) By checking DB

17. What happens if the refresh token call fails?
    a) User stays logged in
    b) User is logged out and redirected
    c) Request is retried without a token
    d) Access token is extended manually

18. What method is used to call the refresh token endpoint?
    a) GET
    b) POST
    c) PUT
    d) DELETE

19. After a new token is received, what is done first?
    a) LocalStorage is cleared
    b) Token is saved in localStorage
    c) User is redirected
    d) Original request is retried immediately

20. Which property in `error.config` represents the original request?
    a) initialRequest
    b) responseConfig
    c) requestBase
    d) requestHeader

---

## ✍️ Fill-in-the-Blank (10)

21. The Axios instance sets the default header `___________: application/json`.
22. In the request interceptor, the `Authorization` header format is `Bearer ___________`.
23. The response interceptor checks for status code `___________` before attempting a token refresh.
24. To avoid multiple refresh calls, the code uses the flag `___________` on the request object.
25. If a token is refreshed, the original request’s `Authorization` header is updated with the \_\_\_\_\_\_\_\_\_\_\_.
26. If the refresh flow fails, the interceptor removes the `___________` from localStorage.
27. After removing token on refresh failure, the user is redirected to `___________`.
28. The new token is received in the field `___________` from the refresh response.
29. The refresh token endpoint called here is `/api/___________`.
30. If there’s no `response` object in the error, the interceptor directly `___________` the error.

---

👉 These questions cover:

* Axios instance basics (baseURL, timeout, headers).
* Request interceptor logic.
* Response interceptor logic.
* Token refresh flow.
* Error handling.

---

Would you like me to also **prepare an answer key** for these 30, or do you prefer to attempt them first and then I’ll review your answers?
*/