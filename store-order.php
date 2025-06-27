<?php
header("Content-Type: application/json");

$host = "localhost";
$user = "root";  // Change to actual DB username
$password = "";  // Change to actual DB password
$dbname = "tafia_rentals";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || empty($data["buyerName"]) || empty($data["phone"]) || empty($data["email"]) || empty($data["carName"])) {
        echo json_encode(["status" => "error", "message" => "Invalid data received."]);
        exit;
}

    $stmt = $conn->prepare("INSERT INTO orders (buyer_name, phone, email, car_name, deposit_amount, transaction_ref) VALUES (?,?,?,?,?,?)");
    $stmt->bind_param("ssssds", $data["buyerName"], $data["phone"], $data["email"], $data["carName"], $data["depositAmount"], $data["reference"]);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Order stored successfully!"]);
} else {
        echo json_encode(["status" => "error", "message" => "Failed to store order."]);
}

    $stmt->close();
    $conn->close();
}
fetch("send-sms.php", {
    method: "POST",
    body: JSON.stringify(formData)
});
fetch("send-whatsapp.php", {
    method: "POST",
    body: JSON.stringify(formData)
});
fetch("send-email.php", {
    method: "POST",
    body: JSON.stringify(formData)
});


?>