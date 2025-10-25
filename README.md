# CustomerLabs React Test - Segment Builder

A simple React app for creating customer segments.

## 🚀 Quick Start

### 1. Install
```bash
npm install
```

### 2. Run
```bash
npm run dev
```
Open http://localhost:5173

## 🎯 How to Use

1. **Click "Save segment"** button
2. **Enter segment name** (required)
3. **Add schemas:**
   - Select from dropdown
   - Click "+ Add new schema"
   - See schemas in blue box
4. **Click "Save the Segment"**

## 📋 Available Schemas
- First Name, Last Name, Gender, Age
- Account Name, City, State

## 🔧 Commands

```bash
npm run dev      # Start development
npm run build    # Build for production
npm run preview  # Preview build
```

## 📁 Files
- `src/App.jsx` - Main app
- `src/App.css` - Styles
- `README.md` - This file

## 🎨 Features
- ✅ Modal popup for segment creation
- ✅ Dynamic schema selection
- ✅ Form validation
- ✅ Success/error notifications
- ✅ API integration with webhook

## 🔗 API
Sends data to: `https://webhook.site/02cb5447-63d0-47be-a100-52577b486ca8`

**Data Format:**
```json
{
  "segment_name": "my_segment",
  "schema": [
    {"first_name": "First Name"},
    {"last_name": "Last Name"}
  ]
}
```

## 🐛 Issues?
```bash
# If port is busy
lsof -ti:5173 | xargs kill -9

# If dependencies fail
rm -rf node_modules package-lock.json
npm install
```

---
**Built for CustomerLabs React Test** 🎯
