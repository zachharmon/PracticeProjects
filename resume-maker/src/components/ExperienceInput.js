import React from "react";
import "../MainStyles.css";

function ExperienceInput({ experienceInit, callbackFunction, removeFunction }) {

    const [experience, setExperience] = React.useState( experienceInit ? experienceInit : 
        { 
            company: '', 
            position: '',
            location: '',
            start: '',
            end: '',
            description: [],
        }
    );

    React.useEffect(() => {
        callbackFunction(experience);
    }, [experience]);

    return(
        <div className="experienceInput">
            <button onClick={removeFunction} className="removeButton">X</button>
            <h4>Basics</h4>
            <div className='inputGroup'>
                <label htmlFor='company'>Company</label>
                <input type='text' id='company' value={experience.company} onChange={(e) => setExperience({...experience, company: e.target.value})} />
            </div>
            <div className='inputGroup'>
                <label htmlFor='position'>Position</label>
                <input type='text' id='position' value={experience.position} onChange={(e) => setExperience({...experience, position: e.target.value})} />
            </div>
            <div className='inputGroup'>
                <label htmlFor='location'>Location</label>
                <input type='text' id='location' value={experience.location} onChange={(e) => setExperience({...experience, location: e.target.value})} />
            </div>
            <div className='inputGroup'>
                <label htmlFor='start'>Start</label>
                <input type="text" id="start" value={experience.start} onChange={(e) => setExperience({...experience, start: e.target.value})} />
            </div>
            <div className='inputGroup'>
                <label htmlFor='end'>End</label>
                <input type="text" id="end" value={experience.end} onChange={(e) => setExperience({...experience, end: e.target.value})} />
            </div>
            

            <h4>Description Points</h4>

            <div className="inputList">
                {experience.description.map((desc, index) => (
                    <div key={index} className="inputGroup">
                        <input type="text" value={desc} onChange={(e) => {
                            let temp = experience.description;
                            temp[index] = e.target.value;
                            setExperience({...experience, description: temp});
                        }} />
                        <button onClick={() => {
                            let temp = experience.description;
                            temp.splice(index, 1);
                            setExperience({...experience, description: temp});
                        }}>Remove</button>
                    </div>
                ))}

                <button onClick={() => {
                    let temp = experience.description;
                    temp.push('');
                    setExperience({...experience, description: temp});
                }}>Add Point</button>
            </div>
            
        </div>
    );

}

export default ExperienceInput;