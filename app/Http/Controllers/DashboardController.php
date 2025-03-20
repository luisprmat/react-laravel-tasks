<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        return Inertia::render('dashboard', [
            'completedVsPendingTaskChart' => $this->getCompletedVsPendingTaskChart(),
            'pendingTasksToday' => Task::query()
                ->where('is_completed', false)
                ->whereDate('due_date', now())
                ->count(),
            'tasksCreatedByDay' => $this->getTasksCreatedByDay(),
        ]);
    }

    private function getCompletedVsPendingTaskChart(): array
    {
        return [
            'labels' => [__('Completed'), __('In Progress')],
            'datasets' => [
                [
                    'label' => __('Tasks'),
                    'backgroundColor' => ['#3490dc', '#f6993f'],
                    'data' => [
                        Task::query()->where('is_completed', true)->count(),
                        Task::query()->where('is_completed', false)->count(),
                    ],
                ],
            ],
        ];
    }

    private function getTasksCreatedByDay(): array
    {
        return [
            'labels' => [__('Mon'), __('Tue'), __('Wed'), __('Thu'), __('Fri'), __('Sat'), __('Sun')],
            'datasets' => [
                [
                    'label' => __('Tasks'),
                    'backgroundColor' => '#3490dc',
                    'data' => collect(range(0, 6))
                        ->map(function ($day) {
                            $date = now()->startOfWeek()->addDays($day);

                            return Task::query()->whereDate('due_date', $date)->count();
                        })
                        ->toArray(),
                ],
            ],
        ];
    }
}
