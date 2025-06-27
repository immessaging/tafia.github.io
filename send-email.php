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
        $mail->Username = 'your-email@example.com'; // Replace with sender email
        $mail->Password = 'your-email-password'; // Replace with email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('your-email@example.com', 'TAFIA Rentals');
        $mail->addAddress($buyerEmail, $buyerName);

        $mail->Subject = "Payment Confirmation - TAFIA Rentals";
        $mail->Body = "Dear $buyerName,\n\nYour deposit of ₦". number_format($depositAmount). " for $carName was successful.\nTransaction Ref: $reference.\nThank you for choosing TAFIA Rentals.";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
}
}

$data = json_decode(file_get_contents("php://input"), true);
if (!empty($data["email"])) {
    if (sendConfirmationEmail($data["email"], $data["buyerName"], $data["carName"], $data["depositAmount"], $data["reference"])) {
        echo json_encode(["status" => "success", "message" => "Email sent!"]);
} else {
        echo json_encode(["status" => "error", "message" => "Failed to send email."]);
}
}
?>

*Step 3: Call This in store-order.php*
php
fetch("send-email.php", {
    method: "POST",
    body: JSON.stringify(formData)
});
