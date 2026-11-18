import { Landmark, ShieldCheck } from "lucide-react";
import FormField from "../FormField";
import FormSection from "../FormSection";

export default function BankDetailsStep({ field, updateField }) {
  return (
    <>
      <FormSection
        title="Banking Information"
        description="Add the employee's bank details for payroll processing."
        icon={Landmark}
        columns={2}
      >
        <FormField
          label="Account Holder Name"
          placeholder="Enter account holder name"
          {...field("accountHolderName")}
        />
        <FormField
          label="Bank Name"
          placeholder="Enter bank name"
          {...field("bankName")}
        />
        <FormField
          label="Account Number"
          placeholder="Enter account number"
          {...field("accountNumber")}
        />
        <FormField
          label="IFSC Code"
          placeholder="e.g. HDFC0001234"
          {...field("ifscCode")}
        />
      </FormSection>

      <FormSection
        title="Identity Information"
        description="Provide identity details required for employee records."
        icon={ShieldCheck}
        columns={2}
      >
        <FormField
          label="Aadhaar Number"
          placeholder="Enter 12-digit Aadhaar number"
          required
          {...field("aadhaarNumber")}
        />
        <FormField
          label="PAN Number"
          placeholder="e.g. ABCDE1234F"
          required
          {...field("panNumber")}
          onChange={(event) =>
            updateField({
              target: {
                name: "panNumber",
                value: event.target.value.toUpperCase(),
              },
            })
          }
        />
      </FormSection>
    </>
  );
}
