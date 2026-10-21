import fitz, os
from PIL import Image

pdf_path = r"C:\Users\deepu\.gemini\antigravity\brain\d4e63989-cf4e-4d63-afa7-55d54b37a9ed\.user_uploaded\media_1792567624868_cff96a54.pdf"
doc = fitz.open(pdf_path)

out_dir = r"assets\images\artworks\portfolio_2026"
os.makedirs(out_dir, exist_ok=True)

# Page to piece mapping
page_pieces = {
    4: ('01_burden_of_giving_birth', 'Burden Of Giving Birth', 'Single-Piece Carving'),
    5: ('02_turbaned_figure', 'Turbaned Figure', 'Single-Piece Carving'),
    6: ('03_budha', 'Budha', 'Single-Piece Carving'),
    7: ('04_bhootnath_temple', 'Bhootnath Temple, Rishikesh', 'Single-Piece Carving'),
    8: ('05_nandi', 'Nandi', 'Single-Piece Carving'),
    9: ('06_kedarnath_temple', 'Kedarnath Temple', 'Single-Piece Carving'),
    10: ('07_pad', 'Pad', 'Single-Piece Carving'),
    11: ('08_self_centricity', 'Self-Centricity', 'Single-Piece Carving'),
    12: ('09_janki_jhula_pul', 'Janki Jhula Pul, Rishikesh', 'Single-Piece Carving'),
    14: ('10_peacock_05mm_lead', 'Peacock on a 0.5 mm Mechanical Pencil Lead', 'Assembled Carving'),
    15: ('11_a_falling_man', 'A Falling Man', 'Assembled Carving'),
    16: ('12_the_hornbill', 'The Hornbill', 'Assembled Carving'),
    17: ('13_the_broken_chair_of_india', 'The Broken Chair of India', 'Assembled Carving'),
    18: ('14_veena', 'Veena', 'Assembled Carving'),
    19: ('15_patra', 'Patra', 'Assembled Carving'),
    20: ('16_ganpati', 'Ganpati', 'Assembled Carving'),
}

# Also extract page 1 cover image
p1_imgs = doc[0].get_images(full=True)
if p1_imgs:
    xref = p1_imgs[0][0]
    base_img = doc.extract_image(xref)
    with open(os.path.join(out_dir, 'cover_hero_statue.jpg'), 'wb') as f:
        f.write(base_img['image'])
    print('Extracted cover_hero_statue.jpg')

for page_idx, (slug, title, category) in page_pieces.items():
    page = doc[page_idx - 1]
    il = page.get_images(full=True)
    
    photo_images = []
    for img_info in il:
        xref = img_info[0]
        base_img = doc.extract_image(xref)
        if base_img['width'] > 500 and base_img['height'] > 500:
            rects = page.get_image_rects(xref)
            x0 = rects[0].x0 if rects else 0
            photo_images.append((x0, xref, base_img))
    
    photo_images.sort(key=lambda x: x[0])
    
    if len(photo_images) >= 2:
        detail_img = photo_images[0][2]
        scale_img = photo_images[1][2]
        
        detail_path = os.path.join(out_dir, f'{slug}_detail.jpg')
        scale_path = os.path.join(out_dir, f'{slug}_scale.jpg')
        
        with open(detail_path, 'wb') as f:
            f.write(detail_img['image'])
        with open(scale_path, 'wb') as f:
            f.write(scale_img['image'])
            
        print(f'Page {page_idx}: {slug} -> Detail ({detail_img["width"]}x{detail_img["height"]}), Scale ({scale_img["width"]}x{scale_img["height"]})')
    elif len(photo_images) == 1:
        img = photo_images[0][2]
        path = os.path.join(out_dir, f'{slug}_detail.jpg')
        with open(path, 'wb') as f:
            f.write(img['image'])
        print(f'Page {page_idx}: {slug} -> 1 image ({img["width"]}x{img["height"]})')
