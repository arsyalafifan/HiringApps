"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type RegisterForm = {
  nik: string;
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    nik: "",
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nik: form.nik,
        name: form.name,
        email: form.email,
        password: form.password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Register failed");
    }

    if (data.status) {
      alert(data.message || "Registration successful");
      router.push("/login");
    } else {
      alert(data.message || "Registration failed");
    }

  } catch (err) {
    console.error("Register error:", err);

    let message = "Failed to connect to API";
    if (err instanceof Error) {
      message = err.message;
    }

    alert(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white w-96 p-8 rounded-2xl shadow-lg space-y-4">

        <h1 className="text-2xl font-bold text-center">Register</h1>

        <input
          type="text"
          className="w-full border p-3 rounded"
          placeholder="NIK"
          value={form.nik}
          onChange={(e) => setForm({ ...form, nik: e.target.value })}
        />

        <input
          type="text"
          className="w-full border p-3 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          className="w-full border p-3 rounded"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full border p-3 rounded"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-green-600 text-white p-3 rounded">
          {loading ? "Loading..." : "Register"}
        </button>

        <p className="text-center text-sm">
          Already have an account? <Link href="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
}