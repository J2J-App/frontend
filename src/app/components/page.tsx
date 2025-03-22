"use client"

import React from 'react';
import "./styles.css";
import { useRouter, useSearchParams } from 'next/navigation';

import Button from '@/components/Button/Button';
import TextArea from '@/components/Inputs/TextArea/textarea';
import SingleInput from '@/components/Inputs/SingleInput/singleInput';
import Switch from '@/components/Switch/switch';
import RadioGroup from '@/components/RadioButtons/RadioGroup';
import Checkbox from '@/components/CheckBoxes/CheckBoxes';
import SelectMenu from '@/components/SelectMenu/SelectMenu';
import Pagination from '@/components/Pagination/pagination';

export default function Components() {    const router = useRouter();
    const searchParams = useSearchParams();

    // For switch components
    const [isSwitchChecked, setIsSwitchChecked] = React.useState(false);
    
    // For radio group
    const [selectedRadioGroup, setSelectedRadioGroup] = React.useState('DTU');

    // For checkbox
    const [checked, setChecked] = React.useState(false);

    // For pagination
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', currentPage.toString());
        router.push(`?${params.toString()}`, { scroll: false });
    }, [currentPage, router, searchParams]);

    const radioOptions = [
        { label: 'DTU', value: 'DTU' },
        { label: 'NSUT', value: 'NSUT' },
        { label: 'IGDTUW', value: 'IGDTUW' },
        { label: 'IIIT-D', value: 'IIIT-D' }
    ];

    const options = [
        { label: 'Item 1', value: 'item1' },
        { label: 'Item 2', value: 'item2' },
        { label: 'Item 3', value: 'item3' },
        { label: 'Item 4', value: 'item4' },
        { label: 'Item 5', value: 'item5' },
        { label: 'Item 6', value: 'item6' },
        { label: 'Item 7', value: 'item7' },
        { label: 'Item 8', value: 'item8' },
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        console.log(`Page changed to ${page}`);
    };

    // Define all components
    const allComponents = [
        {
            title: "Buttons",
            content: (
                <div key="buttons" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3>Buttons</h3>
                    <Button
                        text="Click Me"
                        variant='Primary'
                        width={90}
                        onClick={() => console.log('Button Clicked')}
                    />
                    <Button
                        text="Click Me"
                        variant='Secondary'
                        width={90}
                        onClick={() => console.log('Button Clicked')}
                    />
                </div>
            )
        },
        {
            title: "Text Area",
            content: (
                <div key="textarea">
                    <h3>Text Area</h3>
                    <TextArea holder="hello" height={2} />
                </div>
            )
        },
        {
            title: "Single Input",
            content: (
                <div key="singleinput">
                    <h3>Single Input</h3>
                    <SingleInput holder="hello" />
                </div>
            )
        },
        {
            title: "Switch",
            content: (
                <div key="switch">
                    <h3>Switch</h3>
                    <Switch 
                        checked={isSwitchChecked} 
                        onChange={handleSwitchChange} 
                    />
                    <p>Switch is currently: {isSwitchChecked ? 'ON' : 'OFF'}</p>
                </div>
            )
        },
        {
            title: "Radio Group",
            content: (
                <div key="radiogroup">
                    <h3>Radio Group</h3>
                    <RadioGroup 
                        name="radioExample" 
                        options={radioOptions} 
                        defaultValue={selectedRadioGroup} 
                        onChange={handleRadioGroupChange}
                    />
                </div>
            )
        },
        {
            title: "Checkbox",
            content: (
                <div key="checkbox">
                    <h3>Checkbox</h3>
                    <Checkbox
                        onChange={handleCheckboxChange}
                        checked={checked}
                        label="Remember me"
                    />
                </div>
            )
        },
        {
            title: "Select Menu",
            content: (
                <div key="selectmenu">
                    <h3>Select Menu</h3>
                    <SelectMenu 
                        options={options} 
                        onChange={handleChange} 
                        placeholder="Select"
                    />
                </div>
            )
        },
    ];

    // Calculate pagination data
    const componentsPerPage = 3;
    const totalPages = Math.ceil(allComponents.length / componentsPerPage);
    
    // Get current components
    const indexOfLastComponent = currentPage * componentsPerPage;
    const indexOfFirstComponent = indexOfLastComponent - componentsPerPage;
    const currentComponents = allComponents.slice(indexOfFirstComponent, indexOfLastComponent);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            maxWidth: '800px',
            flexDirection: 'column',
            gap: '20px',
            padding: '20px',
        }}>
            <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                width: '100%',
                marginBottom: '20px',
            }}>
                Components (Page {currentPage} of {totalPages})
            </h1>
            
            {/* Display current components */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flexGrow: 1 }}>
                {currentComponents.map((component, index) => (
                    <div key={index}>
                        {component.content}
                    </div>
                ))}
            </div>
            
            {/* Pagination control */}
            <div>
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                />
            </div>
        </div>
    );
}