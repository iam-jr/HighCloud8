<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $business = htmlspecialchars($_POST['business']);
    $review = htmlspecialchars($_POST['review']);
    
    // Email donde recibirás las opiniones
    $to = "tu_email@ejemplo.com"; // Cambia esto por tu email
    $subject = "Nueva Opinión de Cliente - High Cloud 8";
    
    $message = "
    <html>
    <head>
        <title>Nueva Opinión</title>
    </head>
    <body>
        <h2>Nueva Opinión Recibida</h2>
        <p><strong>Nombre:</strong> $name</p>
        <p><strong>Negocio/Empresa:</strong> $business</p>
        <p><strong>Opinión:</strong></p>
        <p>$review</p>
    </body>
    </html>
    ";
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: noreply@highcloud8.com" . "\r\n";
    
    if (mail($to, $subject, $message, $headers)) {
        header("Location: ../index.html?review=success");
    } else {
        header("Location: ../index.html?review=error");
    }
    exit();
}
?>
