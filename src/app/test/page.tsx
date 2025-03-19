import React from 'react';
import InputT from '@/components/Inputs/TextArea/textarea.tsx';
import SingleInput from '@/components/Inputs/SingleInput/single-Input.tsx';

export default function Test() {
    return <div style={{
        width: '100vw',
        height: '100vh',
    }}>
        <InputT holder="hello"/>
        <SingleInput holder="hello"/>
    </div>
}