import React from 'react';
import "./styles.css"

import TextArea from '@/components/Inputs/TextArea/textarea.tsx';
import SingleInput from '@/components/Inputs/SingleInput/single-Input.tsx';



export default function Components() {
    return <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        maxWidth: '800px',
        flexDirection: 'column',
        gap: '10px',
        padding: '20px',
    }}>
        <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            width: '100%',
            marginBottom: '-10px',
        }}>
            Components
        </h1>
        <h3>
            Text Area
        </h3>
        <TextArea holder="hello" height={1}/>
        <h3>
            Single Input
        </h3>
        <SingleInput holder="hello" />
    </div>
}