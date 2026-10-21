import json, re

# Define the 16 Masterworks from the 2026 Portfolio
portfolio_2026_works = [
    {
        "id": "burden-of-giving-birth",
        "pieceNumber": "01",
        "title": "Burden Of Giving Birth",
        "hindiTitle": "गर्भ का भार — स्त्री की पूर्णता",
        "hindiQuote": "समाज कहता है, स्त्री अधूरी है बिना संतान के, पर वह पूर्ण है अपने में ही।",
        "englishQuote": "Society says a woman is incomplete without a child, yet she is whole in herself.",
        "category": "single-piece",
        "categoryLabel": "Single-Piece Carving",
        "discipline": "Single-Piece (Subtractive, Nothing Added)",
        "date": "18 Sep 2026",
        "year": "2026",
        "size": "approx. 2.5 cm",
        "medium": "Hand-carved pencil graphite, single pencil",
        "dimensions": "Height: approx. 2.5 cm on 2B pencil tip",
        "scaleRatio": "2.5 cm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/01_burden_of_giving_birth_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/01_burden_of_giving_birth_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/01_burden_of_giving_birth_detail.jpg",
        "description": "A poignant exploration of womanhood. Society claims a woman is incomplete without offspring, yet she is intrinsically whole within herself. Sculpted whole from a single graphite rod without additions.",
        "highlights": [
            "Cut whole from single pencil",
            "Subtractive philosophy",
            "Height ~2.5 cm with ruler scale"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "turbaned-figure",
        "pieceNumber": "02",
        "title": "Turbaned Figure",
        "hindiTitle": "पगड़ी वाला व्यक्तित्व",
        "hindiQuote": "न चेहरा पूरा, न पहचान स्पष्ट; यही अपूर्णता ही पूर्णता है।",
        "englishQuote": "No complete face, no clear identity: this incompleteness is wholeness.",
        "category": "single-piece",
        "categoryLabel": "Single-Piece Carving",
        "discipline": "Single-Piece (Subtractive, Nothing Added)",
        "date": "17 Sep 2026",
        "year": "2026",
        "size": "approx. 2.7 cm",
        "medium": "Hand-carved pencil graphite, single pencil",
        "dimensions": "Height: approx. 2.7 cm",
        "scaleRatio": "2.7 cm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/02_turbaned_figure_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/02_turbaned_figure_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/02_turbaned_figure_detail.jpg",
        "description": "An enigmatic tall silhouette wearing a traditional turban. Leaving facial features indeterminate reflects Harsh's guiding philosophy: 'Incompleteness as wholeness'.",
        "highlights": [
            "2.7 cm tall single pencil cut",
            "Anonymity of identity",
            "Subtractive lead sculpture"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "budha-in-niche",
        "pieceNumber": "03",
        "title": "Budha (Buddha in Pencil Niche)",
        "hindiTitle": "भगवान बुद्ध — पेंसिल गुहा",
        "hindiQuote": "भगवान बुद्ध स्वयं।",
        "englishQuote": "Lord Buddha himself.",
        "category": "single-piece",
        "categoryLabel": "Single-Piece Carving",
        "discipline": "Single-Piece (Carved within Pencil Niche)",
        "date": "7 Sep 2026",
        "year": "2026",
        "size": "approx. 1.4 cm",
        "medium": "Hand-carved pencil graphite, figure within a niche cut into the pencil",
        "dimensions": "Height: approx. 1.4 cm",
        "scaleRatio": "1.4 cm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/03_budha_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/03_budha_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/03_budha_detail.jpg",
        "description": "A serene Buddha figure carved into the core graphite while preserving the wooden pencil body as an arched meditation cave (niche).",
        "highlights": [
            "Carved within wooden niche",
            "1.4 cm miniature Buddha",
            "Meditative stillness"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "bhootnath-temple-rishikesh",
        "pieceNumber": "04",
        "title": "Bhootnath Temple, Rishikesh",
        "hindiTitle": "भूतनाथ मंदिर ऋषिकेश",
        "hindiQuote": "ऋषिकेश का पावन प्रतीक — पेंसिल नोक पर प्रतिष्ठित।",
        "englishQuote": "A Rishikesh landmark, carved in miniature on a pencil tip.",
        "category": "single-piece",
        "categoryLabel": "Single-Piece Carving",
        "discipline": "Single-Piece (Subtractive, Nothing Added)",
        "date": "16 Jul 2026",
        "year": "2026",
        "size": "approx. 0.9 cm",
        "medium": "Hand-carved pencil graphite, single pencil",
        "dimensions": "Height: approx. 0.9 cm (9 mm)",
        "scaleRatio": "0.9 cm / 9mm (Scale ruler verified)",
        "location": "Carved on location at Ganga Ghat, Rishikesh",
        "image": "assets/images/artworks/portfolio_2026/04_bhootnath_temple_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/04_bhootnath_temple_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/04_bhootnath_temple_detail.jpg",
        "description": "The revered multi-tiered shikhara of Bhootnath Temple towering above Swargashram in Rishikesh, micro-chiseled on a single pencil tip measuring only 9 millimetres.",
        "highlights": [
            "Sub-centimetre temple (0.9 cm)",
            "Architectural tiered shikhara",
            "Direct Rishikesh heritage"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "nandi-pencil-carving",
        "pieceNumber": "05",
        "title": "Nandi",
        "hindiTitle": "नंदी — शिव का अविचल भक्त",
        "hindiQuote": "शिव को निहारता एक अविचल मन।",
        "englishQuote": "A steadfast mind, gazing at Shiva.",
        "category": "single-piece",
        "categoryLabel": "Single-Piece Carving",
        "discipline": "Single-Piece (Subtractive, Nothing Added)",
        "date": "20 Feb 2024",
        "year": "2024",
        "size": "approx. 0.8 cm",
        "medium": "Hand-carved pencil graphite, single pencil",
        "dimensions": "Height: approx. 0.8 cm (8 mm)",
        "scaleRatio": "0.8 cm / 8mm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/05_nandi_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/05_nandi_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/05_nandi_detail.jpg",
        "description": "Lord Shiva's sacred mount Nandi carved in patient devotion atop an 8mm pedestal. The calm, unmoving gaze embodies unwavering focus and surrender.",
        "highlights": [
            "Only 0.8 cm tall",
            "Horns and hump detailing",
            "Spiritual contemplation"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "kedarnath-temple-pencil-carving",
        "pieceNumber": "06",
        "title": "Kedarnath Temple (Lead Carving)",
        "hindiTitle": "केदारनाथ धाम — पेंसिल नोक पर",
        "hindiQuote": "कण-कण में बसने वाले शिव इस पेंसिल पर भी उसी भव्यता के साथ बैठे हैं।",
        "englishQuote": "Shiva, who dwells in every particle, sits on this pencil with the same grandeur.",
        "category": "single-piece",
        "categoryLabel": "Single-Piece Carving",
        "discipline": "Single-Piece (Subtractive, Nothing Added)",
        "date": "25 Sep 2026",
        "year": "2026",
        "size": "approx. 1.2 cm",
        "medium": "Hand-carved pencil graphite, single pencil",
        "dimensions": "Height: approx. 1.2 cm (12 mm)",
        "scaleRatio": "1.2 cm / 12mm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/06_kedarnath_temple_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/06_kedarnath_temple_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/06_kedarnath_temple_detail.jpg",
        "description": "The divine Kedarnath Himalayan temple hand-carved whole from a single pencil lead. The Sanctum shikhara, amlaka, and entrance hall stand within just 1.2 centimetres.",
        "highlights": [
            "1.2 cm Kedarnath replica",
            "Chiseled temple door & shikhara",
            "Cut whole from single graphite"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "pad-menstrual-hygiene-symbol",
        "pieceNumber": "07",
        "title": "Pad",
        "hindiTitle": "पैड — मौन का विखंडन",
        "hindiQuote": "आधी आबादी के इस बेहद सामान्य पर अहम विषय को एक हौवा बना दिया गया है।",
        "englishQuote": "A very ordinary yet important matter for half the population has been turned into a taboo.",
        "category": "single-piece",
        "categoryLabel": "Single-Piece Carving",
        "discipline": "Single-Piece (Subtractive, Nothing Added)",
        "date": "7 Oct 2025",
        "year": "2025",
        "size": "approx. 1.2 cm",
        "medium": "Hand-carved pencil graphite, single pencil",
        "dimensions": "Height: approx. 1.2 cm",
        "scaleRatio": "1.2 cm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/07_pad_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/07_pad_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/07_pad_detail.jpg",
        "description": "A bold social statement in micro-sculpture. Addressing menstrual awareness and challenging the hypocritical taboos that surround half of humankind.",
        "highlights": [
            "Socio-cultural commentary",
            "Subtle graphite wings",
            "Single pencil carving"
        ],
        "featured": True,
        "isHero": False
    },
    {
        "id": "self-centricity",
        "pieceNumber": "08",
        "title": "Self-Centricity",
        "hindiTitle": "आत्म केंद्रण",
        "hindiQuote": "आत्म केंद्रण - इंसानी स्वभाव का एक आइना।",
        "englishQuote": "Self-centredness: a mirror of human nature.",
        "category": "single-piece",
        "categoryLabel": "Single-Piece Carving",
        "discipline": "Single-Piece (Subtractive, Nothing Added)",
        "date": "19 Sep 2026",
        "year": "2026",
        "size": "approx. 1.9 cm",
        "medium": "Hand-carved pencil graphite, single pencil",
        "dimensions": "Height: approx. 1.9 cm",
        "scaleRatio": "1.9 cm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/08_self_centricity_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/08_self_centricity_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/08_self_centricity_detail.jpg",
        "description": "A psychological study of human nature. The spiraling human torso turning inward upon itself represents modern ego and self-absorption, carved from 1.9cm graphite.",
        "highlights": [
            "Spiraling human anatomy",
            "Philosophical psychological mirror",
            "1.9 cm single pencil cut"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "janki-jhula-pul-rishikesh",
        "pieceNumber": "09",
        "title": "Janki Jhula Pul, Rishikesh",
        "hindiTitle": "जानकी झूला पुल ऋषिकेश",
        "hindiQuote": "माँ गंगा पर फैला ऋषिकेश का गौरव — पेंसिल नोक पर सस्पेंशन ब्रिज।",
        "englishQuote": "A Rishikesh bridge on the Ganga, carved in miniature on a pencil tip.",
        "category": "single-piece",
        "categoryLabel": "Single-Piece Carving",
        "discipline": "Single-Piece (Subtractive, Nothing Added)",
        "date": "17 Jul 2026",
        "year": "2026",
        "size": "approx. 2.6 cm",
        "medium": "Hand-carved pencil graphite, single pencil",
        "dimensions": "Height: approx. 2.6 cm",
        "scaleRatio": "2.6 cm (Scale ruler verified)",
        "location": "Carved on location at Ganga Ghat, Rishikesh",
        "image": "assets/images/artworks/portfolio_2026/09_janki_jhula_pul_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/09_janki_jhula_pul_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/09_janki_jhula_pul_detail.jpg",
        "description": "The suspension towers, vertical stay cables, and pedestrian span of Janki Jhula bridge crossing the sacred waters of Maa Ganga, hollowed whole from a single pencil.",
        "highlights": [
            "2.6 cm hollowed suspension bridge",
            "Intricate cable stay columns",
            "Single-piece subtractive"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "peacock-mechanical-lead",
        "pieceNumber": "10",
        "title": "Peacock on a 0.5 mm Mechanical Pencil Lead",
        "hindiTitle": "0.5mm मैकेनिकल लीड पर मयूर",
        "hindiQuote": "0.5mm की सूक्ष्मता पर भारत का राष्ट्रीय पक्षी।",
        "englishQuote": "India's national bird sculpted on ultra-fragile 0.5 mm mechanical pencil lead.",
        "category": "assembled",
        "categoryLabel": "Assembled Carving",
        "discipline": "Assembled Carving (0.5mm Micro-Joinery)",
        "date": "12 Sep 2026",
        "year": "2026",
        "size": "approx. 1.5 cm",
        "medium": "Hand-carved pencil graphite, assembled from parts",
        "dimensions": "Height: approx. 1.5 cm on 0.5mm lead",
        "scaleRatio": "0.5 mm lead core (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/10_peacock_05mm_lead_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/10_peacock_05mm_lead_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/10_peacock_05mm_lead_detail.jpg",
        "description": "An extraordinary technical feat. While most carvers use 2B thick pencils, Harsh created this peacock perched on a razor-thin 0.5 mm mechanical graphite lead.",
        "highlights": [
            "0.5 mm mechanical lead",
            "Microscopic crest and tail",
            "Master of extreme thinness"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "a-falling-man",
        "pieceNumber": "11",
        "title": "A Falling Man",
        "hindiTitle": "गिरता हुआ मनुष्य",
        "hindiQuote": "जब एक इंसान खुद के ही बोझ से दबने लगता है।",
        "englishQuote": "When a person begins to buckle under his own weight.",
        "category": "assembled",
        "categoryLabel": "Assembled Carving",
        "discipline": "Assembled Carving (Separate Joined Parts)",
        "date": "8 Aug 2026",
        "year": "2026",
        "size": "approx. 0.9 cm",
        "medium": "Hand-carved pencil graphite, assembled from parts",
        "dimensions": "Height: approx. 0.9 cm (9 mm)",
        "scaleRatio": "0.9 cm / 9mm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/11_a_falling_man_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/11_a_falling_man_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/11_a_falling_man_detail.jpg",
        "description": "A hat-wearing gentleman figure stooping under psychological and physical weight. Captures existential vulnerability in less than 1 centimetre of carved graphite.",
        "highlights": [
            "Gentleman hat & overcoat",
            "Sub-centimetre figure (0.9 cm)",
            "Assembled micro-sculpture"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "the-hornbill",
        "pieceNumber": "12",
        "title": "The Hornbill",
        "hindiTitle": "धनेश पक्षी — हॉर्नबिल",
        "hindiQuote": "प्रकृति के अद्भुत पक्षी का सूक्ष्म रूप।",
        "englishQuote": "The great hornbill bird perched in micro-scale silence.",
        "category": "assembled",
        "categoryLabel": "Assembled Carving",
        "discipline": "Assembled Carving (Separate Joined Parts)",
        "date": "5 Sep 2026",
        "year": "2026",
        "size": "approx. 1.1 cm",
        "medium": "Hand-carved pencil graphite, assembled from parts",
        "dimensions": "Height: approx. 1.1 cm",
        "scaleRatio": "1.1 cm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/12_the_hornbill_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/12_the_hornbill_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/12_the_hornbill_detail.jpg",
        "description": "The curved casque and bill of the Great Hornbill sculpted and joined atop a pencil tip. The avian posture captures alertness and elegance at 1.1 cm height.",
        "highlights": [
            "Curved bill and casque",
            "Perched avian posture",
            "1.1 cm scale"
        ],
        "featured": True,
        "isHero": False
    },
    {
        "id": "the-broken-chair-of-india",
        "pieceNumber": "13",
        "title": "The Broken Chair of India",
        "hindiTitle": "द ब्रोकन चेयर ऑफ इंडिया",
        "hindiQuote": "जैसे प्रजातंत्र के चारों स्तंभ टूटे से हैं, वैसे ही ये कुर्सी भी: एक जर्जर होते लोकतंत्र की गवाह।",
        "englishQuote": "As the four pillars of democracy lie cracked, so does this chair: a witness to a crumbling democracy.",
        "category": "assembled",
        "categoryLabel": "Assembled Carving",
        "discipline": "Assembled Carving (Separate Joined Parts)",
        "date": "25 Jul 2026",
        "year": "2026",
        "size": "approx. 0.5 cm",
        "medium": "Hand-carved pencil graphite, assembled from parts",
        "dimensions": "Height: approx. 0.5 cm (Only 5 millimetres!)",
        "scaleRatio": "0.5 cm / 5mm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/13_the_broken_chair_of_india_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/13_the_broken_chair_of_india_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/13_the_broken_chair_of_india_detail.jpg",
        "description": "The smallest masterpiece in the collection at just 5 millimetres. The broken leg and backrest of the chair stand as a solemn socio-political witness to institutional decay.",
        "highlights": [
            "Microscopic 0.5 cm (5mm) scale",
            "Broken chair leg detail",
            "Socio-political witness"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "veena-classical-music",
        "pieceNumber": "14",
        "title": "Veena",
        "hindiTitle": "वीणा — सरस्वती वाद्य",
        "hindiQuote": "हमारी जड़ों में है संगीत।",
        "englishQuote": "Music lies in our roots.",
        "category": "assembled",
        "categoryLabel": "Assembled Carving",
        "discipline": "Assembled Carving (Separate Joined Parts)",
        "date": "10 Aug 2026",
        "year": "2026",
        "size": "approx. 1.0 cm",
        "medium": "Hand-carved pencil graphite, assembled from parts",
        "dimensions": "Height: approx. 1.0 cm (10 mm)",
        "scaleRatio": "1.0 cm / 10mm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/14_veena_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/14_veena_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/14_veena_detail.jpg",
        "description": "A timeless homage to Indian classical tradition. The delicate curve of the neck, fretboard, and resonant gourd joined with millimeter-level precision.",
        "highlights": [
            "Resonator gourd and fretboard",
            "Exact 1.0 cm scale",
            "Indian musical soul"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "patra-begging-bowl",
        "pieceNumber": "15",
        "title": "Patra",
        "hindiTitle": "पात्र — आत्म-विजय का मार्ग",
        "hindiQuote": "भिक्षा नहीं, खुद से जीत जाने का मार्ग।",
        "englishQuote": "Not alms, but the path to victory over oneself.",
        "category": "assembled",
        "categoryLabel": "Assembled Carving",
        "discipline": "Assembled Carving (Separate Joined Parts)",
        "date": "28 Jun 2026",
        "year": "2026",
        "size": "approx. 1.1 cm",
        "medium": "Hand-carved pencil graphite, assembled from parts",
        "dimensions": "Height: approx. 1.1 cm",
        "scaleRatio": "1.1 cm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/15_patra_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/15_patra_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/15_patra_detail.jpg",
        "description": "The monastic bowl (patra) held aloft by slender arms. It symbolizes renunciation of ego and the inner quest for triumph over self, echoing Himalayan ascetic traditions.",
        "highlights": [
            "Hollowed bowl atop slender pillars",
            "Spiritual renunciation",
            "1.1 cm height"
        ],
        "featured": True,
        "isHero": True
    },
    {
        "id": "ganpati-micro-carving",
        "pieceNumber": "16",
        "title": "Ganpati",
        "hindiTitle": "विघ्नहर्ता गणपति",
        "hindiQuote": "मंगलमूर्ति का सूक्ष्म आशीर्वाद।",
        "englishQuote": "Lord Ganesha, remover of obstacles, chiseled in sub-centimetre graphite.",
        "category": "assembled",
        "categoryLabel": "Assembled Carving",
        "discipline": "Assembled Carving (Separate Joined Parts)",
        "date": "14 Sep 2026",
        "year": "2026",
        "size": "approx. 0.7 cm",
        "medium": "Hand-carved pencil graphite, assembled from parts",
        "dimensions": "Height: approx. 0.7 cm (Only 7 millimetres!)",
        "scaleRatio": "0.7 cm / 7mm (Scale ruler verified)",
        "location": "Rishikesh Studio, Uttarakhand",
        "image": "assets/images/artworks/portfolio_2026/16_ganpati_detail.jpg",
        "scaleImage": "assets/images/artworks/portfolio_2026/16_ganpati_scale.jpg",
        "thumbnail": "assets/images/artworks/portfolio_2026/16_ganpati_detail.jpg",
        "description": "Lord Ganesha's curved trunk, modak hand, and seated blessing form sculpted at a staggering 7 millimetre scale with assembled graphite finesse.",
        "highlights": [
            "Only 7 millimetres tall (0.7 cm)",
            "Detailed trunk and crown",
            "Auspicious divine miniature"
        ],
        "featured": True,
        "isHero": True
    }
]

# Read existing catalog to merge non-duplicate items
with open('assets/js/gallery-data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const ARTKGS_CATALOG = (\[.*?\]);', text, re.DOTALL)
existing_items = json.loads(m.group(1))

# Existing IDs that are superseded by the new portfolio 2026 masterworks:
superseded_ids = {
    'bhootnath-mandir-shikhar',
    'janki-bridge-pencil-carving',
    'veena-miniature-carving',
    'broken-chair-pencil-carving',
    'little-buddha-pencil-lead',
    'yt-yZO0STHQ_JQ',
    'ganesha-pencil-carving'
}

merged_catalog = list(portfolio_2026_works)

for item in existing_items:
    if item['id'] not in superseded_ids:
        # Also ensure category is accurate
        merged_catalog.append(item)

print(f"Total merged items: {len(merged_catalog)}")

# Write updated gallery-data.js
js_content = f"""// ArtKGS Master Gallery Catalog Data
// 100% Real, Authentic Artworks by Harsh (Rishikesh, Uttarakhand)
// Enhanced for Ultra-HD Screen Clarity & Millimetre Scale Authenticity
// Official Portfolio 2026 Collection Included

const ARTKGS_CATALOG = {json.dumps(merged_catalog, indent=2, ensure_ascii=False)};

if (typeof module !== 'undefined' && module.exports) {{
  module.exports = {{ ARTKGS_CATALOG }};
}}
"""

with open('assets/js/gallery-data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("assets/js/gallery-data.js successfully written!")
