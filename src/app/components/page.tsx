"use client"

import React, {Suspense} from 'react';
import "./styles.css";
import { useRouter, useSearchParams } from 'next/navigation';

import nsut from "@/public/nsut.jpg";
import nsut_icon from "@/public/nsuticon.png";

import Button from '@/components/Button/Button';
import TextArea from '@/components/Inputs/TextArea/textarea';
import SingleInput from '@/components/Inputs/SingleInput/singleInput';
import Switch from '@/components/Switch/switch';
import RadioGroup from '@/components/RadioButtons/RadioGroup';
import Checkbox from '@/components/CheckBoxes/CheckBoxes';
import SelectMenu from '@/components/SelectMenu/SelectMenu';
import Pagination from '@/components/Pagination/pagination';
import Combobox from '@/components/Combobox/Combobox';
import Accordion from '@/components/Accordion/Accordion';
import UniCard from "@/components/Cards/Uni/UniCard";
import PlacementCard from "@/components/Cards/Placement/Placement";
import Tabs from '@/components/Tabs/Tabs';
import Dialog from '@/components/DialogBox/DialogBox';
import Badge from '@/components/Badges/Badges';

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

    // For dialog box
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)

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

    const tabsData = [
        {
          label: "Round 1",
          content: <div>Content for Round 1</div>
        },
        {
          label: "Round 2",
          content: <div>Content for Round 2</div>
        },
        {
          label: "Round 3",
          content: <div>Content for Round 3</div>
        },
        {
          label: "Round 4",
          content: <div>Content for Round 4</div>
        },
        {
          label: "Round 5",
          content: <div>Content for Round 5</div>
        },
        {
            label: "Spot Round",
            content: <div>Content for Spot Round</div>
        },
        {
            label : "Upgradation Round",
            content: <div>Content for Upgradation Round</div>
        }
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

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
    }

    const handleOpenDialog = () => {
        setIsDialogOpen(true)
    }

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
                    <Button
                        text="Click Me"
                        variant='Outline'
                        width={90}
                        onClick={() => console.log('Button Clicked')}
                    />
                    <Button
                        text="Click Me"
                        variant='Danger'
                        width={90}
                        onClick={() => console.log('Button Clicked')}
                    />
                    <Button
                        text="Click Me"
                        variant='Link'
                        width={90}
                        to="https://github.com"
                        newTab={true}
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
        {
            title:"Combobox",
            content: (
                <div key="combobox">
                    <h3>Combobox</h3>
                    <Combobox
                        options={options}
                        placeholder="Select"
                        searchable={true}
                        multiSelect={true}
                    />
                </div>
            )
        },
        {
            title: "Accordion",
            content: (
                <div key="accordion">
                    <h3>Accordion</h3>
                    <Accordion
                        title="Expendible Data"
                        content="Lapis, dolor, amet, consectetur, adipiscing, elit, sed, do, eiusmod, tempor, incididunt, ut, labore, et, dolore, magna, aliqua. Ut, enim, ad, minim, veniam, quis, nostrud, exercitation, ullamco, laboris, nisi, ut, aliquip, ex, ea, commodo, consequat, duis, aute, irure, dolor, in, reprehenderit, in, voluptate, velit, esse, cillum, dolore, eu, fugiat, nulla, pariatur, excepteur, sint, occaecat, cupidatat, non, proident, sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum."
                    />
                </div>
            )
        },
        {
            title: "Cards",
            content: (
                <div key="cards" style={{
                    display: "flex",
                    gap: "10px",
                }}>
                    <UniCard name="NSUT" description="An absolute shithole of incompetant admins, fuckall teachers and perverted students." background={nsut.src} icon={nsut_icon.src} location={"Dwarka Mor"} nirf="57" />
                    <PlacementCard course="CSE" background={nsut.src} name={"NSUT"} icon={nsut_icon.src} max="62 LPA" min="7 LPA" avg="14 LPA" median="21 LPA" />
                </div>
            )
        },
        {
            title: "Tabs",
            content: (
                <div key="tabs">
                    <h3>Tabs</h3>
                    <Tabs
                        tabs={tabsData}
                    />
                </div>
            )
        },
        {
            title: "Dialog Box",
            content: (
                <div key="dialogbox">
                    <h3>Dialog Box</h3>
                    <button
                        onClick={handleOpenDialog}>
                            Open Dialog Box
                    </button>
                    <Dialog
                     isOpen={isDialogOpen}
                     onClose={handleCloseDialog}
                     >
                        <p style={{
                            color : "white",
                            fontSize : "16px",
                            textAlign : "center",
                            marginBottom : "20px",
                        }}>
                            This is a dialog box
                        </p>
                        <Button
                            text="Close Dialog Box"
                            onClick={handleCloseDialog}
                            variant='Primary'
                            width={120}
                            height={45}
                        />
                    </Dialog>
                </div>
            )
        },
        {
            title:"Badges",
            content: (
                <div key="badges" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3>Badges</h3>
                    <Badge text="Fancy" varient="fancy" width={90} />
                    <Badge text="Outline" varient="outline" width={90} />
                    <Badge text="Default" varient="default" width={90} />
                    <Badge text="Danger" varient="danger" width={90} />
                </div>
            )
        }
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
                <div style={{display: 'flex', flexDirection: 'column', gap: '30px', flexGrow: 1}}>
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
                        showEllipsis={true}
                    />
                </div>
            </div>
    );
}