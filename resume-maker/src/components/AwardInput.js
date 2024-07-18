import React from "react";
import "../MainStyles.css";

function AwardInput({ awardInit, callbackFunction, removeFunction }) {

    const [award, setAward] = React.useState( awardInit ? awardInit : 
        { 
            award: '',
            date: '',
        }
    );

    React.useEffect(() => {
        callbackFunction(award);
    }, [award]);

    return(
        <div className="awardInput">
            <button onClick={removeFunction} className="removeButton">X</button>

            <h4>Details</h4>
            <div className='inputGroup'>
                <label htmlFor='award'>Award</label>
                <input type='text' id='award' value={award.award} onChange={(e) => setAward({...award, award: e.target.value})} />
            </div>
            <div className='inputGroup'>
                <label htmlFor='date'>Date</label>
                <input type='text' id='date' value={award.date} onChange={(e) => setAward({...award, date: e.target.value})} />
            </div>
            
        </div>
    );

}

export default AwardInput;