import { Head, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Task } from '@/types';

type EditTaskForm = {
    name: string;
    is_completed: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tasks', href: '/tasks' },
    { title: 'Edit', href: '' },
];

export default function Edit({ task }: { task: Task }) {
    const { t } = useLaravelReactI18n();
    const taskName = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing } = useForm<Required<EditTaskForm>>({
        name: task.name,
        is_completed: task.is_completed,
    });

    const editTask: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('tasks.update', task.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                if (errors.name) {
                    reset('name');
                    taskName.current?.focus();
                }
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Edit :name', { name: t('Task') })} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form onSubmit={editTask} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            {t('Task Name')} <span className={'text-red-500'}>*</span>
                        </Label>

                        <Input
                            id="name"
                            ref={taskName}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full"
                        />

                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="is_completed">{t('Completed?')}</Label>

                        <Switch checked={data.is_completed} onCheckedChange={() => setData('is_completed', !data.is_completed)} />

                        <InputError message={errors.is_completed} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>{t('Update :name', { name: t('Task') })}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
