<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rombel;
use App\Models\AppState;
use App\Models\DomainRecord;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class SchoolDataController extends Controller
{
    private const RESOURCE_PATTERN = '/^[a-z][a-z0-9_]{1,79}$/';

    public function resources(): JsonResponse
    {
        return response()->json(
            DomainRecord::query()->get()->groupBy('resource')->map(
                fn ($records) => $records->map(fn (DomainRecord $record) => $record->payload)->values()
            )
        );
    }

    public function resource(string $resource): JsonResponse
    {
        $this->validateResource($resource);

        return response()->json(
            DomainRecord::query()->where('resource', $resource)->get()
                ->map(fn (DomainRecord $record) => $record->payload)->values()
        );
    }

    public function replaceResource(Request $request, string $resource): JsonResponse
    {
        $this->validateResource($resource);
        $data = $request->validate(['items' => ['present', 'array']]);

        DomainRecord::query()->where('resource', $resource)->delete();
        foreach ($data['items'] as $item) {
            if (! is_array($item) || ! isset($item['id']) || ! is_string($item['id'])) {
                abort(422, 'Every resource item must have a string id.');
            }
            DomainRecord::create([
                'resource' => $resource,
                'record_id' => $item['id'],
                'payload' => $item,
            ]);
        }

        return $this->resource($resource);
    }

    public function storeResourceItem(Request $request, string $resource): JsonResponse
    {
        $this->validateResource($resource);
        $item = $request->validate(['id' => ['required', 'string', 'max:150']]);
        $record = DomainRecord::create([
            'resource' => $resource,
            'record_id' => $item['id'],
            'payload' => $request->all(),
        ]);

        return response()->json($record->payload, 201);
    }

    public function updateResourceItem(Request $request, string $resource, string $id): JsonResponse
    {
        $this->validateResource($resource);
        $record = DomainRecord::query()->where('resource', $resource)->where('record_id', $id)->firstOrFail();
        $record->update(['payload' => $request->all()]);

        return response()->json($record->fresh()->payload);
    }

    public function destroyResourceItem(string $resource, string $id): JsonResponse
    {
        $this->validateResource($resource);
        DomainRecord::query()->where('resource', $resource)->where('record_id', $id)->firstOrFail()->delete();

        return response()->json(status: 204);
    }

    public function state(): JsonResponse
    {
        return response()->json(
            AppState::query()->get()->mapWithKeys(
                fn (AppState $item) => [$item->state_key => $item->state_value]
            )
        );
    }

    public function saveState(Request $request, string $key): JsonResponse
    {
        abort_unless(preg_match('/^[a-z][a-z0-9_]{1,80}$/', $key) === 1, 422, 'Invalid state key.');

        $data = $request->validate([
            'value' => ['present'],
        ]);

        AppState::query()->updateOrCreate(
            ['state_key' => $key],
            ['state_value' => $data['value']]
        );

        return response()->json(['key' => $key, 'value' => $data['value']]);
    }

    public function deleteState(string $key): JsonResponse
    {
        AppState::query()->whereKey($key)->delete();
        return response()->json(status: 204);
    }

    public function bootstrap(): JsonResponse
    {
        return response()->json([
            'teachers' => Teacher::query()->latest()->get()->map(fn (Teacher $item) => $this->expand($item)),
            'students' => Student::query()->latest()->get()->map(fn (Student $item) => $this->expand($item)),
            'classes' => SchoolClass::query()->latest()->get()->map(fn (SchoolClass $item) => $this->expand($item)),
            'rombels' => Rombel::query()->latest()->get()->map(fn (Rombel $item) => $this->expand($item)),
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = \App\Models\User::query()
            ->where('username', $credentials['username'])
            ->orWhere('email', $credentials['username'])
            ->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Username atau password tidak sesuai.'], 422);
        }

        return response()->json(['user' => [
            'id' => (string) $user->id,
            'username' => $user->username,
            'name' => $user->name,
            'role' => $user->role,
            'email' => $user->email,
            'teacherId' => $user->teacher_id,
            'studentId' => $user->student_id,
        ]]);
    }

    public function storeTeacher(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => ['nullable', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:100', 'unique:teachers,username'],
            'email' => ['nullable', 'email', 'unique:teachers,email'],
            'nip' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:30'],
        ]);

        $teacher = Teacher::create([
            ...$data,
            'id' => $data['id'] ?? 'guru-'.str()->uuid(),
            'profile' => $request->except(['id', 'name', 'username', 'email', 'nip', 'status']),
        ]);

        return response()->json($this->expand($teacher), 201);
    }

    public function updateTeacher(Request $request, Teacher $teacher): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:100', Rule::unique('teachers', 'username')->ignore($teacher->id, 'id')],
            'email' => ['nullable', 'email', Rule::unique('teachers', 'email')->ignore($teacher->id, 'id')],
            'nip' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:30'],
        ]);
        $teacher->update([...$data, 'profile' => $request->except(['name', 'username', 'email', 'nip', 'status'])]);

        return response()->json($this->expand($teacher->fresh()));
    }

    public function destroyTeacher(Teacher $teacher): JsonResponse
    {
        $teacher->delete();
        return response()->json(status: 204);
    }

    public function storeStudent(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => ['nullable', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:100'],
            'nis' => ['nullable', 'string', 'max:100'],
            'nisn' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:30'],
            'classId' => ['nullable', 'string', 'max:100'],
            'rombelId' => ['nullable', 'string', 'max:100'],
        ]);
        $student = Student::create([
            'id' => $data['id'] ?? 'murid-'.str()->uuid(),
            'name' => $data['name'],
            'username' => $data['username'] ?? null,
            'nis' => $data['nis'] ?? null,
            'nisn' => $data['nisn'] ?? null,
            'status' => $data['status'] ?? 'Aktif',
            'class_id' => $data['classId'] ?? null,
            'rombel_id' => $data['rombelId'] ?? null,
            'profile' => $request->except(['id', 'name', 'username', 'nis', 'nisn', 'status', 'classId', 'rombelId']),
        ]);

        return response()->json($this->expand($student), 201);
    }

    public function updateStudent(Request $request, Student $student): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:100'],
            'nis' => ['nullable', 'string', 'max:100'],
            'nisn' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:30'],
            'classId' => ['nullable', 'string', 'max:100'],
            'rombelId' => ['nullable', 'string', 'max:100'],
        ]);
        $student->update([
            ...collect($data)->except(['classId', 'rombelId'])->all(),
            'class_id' => $data['classId'] ?? null,
            'rombel_id' => $data['rombelId'] ?? null,
            'profile' => $request->except(['name', 'username', 'nis', 'nisn', 'status', 'classId', 'rombelId']),
        ]);

        return response()->json($this->expand($student->fresh()));
    }

    public function destroyStudent(Student $student): JsonResponse
    {
        $student->delete();
        return response()->json(status: 204);
    }

    private function expand(object $model): array
    {
        $base = $model->toArray();
        $profile = $base['profile'] ?? $base['data'] ?? [];
        unset($base['profile'], $base['data'], $base['created_at'], $base['updated_at']);
        if (array_key_exists('class_id', $base)) {
            $base['classId'] = $base['class_id'];
            unset($base['class_id']);
        }
        if (array_key_exists('rombel_id', $base)) {
            $base['rombelId'] = $base['rombel_id'];
            unset($base['rombel_id']);
        }
        return [...$profile, ...$base];
    }

    private function validateResource(string $resource): void
    {
        abort_unless(preg_match(self::RESOURCE_PATTERN, $resource) === 1, 422, 'Invalid resource name.');
    }
}
