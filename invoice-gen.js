function generateInvoice(reference) {
    const formData = {
      buyerName: document.getElementById("buyerName").value,
      email: document.getElementById("email").value,
      carName: document.getElementById("carName").value,
      depositAmount: document.getElementById("depositAmount").value,
      reference
  };
  
    fetch("admin/generate-invoice.php", {
      method: "POST",
      body: JSON.stringify(formData),
  }).then(response => response.blob())
  .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `TAFIA_Invoice_${reference}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
  });
  }
  
 