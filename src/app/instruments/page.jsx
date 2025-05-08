'use client'; // Make sure you're in the 'client-side' app directory
import React, { useEffect, useState } from 'react'; // Import React and hooks
import { supabase } from '@/lib/supabaseClient'; // Import the supabase client from your lib

export default function Instruments() {
  const [instruments, setInstruments] = useState([]); // State to store the instruments

  useEffect(() => {
    // Function to fetch instruments from Supabase
    async function fetchInstruments() {
      const { data, error } = await supabase
        .from('instruments') // Access the instruments table
        .select('*'); // Get all columns

      if (error) {
        console.error('Error fetching instruments:', error); // Log error if any
      } else {
        console.log('Fetched instruments:', data); // Log fetched data for debugging
        setInstruments(data); // Store the fetched instruments in state
      }
    }

    fetchInstruments(); // Call the function to fetch data
  }, []); // Empty dependency array to run the effect once on component mount

  return (
    <main className='p-10'>
      <h1 className='text-2xl font-bold'>Instruments List</h1>
      {instruments.length === 0 ? (
        <p>No instruments available</p> // Display message if no instruments
      ) : (
        <ul className='mt-4'>
          {/* Loop over the instruments and display them */}
          {instruments.map((instrument) => (
            <li key={instrument.id} className='mb-2'>
              <strong>{instrument.name}</strong> - {instrument.type}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
