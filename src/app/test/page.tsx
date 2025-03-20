import React from 'react';
import InputT from '@/components/Input-TextArea/Input';
import Input from '@/components/Input-Single/Input';
import Switch from '@/components/Switch/switch'

export default function Test() {
    return <div>
        <InputT holder="hello"/>
        <Input holder="hello"/>
        <Switch/>
    </div>
}