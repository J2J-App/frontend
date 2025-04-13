"use client"

import React from 'react';
import "./styles.css";
import { useRouter, useSearchParams } from 'next/navigation';

import nsut from "@/public/nsut.jpg";
import nsut_icon from "@/public/icons/uni/nsut_icon.png";

import Button from '@/components/buttons/button.tsx';
import TextArea from '@/components/Inputs/TextArea/textarea';
import SingleInput from '@/components/Inputs/SingleInput/singleInput';
import Switch from '@/components/switch/switch';
import RadioGroup from '@/components/radio-buttons/radio-group.tsx';
import Checkbox from '@/components/check-boxes/check-boxes.tsx';
import SelectMenu from '@/components/select-menus/select-menu.tsx';
import Pagination from '@/components/pagination/pagination';
import Combobox from '@/components/combobox/combobox.tsx';
import Accordion from '@/components/accordion/accordion.tsx';
import UniCard from "@/components/cards/Uni/uni-card.tsx";
import PlacementCard from "@/components/cards/placement/placement.tsx";
import Tabs from '@/components/tabs/tabs.tsx';
import Dialog from '@/components/dialog-box/dialog-box.tsx';
import Badge from '@/components/badges/badges';
import DataTable from "@/components/data-table/data-table.tsx";
import GradientBarChart from "@/components/Charts/BarGraphs/BarGraphs.tsx";

export default function Components() {    const router = useRouter();
    const searchParams = useSearchParams();

    const [tabIndex, setTabIndex] = React.useState<number>(0);

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

    // For bar graphs
    const monthlyData = [55, 25, 35, 20, 85, 45, 70]
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
  
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
                        onClick={() => console.log('buttons Clicked')}
                    />
                    <Button
                        text="Click Me"
                        variant='Secondary'
                        width={90}
                        onClick={() => console.log('buttons Clicked')}
                    />
                    <Button
                        text="Click Me"
                        variant='Outline'
                        width={90}
                        onClick={() => console.log('buttons Clicked')}
                    />
                    <Button
                        text="Click Me"
                        variant='Danger'
                        width={90}
                        onClick={() => console.log('buttons Clicked')}
                    />
                    <Button
                        text="Click Me"
                        variant='Link'
                        width={90}
                        to="https://github.com"
                        newTab={true}
                        onClick={() => console.log('buttons Clicked')}
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
            title: "switch",
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
            title:"combobox",
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
            title: "accordion",
            content: (
                <div key="accordion">
                    <h3>Accordion</h3>
                    <Accordion
                        title="Expendible Data"
                        content="Lapis, dolor, amet, consectetur, adipiscing, elit, sed, do, eiusmod, tempor, incididunt, ut, labore, et, dolore, magna, aliqua. Ut, enim, ad, minim, veniam, quis, nostrud, exercitation, ullamco, laboris, nisi, ut, aliquip, ex, ea, commodo, consequat, duis, aute, irure, dolor, in, reprehenderit, in, voluptate, velit, esse, cillum, dolore, eu, fugiat, nulla, pariatur, excepteur, sint, occaecat, cupidatat, non, proident, sunt, in, culpa, qui, officia, deserunt, mollit, anim, id, est, laborum."
                        width={"100%"}
                    />
                </div>
            )
        },
        {
            title: "Cards",
            content: (
                <>
                    <h3 style={{paddingBottom:"12px"}}>Cards</h3>
                    <div key="cards" 
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                        <UniCard name="NSUT" description="An absolute shithole of incompetant admins, fuckall teachers and perverted students." background={nsut.src} icon={nsut_icon.src} location={"Dwarka Mor"} nirf="57" />
                        <PlacementCard course="CSE" background={nsut.src} name={"NSUT"} icon={nsut_icon.src} max="62 LPA" min="7 LPA" avg="14 LPA" median="21 LPA" />
                    </div>
                </>
            )
        },
        {
            title: "tabs",
            content: (
                <div key="tabs">
                    <h3>Tabs</h3>
                    <Tabs
                        activeIndex={tabIndex}
                        setActiveIndex={setTabIndex}
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
                    <Button text="Open Dialog Box"
                            variant="Primary"
                            height={40}
                            width={150}
                        onClick={handleOpenDialog} />
                    <Dialog
                     isOpen={isDialogOpen}
                     onClose={handleCloseDialog}
                     >
                        <h1 style={{
                            color : "white",
                            fontSize : "20px",
                            fontWeight: "900",
                            marginBottom : "10px",
                        }}>
                            This is a dialog box
                        </h1>
                        <UniCard name="NSUT" description="An absolute shithole of incompetant admins, fuckall teachers and perverted students." background={nsut.src} icon={nsut_icon.src} location={"Dwarka Mor"} nirf="57" />
                        <div style={{
                            width: "fit-content",
                            marginLeft: "auto",
                            marginTop: "10px",
                        }}>
                            <Button
                                text="Close"
                                onClick={handleCloseDialog}
                                variant='Danger'
                                width={70}
                                height={35}
                            />
                        </div>
                    </Dialog>
                </div>
            )
        },
        {
            title:"Badges",
            content: (
                <div key="badges" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3>Badges</h3>
                    <Badge text="Fancy" varient="fancy" width={60} />
                    <Badge text="Outline" varient="outline" width={60} />
                    <Badge text="Default" varient="default" width={60} />
                    <Badge text="Danger" varient="danger" width={60} />
                </div>
            )
        },
        {
            title:"Data Tables",
            content: (
                <div key="data-tables">
                    <h3 style={{
                        paddingBottom: "12px",
                    }}>Data Tables</h3>
                    <DataTable
                        data={[
                            {
                                "college": "DTU",
                                "branch": "CSE",
                                "jee_rank": 1200,
                            },
                            {
                                "college": "NSUT",
                                "branch": "IT",
                                "jee_rank": 2100,
                            },
                            {
                                "college": "IIIT-D",
                                "branch": "CSAI",
                                "jee_rank": 900,
                            },
                            {
                                "college": "IGDTUW",
                                "branch": "ECE",
                                "jee_rank": 7500,
                            },
                            {
                                "college": "DTU",
                                "branch": "ME",
                                "jee_rank": 15000,
                            },
                            {
                                "college": "NSUT",
                                "branch": "ECE",
                                "jee_rank": 6500,
                            },
                            {
                                "college": "IIIT-D",
                                "branch": "CSE",
                                "jee_rank": 1300,
                            },
                            {
                                "college": "IGDTUW",
                                "branch": "IT",
                                "jee_rank": 5600,
                            },
                            {
                                "college": "DTU",
                                "branch": "BT",
                                "jee_rank": 28000,
                            },
                            {
                                "college": "NSUT",
                                "branch": "CSAI",
                                "jee_rank": 2500,
                            }
                        ]
                        }
                    />
                </div>
            )
        },
        {
            title: "bar graphs",
            content : (
                <div>
                    <h3 style={{paddingBottom : "12px"}}>Bar Graphs</h3>
                    <GradientBarChart data={monthlyData} labels={monthLabels} showLabels={true}/>
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
                maxWidth: '1200px',
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