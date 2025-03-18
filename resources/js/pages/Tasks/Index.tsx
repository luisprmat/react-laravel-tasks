import AppLayout from '@/layouts/app-layout';
import { Task, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function Index({ tasks }: { tasks: Task[] }) {
    const { t } = useLaravelReactI18n();

    const deleteTask = (id: number) => {
        if (confirm(t('Are you sure?'))) {
            router.delete(route('tasks.destroy', { id }));
            toast.success(t('Task deleted successfully'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t(':Items List', { items: t('tasks') })} />
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('Task')}</TableHead>
                            <TableHead className="w-[100px]">{t('Status')}</TableHead>
                            <TableHead className="w-[150px] text-right">{t('Actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.name}</TableCell>
                                <TableCell className={task.is_completed ? 'text-green-600' : 'text-red-700'}>
                                    {task.is_completed ? t('Completed') : t('In Progress')}
                                </TableCell>
                                <TableCell className="flex flex-row gap-x-2 text-right">
                                    <Button variant={'destructive'} className={'cursor-pointer'} onClick={() => deleteTask(task.id)}>
                                        {t('Delete')}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
