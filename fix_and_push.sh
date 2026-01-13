#!/bin/bash
echo "Frontend klasoru duzeltiliyor..."

# 1. Hatali eklenen submodule'u cikar
git rm -f --cached frontend 2>/dev/null

# 2. Icindeki .git klasorunu sil (biz ana depoyu kullancagiz)
rm -rf frontend/.git

# 3. Dosyalari normal dosya olarak ekle
git add frontend

# 4. Commit olustur
git commit -m "Fix: Add frontend files correctly"

echo "✅ Duzeltme basarili!"
echo "------------------------------------------------"
echo "Simdi asagidaki komutu son kez calistirin:"
echo "git push -u origin main --force"
echo "------------------------------------------------"
