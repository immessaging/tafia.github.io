<?php
require __DIR__. "/vendor/autoload.php";
use Twilio\Rest\Client;

$twilioSid = "YOUR_TWILIO_SID";
$twilioToken = "YOUR_TWILIO_AUTH_TOKEN";
$twilioPhone = "YOUR_TWILIO_PHONE_NUMBER";

$client = new Client($twilioSid, $twilioToken);

$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data["phone"])) {
    $message = "Hello ". $data["buyerName"]. ",
        Your deposit of ₦". number_format($data["depositAmount"]). " for ". $data["carName"]. " was successful.
        Transaction Ref: ". $data["reference"]. ".
        Thank you for choosing TAFIA Rentals.";

    $client->messages->create(
        $data["phone"],
        ["from" => $twilioPhone, "body" => $message]
);

    echo json_encode(["status" => "success", "message" => "SMS sent!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid phone number"]);
}
?>
