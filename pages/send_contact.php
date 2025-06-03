<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize inputs
    $name = htmlspecialchars(trim($_POST['name']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(trim($_POST['phone'] ?? ''));
    $message = htmlspecialchars(trim($_POST['message']));

    // Destination email address
    $to = "highcloud8@internet.ru";

    // Dynamic subject line with user's name
    $subject = "New Contact from: $name";

    // Email body as an HTML table
    $body = "
    <html>
    <head>
      <title>Contact Form Submission</title>
    </head>
    <body>
      <h2>New Contact Request</h2>
      <table border='1' cellpadding='10' cellspacing='0'>
        <tr><th>Name</th><td>{$name}</td></tr>
        <tr><th>Email</th><td>{$email}</td></tr>
        <tr><th>Phone</th><td>{$phone}</td></tr>
        <tr><th>Message</th><td>" . nl2br($message) . "</td></tr>
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
        echo "Thank you, $name! Your message has been sent.";
    } else {
        echo "There was a problem sending your message. Please try again later.";
    }
} else {
    header("Location: index.html");
    exit;
}
?>