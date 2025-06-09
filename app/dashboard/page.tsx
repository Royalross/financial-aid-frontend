'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  [key: string]: any;
};

export default function Page() {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

    if (!token) {
      setError('Not logged in or missing credentials.');
      setLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    axios
      .get<User>(`${apiUrl}/auth/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div>Dashboard</div>
      <p>Welcome{data && data.username ? `, ${data.username}` : ''}</p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && (
        <div
          style={{
            background: '#f4f4f4',
            padding: '1em',
            borderRadius: 8,
            marginTop: 12,
          }}
        >
          <h3>User Details:</h3>
          <ul>
            {Object.entries(data).map(([key, value]) => (
              <li key={key}>
                <b>{key}:</b> {String(value)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
