import { useState } from "react";

const CheckGovermentOfficer = () => {
  const [governmentOfficers, setGovernmentOfficers] = useState([]);

  const setupGovernmentOfficerList = (data) => {
    console.log("data", data);

    if (data?.CUSTOMER) {
      setGovernmentOfficers({ ...data.CUSTOMER });
    }
    console.log("data?.CUSTOMER", governmentOfficers);

    if (data?.GUARANTORS) {
      const governmentOfficersGuarantors = data.GUARANTORS.filter(
        (item) => item
      );
      console.log("governmentOfficersGuarantors", governmentOfficersGuarantors);

      setGovernmentOfficers((prev) => ({
        ...prev,
        guarantors: governmentOfficersGuarantors,
      }));
      console.log("governmentOfficers", governmentOfficers);
    }
  };
  return [setupGovernmentOfficerList, governmentOfficers];
};

export default CheckGovermentOfficer;
