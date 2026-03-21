# Connection Error Troubleshooting

## What's the Error?

If you see "refuses to connect" - check these steps:

---

## Quick Diagnostics

1. **Go to http://localhost:3000/debug**
   - This shows your connection status
   - Shows what's working/broken

2. **Check the browser console (F12)**
   - Errors show up there
   - Copy/paste any error messages

---

## Common Issues & Fixes

### Issue 1: "Supabase URL not found"
**Cause:** Missing environment variables

**Fix:**
1. Check `.env.local` file exists
2. It should have:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Restart the dev server (Ctrl+C, then `npm run dev`)

---

### Issue 2: "Can't reach Supabase"
**Cause:** Network/project issue

**Fix:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Check your project is online
3. Copy fresh URL and Key from Settings → API
4. Paste into `.env.local`
5. Restart server

---

### Issue 3: "403 Forbidden" or "Not authenticated"
**This is NORMAL!**

**Why:** You're not logged in yet

**Fix:**
1. Go to http://localhost:3000/login
2. Sign up for an account
3. Then the app will connect

---

## Quick Connection Checklist

- [ ] `.env.local` file exists
- [ ] Has NEXT_PUBLIC_SUPABASE_URL
- [ ] Has NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Dev server restarted after changes
- [ ] Browser is accessing localhost:3000
- [ ] You're signed in (or trying to)

---

## Test Steps

1. Visit http://localhost:3000
   - Should see home page

2. Click "Sign Up"
   - Create account

3. Go to Dashboard
   - Create a course

4. Click "Edit Course"
   - Video form should appear

5. Paste YouTube URL
   - Should save!

---

## Check Dev Server Logs

Look at the terminal running `npm run dev`:

**Good signs:**
```
✓ Ready in 1327ms
GET /dashboard 200
```

**Bad signs:**
```
Error: Cannot find module
ECONNREFUSED
ENOTFOUND
```

---

## Still Stuck?

1. Open browser console (F12)
2. Go to Network tab
3. Try to perform action
4. Look for failed requests (red 404/500)
5. Right-click → Copy response
6. Share the error message

---

**The app is running! Connection issues are usually just setup.** 💡
