import { Head, router, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import dayjs from '@/lib/dayjs';
import { type BreadcrumbItem, type Task, type TaskCategory } from '@/types';

type EditTaskForm = {
    name: string;
    is_completed: boolean;
    due_date?: string;
    media?: string | File;
    categories: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tasks', href: '/tasks' },
    { title: 'Edit', href: '' },
];

export default function Edit({ task, categories }: { task: Task; categories: TaskCategory[] }) {
    const { t } = useLaravelReactI18n();
    const taskName = useRef<HTMLInputElement>(null);

    const { data, setData, errors, reset, processing, progress } = useForm<Required<EditTaskForm>>({
        name: task.name,
        is_completed: task.is_completed,
        due_date: task.due_date,
        media: '',
        categories: task.task_categories.map((category) => category.id.toString()),
    });

    const editTask: FormEventHandler = (e) => {
        e.preventDefault();

        router.post(
            route('tasks.update', task.id),
            { ...data, _method: 'PUT' },
            {
                forceFormData: true,
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
            },
        );
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
                    <div className="grid gap-2">
                        <Label htmlFor="due_date">{t('Due Date')}</Label>

                        <Input
                            id="due_date"
                            value={data.due_date ? dayjs(data.due_date).format('YYYY-MM-DD') : ''}
                            onChange={(e) => setData('due_date', dayjs(e.target.value).format('YYYY-MM-DD'))}
                            className="mt-1 block w-full"
                            type="date"
                        />

                        <InputError message={errors.due_date} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="media">{t('Media')}</Label>

                        <Input
                            id="media"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                    setData('media', files[0]);
                                }
                            }}
                            className="mt-1 block w-full"
                            type="file"
                        />

                        {progress && (
                            <progress value={progress.percentage} max="100">
                                {progress.percentage}%
                            </progress>
                        )}

                        <InputError message={errors.media} />

                        {!task.mediaFile ? (
                            ''
                        ) : (
                            <a href={task.mediaFile.original_url} target="_blank" className="mx-auto my-4">
                                <img src={task.mediaFile.original_url} className={'h-32 w-32'} />
                            </a>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="due_date">{t('Categories')}</Label>

                        <ToggleGroup
                            type="multiple"
                            variant={'outline'}
                            size={'lg'}
                            value={data.categories}
                            onValueChange={(value) => setData('categories', value)}
                        >
                            {categories.map((category) => (
                                <ToggleGroupItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>

                        <InputError message={errors.due_date} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>{t('Update :name', { name: t('Task') })}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
