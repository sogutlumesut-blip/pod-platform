#!/bin/bash
echo "Git kurulumu baslatiliyor..."

# 1. Initialize
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit"

# 4. Branch
git branch -M main

# 5. Remote (Eger varsa once sil, sonra ekle)
git remote remove origin 2>/dev/null
git remote add origin https://github.com/sogutlumesut-blip/printmarkt-platform.git

echo "------------------------------------------------"
echo "✅ Kurulum Tamamlandi!"
echo "Simdi terminale su komutu yapistirip sifrenizi girin:"
echo "git push -u origin main"
echo "------------------------------------------------"
