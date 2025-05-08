'use client'; // if you're inside app/ directory (required for client-side code)
import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('test') //
        .select('*');

      if (error) console.error('Supabase error:', error);
      else setData(data);
    }

    fetchData();
  }, []);

  return (
    <main className='p-10'>
      <h1 className='text-2xl font-bold'>Supabase Test</h1>
    </main>
  );
}
