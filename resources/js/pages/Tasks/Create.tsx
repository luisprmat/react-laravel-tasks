import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import dayjs from '@/lib/dayjs';
import { type BreadcrumbItem, type TaskCategory } from '@/types';

type CreateTaskForm = {
    name?: string;
    due_date?: string;
    media?: string | File;
    categories?: string[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Tasks', href: '/tasks' },
    { title: 'Create', href: '/tasks' },
];

export default function Create({ categories }: { categories: TaskCategory[] }) {
    const { t } = useLaravelReactI18n();

    const taskName = useRef<HTMLInputElement>(null);

    const { data, setData, errors, post, reset, processing, progress } = useForm<Required<CreateTaskForm>>({
        name: '',
        due_date: '',
        media: '',
        categories: [],
    });

    const createTask: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('tasks.store'), {
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
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('Create :name', { name: t('Task') })} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <form onSubmit={createTask} className="space-y-6">
                    <Card>
                        <CardContent className="grid grid-cols-1 gap-4 space-y-6 md:grid-cols-2 lg:grid-cols-3">
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
                                <Label htmlFor="due_date">{t('Due Date')}</Label>

                                <Input
                                    id="due_date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', dayjs(e.target.value).format('YYYY-MM-DD'))}
                                    className="mt-1 block w-full dark:[color-scheme:dark]"
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
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="categories">{t('Categories')}</Label>

                                <ToggleGroup
                                    id="categories"
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

                                <InputError message={errors.categories} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>{t('Create :name', { name: t('Task') })}</Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
}
