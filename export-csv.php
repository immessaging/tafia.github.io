<?php
header('Content-Type: text/csv');
header('Content-Disposition: attachment;filename="tafia_orders.csv"');

$file = "orders.txt";
if (!file_exists($file)) {
    echo "No orders available.";
    exit;
}

$output = fopen("php://output", "w");
fputcsv($output, ["Buyer Name", "Phone", "Email", "Car", "Deposit Paid", "Reference"]);

foreach (file($file, FILE_IGNORE_NEW_LINES) as $line) {
    $data = json_decode($line, true);
    fputcsv($output, [
        $data["buyerName"],
        $data["phone"],
        $data["email"],
        $data["carName"],
        $data["depositAmount"],
        $data["reference"]
    ]);
}
fclose($output);
exit;
?>

