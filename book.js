// Helper function shortcuts
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => document.querySelectorAll(sel);

const modal = qs('#booking-modal');
const closeBtn = qs('.close-btn');
const form = qs('#booking-form');
const cartItems = qs('#cart-items');
const payBtn = qs('#pay-btn');

let cart = [];
const ratePerKm = 500; // NGN per km

// Book Now buttons
qsa('.book-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.car-card');
        qs('#vehicleType').value = card.dataset.type;
        modal.style.display = 'flex';
    });
});

// Close modal
closeBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

// Google Autocomplete
function initAutocomplete() {
    const pickupInput = qs('#pickup');
    const destInput = qs('#destination');
    new google.maps.places.Autocomplete(pickupInput, { componentRestrictions: { country: 'ng' } });
    new google.maps.places.Autocomplete(destInput, { componentRestrictions: { country: 'ng' } });
}

// Calculate distance
function calculateDistance(pickup, destination) {
    return new Promise((resolve) => {
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: [pickup],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
        }, (res, status) => {
            if (status === 'OK') {
                const distText = res.rows[0].elements[0].distance.text; // e.g., "50 km"
                resolve(parseFloat(distText.replace(' km', '').replace(',', '')));
            } else resolve(null);
        });
    });
}

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    qs('#form-error').textContent = '';

    const vehicleType = qs('#vehicleType').value;
    const name = qs('#name').value.trim();
    const phone = qs('#phone').value.trim();
    const pickup = qs('#pickup').value.trim();
    const destination = qs('#destination').value.trim();

    if (!pickup.toLowerCase().includes('lafia')) {
        qs('#form-error').textContent = 'Pickup address must be within Lafia.';
        return;
    }

    const distanceKm = await calculateDistance(pickup, destination);
    if (!distanceKm) {
        qs('#form-error').textContent = 'Could not calculate distance. Check addresses.';
        return;
    }

    const amount = Math.ceil(distanceKm * ratePerKm);

    cart.push({ vehicleType, distanceKm, amount });
    renderCart();
    modal.style.display = 'none';
});

function renderCart() {
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>No bookings yet.</p>';
        payBtn.disabled = true;
        return;
    }
    cart.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `<span>${i + 1}. ${item.vehicleType} (${item.distanceKm.toFixed(1)} km)</span>
                         <span>₦${item.amount.toLocaleString()}</span>`;
        cartItems.appendChild(div);
    });
    payBtn.disabled = false;
}

// Paystack
payBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    const totalAmount = cart.reduce((sum, item) => sum + item.amount, 0);

    const handler = PaystackPop.setup({
        key: 'pk_test_xxxxxxxxxxxxx', // replace with your Paystack key
        email: 'customer@example.com',
        amount: totalAmount * 100, // convert to kobo
        currency: 'NGN',
        callback: function(response){
            alert('Payment successful! Ref: ' + response.reference);
            cart = [];
            renderCart();
        },
        onClose: function(){ alert('Payment window closed.'); }
    });
    handler.openIframe();
});

// Expose initAutocomplete globally
window.initAutocomplete = initAutocomplete;
qs('#loader').style.display = 'block';
qs('#loader').style.display = 'none';