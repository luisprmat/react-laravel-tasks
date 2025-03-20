import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedResponse, type Task, type TaskCategory } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

import { TablePagination } from '@/components/table-pagination';
import { Button, buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import dayjs from '@/lib/dayjs';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function Index({
    tasks,
    categories,
    selectedCategories,
}: {
    tasks: PaginatedResponse<Task>;
    categories: TaskCategory[];
    selectedCategories: string[] | null;
}) {
    const { t } = useLaravelReactI18n();

    const deleteTask = (id: number) => {
        if (confirm(t('Are you sure?'))) {
            router.delete(route('tasks.destroy', { id }));
            toast.success(t('Task deleted successfully'));
        }
    };

    const selectCategory = (id: string) => {
        const selected = selectedCategories?.includes(id)
            ? selectedCategories?.filter((category) => category !== id)
            : [...(selectedCategories || []), id];
        router.visit('/tasks', { data: { categories: selected } });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t(':Items List', { items: t('tasks') })} />
            <div className={'mt-8 p-4'}>
                <div className={'flex flex-row gap-x-4'}>
                    <Link className={buttonVariants({ variant: 'default' })} href="/tasks/create">
                        {t('Create :name', { name: t('Task') })}
                    </Link>
                    <Link className={buttonVariants({ variant: 'outline' })} href="/task-categories">
                        {t('Manage Task Categories')}
                    </Link>
                </div>
                <div className={'mt-4 flex flex-row justify-center gap-x-2'}>
                    {categories.map((category: TaskCategory) => (
                        <Button
                            variant={selectedCategories?.includes(category.id.toString()) ? 'default' : 'outline'}
                            key={category.id}
                            onClick={() => selectCategory(category.id.toString())}
                        >
                            {category.name} ({category.tasks_count})
                        </Button>
                    ))}
                </div>
                <Table className={'mt-4'}>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('File')}</TableHead>
                            <TableHead>{t('Task')}</TableHead>
                            <TableHead className="w-[200px]">{t('Categories')}</TableHead>
                            <TableHead className="w-[100px]">{t('Status')}</TableHead>
                            <TableHead className="w-[100px]">{t('Due Date')}</TableHead>
                            <TableHead className="w-[150px] text-right">{t('Actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.data.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>
                                    {!task.mediaFile ? (
                                        ''
                                    ) : (
                                        <a href={task.mediaFile.original_url} target="_blank">
                                            <img src={task.mediaFile.original_url} className={'h-8 w-8'} />
                                        </a>
                                    )}
                                </TableCell>
                                <TableCell>{task.name}</TableCell>
                                <TableCell className={'flex flex-row gap-x-2'}>
                                    {task.task_categories?.map((category: TaskCategory) => (
                                        <span key={category.id} className="rounded-full bg-gray-200 px-2 py-1 text-xs">
                                            {category.name}
                                        </span>
                                    ))}
                                </TableCell>
                                <TableCell className={task.is_completed ? 'text-green-600' : 'text-red-700'}>
                                    {task.is_completed ? t('Completed') : t('In Progress')}
                                </TableCell>
                                <TableCell>{task.due_date ? dayjs(task.due_date).format('MMMM D, YYYY') : ''}</TableCell>
                                <TableCell className="flex flex-row gap-x-2 text-right">
                                    <Link className={buttonVariants({ variant: 'default' })} href={`/tasks/${task.id}/edit`}>
                                        {t('Edit')}
                                    </Link>
                                    <Button variant={'destructive'} className={'cursor-pointer'} onClick={() => deleteTask(task.id)}>
                                        {t('Delete')}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination resource={tasks} />
            </div>
        </AppLayout>
    );
}
