import { useState } from "react";
import { BadgeCheck, BriefcaseBusiness, Building2, CalendarDays, Mail, MapPin, Phone, Save, UserRound, X } from "lucide-react";

const initialProfile = {
  name: "Admin",
  role: "Intern",
  department: "Miscellaneous",
  designation: "Intern",
  employeeCode: "5345355",
  fullName: "Admin",
  fatherName: "N/A",
  personalEmail: "nifmisaluje98@gmail.com",
  officialEmail: "N/A",
  dateOfBirth: "2022-02-09",
  joiningDate: "2022-11-21",
  mobileNumber: "9813098136",
  alternateNumber: "2342344343",
  gender: "Male",
  state: "N/A",
  city: "N/A",
  address: "N/A",
};

const inputClass = "w-full rounded-xl border border-border-default bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/10";

function Detail({ label, value, icon: Icon }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-neutral-500">{Icon && <Icon size={14} />}{label}</div>
      <div className="truncate rounded-xl border border-border-light bg-surface-subtle px-3.5 py-2.5 text-sm font-medium text-brand-navy">{value || "N/A"}</div>
    </div>
  );
}

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialProfile);
  const [saved, setSaved] = useState(false);
  const displayed = form;

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaved(true);
    setEditing(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Profile</h1>
          <p className="mt-1 text-sm text-neutral-500">View and update your employee information.</p>
        </div>
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="rounded-xl bg-brand-teal px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-teal-dark">Edit Profile</button>
        )}
      </div>
      {saved && <div role="status" className="rounded-xl border border-brand-teal-soft bg-brand-teal-soft px-4 py-3 text-sm text-brand-teal-dark">Profile updated successfully.</div>}
      <main className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-border-default bg-white text-center shadow-sm">
            <div className="h-24 bg-linear-to-r from-brand-navy to-brand-teal-dark" />
            <div className="-mt-12 px-5 pb-6">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-brand-teal-soft text-3xl font-semibold text-brand-teal">{displayed.fullName.charAt(0)}</div>
              <h2 className="mt-3 flex items-center justify-center gap-1 text-xl font-semibold text-brand-navy">{displayed.fullName}<BadgeCheck size={18} className="text-brand-teal" /></h2>
              <p className="mt-1 text-sm text-brand-teal">{displayed.role}</p>
              <p className="mt-1 text-xs text-neutral-500">{displayed.department}</p>
            </div>
          </section>
        </aside>
        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-border-default bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-border-light px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-teal-soft text-brand-teal"><UserRound size={17} /></span>
              <h2 className="text-sm font-semibold text-brand-navy">Personal Details</h2>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {editing ? (
                <>
                  <label className="block text-xs font-medium text-neutral-500">Full Name<input name="fullName" value={displayed.fullName} onChange={handleChange} className={inputClass} /></label>
                  <label className="block text-xs font-medium text-neutral-500">Personal Email<input name="personalEmail" value={displayed.personalEmail} onChange={handleChange} className={inputClass} /></label>
                  <label className="block text-xs font-medium text-neutral-500">Mobile Number<input name="mobileNumber" value={displayed.mobileNumber} onChange={handleChange} className={inputClass} /></label>
                  <label className="block text-xs font-medium text-neutral-500">Gender<input name="gender" value={displayed.gender} onChange={handleChange} className={inputClass} /></label>
                </>
              ) : (
                <>
                  <Detail label="Full Name" value={displayed.fullName} icon={UserRound} />
                  <Detail label="Personal Email" value={displayed.personalEmail} icon={Mail} />
                  <Detail label="Mobile Number" value={displayed.mobileNumber} icon={Phone} />
                  <Detail label="Gender" value={displayed.gender} />
                </>
              )}
            </div>
          </section>
          <section className="overflow-hidden rounded-2xl border border-border-default bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-border-light px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-teal-soft text-brand-teal"><Building2 size={17} /></span>
              <h2 className="text-sm font-semibold text-brand-navy">Address Information</h2>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Detail label="State" value={displayed.state} icon={MapPin} />
              <Detail label="City" value={displayed.city} icon={MapPin} />
              <Detail label="Address" value={displayed.address} />
            </div>
          </section>
          <section className="overflow-hidden rounded-2xl border border-border-default bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-border-light px-5 py-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-teal-soft text-brand-teal"><BriefcaseBusiness size={17} /></span>
              <h2 className="text-sm font-semibold text-brand-navy">Professional Information</h2>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Department" value={displayed.department} />
              <Detail label="Designation" value={displayed.designation} />
              <Detail label="Joining Date" value={displayed.joiningDate} icon={CalendarDays} />
              <Detail label="Employee Code" value={displayed.employeeCode} icon={BadgeCheck} />
            </div>
          </section>
          {editing && (
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => { setForm(initialProfile); setEditing(false); }} className="inline-flex items-center gap-2 rounded-xl border border-border-default px-4 py-2.5 text-sm text-neutral-600"><X size={16} />Cancel</button>
              <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-brand-teal px-5 py-2.5 text-sm text-white"><Save size={16} />Save Changes</button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
