import { Head, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type TaskCategory } from '@/types';

type EditTaskCategoryForm = {
    name: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tasks', href: '/tasks' },
    { title: 'Task Categories', href: '/task-categories' },
    { title: 'Edit', href: '' },
];

export default function Edit({ taskCategory }: { taskCategory: TaskCategory }) {
    const { t } = useLaravelReactI18n();
    const taskCategoryName = useRef<HTMLInputElement>(null);

    const { data, setData, errors, reset, processing, put } = useForm<Required<EditTaskCategoryForm>>({
        name: taskCategory.name,
    });

    const editTaskCategory: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('task-categories.update', taskCategory.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                if (errors.name) {
                    reset('name');
                    taskCategoryName.current?.focus();
                }
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Edit :name', { name: t('Task Category') })} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form onSubmit={editTaskCategory} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">
                            {t('Name')} <span className={'text-red-500'}>*</span>
                        </Label>

                        <Input
                            id="name"
                            ref={taskCategoryName}
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="mt-1 block w-full"
                        />

                        <InputError message={errors.name} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>{t('Update')}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
