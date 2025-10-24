<?php
// SMTP Email Configuration
$smtp_host = 'smtp.gmail.com';
$smtp_port = 587;
$smtp_username = 'devarkondasneha@gmail.com';
$smtp_password = 'your_app_password_here'; // Use App Password for Gmail
$smtp_from_email = 'devarkondasneha@gmail.com';
$smtp_from_name = 'Portfolio Contact Form';

// Recipient email
$recipient_email = 'devarkondasneha@gmail.com';

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    
    // Validate form data
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Name is required';
    }
    
    if (empty($email)) {
        $errors[] = 'Email is required';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }
    
    if (empty($message)) {
        $errors[] = 'Message is required';
    }
    
    // If no errors, send email
    if (empty($errors)) {
        // Email content
        $subject = 'New message from your portfolio website';
        $email_body = "
        <html>
        <head>
            <title>Portfolio Contact Form</title>
        </head>
        <body>
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
            <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
            <p><strong>Message:</strong></p>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
            <hr>
            <p><em>This message was sent from your portfolio contact form.</em></p>
        </body>
        </html>
        ";
        
        // Email headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . $smtp_from_name . ' <' . $smtp_from_email . '>',
            'Reply-To: ' . $email,
            'X-Mailer: PHP/' . phpversion()
        ];
        
        // Send email using PHP's mail function (simpler approach)
        $mail_sent = mail(
            $recipient_email,
            $subject,
            $email_body,
            implode("\r\n", $headers)
        );
        
        if ($mail_sent) {
            // Return success response
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'message' => 'Message sent successfully!'
            ]);
        } else {
            // Return error response
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to send message. Please try again.'
            ]);
        }
    } else {
        // Return validation errors
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Validation errors',
            'errors' => $errors
        ]);
    }
} else {
    // Return method not allowed
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
?>