// Simple state for current booking
let currentBooking = {
  service: null,
  price: null
};

// Mobile nav toggle
function toggleMobileNav() {
  const nav = document.getElementById('mobile-nav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

// Scroll to quote section
function openQuoteFromNav() {
  document.getElementById('quote').scrollIntoView({ behavior: 'smooth' });
}

// Scroll to services (as a generic "booking" anchor)
function scrollToBooking() {
  document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

// Open booking modal with service + price
function openBooking(serviceName, price) {
  currentBooking.service = serviceName;
  currentBooking.price = price;
  const summary = document.getElementById('booking-summary');
  summary.textContent = `${serviceName} — $${price.toFixed ? price.toFixed(2) : price}.00`;
  openModal('booking-modal');
}

// Open quote modal with selected service label
function openQuoteForService(serviceName) {
  const pill = document.getElementById('quote-selected-pill');
  pill.textContent = serviceName;
  openModal('quote-modal');
}

// Generic modal open/close
function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('active');
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('active');
}

// Close modals when clicking overlay background
document.addEventListener('click', (e) => {
  const overlay = e.target.closest('.modal-overlay');
  if (overlay && e.target === overlay) {
    overlay.classList.remove('active');
  }
});

// Booking: simulate "Proceed to Payment"
function proceedToPayment() {
  const data = {
    type: 'booking',
    service: currentBooking.service,
    price: currentBooking.price,
    name: document.getElementById('booking-name').value,
    contact: document.getElementById('booking-contact').value,
    date: document.getElementById('booking-date').value,
    time: document.getElementById('booking-time').value,
    address: document.getElementById('booking-address').value
  };

  console.log('Booking data to send to backend/Stripe:', data);

  // Here you would call your backend to create a checkout session.
  // For now we just simulate success:
  closeModal('booking-modal');
  showConfirmation('Payment confirmed! Your booking is complete.');
}

// Quote modal submit
function submitQuoteModal() {
  const service = document.getElementById('quote-selected-pill').textContent;
  const data = {
    type: 'quote',
    service,
    name: document.getElementById('modal-quote-name').value,
    contact: document.getElementById('modal-quote-contact').value,
    address: document.getElementById('modal-quote-address').value,
    details: document.getElementById('modal-quote-details').value,
    price: null
  };

  sendEmailNotification(data);
  closeModal('quote-modal');
  alert('Quote request sent! We’ll be in touch within 24 hours.');
}

// Free quote section submit
function submitQuoteForm() {
  const data = {
    type: 'quote',
    service: document.getElementById('quote-service').value,
    name: document.getElementById('quote-name').value,
    contact: document.getElementById('quote-contact').value,
    address: document.getElementById('quote-address').value,
    details: document.getElementById('quote-details').value,
    price: null
  };

  sendEmailNotification(data);
  alert('Quote request sent! We’ll be in touch within 24 hours.');
}

// Email notification function
function sendEmailNotification(data) {
  console.log('Email notification payload:', data);

  /*
    Integration idea A — EmailJS (good for static hosting like GitHub Pages):

    1. Sign up at emailjs.com and create a service + template.
    2. Include their SDK script in index.html.
    3. Replace the console.log above with:

       await emailjs.send(
         'YOUR_SERVICE_ID',
         'YOUR_TEMPLATE_ID',
         {
           type: data.type,
           service: data.service,
           name: data.name,
           contact: data.contact,
           address: data.address,
           details: data.details,
           price: data.price
         },
         'YOUR_PUBLIC_KEY'
       );

  */

  /*
    Integration idea B — Custom backend endpoint:

    1. Create an API route on your server, e.g. POST /api/send-notification.
    2. In that route, send an email using your preferred provider (SendGrid, SES, etc.).
    3. Replace the console.log above with:

       await fetch('/api/send-notification', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
       });

  */
}

// Confirmation modal helper
function showConfirmation(message) {
  const msg = document.getElementById('confirm-message');
  msg.textContent = message;
  openModal('confirm-modal');
}
