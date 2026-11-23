<?php

$frontendUrls = env('FRONTEND_URLS');
if (! is_string($frontendUrls) || trim($frontendUrls) === '') {
    $frontendUrls = env('FRONTEND_URL', 'http://localhost:3000');
}

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', $frontendUrls)
    ))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
