// ArtKGS WhatsApp Booking & Custom Commission Engine
// Direct integration with Harsh (+91 98706 20748) for bespoke art inquiries

class BookingEngine {
  constructor() {
    this.modal = document.getElementById('booking-modal');
    this.phone = ARTKGS_CONFIG.whatsappNumber; // '919870620748'
    this.selectedArtwork = null;

    if (this.modal) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
  }

  open(artwork = null) {
    this.selectedArtwork = artwork;
    
    // Set field values
    const artworkField = document.getElementById('booking-reference-art');
    const categorySelect = document.getElementById('booking-category');

    if (artwork) {
      if (artworkField) {
        artworkField.value = `${artwork.title} (${artwork.categoryLabel})`;
        document.getElementById('booking-art-preview-box').classList.remove('hidden');
        document.getElementById('booking-art-preview-img').src = artwork.thumbnail;
        document.getElementById('booking-art-preview-title').textContent = artwork.title;
        document.getElementById('booking-art-preview-medium').textContent = artwork.medium;
      }
      if (categorySelect) {
        categorySelect.value = artwork.category;
      }
    } else {
      if (artworkField) {
        artworkField.value = "General Bespoke Commission";
        document.getElementById('booking-art-preview-box').classList.add('hidden');
      }
    }

    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  sendToWhatsApp(formData) {
    const { name, phone, category, referenceArt, size, occasion, details } = formData;

    const categoryNames = {
      'pencil': '✏️ Pencil-Tip Miniature Carving (पेंसिल नोक नक्काशी)',
      'sculpture': '🗿 Clay Sculpture / Bust (मिट्टी की मूर्ति)',
      'devbhoomi': '🏔️ Sacred Devbhoomi / Himalayan Canvas (केदारनाथ / गंगा चित्र)',
      'hyperrealism': '🎨 Hyperrealism / Fine Pencil Drawing (हाइपर-रियलिज्म)',
      'commissions': '💍 Custom Portrait Commission (विवाह / पारिवारिक स्मृति चित्र)',
      'murals': '🖌️ Architectural Wall Mural (भित्ति चित्र)'
    };

    const selectedCatLabel = categoryNames[category] || category;

    // Beautifully crafted bilingual WhatsApp message
    let message = `*Namaste Harsh ji! 🙏*\n\n`;
    message += `I am visiting your official website *Artkgs* and would like to commission an artwork / inquire about your creations:\n\n`;
    message += `👤 *Client Name:* ${name || 'Collector'}\n`;
    if (phone) message += `📞 *Contact:* ${phone}\n`;
    message += `🎨 *Category:* ${selectedCatLabel}\n`;
    if (referenceArt && referenceArt !== 'General Bespoke Commission') {
      message += `🖼️ *Artwork Reference:* ${referenceArt}\n`;
    }
    if (size) message += `📐 *Preferred Scale/Size:* ${size}\n`;
    if (occasion) message += `🎁 *Occasion/Purpose:* ${occasion}\n`;
    if (details) message += `📝 *Custom Requirements:* ${details}\n\n`;
    message += `--------------------------------\n`;
    message += `Could you please share your availability, timeline, and commission process?\n`;
    message += `Looking forward to connecting with you directly from Rishikesh!  Ganga Sharnam. 🌸`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.phone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    this.close();
  }

  bindEvents() {
    // Close events
    const closeBtn = document.getElementById('booking-modal-close');
    if (closeBtn) closeBtn.onclick = () => this.close();

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.close();
      }
    });

    // Form submit
    const form = document.getElementById('booking-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
          name: document.getElementById('booking-name').value.trim(),
          phone: document.getElementById('booking-phone').value.trim(),
          category: document.getElementById('booking-category').value,
          referenceArt: document.getElementById('booking-reference-art').value,
          size: document.getElementById('booking-size').value,
          occasion: document.getElementById('booking-occasion').value.trim(),
          details: document.getElementById('booking-details').value.trim()
        };

        this.sendToWhatsApp(formData);
      });
    }

    // Direct WhatsApp quick buttons
    document.querySelectorAll('[data-open-booking]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.open();
      });
    });
  }
}

// Global helpers
window.openWhatsAppInquiry = function(artwork) {
  if (window.bookingEngine) {
    window.bookingEngine.open(artwork);
  } else {
    // Direct link fallback
    const text = encodeURIComponent(`Namaste Harsh ji! 🙏 I am interested in your artwork: "${artwork.title}" (${artwork.medium}). Could you please share details on availability and commission?`);
    window.open(`https://wa.me/${ARTKGS_CONFIG.whatsappNumber}?text=${text}`, '_blank');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.bookingEngine = new BookingEngine();
});
