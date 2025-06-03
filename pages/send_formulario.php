<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize input
    $name = htmlspecialchars(trim($_POST['name']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
    $details = htmlspecialchars(trim($_POST['details']));

    // Destination email
    $to = "highcloud8@internet.ru";

    // Email subject includes client name
    $subject = "New Client Form Submission from: $name";

    // Email content formatted as an HTML table
    $body = "
    <html>
    <head><title>Client Form Submission</title></head>
    <body>
      <h2>New Client Request</h2>
      <table border='1' cellpadding='10' cellspacing='0'>
        <tr><th>Name</th><td>{$name}</td></tr>
        <tr><th>Email</th><td>{$email}</td></tr>
        <tr><th>Phone</th><td>{$phone}</td></tr>
        <tr><th>Project Details</th><td>" . nl2br($details) . "</td></tr>
      </table>
    </body>
    </html>
    ";

    // Headers
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: {$name} <{$email}>\r\n";

    // Send the email
    if (mail($to, $subject, $body, $headers)) {
        echo "Thank you, $name. Your request has been sent successfully!";
    } else {
        echo "Sorry, there was a problem sending your request. Please try again.";
    }
} else {
    header("Location: formulario-clientes.html");
    exit;
}
?>
