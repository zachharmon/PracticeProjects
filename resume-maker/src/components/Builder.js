import React from 'react';
import '../MainStyles.css';
import EducationInput from './EducationInput';
import ExperienceInput from './ExperienceInput';
import ActivityInput from './ActivityInput';
import AwardInput from './AwardInput';
import { useNavigate } from 'react-router-dom';


function Builder() {

    const nav = useNavigate();

    const [resume, setResume] = React.useState(localStorage.getItem('resume') ? JSON.parse(localStorage.getItem('resume')) : 
        {
            name: '',
            email: '',
            phone: '',
            website: '',
            education: [],
            experience: [],
            activities: [],
            skills: [],
            awards: [],
        }
    );

    const [key, setKey] = React.useState(0);

    React.useEffect(() => {
        localStorage.setItem('resume', JSON.stringify(resume));
    }, [resume]);

    React.useEffect(() => {
        setKey(key+1 % 10000);
    }, [resume.education, resume.experience, resume.activities, resume.awards]);
    
    React.useEffect(() => {
        document.title = resume.name ? resume.name + "'s Resume" : "Resume Builder";
    }, [resume.name]);

    return (
        <div className='builder'>

            <button className='importJSON'
                onClick={(e) => {
                    document.getElementById('importJSON').click();
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Import</title><path d="M14,12L10,8V11H2V13H10V16M20,18V6C20,4.89 19.1,4 18,4H6A2,2 0 0,0 4,6V9H6V6H18V18H6V15H4V18A2,2 0 0,0 6,20H18A2,2 0 0,0 20,18Z" /></svg>
                <input type='file' id='importJSON' accept='.json' onChange={(e) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (e.target.result === null) return;
                        try{
                            JSON.parse(e.target.result);
                        } catch {
                            alert("Invalid Import File");
                            return;
                        }
                        if (!jsonIsResume(JSON.parse(e.target.result))){
                            alert("Invalid Import File");
                            return;
                        };
                        setResume(JSON.parse(e.target.result));
                        setKey(key+1 % 10000);
                    }
                    reader.readAsText(e.target.files[0]);
                }} />
            </button>

            <button className='exportJSON'>
                <a href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume))} download='ResumeBuilder_Export.json'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Export</title><path d="M23,12L19,8V11H10V13H19V16M1,18V6C1,4.89 1.9,4 3,4H15A2,2 0 0,1 17,6V9H15V6H3V18H15V15H17V18A2,2 0 0,1 15,20H3A2,2 0 0,1 1,18Z" /></svg>
                </a>
            </button>

            <button className='clearResume'
                onClick={() => {
                    var confirmClear = window.confirm("Are you sure you want to clear the resume?");

                    if (confirmClear) {
                        setResume({
                            name: '',
                            email: '',
                            phone: '',
                            website: '',
                            education: [],
                            experience: [],
                            activities: [],
                            skills: [],
                            awards: [],
                        });
                    }
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Clear</title><path d="M14.04,12H10V11H5.5A3.5,3.5 0 0,1 2,7.5A3.5,3.5 0 0,1 5.5,4C6.53,4 7.45,4.44 8.09,5.15C8.5,3.35 10.08,2 12,2C13.92,2 15.5,3.35 15.91,5.15C16.55,4.44 17.47,4 18.5,4A3.5,3.5 0 0,1 22,7.5A3.5,3.5 0 0,1 18.5,11H14.04V12M10,16.9V15.76H5V13.76H19V15.76H14.04V16.92L20,19.08C20.58,19.29 21,19.84 21,20.5A1.5,1.5 0 0,1 19.5,22H4.5A1.5,1.5 0 0,1 3,20.5C3,19.84 3.42,19.29 4,19.08L10,16.9Z" /></svg>
            </button>

            <h1>Resume Builder</h1>

            <h3>Personal Information</h3>

            <div className='inputGroup'>
                <label htmlFor='name'>Name</label>
                <input type='text' id='name' value={resume.name} onChange={(e) => setResume({...resume, name: e.target.value})} />
            </div>

            <div className='inputGroup'>
                <label htmlFor='email'>Email</label>
                <input type='email' id='email' value={resume.email} onChange={(e) => setResume({...resume, email: e.target.value})} />
            </div>

            <div className='inputGroup'>
                <label htmlFor='phone'>Phone</label>
                <input type='tel' id='phone' value={resume.phone} onChange={(e) => setResume({...resume, phone: e.target.value})} />
            </div>

            <div className='inputGroup'>
                <label htmlFor='website'>Website</label>
                <input type='url' id='website' value={resume.website} onChange={(e) => setResume({...resume, website: e.target.value})} />
            </div>

            <h3>Education</h3>

            <div className='basicList'
                key={"education-" + key}
            >
                {resume.education.map((education, index) => (
                    <EducationInput key={index} educationInit={education} 
                        callbackFunction={(education) => {
                            let temp = resume.education;
                            temp[index] = education;
                            setResume({...resume, education: temp});
                        }}

                        removeFunction={() => {
                            setResume(prevResume => {
                                const newEducation = prevResume.education.filter((_, eduIndex) => eduIndex !== index);
                                return {...prevResume, education: newEducation};
                            });
                        }}
                    />
                ))}

                <button
                className='addButton'
                onClick={() => {
                    let temp = resume.education;
                    temp.push({ 
                        school: '', 
                        info: '',
                        start: '',
                        end: '',
                        location: '',
                        courses: [],
                        projects: [],
                    });
                    setResume({...resume, education: temp});
                }}>Add Education</button>
            </div>

            <h3>Experience</h3>

            <div className='basicList'
                key={"experience-" + key}
            >
                {resume.experience.map((experience, index) => (
                    <ExperienceInput key={index} experienceInit={experience} 
                        callbackFunction={(experience) => {
                            let temp = resume.experience;
                            temp[index] = experience;
                            setResume({...resume, experience: temp});
                        }}

                        removeFunction={() => {
                            setResume(prevResume => {
                                const newExperience = prevResume.experience.filter((_, expIndex) => expIndex !== index);
                                return {...prevResume, experience: newExperience};
                            });
                        }}
                    />
                ))}

                <button
                className='addButton'
                onClick={() => {
                    let temp = resume.experience;
                    temp.push({ 
                        company: '', 
                        position: '',
                        location: '',
                        start: '',
                        end: '',
                        description: [],
                    });
                    setResume({...resume, experience: temp});
                }}>Add Experience</button>
            </div>

            <h3>Activities</h3>

            <div className='basicList'
                key={"activity-" + key}
            >
                {resume.activities.map((activity, index) => (
                    <ActivityInput key={index} activityInit={activity}
                        callbackFunction={(activity) => {
                            let temp = resume.activities;
                            temp[index] = activity;
                            setResume({...resume, activities: temp});
                        }}

                        removeFunction={() => {
                            setResume(prevResume => {
                                const newActivities = prevResume.activities.filter((_, actIndex) => actIndex !== index);
                                return {...prevResume, activities: newActivities};
                            });
                        }}
                    />
                ))}

                <button 
                className='addButton'
                onClick={() => {
                    let temp = resume.activities;
                    temp.push({ 
                        activity: '', 
                        location: '',
                        details: [],
                    });
                    setResume({...resume, activities: temp});
                }}>Add Activity</button>

            </div>

            <h3>Skills</h3>

            <div className='inputList skills'>

                {resume.skills.map((skill, index) => (
                    <div key={index} className='inputGroup'>
                        <input type='text' value={skill} onChange={(e) => {
                            let temp = resume.skills;
                            temp[index] = e.target.value;
                            setResume({...resume, skills: temp});
                        }} />
                        <button onClick={() => {
                            let temp = resume.skills;
                            temp.splice(index, 1);
                            setResume({...resume, skills: temp});
                        }}>Remove</button>
                    </div>
                ))}
                <button 
                className='addSkillButton'
                onClick={() => {
                    let temp = resume.skills;
                    temp.push('');
                    setResume({...resume, skills: temp});
                }}>Add Skill</button>
            </div>

            <h3>Awards</h3>

            <div className='basicList'
                key={"awards-" + key}
            >

                {resume.awards.map((award, index) => (
                    <AwardInput key={index} awardInit={award}
                        callbackFunction={(award) => {
                            let temp = resume.awards;
                            temp[index] = award;
                            setResume({...resume, awards: temp});
                        }}

                        removeFunction={() => {
                            setResume(prevResume => {
                                const newAwards = prevResume.awards.filter((_, awardIndex) => awardIndex !== index);
                                return {...prevResume, awards: newAwards};
                            });
                        }}
                    />
                ))}

                <button
                className='addButton'
                onClick={() => {
                    let temp = resume.awards;
                    temp.push({ 
                        award: '', 
                        date: '',
                    });
                    setResume({...resume, awards: temp});
                }}>Add Award</button>
            </div>

            <button className='generateButton'
                onClick={() => {
                    window.open('/tools/resume-builder?fontSizeIncrease=2#/output', '_blank')
                }}
            >
                Generate Resume
            </button>

        </div>
    );
}

function jsonIsResume(resume){
    return resume.name !== undefined && resume.email !== undefined && resume.phone !== undefined && resume.website !== undefined && resume.education !== undefined && resume.experience !== undefined && resume.activities !== undefined && resume.skills !== undefined && resume.awards !== undefined;
}

export default Builder;