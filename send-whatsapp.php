<?php
require __DIR__. "/vendor/autoload.php";
use Twilio\Rest\Client;

$twilioSid = "YOUR_TWILIO_SID";
$twilioToken = "YOUR_TWILIO_AUTH_TOKEN";
$twilioPhone = "whatsapp:+YOUR_TWILIO_WHATSAPP_NUMBER"; // Twilio WhatsApp-enabled number

$client = new Client($twilioSid, $twilioToken);

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data["phone"])) {
    $message = "Hello ". $data["buyerName"]. ",
        Your deposit of ₦". number_format($data["depositAmount"]). " for ". $data["carName"]. " was successful.
        Transaction Ref: ". $data["reference"]. ".
        Thank you for choosing TAFIA Rentals.";

    $client->messages->create(
        "whatsapp:". $data["phone"],
        ["from" => $twilioPhone, "body" => $message]
);

    echo json_encode(["status" => "success", "message" => "WhatsApp message sent!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid phone number"]);
}
?>
