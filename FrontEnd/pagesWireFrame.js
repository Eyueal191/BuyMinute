/*pages/
├── Home.jsx                # Homepage
├── Shop.jsx                # Shop listing
├── Offers.jsx              # Offers / promotions
├── Contact.jsx             # Contact page
├── About.jsx               # About page
├── ProductDetail.jsx       # Product detail page
├── Cart.jsx                # Protected: Cart page
├── Orders.jsx              # Protected: Orders page
├── PlaceOrder.jsx          # Protected: Place order page
├── LogIn.jsx               # Login page
├── SignUp.jsx              # Signup page
├── VerifyPage.jsx          # Account verification page (after signup)
├── ForgotPassword.jsx      # Forgot password request page
├── ResetPassword.jsx       # Reset password page (via email token)
├── ErrorPage.jsx           # Catch-all error page
└── account/                # Nested account section
    ├── AccountLayout.jsx   # Layout with tabs/navigation
    ├── Profile.jsx         # Edit profile info
    ├── Security.jsx        # Change password / 2FA
    └── Preferences.jsx     # Notification / language / payment preferences

/* Tailwind Colors & Styling Guide */
/*
|
Element | Color Suggestion / Tailwind Class | Notes |
    |
    -- -- -- -- -- -- -- -- -- -- -- | -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- - | -- -- -- -- -- -- -- -- -- -- -- -- -- -- - |
    |
    **
    Page Background ** | `bg-white`
or `bg-gray-50` | Bright and clean base |
    |
    **
    Card Background ** | `bg-white`
with `shadow-md`
or `shadow-gray-200/50` | Subtle elevation
for forms & products |
    |
    **
    Header / Footer ** | `bg-white`
or `bg-gray-100` | Light, non - distracting |
    |
    **
    Text Primary ** | `text-gray-900` | Main readable text |
    |
    **
    Text Secondary ** | `text-gray-500` | Meta text, captions |
    |
    **
    Link / Accent ** | `text-blue-600 hover:underline` | Buttons, links, highlights |
    |
    **
    Button Primary ** | `bg-black text-white hover:scale-105` | Main CTA buttons |
    |
    **
    Button Secondary ** | `bg-gray-200 text-gray-900 hover:bg-gray-300` | Secondary actions |
    |
    **
    Borders / Dividers ** | `border-gray-200` | Soft separation |
    |
    **
    Shadow / Elevation ** | `shadow-md`
or `shadow-lg` | Light depth
for cards / forms |
    */