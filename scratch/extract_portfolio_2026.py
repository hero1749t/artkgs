import fitz, os
from PIL import Image
import io

pdf_path = r'C:\Users\deepu\.gemini\antigravity\brain\d4e63989-cf4e-4d63-afa7-55d54b37a9ed\.user_uploaded\media_1792567624868_cff96a54.pdf'
doc = fitz.open(pdf_path)

out_dir = r'assets\images\artworks\portfolio_2026'
os.makedirs(out_dir, exist_ok=True)

for page_num in range(len(doc)):
    page = doc[page_num]
    il = page.get_images(full=True)
    if not il:
        continue
    print(f'=== Page {page_num+1} ===')
    for img_info in il:
        xref = img_info[0]
        base_img = doc.extract_image(xref)
        rects = page.get_image_rects(xref)
        w, h = base_img['width'], base_img['height']
        print(f'xref {xref}: {w}x{h}, rects: {rects}')
