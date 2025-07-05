// // database/db.js
// import * as SQLite from "expo-sqlite";

// let db;

// export const openDB = async () => {
//   if (!db) {
//     db = await SQLite.openDatabaseAsync("patient.db");
//   }
//   return db;
// };

// export const createPatientTable = async () => {
//   const db = await openDB();
//   await db.runAsync(`DROP TABLE IF EXISTS patients`);

//   await db.runAsync(`
//     CREATE TABLE IF NOT EXISTS patients (
//       _id INTEGER PRIMARY KEY AUTOINCREMENT,
//       patient_name TEXT NOT NULL,
//       age TEXT,
//       sex TEXT,
//       spouse_name TEXT,
//       parent_name TEXT,
//       location TEXT,
//       mobile TEXT,
//       skype_id TEXT,
//       preferred_calling TEXT,
//       unique_id TEXT,
//       confidential INTEGER,
//       referred_by TEXT,
//       clinic_name TEXT,
//       date_of_birth TEXT,
//       marital_status TEXT,
//       guardian_name TEXT,
//       occupation TEXT,
//       annual_income TEXT,
//       home_phone TEXT,
//       home_address TEXT,
//       state TEXT,
//       country TEXT,
//       zip_code TEXT,
//       email TEXT,
//       emergency_name TEXT,
//       emergency_relation TEXT,
//       emergency_mobile TEXT,
//       emergency_phone TEXT
//     );
//   `);
// };

// export const insertPatient = async (form) => {
//   const db = await openDB();

//   const values = [
//     form.patientName,
//     form.age,
//     form.sex,
//     form.spouseName,
//     form.fatherMotherName,
//     form.location,
//     form.mobile,
//     form.skypeID,
//     form.preferredCalling,
//     form.uniqueID,
//     form.confidential ? 1 : 0,
//     form.referredBy,
//     form.clinicName,
//     typeof form.dateOfBirth === "string"
//       ? form.dateOfBirth
//       : form.dateOfBirth.toISOString().split("T")[0],
//     form.maritalStatus,
//     form.guardianName,
//     form.occupation,
//     form.income,
//     form.homePhone,
//     form.homeAddress,
//     form.state,
//     form.country,
//     form.zipCode,
//     form.email,
//     form.emergencyName,
//     form.emergencyRelation,
//     form.emergencyMobile,
//     form.emergencyPhone,
//   ];

//   try {
//     await db.runAsync(
//       `INSERT INTO patients (
//         patient_name, age, sex, spouse_name, parent_name, location, mobile, skype_id,
//         preferred_calling, unique_id, confidential, referred_by, clinic_name, date_of_birth,
//         marital_status, guardian_name, occupation, annual_income, home_phone, home_address,
//         state, country, zip_code, email, emergency_name, emergency_relation,
//         emergency_mobile, emergency_phone
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       values
//     );
//     console.log("✅ Inserted into database");
//   } catch (err) {
//     console.error("❌ DB Insert Error:", err);
//   }
// };
// export const getAllPatients = async () => {
//   const db = await openDB();
//   const results = await db.getAllAsync(
//     "SELECT id, patient_name, mobile, unique_id FROM patients"
//   );
//   return results;
// };

// export const deletePatientById = async (id) => {
//   const db = await openDB();
//   await db.runAsync("DELETE FROM patients WHERE id = ?", [id]);
// };
