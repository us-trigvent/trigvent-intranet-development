import { useState } from "react";
import {
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Link2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";

const profile = {
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
  linkedin: "N/A",
  accountName: "N/A",
  bankName: "N/A",
  accountNumber: "N/A",
  ifscCode: "N/A",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#203D61] outline-none transition focus:border-[#0D9999] focus:ring-4 focus:ring-[#0D9999]/10";

function Detail({ label, value, wide = false, icon: Icon }) {
  return (
    <div className={`min-w-0 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        {Icon && <Icon size={14} className="text-slate-400" />}
        {label}
      </div>
      <div className="truncate rounded-xl border border-slate-100 bg-[#F8FAFD] px-3.5 py-2.5 text-sm font-medium text-[#203D61]">
        {value || "N/A"}
      </div>
    </div>
  );
}

function EditableDetail({ label, name, value, type = "text", onChange, icon: Icon }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500">
        {Icon && <Icon size={14} className="text-slate-400" />}
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={inputClass}
      />
    </label>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F7F6] text-[#0D9999]">
          <Icon size={17} />
        </span>
        <h2 className="text-sm font-semibold text-[#203D61] sm:text-base">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSaved(false);
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setEditing(false);
    setSaved(true);
  };

  const displayed = editing ? form : profile;

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 pb-10 pt-20 sm:px-6 lg:px-8 lg:pt-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Trigvent</span>
            <span className="text-slate-300">/</span>
            <span>Profile</span>
            <span className="text-slate-300">/</span>
            <span className="text-[#0D9999]">My Profile</span>
          </div>
          <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#203D61] sm:text-3xl">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F7F6] text-[#0D9999]">
              <UserRound size={23} />
            </span>
            My Profile
          </h1>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D9999] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#087F80] focus:outline-none focus:ring-4 focus:ring-[#0D9999]/20"
          >
            <Edit3 size={16} />
            Edit Profile
          </button>
        )}
      </header>

      {saved && (
        <div role="status" className="mb-5 flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">
          <CheckCircle2 size={17} />
          Profile updated successfully.
        </div>
      )}

      <div className="grid items-start gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-center shadow-sm">
            <div className="h-24 bg-linear-to-r from-[#203D61] to-[#2A668A]" />
            <div className="px-5 pb-6">
              <div className="-mt-12 mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-[#E8F7F6] text-3xl font-semibold text-[#0D9999] shadow-md">
                A
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <h2 className="text-xl font-semibold text-[#203D61]">{displayed.name}</h2>
                <BadgeCheck size={18} className="text-[#0D9999]" fill="#0D9999" />
              </div>
              <p className="mt-1 text-sm font-medium text-[#0D9999]">{displayed.role}</p>
              <p className="mt-1 text-xs text-slate-500">{displayed.department}</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#203D61] px-3 py-4 text-white">
                  <CalendarDays size={19} className="mx-auto text-[#73D3D3]" />
                  <p className="mt-2 text-xs text-[#C9D7E7]">Joined</p>
                  <p className="mt-1 text-sm font-semibold">Nov 2022</p>
                </div>
                <div className="rounded-xl bg-[#0D9999] px-3 py-4 text-white">
                  <BriefcaseBusiness size={19} className="mx-auto text-white" />
                  <p className="mt-2 text-xs text-teal-100">Employee</p>
                  <p className="mt-1 text-sm font-semibold">Intern</p>
                </div>
              </div>
            </div>
          </section>

          <SectionCard title="Bank Details" icon={Banknote}>
            <div className="space-y-3">
              {[
                ["Account Name", displayed.accountName],
                ["Bank Name", displayed.bankName],
                ["Account No.", displayed.accountNumber],
                ["IFSC Code", displayed.ifscCode],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-100 bg-[#F8FAFD] px-3 py-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-medium text-[#203D61]">{value || "N/A"}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Social Links" icon={Link2}>
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-[#F8FAFD] px-3 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 font-bold text-blue-600">in</span>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">LinkedIn</p>
                <p className="truncate text-sm font-medium text-[#203D61]">{displayed.linkedin}</p>
              </div>
            </div>
          </SectionCard>
        </aside>

        <form onSubmit={handleSave} className="min-w-0 space-y-5">
          <SectionCard title="Personal Details" icon={UserRound}>
            <div className="grid gap-4 sm:grid-cols-2">
              {editing ? (
                <>
                  <EditableDetail label="Full Name" name="fullName" value={displayed.fullName} onChange={handleChange} />
                  <EditableDetail label="Personal Email" name="personalEmail" value={displayed.personalEmail} onChange={handleChange} icon={Mail} />
                  <EditableDetail label="Father Name" name="fatherName" value={displayed.fatherName} onChange={handleChange} />
                  <EditableDetail label="Official Email" name="officialEmail" value={displayed.officialEmail} onChange={handleChange} icon={Mail} />
                  <EditableDetail label="Date of Birth" name="dateOfBirth" value={displayed.dateOfBirth} onChange={handleChange} type="date" icon={CalendarDays} />
                  <EditableDetail label="Mobile Number" name="mobileNumber" value={displayed.mobileNumber} onChange={handleChange} icon={Phone} />
                  <EditableDetail label="Gender" name="gender" value={displayed.gender} onChange={handleChange} />
                  <EditableDetail label="Alternate Number" name="alternateNumber" value={displayed.alternateNumber} onChange={handleChange} icon={Phone} />
                </>
              ) : (
                <>
                  <Detail label="Full Name" value={displayed.fullName} />
                  <Detail label="Personal Email" value={displayed.personalEmail} icon={Mail} />
                  <Detail label="Father Name" value={displayed.fatherName} />
                  <Detail label="Official Email" value={displayed.officialEmail} icon={Mail} />
                  <Detail label="Date of Birth" value={displayed.dateOfBirth} icon={CalendarDays} />
                  <Detail label="Mobile Number" value={displayed.mobileNumber} icon={Phone} />
                  <Detail label="Gender" value={displayed.gender} />
                  <Detail label="Alternate Number" value={displayed.alternateNumber} icon={Phone} />
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Address Information" icon={Building2}>
            <div className="grid gap-4 sm:grid-cols-2">
              {editing ? (
                <>
                  <EditableDetail label="State" name="state" value={displayed.state} onChange={handleChange} icon={MapPin} />
                  <EditableDetail label="City" name="city" value={displayed.city} onChange={handleChange} icon={MapPin} />
                  <EditableDetail label="Address" name="address" value={displayed.address} onChange={handleChange} />
                </>
              ) : (
                <>
                  <Detail label="State" value={displayed.state} icon={MapPin} />
                  <Detail label="City" value={displayed.city} icon={MapPin} />
                  <Detail label="Address" value={displayed.address} wide icon={MapPin} />
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Professional Information" icon={BriefcaseBusiness}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Department" value={displayed.department} />
              <Detail label="Designation" value={displayed.designation} />
              <Detail label="Joining Date" value={displayed.joiningDate} icon={CalendarDays} />
              <Detail label="Employee Code" value={displayed.employeeCode} icon={BadgeCheck} />
            </div>

            {editing && (
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D9999] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#087F80] focus:outline-none focus:ring-4 focus:ring-[#0D9999]/20"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </SectionCard>
        </form>
      </div>
    </div>
  );
}
