'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type ProfileData = {
  nik: string
  nama: string
  gender: string
  phone: string
  email: string
  birthPlace: string
  birthDate: string
  age: string
  marital: string
  religion: string
  tribe: string
  education: string
  major: string
  school: string
}

const temp: ProfileData = {
  nik: '',
  nama: '',
  gender: '',
  phone: '',
  email: '',
  birthPlace: '',
  birthDate: '',
  age: '',
  marital: '',
  religion: '',
  tribe: '',
  education: '',
  major: '',
  school: '',
}

const ProfileForm = () => {
  const router = useRouter()
  const [isEdit, setIsEdit] = useState(false)
  const [formData, setFormData] = useState<ProfileData>(temp)
  const [tempData, setTempData] = useState<ProfileData>(temp)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [educations, setEducations] = useState<any[]>([])

  useEffect(() => {
    const loadProfile = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      if (!token) {
        router.push("/login");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("http://localhost:8000/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (!res.ok || !data.status) {
          throw new Error(data.message || "Failed to load profile");
        }

        const p = data.data.profile; // ✅ FIX disini

        const computeAge = (dateStr: string) => {
          if (!dateStr) return "";
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return "";
          const diff = Date.now() - d.getTime();
          return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)).toString();
        };

        const mapped: ProfileData = {
          nik: p.NIK ?? "",
          nama: p.Name ?? "",
          gender: p.Gender ?? "",
          phone: p.HP1 ?? p.HP2 ?? "",
          email: p.Email ?? "",
          birthPlace: p.Birth_place ?? "",
          birthDate: p.Birth_date ?? "",
          age: computeAge(p.Birth_date ?? ""),
          marital: p.marital ?? "",
          religion: p.Religion ?? "",
          tribe: p.Race ?? "",
          education: p.LastEducLevel ?? "",
          major: p.LastEducMajor ?? "",
          school: p.LastEducInstitu ?? ""
        };

        setFormData(mapped);
        setTempData(mapped);
        setError(null);

      } catch (err) {
        console.error("Load profile error:", err);

        let message = "Failed to load profile";
        if (err instanceof Error) {
          message = err.message;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

  loadProfile();
}, [router]);

useEffect(() => {
  const fetchEducation = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/education")
      const data = await res.json()

      if (data.status) {
        setEducations(data.data)
      }
    } catch (err) {
      console.error("Failed load education", err)
    }
  }

  fetchEducation()
}, [])

const handleChange = (key: keyof ProfileData, value: string) => {
  const updated = { ...tempData, [key]: value };

  // auto hitung umur kalau birthDate berubah
  if (key === "birthDate") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      const age = Math.floor(
        (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      );
      updated.age = String(age);
    }
  }
  
  setTempData(updated)
}

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired, please login again");
        router.push("/login");
        return;
      }

      setLoading(true);

      const res = await fetch("http://localhost:8000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          NIK: tempData.nik,
          Name: tempData.nama,
          Gender: tempData.gender,
          HP1: tempData.phone,
          Birth_place: tempData.birthPlace,
          Birth_date: tempData.birthDate,
          marital: tempData.marital,
          Religion: tempData.religion,
          Race: tempData.tribe,
          LastEducLevel: tempData.education,
          LastEducMajor: tempData.major,
          LastEducInstitu: tempData.school
        })
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Update failed");
      }

      // update UI setelah berhasil
      setFormData(tempData);
      setIsEdit(false);

      alert("Profile updated successfully");

    } catch (err) {
      console.error("Update error:", err);

      let message = "Failed to update profile";
      if (err instanceof Error) {
        message = err.message;
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempData(formData)
    setIsEdit(false)
  }

  return (
    <div className="bg-white rounded-xl shadow p-8">
      {loading && (
        <div className="mb-4 text-sm text-gray-600">Loading profile...</div>
      )}
      {error && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-primary">
          Informasi Personal
        </h2>

        {!isEdit ? (
          <button
            onClick={() => setIsEdit(true)}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
          >
            Ubah
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Simpan"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Batal
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-2 gap-6">
        <Field label="NIK" value={isEdit ? tempData.nik : formData.nik} edit={false}
          onChange={(v) => handleChange('nik', v)} />

        <Field label="Nama" value={isEdit ? tempData.nama : formData.nama} edit={isEdit}
          onChange={(v) => handleChange('nama', v)} />

        <Field label="Jenis Kelamin" value={isEdit ? tempData.gender : formData.gender} edit={isEdit}
          onChange={(v) => handleChange('gender', v)} />

        <Field label="Nomor Telepon" value={isEdit ? tempData.phone : formData.phone} edit={isEdit}
          onChange={(v) => handleChange('phone', v)} />

        <Field label="Email" value={isEdit ? tempData.email : formData.email} edit={false}
          onChange={(v) => handleChange('email', v)} />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Tempat / Tanggal Lahir <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-2">
            {/* Birth Place */}
            {!isEdit ? (
              <p className="border rounded-lg px-4 py-2 bg-gray-50 w-1/2">
                {formData.birthPlace || '-'}
              </p>
            ) : (
              <input
                value={tempData.birthPlace}
                onChange={(e) =>
                  handleChange("birthPlace", e.target.value)
                }
                placeholder="Tempat lahir"
                className="border rounded-lg px-4 py-2 w-1/2"
              />
            )}

            {/* Birth Date */}
            {!isEdit ? (
              <p className="border rounded-lg px-4 py-2 bg-gray-50 w-1/2">
                {formData.birthDate || '-'}
              </p>
            ) : (
              <input
                type="date"
                value={tempData.birthDate}
                onChange={(e) =>
                  handleChange("birthDate", e.target.value)
                }
                className="border rounded-lg px-4 py-2 w-1/2"
              />
            )}
          </div>
        </div>

        <Field label="Umur" value={isEdit ? tempData.age : formData.age} edit={isEdit}
          onChange={(v) => handleChange('age', v)} />

        <Field label="Status Pernikahan" value={isEdit ? tempData.marital : formData.marital} edit={isEdit}
          onChange={(v) => handleChange('marital', v)} />

        <Field label="Agama" value={isEdit ? tempData.religion : formData.religion} edit={isEdit}
          onChange={(v) => handleChange('religion', v)} />

        <Field label="Suku" value={isEdit ? tempData.tribe : formData.tribe} edit={isEdit}
          onChange={(v) => handleChange('tribe', v)} />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Pendidikan Terakhir</label>

          {!isEdit ? (
            <p className="border rounded-lg px-4 py-2 bg-gray-50">
              {formData.education || '-'}
            </p>
          ) : (
            <select
              value={tempData.education}
              onChange={(e) => handleChange("education", e.target.value)}
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">-- Pilih Pendidikan --</option>

              {educations.map((edu) => (
                <option key={edu.educID} value={edu.educCode}>
                  {edu.educName} ({edu.educCode})
                </option>
              ))}
            </select>
          )}
        </div>

        <Field label="Jurusan Terakhir" value={isEdit ? tempData.major : formData.major} edit={isEdit}
          onChange={(v) => handleChange('major', v)} />

        <Field label="Sekolah / Universitas" value={isEdit ? tempData.school : formData.school} edit={isEdit}
          onChange={(v) => handleChange('school', v)} />
      </div>
    </div>
  )
}

const Field = ({
  label,
  value,
  edit,
  onChange,
}: {
  label: string
  value: string
  edit: boolean
  onChange: (v: string) => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>

      {!edit ? (
        <p className="border rounded-lg px-4 py-2 bg-gray-50">
          {value || '-'}
        </p>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
        />
      )}
    </div>
  )
}

export default ProfileForm
