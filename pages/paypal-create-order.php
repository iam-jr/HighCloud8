<?php
// Minimal PayPal order creation for Hosted Fields.
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
$amount = isset($body['amount']) ? $body['amount'] : null;
$description = isset($body['description']) ? $body['description'] : 'Pago High Cloud 8';

if (!$amount || !is_numeric($amount)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid amount']);
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

// Create order
$orderPayload = [
    'intent' => 'CAPTURE',
    'purchase_units' => [[
        'description' => $description,
        'amount' => [
            'currency_code' => 'USD',
            'value' => number_format((float)$amount, 2, '.', '')
        ]
    ]]
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiBase . '/v2/checkout/orders');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $accessToken
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderPayload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
if (!$response) {
    http_response_code(500);
    echo json_encode(['error' => 'Order request failed']);
    exit;
}
$orderData = json_decode($response, true);

if (!isset($orderData['id'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Order creation failed']);
    exit;
}

echo json_encode(['id' => $orderData['id']]);
