import React from "react";
import "../MainStyles.css";

function EducationInput({ educationInit, callbackFunction, removeFunction }) {

    const [education, setEducation] = React.useState( educationInit ? educationInit : 
        { 
            school: '', 
            info: '',
            start: '',
            end: '',
            location: '',
            courses: [],
            projects: [],
        }
    );

    React.useEffect(() => {
        callbackFunction(education);
    }, [education]);

    return(
        <div className="educationInput">
            <button onClick={removeFunction} className="removeButton">X</button>
            <h4>Basics</h4>
            <div className='inputGroup'>
                <label htmlFor='school'>School</label>
                <input type='text' id='school' value={education.school} onChange={(e) => setEducation({...education, school: e.target.value})} />
            </div>
            <div className='inputGroup'>
                <label htmlFor='info'>Info</label>
                <input type='text' id='info' value={education.info} onChange={(e) => setEducation({...education, info: e.target.value})} placeholder="(Ex: Degree, GPA, etc.)" />
            </div>
            <div className='inputGroup'>
                <label htmlFor='location'>Location</label>
                <input type='text' id='location' value={education.location} onChange={(e) => setEducation({...education, location: e.target.value})} />
            </div>
            <div className='inputGroup'>
                <label htmlFor='start'>Start</label>
                <input type="text" id="start" value={education.start} onChange={(e) => setEducation({...education, start: e.target.value})} />
            </div>
            <div className='inputGroup'>
                <label htmlFor='end'>End</label>
                <input type="text" id="end" value={education.end} onChange={(e) => setEducation({...education, end: e.target.value})} />
            </div>

            <h4>Relevant Courses</h4>

            <div className="inputList">
                {education.courses.map((course, index) => (
                    <div key={index} className="inputGroup">
                        <input type="text" value={course} onChange={(e) => {
                            let temp = education.courses;
                            temp[index] = e.target.value;
                            setEducation({...education, courses: temp});
                        }} />
                        <button onClick={() => {
                            let temp = education.courses;
                            temp.splice(index, 1);
                            setEducation({...education, courses: temp});
                        }}>Remove</button>
                    </div>
                ))}

                <button onClick={() => {
                    let temp = education.courses;
                    temp.push('');
                    setEducation({...education, courses: temp});
                }}>Add Course</button>
            </div>

            <h4>Projects/Works</h4>

            <div className="inputList">
                {education.projects.map((project, index) => (
                    <div key={index} className="projectItem">
                        <div className="inputGroup">
                            <label htmlFor='class'>Class/Event</label>
                            <input type='text' value={project.class} onChange={(e) => {
                                let temp = education.projects;
                                temp[index].class = e.target.value;
                                setEducation({...education, projects: temp});
                            }} />
                        </div>
                        <div className="inputGroup">
                            <label htmlFor='project'>Project</label>
                            <input type='text' value={project.project} onChange={(e) => {
                                let temp = education.projects;
                                temp[index].project = e.target.value;
                                setEducation({...education, projects: temp});
                            }} />
                        </div>
                        <button 
                        className="removeButton"
                        onClick={() => {
                            let temp = education.projects;
                            temp.splice(index, 1);
                            setEducation({...education, projects: temp});
                        }}>X</button>
                    </div>
                ))}

                <button onClick={() => {
                    let temp = education.projects;
                    temp.push({class: '', project: ''});
                    setEducation({...education, projects: temp});
                }}>Add Project</button>
            </div>
            
        </div>
    );

}

export default EducationInput;