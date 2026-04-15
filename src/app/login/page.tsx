"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from '../contexts/AuthContext';

type LoginForm = {
  Mail: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginForm>({
    Mail: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({
        Mail: form.Mail,
        password: form.password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.status && data.token) {
      login(data.token)
      router.push("/profile");
    } else {
      alert(data.message || "Login failed");
    }

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to connect to API";
    console.error("Login error:", err);
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white w-96 p-8 rounded-2xl shadow-lg space-y-4">

        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          type="email"
          className="w-full border p-3 rounded"
          placeholder="Email"
          value={form.Mail}
          onChange={(e) =>
            setForm({ ...form, Mail: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full border p-3 rounded"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded">
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Don&apos;t have an account? <Link href="/register" className="text-blue-600">Register</Link>
        </p>
      </form>
    </div>
  );
}