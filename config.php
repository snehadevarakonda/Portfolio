<?php
// SMTP Configuration File
// Update these settings with your email provider details

return [
    // Gmail SMTP Settings
    'smtp' => [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'devarkondasneha@gmail.com',
        'password' => 'your_app_password_here', // Gmail App Password (not your regular password)
        'encryption' => 'tls', // or 'ssl' for port 465
        'from_email' => 'devarkondasneha@gmail.com',
        'from_name' => 'Sneha Portfolio Contact',
        'to_email' => 'devarkondasneha@gmail.com'
    ],
    
    // Alternative SMTP providers
    'alternatives' => [
        // Outlook/Hotmail
        'outlook' => [
            'host' => 'smtp-mail.outlook.com',
            'port' => 587,
            'encryption' => 'tls'
        ],
        
        // Yahoo
        'yahoo' => [
            'host' => 'smtp.mail.yahoo.com',
            'port' => 587,
            'encryption' => 'tls'
        ],
        
        // Custom SMTP
        'custom' => [
            'host' => 'your-smtp-server.com',
            'port' => 587,
            'encryption' => 'tls'
        ]
    ],
    
    // Security settings
    'security' => [
        'rate_limit' => 60, // seconds between emails
        'max_message_length' => 1000,
        'spam_protection' => true,
        'honeypot_field' => 'website' // hidden field to catch bots
    ],
    
    // Email templates
    'templates' => [
        'subject' => 'New message from your portfolio website',
        'reply_to_sender' => true,
        'include_ip' => false, // for privacy
        'include_timestamp' => true
    ]
];
?>