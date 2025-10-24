<?php
// Advanced SMTP Email Handler using PHPMailer
// You'll need to install PHPMailer via Composer or download it manually

// Include PHPMailer (adjust path based on your setup)
// If using Composer: require_once 'vendor/autoload.php';
// If manual download: require_once 'PHPMailer/PHPMailer.php';
// require_once 'PHPMailer/SMTP.php';
// require_once 'PHPMailer/Exception.php';

// For this example, I'll use a simple SMTP implementation
// In production, use PHPMailer for better reliability

// SMTP Configuration
$smtp_config = [
    'host' => 'smtp.gmail.com',
    'port' => 587,
    'username' => 'devarkondasneha@gmail.com',
    'password' => 'your_app_password_here', // Gmail App Password
    'encryption' => 'tls',
    'from_email' => 'devarkondasneha@gmail.com',
    'from_name' => 'Portfolio Contact Form',
    'to_email' => 'devarkondasneha@gmail.com'
];

// Simple SMTP Email Sender Function
function sendSMTPEmail($config, $name, $email, $message) {
    // Create email content
    $subject = 'New message from your portfolio website';
    $body = "
    <html>
    <head>
        <title>Portfolio Contact Form</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b6b, #ffa726); color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>New Contact Form Submission</h1>
            </div>
            <div class='content'>
                <div class='field'>
                    <div class='label'>Name:</div>
                    <div class='value'>" . htmlspecialchars($name) . "</div>
                </div>
                <div class='field'>
                    <div class='label'>Email:</div>
                    <div class='value'><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></div>
                </div>
                <div class='field'>
                    <div class='label'>Message:</div>
                    <div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>
                </div>
            </div>
            <div class='footer'>
                <p>This message was sent from your portfolio contact form.</p>
                <p>Reply directly to this email to respond to the sender.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Email headers
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . $config['from_name'] . ' <' . $config['from_email'] . '>',
        'Reply-To: ' . $email,
        'X-Mailer: Portfolio Contact Form',
        'X-Priority: 3'
    ];
    
    // Send email
    return mail(
        $config['to_email'],
        $subject,
        $body,
        implode("\r\n", $headers)
    );
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get and sanitize form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    
    // Validation
    $errors = [];
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = 'Name must be at least 2 characters long';
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address';
    }
    
    if (empty($message) || strlen($message) < 10) {
        $errors[] = 'Message must be at least 10 characters long';
    }
    
    // Check for spam (basic protection)
    $spam_keywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations'];
    $message_lower = strtolower($message);
    foreach ($spam_keywords as $keyword) {
        if (strpos($message_lower, $keyword) !== false) {
            $errors[] = 'Message contains inappropriate content';
            break;
        }
    }
    
    // Rate limiting (basic implementation)
    session_start();
    $current_time = time();
    if (isset($_SESSION['last_email_time']) && 
        ($current_time - $_SESSION['last_email_time']) < 60) {
        $errors[] = 'Please wait before sending another message';
    }
    
    if (empty($errors)) {
        // Send email
        $email_sent = sendSMTPEmail($smtp_config, $name, $email, $message);
        
        if ($email_sent) {
            // Update rate limiting
            $_SESSION['last_email_time'] = $current_time;
            
            // Log successful submission (optional)
            error_log("Contact form submission from: $email");
            
            // Return success response
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'message' => 'Message sent successfully! I\'ll get back to you soon.'
            ]);
        } else {
            // Log error
            error_log("Failed to send contact form email from: $email");
            
            // Return error response
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to send message. Please try again later.'
            ]);
        }
    } else {
        // Return validation errors
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please correct the following errors:',
            'errors' => $errors
        ]);
    }
} else {
    // Method not allowed
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
}
?>