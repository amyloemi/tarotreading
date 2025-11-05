# My Tarot Today - GitHub Pages Deployment

🌐 **Live Site:** https://mytarottoday.com

This is the minimal production-ready package for GitHub Pages deployment.

## 📦 Package Contents

This deployment folder contains only the essential files needed to run the website:

```
github-deploy/
├── index.html              # Main page - Daily card reading
├── gallery.html            # Gallery page - Browse all cards
├── tarot-background.jpg    # Background image
├── CNAME                   # Custom domain (mytarottoday.com)
├── assets/                 # CSS, JS, fonts (from HTML5 UP template)
│   ├── css/
│   ├── js/
│   └── webfonts/
└── decks/                  # All deck data and card images
    ├── rider-waite-data.js
    ├── artistic-data.js
    ├── miro-data.js
    ├── picasso-data.js
    ├── images/             # Rider-Waite cards (78 PNG)
    ├── artistic-tarot-cards/    # Artistic cards (78 PNG)
    ├── miro-tarot-cards/        # Miró cards (78 PNG)
    └── picasso-tarot-cards/     # Picasso cards (78 PNG)
```

## 📊 Package Statistics

- **Total Size:** ~97 MB
- **Total Files:** 354 files
- **Decks:** 4 decks × 78 cards = 312 card images
- **Languages:** 6 (English, French, Spanish, Chinese, Japanese, Korean)

## 🚀 Deployment Instructions

### Deploy to GitHub Pages

1. **Create a new repository** or use an existing one:
   ```bash
   # Option 1: Create new repo on GitHub, then:
   cd github-deploy
   git init
   git add .
   git commit -m "Initial deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `(root)`
   - Save

3. **Custom Domain (Optional):**
   - The CNAME file is already included
   - In GitHub Settings → Pages → Custom domain
   - Enter: `mytarottoday.com`
   - Configure DNS with your domain provider:
     ```
     Type: CNAME
     Name: www (or @)
     Value: YOUR-USERNAME.github.io
     ```

### Test Locally

```bash
# Using Python 3
cd github-deploy
python -m http.server 8080

# Then visit: http://localhost:8080
```

## ✅ What's Included

- ✅ **2 HTML pages** (index.html, gallery.html)
- ✅ **4 complete tarot decks** (312 card images total)
- ✅ **6 language translations**
- ✅ **Responsive design** (mobile, tablet, desktop)
- ✅ **Search functionality**
- ✅ **Gallery with lightbox**
- ✅ **Custom domain support** (CNAME)

## ❌ What's NOT Included

The following are excluded to keep the deployment lean:

- ❌ Documentation files (README, guides, methodology)
- ❌ Utility scripts (card generators, optimizers)
- ❌ Old versions and backups
- ❌ Development files (node_modules, package.json)
- ❌ Archive folder
- ❌ Template source files

## 📝 File Breakdown

| Category | Files | Size |
|----------|-------|------|
| HTML Pages | 2 | ~71 KB |
| Background Image | 1 | ~514 KB |
| Assets (CSS/JS/Fonts) | 27 | ~500 KB |
| Deck Data (JS) | 4 | ~50 KB |
| Card Images (PNG) | 312 | ~96 MB |
| Config (CNAME) | 1 | 16 B |
| **Total** | **354** | **~97 MB** |

## 🔄 Updating Deployment

To update the live site after making changes to the main project:

```bash
# 1. Make changes in main TarotReading folder
# 2. Copy updated files to github-deploy
cp index.html gallery.html github-deploy/
cp -r decks github-deploy/

# 3. Commit and push
cd github-deploy
git add .
git commit -m "Update site"
git push
```

## 🌟 Features

- **Daily Tarot Reading** - Draw a random card for daily guidance
- **Card Gallery** - Browse all 78 cards from each deck
- **Multi-Deck Support** - 4 unique artistic interpretations
- **Multi-Language** - Automatic detection + manual selection
- **Responsive Design** - Works perfectly on all devices
- **Fast Loading** - Optimized images and lazy loading
- **Custom Domain** - Professional branding with mytarottoday.com

## 🎨 Available Decks

1. **Rider-Waite Classic** - Traditional tarot symbolism
2. **Artistic Tarot** - Modern vibrant interpretation
3. **Miró Surrealism** - Inspired by Joan Miró
4. **Picasso Cubism** - Inspired by Pablo Picasso

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

- Website code: MIT License
- HTML5 UP Template: [CCA 3.0 License](https://html5up.net/license)
- Tarot imagery: Various (public domain + AI-generated)

## 🔗 Links

- **Live Site:** https://mytarottoday.com
- **Main Repository:** (Full project with docs, scripts, etc.)
- **GitHub Pages:** (This deployment package)

---

**Ready to Deploy:** ✅
**Last Updated:** November 4, 2025
**Version:** 1.0
**Status:** Production Ready
