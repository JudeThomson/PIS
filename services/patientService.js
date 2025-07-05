import axios from "axios";

// Use your computer's IP address and Laravel port
const BASE_URL = "http://192.168.0.243:8000/api/patients";

export const getPatients = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const addPatient = async (formDataToSend) => {
  const response = await axios.post(BASE_URL, formDataToSend, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const deletePatient = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
export const getNextPatientId = async () => {
  const res = await axios.get("http://192.168.0.243:8000/api/patient_id/next");
  return res.data.next_id;
};
export const getPatientById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};
export const updatePatient = async (id, patientData) => {
  const response = await axios.post(
    `${BASE_URL}/${id}?_method=PUT`,
    patientData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};
