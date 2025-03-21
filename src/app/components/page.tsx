"use client"

import React from 'react';
import "./styles.css"

import Button from '@/components/Button/Primary/Button';
import TextArea from '@/components/Inputs/TextArea/textarea.tsx';
import SingleInput from '@/components/Inputs/SingleInput/singleInput.tsx';
import Switch from '@/components/Switch/switch.tsx';
import RadioGroup from '@/components/RadioButtons/RadioGroup';
import Checkbox from '@/components/CheckBoxes/CheckBoxes';
import SelectMenu from '@/components/SelectMenu/SelectMenu';

export default function Components() {
    // For switch components
    const [isSwitchChecked, setIsSwitchChecked] = React.useState(false);
    
    // For radio group
    const [selectedRadioGroup, setSelectedRadioGroup] = React.useState('DTU');

    // For checkbox
    const [checked, setChecked] = React.useState(false);

    const radioOptions = [
        { label: 'DTU', value: 'DTU' },
        { label: 'NSUT', value: 'NSUT' },
        { label: 'IGDTUW', value: 'IGDTUW' },
        { label: 'IIIT-D', value: 'IIIT-D' }
    ];

    const options = [
        { label: 'Item 1', value: 'item1' },
        { label: 'Item 2', value: 'item2' },
        { label: 'Item 3', value: 'item3' }
    ];

    const handleChange = (value: string) => {
        console.log(value);
    };

    const handleRadioGroupChange = (value: string) => {
        setSelectedRadioGroup(value);
    };

    const handleSwitchChange = (checked: boolean) => {
        setIsSwitchChecked(checked);
    };

    const handleCheckboxChange = (checked: boolean) => {
        setChecked(checked);
        console.log(checked);
    };

    return (
        <div style={{
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
            <h3>Button</h3>
            <Button
            text="Click Me"
            variant='primary'
            width={90}
            onClick={() => console.log('Button Clicked')}
            />
            <h3>Text Area</h3>
            <TextArea holder="hello" height={2} />
            <h3>Single Input</h3>
            <SingleInput holder="hello" />
            <div>
                <h3>Switch</h3>
                <Switch 
                    checked={isSwitchChecked} 
                    onChange={handleSwitchChange} 
                />
                <p>Switch is currently: {isSwitchChecked ? 'ON' : 'OFF'}</p>
            </div>
            <h3>Radio Group</h3>
            <RadioGroup 
                name="radioExample" 
                options={radioOptions} 
                defaultValue={selectedRadioGroup} 
                onChange={handleRadioGroupChange}
            />
            <h3>Checkbox</h3>
            <Checkbox
                onChange={handleCheckboxChange}
                checked={checked}
                label="Remember me"
            />
            <h3>Select Menu</h3>
            <SelectMenu 
                options={options} 
                onChange={handleChange} 
                placeholder="Select"
            />
        </div>
    );
}