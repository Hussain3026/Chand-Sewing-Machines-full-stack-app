import React, { useState, useContext } from "react";
import { FaAngleDown } from "react-icons/fa";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { IoMdClose } from "react-icons/io";
import Slide from '@mui/material/Slide';
import { MyContext } from '../../App';
import "./CountryDropdown.css";

const Transition = React.forwardRef(function Transition(props, ref){
    return <Slide direction="up" ref={ref} {...props} />
});

const CountryDropdown = () => {
    const [isOpenModal, setisOpenModal] = useState(false);
    const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState(""); // 🔥 NEW
    const [search, setSearch] = useState("");
    const context = useContext(MyContext);

    // 🔥 DISPLAY TEXT LOGIC
    const displayText = selectedDistrict || selectedState || "Select Location";

    const shortText =
        displayText.length > 12
            ? displayText.substring(0, 12) + "..."
            : displayText;

    return(
        <>
        {/* 🔹 BUTTON */}
        <Button className='countryDrop' onClick={()=>setisOpenModal(true)}>
            <div className='info d-flex flex-column'>
                <span className='label'>Your Location</span>
                <span className='name'>
                    {shortText}
                </span>
            </div>
            <FaAngleDown />
        </Button>

        {/* 🔹 MODAL */}
        <Dialog 
            open={isOpenModal} 
            onClose={()=>setisOpenModal(false)} 
            className="locationModel" 
            TransitionComponent={Transition}
        >
            
            <h4>Select Your Location</h4>

            {/* 🔍 SEARCH */}
            <div className='headerSearch w-100 mb-3'>
                <input 
                    type='text' 
                    placeholder='Search location...' 
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />
            </div>

            {/* ✅ STATES */}
            {!selectedState && (
                <>
                    <h6>States</h6>
                    <ul className='locationList'>
                        {
                            context.stateList
                            ?.filter((item)=>
                                item.name.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((item,index)=>(
                                <li key={index}>
                                    <Button onClick={()=>{
                                        setSelectedState(item.name);
                                        context.getDistricts(item.name);
                                        setSearch("");
                                    }}>
                                        {item.name}
                                    </Button>
                                </li>
                            ))
                        }
                    </ul>
                </>
            )}

            {/* ✅ DISTRICTS */}
            {selectedState && (
                <>
                    {/* 🔙 BACK */}
                    <Button onClick={()=>{
                        setSelectedState("");
                        setSelectedDistrict(""); // reset
                        setSearch("");
                    }}>
                        ← Back to States
                    </Button>

                    <h6 className="mt-3">Districts</h6>
                    <ul className='locationList'>
                        {
                            context.districtList
                            .filter((item)=>
                                item.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((item,index)=>(
                                <li key={index}>
                                    <Button onClick={()=>{
                                        setSelectedDistrict(item); // 🔥 SAVE DISTRICT
                                        setisOpenModal(false);
                                        setSearch("");
                                    }}>
                                        {item}
                                    </Button>
                                </li>
                            ))
                        }
                    </ul>
                </>
            )}

            {/* ❌ CLOSE */}
            <Button className="close" onClick={()=>setisOpenModal(false)}>
                <IoMdClose/>
            </Button>

        </Dialog>
      </>
    )
}

export default CountryDropdown;
