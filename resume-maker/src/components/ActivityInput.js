import React from "react";
import "../MainStyles.css";

function ActivityInput({ activityInit, callbackFunction, removeFunction }) {

    const [activity, setActivity] = React.useState( activityInit ? activityInit : 
        { 
            activity: '',
            location: '',
            details: [],
        }
    );

    React.useEffect(() => {
        callbackFunction(activity);
    }, [activity]);

    return(
        <div className="activityInput">
            <button onClick={removeFunction} className="removeButton">X</button>

            <h4>Basics</h4>
            <div className='inputGroup'>
                <label htmlFor='activity'>Activity</label>
                <input type='text' id='activity' value={activity.activity} onChange={(e) => setActivity({...activity, activity: e.target.value})} />
            </div>
            <div className='inputGroup'>
                <label htmlFor='location'>Location</label>
                <input type='text' id='location' value={activity.location} onChange={(e) => setActivity({...activity, location: e.target.value})} />
            </div>
            

            <h4>Details</h4>

            <div className="basicList">

                {activity.details.map((detail, index) => (
                    <div key={index} className="activityDetail">

                        <div className="inputGroup">
                            <label htmlFor="detail">Detail</label>
                            <input type="text" value={detail.detail} onChange={(e) => {
                                let temp = activity.details;
                                temp[index].detail = e.target.value;
                                setActivity({...activity, details: temp});
                            }} />
                        </div>

                        <div className="inputGroup">
                            <label htmlFor="start">Start</label>
                            <input type="text" value={detail.start} onChange={(e) => {
                                let temp = activity.details;
                                temp[index].start = e.target.value;
                                setActivity({...activity, details: temp});
                            }} />
                        </div>

                        <div className="inputGroup">
                            <label htmlFor="end">End</label>
                            <input type="text" value={detail.end} onChange={(e) => {
                                let temp = activity.details;
                                temp[index].end = e.target.value;
                                setActivity({...activity, details: temp});
                            }} />
                        </div>

                        <button 
                        className="removeButton"
                        onClick={() => {
                            let temp = activity.details;
                            temp.splice(index, 1);
                            setActivity({...activity, details: temp});
                        }}>X</button>

                    </div>
                    
                ))}

                <button 
                className="addDetailButton"
                onClick={() => {
                    let temp = activity.details;
                    temp.push({ detail: '', start: '', end: '' });
                    setActivity({...activity, details: temp});
                }}>Add Detail</button>

            </div>
            
        </div>
    );

}

export default ActivityInput;