import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppLayout from "../../../components/layout/AppLayout";
import NomineeForm from "../../../components/nominee/NomineeForm";

import {
  getNomineeById,
  updateNominee,
} from "../../../services/nomineeService";

export default function EditNominee() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [nominee, setNominee] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    loadNominee();

  }, []);

  async function loadNominee() {

    const data = await getNomineeById(id);

    setNominee(data);

  }

  async function handleSubmit(data) {

    try {

      setLoading(true);

      await updateNominee(id, data);

      navigate("/owner/nominees");

    } finally {

      setLoading(false);

    }

  }

  if (!nominee) {

    return (
      <AppLayout>
        Loading...
      </AppLayout>
    );

  }

  return (

    <AppLayout>

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Edit Nominee
        </h1>

        <NomineeForm
          initialData={nominee}
          loading={loading}
          onSubmit={handleSubmit}
        />

      </div>

    </AppLayout>

  );

}