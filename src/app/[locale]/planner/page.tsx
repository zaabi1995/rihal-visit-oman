import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';

// TODO: implement full trip planner with algorithm integration (Part 2)
export default async function PlannerPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations('planner');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
        {t('title')}
      </h1>
      <p className="text-dark/50">Coming soon...</p>
    </div>
  );
}
