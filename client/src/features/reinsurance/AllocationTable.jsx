import React, { useEffect, useState } from "react";

import { reinsuranceAPI } from "../../services/api";

const AllocationTable = ({ policyId }) => {
  const [allocations, setAllocations] = useState([]);
  const [retainedAmount, setRetainedAmount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const res = await reinsuranceAPI.getRiskAllocations(policyId);
        if (res.data.length > 0) {
          setAllocations(res.data[0].allocations);
          setRetainedAmount(res.data[0].retainedAmount);
        } else {
          setAllocations([]);
          setRetainedAmount(0);
        }
      } catch (err) {
        setError("Failed to load allocations");
      }
    };
    if (policyId) fetchAllocations();
  }, [policyId]);

  const validateAllocations = () => {
    return allocations.some(
      (a) => a.allocatedAmount > a.treatyId?.treatyLimit
    );
  };

  if (!policyId)
    return (
      <p className="text-gray-500 mt-4">
        Select a policy to view allocations.
      </p>
    );

  if (error)
    return (
      <p className="text-red-600 font-medium mt-4">{error}</p>
    );

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">

      {/* Title */}
      <h3 className="text-xl font-semibold mb-4">
        Risk Allocation Table
      </h3>

      {/* Validation Warning */}
      {validateAllocations() && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          One or more allocations exceed treaty limits!
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border">Reinsurer</th>
              <th className="px-4 py-2 text-left border">Treaty</th>
              <th className="px-4 py-2 text-right border">Allocated Amount</th>
              <th className="px-4 py-2 text-right border">Allocated %</th>
              <th className="px-4 py-2 text-right border">Treaty Limit</th>
            </tr>
          </thead>

          <tbody>
            {allocations.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500"
                >
                  No allocations found
                </td>
              </tr>
            ) : (
              allocations.map((a, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {a.reinsurerId?.name || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    {a.treatyId?.treatyName || "N/A"}
                  </td>
                  <td className="px-4 py-2 border text-right">
                    ₹{a.allocatedAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-right">
                    {a.allocatedPercentage}%
                  </td>
                  <td className="px-4 py-2 border text-right">
                    ₹{a.treatyId?.treatyLimit?.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Retained Amount */}
      <div className="mt-4 text-lg">
        <span className="font-semibold">
          Retained Amount:
        </span>{" "}
        ₹{retainedAmount.toLocaleString()}
      </div>

    </div>
  );
};

export default AllocationTable;
