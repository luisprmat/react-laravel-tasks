import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function Index() {
    const { t } = useLaravelReactI18n();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t(':Items List', { items: t('tasks') })} />
            <div>The list will be here.</div>
        </AppLayout>
    );
}
