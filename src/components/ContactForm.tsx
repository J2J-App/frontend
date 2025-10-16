"use client"; 

import React, { useState, useEffect } from 'react'; 
import { MdMail } from 'react-icons/md'; 


const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || 'https://formspree.io/f/fallback-for-testing';


interface FormData {
    name: string;
    _replyto: string; 
    message: string;
}


const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    marginTop: '5px',
    marginBottom: '5px',
    border: '1px solid #444',
    borderRadius: '8px',
    backgroundColor: '#1a1a1a', 
    color: '#eee', 
    fontSize: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', 
    transition: 'border-color 0.3s',
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontWeight: '600',
    color: '#aaa', 
    fontSize: '14px',
};


const ContactForm: React.FC = () => {
    
    const [isMounted, setIsMounted] = useState(false); 

    
    const [formData, setFormData] = useState<FormData>({ name: '', _replyto: '', message: '' }); 
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        setIsMounted(true); 
    }, []); 

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
               
                body: JSON.stringify(formData), 
            });

            if (response.ok) {
                setStatus('success');
                
                setFormData({ name: '', _replyto: '', message: '' }); 
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <form onSubmit={handleSubmit} className="contact-form-container" style={{
            
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: 'rgba(20, 20, 20, 0.7)', 
            maxWidth: '450px',
            margin: '20px auto', 
        }}> 
            
            
            <div style={{ marginBottom: '15px' }}> 
                <label htmlFor="contact-name" style={labelStyle}>Your Name</label>
                <input 
                    id="contact-name" 
                    name="name" 
                    type="text" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    style={inputStyle}
                />
            </div>
            
           
            <div style={{ marginBottom: '15px' }}> 
                <label htmlFor="contact-email" style={labelStyle}>Your Email</label>
                <input 
                    id="contact-email" 
                    name="_replyto" 
                    type="email" 
                    value={formData._replyto} 
                    onChange={handleChange} 
                    required 
                    style={inputStyle}
                />
            </div>

            
            <div style={{ marginBottom: '20px' }}> 
                <label htmlFor="contact-message" style={labelStyle}>Message</label>
                <textarea 
                    id="contact-message" 
                    name="message" 
                    rows={4} 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    style={{...inputStyle, resize: 'vertical'}} 
                />
            </div>

            
            <button type="submit" disabled={status === 'loading'} className="contact-submit-button" style={{
                width: '100%',
                padding: '12px 15px',
                backgroundColor: status === 'loading' ? '#4a5568' : '#63b3ed', 
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '8px',
                border: 'none',
                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s, opacity 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                opacity: status === 'loading' ? 0.7 : 1,
            }}>
                <MdMail /> {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
            
            
            {status === 'success' && (
                <p role="alert" style={{ color: '#48bb78', marginTop: '10px', textAlign: 'center' }}>
                    Message sent successfully!
                </p>
            )}
            {status === 'error' && (
                <p role="alert" style={{ color: '#f56565', marginTop: '10px', textAlign: 'center' }}>
                    Failed to send. Please try again.
                </p>
            )}
        </form>
    );
};

export default ContactForm;
