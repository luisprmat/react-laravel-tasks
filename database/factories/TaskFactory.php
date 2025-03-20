<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\TaskCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'is_completed' => fake()->boolean(),
            'due_date' => fake()->dateTimeBetween('now', '+3 month'),
            'created_at' => fake()->dateTimeBetween(now()->startOfWeek(), now()->endOfWeek()),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): static
    {
        $taskCategories = TaskCategory::pluck('id')->toArray();

        return $this->afterCreating(function (Task $task) use ($taskCategories) {
            $task->taskCategories()->attach(Arr::random($taskCategories, rand(0, 2)));
        });
    }
}
