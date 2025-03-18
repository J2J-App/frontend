"use client"

import React from 'react';
import './Input.css';

export default function Input({holder} : {holder: string}) {
  console.log(holder)
  return (
    <div>
        <input type="text" className='text' placeholder={holder} />
    </div>
  );
}