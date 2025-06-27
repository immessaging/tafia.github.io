<?php
require 'vendor/autoload.php';
use Dompdf\Dompdf;
use Dompdf\Options;

// Ensure POST data is received
if ($_SERVER["REQUEST_METHOD"]!== "POST") {
    echo "Invalid request.";
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if (empty($data["buyerName"]) || empty($data["email"]) || empty($data["carName"]) || empty($data["depositAmount"]) || empty($data["reference"])) {
    echo "Missing data.";
    exit();
}

// Create PDF invoice
$options = new Options();
$options->set("isHtml5ParserEnabled", true);
$dompdf = new Dompdf($options);

$html = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif;}
.invoice-box { max-width: 800px; margin: auto; padding: 20px; border: 1px solid #eee;}
.invoice-box h2 { text-align: center; color: #ea1538;}
.table { width: 100%; border-collapse: collapse; margin-top: 20px;}
.table,.table th,.table td { border: 1px solid #ddd; padding: 10px;}
.table th { background-color: #ea1538; color: white;}
    </style>
</head>
<body>
    <div class='invoice-box'>
        <h2>TAFIA Car Rental - Payment Invoice</h2>
        <p>Date: ". date("d M Y"). "</p>
        <p>Buyer: {$data["buyerName"]}</p>
        <p>Email: {$data["email"]}</p>
        <p>Transaction Ref: {$data["reference"]}</p>

        <table class='table'>
            <tr>
                <th>Car Model</th>
                <th>Deposit Paid</th>
            </tr>
            <tr>
                <td>{$data["carName"]}</td>
                <td>₦". number_format($data["depositAmount"]). "</td>
            </tr>
        </table>

        <p style='text-align:center; font-size:14px; margin-top:20px;'>Thank you for choosing TAFIA Car Rental!</p>
    </div>
</body>
</html>";
$dompdf->loadHtml($html);
$dompdf->setPaper("A4", "portrait");
$dompdf->render();
$dompdf->stream("TAFIA_Invoice_". $data["reference"]. ".pdf", ["Attachment" => true]);
exit();
?>


 
Let's take this to the next level! We'll implement two major upgrades:

1️⃣ Email Attachments for PDF Invoices – Send invoices as email attachments to buyers.
2️⃣ Admin Invoice Tracker – A dashboard where admins can view, search, and download invoices.

---

📩 1. Sending Email Attachments with PHPMailer
We'll modify send-email.php to attach the invoice PDF when sending a confirmation email.

Step 1: Install PHPMailer
Run this in your terminal:

composer require phpmailer/phpmailer


*Step 2: Modify send-email.php*
php
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function sendConfirmationEmail($buyerEmail, $buyerName, $carName, $depositAmount, $reference) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.example.com'; // Replace with your SMTP provider
        $mail->SMTPAuth = true;
        $mail->Username = 'your-email@example.com'; // Sender email
        $mail->Password = 'your-email-password'; // Email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('your-email@example.com', 'TAFIA Rentals');
        $mail->addAddress($buyerEmail, $buyerName);
        $mail->Subject = "Payment Confirmation & Invoice - TAFIA Rentals";

        $invoicePath = "admin/invoices/Invoice_$reference.pdf";

        $mail->Body = "Dear $buyerName,\n\nYour deposit of ₦". number_format($depositAmount). " for $carName was successful.\nTransaction Ref: $reference.\nYour invoice is attached.\n\nThank you for choosing TAFIA Rentals!";

        if (file_exists($invoicePath)) {
            $mail->addAttachment($invoicePath);
}

        $mail->send();
        return true;
} catch (Exception $e) {
        return false;
}
}

$data = json_decode(file_get_contents("php://input"), true);
if (!empty($data["email"])) {
    if (sendConfirmationEmail($data["email"], $data["buyerName"], $data["carName"], $data["depositAmount"], $data["reference"])) {
        echo json_encode(["status" => "success", "message" => "Email with invoice sent!"]);
} else {
        echo json_encode(["status" => "error", "message" => "Failed to send email."]);
}
}
?>


✅ Buyers now receive the invoice as an attachment
✅ Ensures professionalism & keeps transaction records

---

📂 2. Admin Invoice Tracker
We'll create an admin dashboard to view all invoices.

*Step 1: Store Invoices in /admin/invoices/ Folder*
Modify generate-invoice.php to save invoices instead of auto-downloading:

php
$filePath = "admin/invoices/Invoice_". $data["reference"]. ".pdf";
$dompdf->stream($filePath, ["Attachment" => false]);
file_put_contents($filePath, $dompdf->output());


Now invoices are stored in /admin/invoices/ for tracking.

---

*Step 2: Create admin-invoices.php*
php
<?php
session_start();

// Restrict access to admins
if (!isset($_SESSION["admin_logged_in"])) {
    header("Location: admin-login.php");
    exit();
}

echo "<h1>Admin Invoice Tracker</h1>";

$invoiceDir = "invoices/";
$files = array_diff(scandir($invoiceDir), ['.', '..']);

if (empty($files)) {
    echo "<p>No invoices found.</p>";
    exit();
}

echo "<table border='1' style='width:100%;'>";
echo "<tr><th>Invoice</th><th>Download</th></tr>";

foreach ($files as $file) {
    echo "<tr><td>$file</td><td><a href='invoices/$file' target='_blank'>Download</a></td></tr>";
}

echo "</table>";
?>


✅ Admins can view & download invoices

---

🔒 Step 3: Add Invoice Tracking Link in Dashboard
Modify admin-dashboard.php:
html
<a href="admin-invoices.php">📄 View Invoices</a>


---

🎯 Final Upgrades
🚀 PDF invoice email attachments for buyers
📂 Admin invoice tracker with easy downloads

Now your system automates billing, email notifications, and admin tracking! Want to add automated invoice reminders or bulk PDF exports next? 🚗✨💼
 
 
