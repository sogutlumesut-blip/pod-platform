#!/bin/bash
echo "Git deposu duzeltiliyor..."

# 1. Frontend icindeki .git klasorunu sil (varsa)
rm -rf frontend/.git

# 2. Git cache'den frontend'i sil (dosyalari silmez, sadece takibi birakir)
git rm --cached frontend 2>/dev/null

# 3. Dosyalari tekrar ekle
git add .

# 4. Commit yap
git commit -m "Fix: Force add frontend files and API URL config"

echo "✅ Kodlar hazir!"
echo "------------------------------------------------"
echo "Simdi lutfen su komutu calistirin:"
echo "git push"
echo "------------------------------------------------"
