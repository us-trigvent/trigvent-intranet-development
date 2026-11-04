export default function PlaceholderPage({ title }) {
  return (
    <section className="p-6 lg:p-10">
      <div className="rounded-2xl border border-border-default bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-text-strong">{title}</h1>
        <p className="mt-2 text-neutral-500">This page is ready for its content.</p>
      </div>
    </section>
  );
}
