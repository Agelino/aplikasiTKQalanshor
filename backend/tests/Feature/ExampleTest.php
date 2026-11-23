<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_the_api_health_endpoint_returns_ok(): void
    {
        $response = $this->get('/api/health');

        $response->assertOk();
        $response->assertJson([
            'status' => 'ok',
            'service' => 'tkq-backend',
        ]);
    }

    public function test_upload_requires_a_supported_file(): void
    {
        $response = $this->postJson('/api/v1/uploads', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('file');
    }
}
