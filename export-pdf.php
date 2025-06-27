<?php
require 'vendor/autoload.php';
use Dompdf\Dompdf;

$orders = file("orders.txt", FILE_IGNORE_NEW_LINES);

$html = "<h2>TAFIA Car Orders</h2><table border='1' width='100%' cellpadding='5'><tr><th>Buyer Name</th><th>Phone</th><th>Email</th><th>Car</th><th>Deposit</th><th>Ref</th></tr>";
foreach ($orders as $line) {
    $d = json_decode($line, true);
    $html.= "<tr>
        <td>{$d['buyerName']}</td>
        <td>{$d['phone']}</td>
        <td>{$d['email']}</td>
        <td>{$d['carName']}</td>
        <td>₦". number_format($d['depositAmount']). "</td>
        <td>{$d['reference']}</td>
    </tr>";
}
$html.= "</table>";

$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'landscape');
$dompdf->render();
$dompdf->stream("tafia_orders.pdf", ["Attachment" => true]);
exit;
?>