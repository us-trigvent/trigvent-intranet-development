export default function PlaceholderPage({ title }) {
  return (
    <section className="p-6 lg:p-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">{title}</h1>
        <p className="mt-2 text-slate-500">This page is ready for its content.</p>
      </div>
    </section>
  );
}
