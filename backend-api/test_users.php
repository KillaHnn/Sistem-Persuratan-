<?php
$ch = curl_init('http://127.0.0.1:8000/api/users');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer 9|ntHVFC1sN6thv9XLocSNljuQACDgjWCG5W9UdkYS3d35e090', 'Accept: application/json']);
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
echo 'HTTP: ' . $httpcode . PHP_EOL;
echo $response . PHP_EOL;
