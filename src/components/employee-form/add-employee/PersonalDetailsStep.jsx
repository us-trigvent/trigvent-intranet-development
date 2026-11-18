import {
  BriefcaseBusiness,
  CalendarDays,
  UserRound,
} from "lucide-react";
import FormField from "../FormField";
import FormSection from "../FormSection";
import {
  probationOptions,
  verificationOptions,
  workTypeOptions,
} from "./employeeFormConfig";

export default function PersonalDetailsStep({
  field,
  form,
  errors,
  updateField,
  getNextEmployeeCode,
  nextEmployeeCodeLoading,
  nextEmployeeCodeError,
  updateState,
  states,
  departments,
  designations,
  cities,
}) {
  return (
    <>
      <FormSection
        title="Basic Information"
        description="Enter the employee's personal and identification details."
        icon={UserRound}
      >
        <FormField
          label="First Name"
          placeholder="Enter first name"
          required
          {...field("firstName")}
        />
        <FormField
          label="Last Name"
          placeholder="Enter last name"
          {...field("lastName")}
        />
        <FormField
          label="Date of Birth"
          type="date"
          max={new Date().toISOString().split("T")[0]}
          required
          {...field("dob")}
        />
        <FormField
          label="Gender"
          type="radio"
          required
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ]}
          {...field("gender")}
        />
        <FormField
          label="Profile Image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          name="profileImage"
          onChange={updateField}
          error={errors.profileImage}
          hint="Optional. Choose an image file."
        />
      </FormSection>

      <FormSection
        title="Contact Information"
        description="Employee contact details and professional profiles."
        icon={UserRound}
      >
        <FormField
          label="Mobile Number"
          type="tel"
          placeholder="Enter mobile number"
          required
          {...field("mobile")}
        />
        <FormField
          label="Alternate Number"
          type="tel"
          placeholder="Enter alternate number"
          required
          {...field("alternateNumber")}
        />
        <FormField
          label="Official Email"
          type="email"
          placeholder="name@trigvent.com"
          {...field("officialEmail")}
        />
        <FormField
          label="Personal Email"
          type="email"
          placeholder="name@example.com"
          required
          {...field("personalEmail")}
        />
      </FormSection>

      <FormSection
        title="Address Information"
        description="Residential address and location."
        icon={CalendarDays}
      >
        <FormField
          label="Permanent Address"
          placeholder="Enter permanent address"
          {...field("permanentAddress")}
        />
        <FormField
          label="State"
          type="select"
          options={states.records.map((option) => ({
            label: option.name,
            value: option.id,
          }))}
          placeholder="Select state"
          disabled={states.loading || Boolean(states.error)}
          hint={
            states.error ||
            (states.loading ? "Loading states..." : undefined)
          }
          {...field("stateId")}
          onChange={updateState}
        />
        <FormField
          label="City"
          type="select"
          options={cities.records.map((option) => ({
            label: option.name,
            value: option.name,
          }))}
          placeholder={
            !form.stateId
              ? "Select a state first"
              : cities.loading
                ? "Loading cities..."
                : "Select city"
          }
          hint={cities.error || undefined}
          disabled={
            !form.stateId || cities.loading || Boolean(cities.error)
          }
          {...field("city")}
        />
        <FormField
          label="PIN Code"
          placeholder="Enter PIN code"
          {...field("pincode")}
        />
      </FormSection>

      <FormSection
        title="Emergency Contact"
        description="Optional contact details for emergencies."
        icon={UserRound}
      >
        <FormField
          label="Contact Name"
          placeholder="Enter contact name"
          {...field("emergencyContactName")}
        />
        <FormField
          label="Relationship"
          placeholder="e.g. Spouse"
          {...field("emergencyContactRelation")}
        />
        <FormField
          label="Contact Number"
          type="tel"
          placeholder="Enter contact number"
          {...field("emergencyContactNumber")}
        />
      </FormSection>

      <FormSection
        title="Employment Details"
        description="Assign the employee's department and work information."
        icon={BriefcaseBusiness}
      >
        <FormField
          label="Department"
          type="select"
          options={departments.records.map((option) => ({
            label: option.name,
            value: option.id,
          }))}
          placeholder={
            departments.loading ? "Loading departments..." : "Select department"
          }
          disabled={departments.loading || Boolean(departments.error)}
          hint={departments.error || undefined}
          required
          {...field("department")}
        />
        <FormField
          label="Designation"
          type="select"
          options={designations.records.map((option) => ({
            label: option.name,
            value: option.id,
          }))}
          placeholder={
            !form.department
              ? "Select a department first"
              : designations.loading
                ? "Loading designations..."
                : "Select designation"
          }
          hint={designations.error || undefined}
          disabled={
            !form.department ||
            designations.loading ||
            Boolean(designations.error)
          }
          required
          {...field("designation")}
        />
        <FormField
          label="Joining Date"
          type="date"
          required
          {...field("joiningDate")}
        />
        <FormField
          label="Work Type"
          type="select"
          options={workTypeOptions}
          placeholder="Select work type"
          required
          {...field("workType")}
        />
        <FormField
          label="Branch"
          type="select"
          options={["Mohali", "Yamuna Nagar", "Remote"]}
          required
          {...field("branch")}
        />
        <FormField
          label="Employee Code"
          placeholder="e.g. TRG-1005"
          hint={nextEmployeeCodeError || undefined}
          action={{
            label: "Get code",
            ariaLabel: "Get employee code",
            onClick: getNextEmployeeCode,
            loading: nextEmployeeCodeLoading,
          }}
          {...field("employeeCode")}
        />
        <FormField
          label="Probation Period"
          type="select"
          options={probationOptions}
          placeholder="Select probation period"
          {...field("probationPeriod")}
        />
        <FormField
          label="Attendance Code"
          placeholder="Enter attendance code"
          {...field("attendanceCode")}
        />
        <FormField
          label="Card Number"
          placeholder="Enter card number"
          required
          {...field("cardNumber")}
        />
        <FormField
          label="Background Verification"
          type="select"
          options={verificationOptions}
          placeholder="Select verification status"
          {...field("backgroundVerification")}
        />
        <FormField
          label="Remarks"
          type="textarea"
          placeholder="Add employment remarks"
          rows={3}
          {...field("receivedRemarks")}
        />
      </FormSection>
    </>
  );
}
