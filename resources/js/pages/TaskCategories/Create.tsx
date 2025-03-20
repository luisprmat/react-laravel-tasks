import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';

type CreateTaskCategoryForm = {
    name?: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tasks', href: '/tasks' },
    { title: 'Task Categories', href: '/task-categories' },
    { title: 'Create', href: '/tasks' },
];

export default function Create() {
    const { t } = useLaravelReactI18n();

    const taskCategoryName = useRef<HTMLInputElement>(null);

    const { data, setData, errors, post, reset, processing } = useForm<Required<CreateTaskCategoryForm>>({
        name: '',
    });

    const createTaskCategory: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('task-categories.store'), {
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
            <Head title={t('Create :name', { name: t('Task Category') })} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form onSubmit={createTaskCategory} className="space-y-6">
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
                        <Button disabled={processing}>{t('Create')}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
