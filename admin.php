<?php
$allowed_ips = ["192.168.1.20", "123.45.67.89"]; // Replace with real admin IPs
$user_ip = $_SERVER['REMOTE_ADDR'];

if (!in_array($user_ip, $allowed_ips)) {
    header("HTTP/1.1 403 Forbidden");
    exit("Access denied: unauthorized IP");
}
?>

<?php
$orders = file("orders.txt", FILE_IGNORE_NEW_LINES);
$salesData = [];

foreach ($orders as $line) {
    $data = json_decode($line, true);
    $month = date("M Y", strtotime($data["orderDate"]?? "now")); // Get month
    $salesData[$month] = ($salesData[$month]?? 0) + $data["depositAmount"];
}

echo "<script>
    var ctx = document.getElementById('salesChart').getContext('2d');
    var salesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ". json_encode(array_keys($salesData)). ",
            datasets: [{
                label: 'Total Deposits',
                data: ". json_encode(array_values($salesData)). ",
                backgroundColor: '#ea1538',
                borderColor: '#b81c24',
                borderWidth: 1
}]
},
});
</script>";
?>

