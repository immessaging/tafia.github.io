
// Generate 10 sections of 5 cars each
const allCars = Array.from({ length: 10}, (_, i) =>
  Array.from({ length: 5}, (_, j) => {
    const index = i * 5 + j + 1;
    const price = 5000000 + index * 200000;
    const deposit = Math.round(price * 0.3);
    const monthly = Math.round((price - deposit) / 23);
    return {
      name: Car Model ${index},
      description: Reliable and stylish vehicle number ${index}.,
      image: images/car${(index % 5) + 1}.jpg,
      price,
      deposit,
      monthly
};
})
);

let sectionIndex = 0;

function renderCarSections() {
  const wrapper = document.getElementById("car-sections-wrapper");
  wrapper.innerHTML = "";

  allCars.forEach((section, idx) => {
    const sectionEl = document.createElement("div");
    sectionEl.className = "car-section" + (idx === 0? " active": "");

    const sectionTitle = document.createElement("h2");
    sectionTitle.textContent = Section ${idx + 1};
    sectionEl.appendChild(sectionTitle);

    const carList = document.createElement("div");
    carList.className = "car-list";

    section.forEach(car => {
      const div = document.createElement("div");
      div.className = "car-item";
      div.innerHTML = `
        <img src="${car.image}" alt="${car.name}">
        <h3>${car.name}</h3>
        <p>${car.description}</p>
        <p>Cost: ₦${car.price.toLocaleString()}</p>
        <p>Deposit (30%): ₦${car.deposit.toLocaleString()}</p>
        <p>Monthly Payment: ₦${car.monthly.toLocaleString()}</p>
        <button onclick="openPaymentForm('${car.name}', ${car.price})">Pay Now</button>
      `;
      carList.appendChild(div);
});

    sectionEl.appendChild(carList);
    wrapper.appendChild(sectionEl);
});
}

function flipSection(dir) {
  const sections = document.querySelectorAll(".car-section");
  sections[sectionIndex].classList.remove("active");
  sectionIndex = (sectionIndex + dir + allCars.length) % allCars.length;
  sections[sectionIndex].classList.add("active");
}

function openPaymentForm(carName, carPrice) {
  document.getElementById("carName").value = carName;
  document.getElementById("carCost").value = carPrice;
  document.getElementById("depositAmount").value = Math.round(carPrice * 0.3);
  document.getElementById("payment-form").classList.add("active");
}

function payWithPaystack() {
  const buyerName = document.getElementById("buyerName").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const carName = document.getElementById("carName").value;
  const carCost = parseFloat(document.getElementById("carCost").value);
  const depositAmount = Math.round(carCost * 0.3);

  if (!buyerName ||!phone ||!email) {
    alert("Please fill all required fields.");
    return;
}

  let handler = PaystackPop.setup({
    key: "YOUR_PAYSTACK_PUBLIC_KEY", // Replace this with your live/public Paystack key
    email: email,
    amount: depositAmount * 100,
    currency: "NGN",
    ref: "TAFIA-" + Math.floor(Math.random() * 1000000),
    metadata: {
      custom_fields: [
        { display_name: "Buyer Name", variable_name: "buyer_name", value: buyerName},
        { display_name: "Phone", variable_name: "phone_number", value: phone},
        { display_name: "Car", variable_name: "car_name", value: carName}
      ]
},
    callback: function(response) {
      alert("Payment Successful! Transaction Ref: " + response.reference);
      document.getElementById("payment-form").classList.remove("active");
},
    onClose: function() {
      alert("Payment Cancelled.");
}
});

  handler.openIframe();
}

// Close popup when clicking outside
window.onclick = function(event) {
  if (event.target.classList.contains("payment-popup")) {

    document.getElementById("payment-form").classList.remove("active");
}
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  renderCarSections();
});


callback: function(response) {
    alert("Payment Successful! Transaction Ref: " + response.reference);
    document.getElementById("payment-form").classList.remove("active");
    document.getElementById("buy-form").reset();
    // Optionally trigger receipt generation
    generateReceipt(response.reference);
}


function generateReceipt(reference) {
    const formData = {
      carName: document.getElementById("carName").value,
      buyerName: document.getElementById("buyerName").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      depositAmount: document.getElementById("depositAmount").value,
      reference
  };
  
    fetch("store-order.php", {
      method: "POST",
      body: JSON.stringify(formData)
  });
  }
  const { jsPDF} = window.jspdf;
  const doc = new jsPDF();
  const now = new Date().toLocaleString();
  
  doc.setFontSize(14);
  doc.text("TAFIA Car Rental - Payment Receipt", 20, 20);
  doc.setFontSize(10);
  doc.text(`Date: ${now}`, 20, 30);
  doc.text(`Buyer Name: ${formData.buyerName}`, 20, 40);
  doc.text(`Phone: ${formData.phone}`, 20, 50);
  doc.text(`Email: ${formData.email}`, 20, 60);
  doc.text(`Car: ${formData.carName}`, 20, 70);
  doc.text(`Deposit Paid: ₦${formData.depositAmount}`, 20, 80);
  doc.text(`Transaction Ref: ${formData.reference}`, 20, 90);
  
  doc.save(`Receipt_${formData.reference}.pdf`);
  fetch("store-order.php", {
    method: "POST",
    body: JSON.stringify({
        buyerName: "John Doe",
        phone: "08123456789",
        email: "john@example.com",
        carName: "Toyota Corolla 2022",
        depositAmount: 2400000,
        reference: "TAFIA-123456"
})
});
  

/*
// Car data structure
const cars = [
    {
        name: "Toyota Corolla 2022",
        description: "Fuel-efficient sedan with advanced safety features.",
        price: 8000000,
},
    {
        name: "Honda Civic 2021",
        description: "Stylish and reliable performance.",
        price: 7500000,
},
    {
        name: "Mercedes-Benz C300",
        description: "Luxury and performance combined.",
        price: 15000000,
},
    {
        name: "Lexus RX 350",
        description: "Spacious and powerful SUV.",
        price: 12000000,
},
    {
        name: "Ford Explorer 2022",
        description: "Rugged SUV with superior handling.",
        price: 11000000,
}
];

// Store current section index
let currentSection = 0;

// Function to load cars into the page
function loadCarSection() {
    const carList = document.getElementById("car-list");
    carList.innerHTML = "";
    cars.forEach(car => {
        let deposit = car.price * 0.3;
        let monthlyPayment = (car.price - deposit) / 23;

        carList.innerHTML += `
            <div class="car-item">
                <h3>${car.name}</h3>
                <p>${car.description}</p>
                <p>Cost: ₦${car.price.toLocaleString()}</p>
                <p>Deposit (30%): ₦${deposit.toLocaleString()}</p>
                <p>Monthly Payment: ₦${monthlyPayment.toLocaleString()}</p>
                <button onclick="openPaymentForm('${car.name}', ${car.price})">Pay Now</button>
            </div>
        `;
});
}

// Function to flip sections
function flipSection(direction) {
    currentSection += direction;
    if (currentSection < 0) currentSection = 9;
    if (currentSection> 9) currentSection = 0;
    loadCarSection();
}

// Function to open payment form
function openPaymentForm(carName, carPrice) {
    document.getElementById('carName').value = carName;
    document.getElementById('carCost').value = carPrice;
    document.getElementById('payment-form').classList.add('active');
}

// Handle payment submission
document.getElementById("buy-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Simulating Paystack redirection
    alert("Redirecting to Paystack payment page...");

    // Simulate successful payment
    setTimeout(() => {
        alert("Payment successful! Thank you for purchasing " + document.getElementById("carName").value);
}, 3000);
});

// Load first car section on page load
document.addEventListener("DOMContentLoaded", () => {
    loadCarSection();
});

const allCars = Array.from({ length: 10}, (_, i) => (
    Array.from({ length: 5}, (_, j) => {
      const index = i * 5 + j + 1;
      const price = 5000000 + index * 200000;
      const deposit = Math.round(price * 0.3);
      const monthly = Math.round((price - deposit) / 23);
      return {
        name: `Car Model ${index}`,
        description: `Reliable and stylish vehicle number ${index}.`,
        image: `image/car${index % 5 + 1}.jpg`, // Rotate through 5 car images
        price,
        deposit,
        monthly
  };
  })
  ));
  
  let sectionIndex = 0;

  function renderCarSections() {
    const wrapper = document.getElementById("car-sections-wrapper");
    wrapper.innerHTML = "";
  
    allCars.forEach((section, idx) => {
      const sectionEl = document.createElement("div");
      sectionEl.className = "car-section" + (idx === 0? " active": "");
  
      const sectionTitle = document.createElement("h2");
      sectionTitle.textContent = `Section ${idx + 1}`;
      sectionEl.appendChild(sectionTitle);
  
      const carList = document.createElement("div");
      carList.className = "car-list";
  
      section.forEach(car => {
        const div = document.createElement("div");
        div.className = "car-item";
        div.innerHTML = `
          <img src="${car.image}" alt="${car.name}">
          <h3>${car.name}</h3>
          <p>${car.description}</p>
<p>Cost: ₦${car.price.toLocaleString()}</p>
        <p>Deposit (30%): ₦${car.deposit.toLocaleString()}</p>
        <p>Monthly Payment: ₦${car.monthly.toLocaleString()}</p>
        <button onclick="openPaymentForm('${car.name}', ${car.price})">Pay Now</button>
      `;
      carList.appendChild(div);
});

    sectionEl.appendChild(carList);
    wrapper.appendChild(sectionEl);
});
}

function flipSection(dir) {
  const sections = document.querySelectorAll(".car-section");
  sections[sectionIndex].classList.remove("active");
  sectionIndex = (sectionIndex + dir + 10) % 10;
  sections[sectionIndex].classList.add("active");
}
function openPaymentForm(carName, carPrice) {
    document.getElementById("carName").value = carName;
    document.getElementById("carCost").value = carPrice;
    document.getElementById("payment-form").classList.add("active");
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    renderCarSections();
  });
  
  function payWithPaystack() {
    let buyerName = document.getElementById("buyerName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let carName = document.getElementById("carName").value;
    let carCost = parseFloat(document.getElementById("carCost").value);
    let depositAmount = Math.round(carCost * 0.3);

    if (!buyerName ||!phone ||!email) {
        alert("Please fill all required fields.");
        return;
}

    let handler = PaystackPop.setup({
        key: "YOUR_PAYSTACK_PUBLIC_KEY", // Replace with your Paystack public key
        email: email,
        amount: depositAmount * 100, // Convert to kobo
        currency: "NGN",
        ref: "TAFIA-" + Math.floor(Math.random() * 1000000),
        metadata: {
            custom_fields: [
                { display_name: "Buyer Name", variable_name: "buyer_name", value: buyerName},
                { display_name: "Phone", variable_name: "phone_number", value: phone},
                { display_name: "Car", variable_name: "car_name", value: carName}
            ]
},
callback: function(response) {
    alert("Payment Successful! Transaction Ref: " + response.reference);
    document.getElementById("payment-form").classList.remove("active");
},
onClose: function() {
    alert("Payment Cancelled.");
}
});

handler.openIframe();
}



document.getElementById("buy-form").addEventListener("submit", function(event) {
    event.preventDefault();

    alert("Redirecting to Paystack...");

    setTimeout(() => {
        alert("Payment successful!");
        document.getElementById("payment-form").classList.remove("active");
}, 3000);
});

// Close popup when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains("payment-popup")) {
        document.getElementById("payment-form").classList.remove("active");
}
};

*/