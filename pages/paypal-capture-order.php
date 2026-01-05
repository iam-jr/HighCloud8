<?php
// Minimal PayPal order capture for Hosted Fields.
// Requires environment variables: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET
// Uses sandbox/live based on PAYPAL_MODE (sandbox|live). Do not commit real secrets.

header('Content-Type: application/json');

$clientId = getenv('PAYPAL_CLIENT_ID');
$clientSecret = getenv('PAYPAL_CLIENT_SECRET');
$mode = getenv('PAYPAL_MODE') === 'live' ? 'live' : 'sandbox';

if (!$clientId || !$clientSecret) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing PayPal credentials']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$orderId = $body['orderId'] ?? null;
if (!$orderId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing orderId']);
    exit;
}

$apiBase = $mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

// Get access token
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiBase . '/v1/oauth2/token');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json', 'Accept-Language: en_US']);
curl_setopt($ch, CURLOPT_USERPWD, $clientId . ':' . $clientSecret);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$tokenResponse = curl_exec($ch);
if (!$tokenResponse) {
    http_response_code(500);
    echo json_encode(['error' => 'Token request failed']);
    exit;
}
$tokenData = json_decode($tokenResponse, true);
$accessToken = $tokenData['access_token'] ?? null;
if (!$accessToken) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid token response']);
    exit;
}

// Capture order
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiBase . '/v2/checkout/orders/' . urlencode($orderId) . '/capture');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $accessToken
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
if (!$response) {
    http_response_code(500);
    echo json_encode(['error' => 'Capture request failed']);
    exit;
}
$data = json_decode($response, true);

$status = $data['status'] ?? null;
echo json_encode(['status' => $status, 'details' => $data]);
