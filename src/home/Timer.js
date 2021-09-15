import React, { } from 'react'
import convertToPersian from '../tools/Converter'

const Timer = (data) => {
    const [counter, setCounter] = React.useState(0);

    React.useEffect(() => {
        counter >= 0 && setTimeout(() => setCounter(counter + 1), 1000);
    }, [counter]);
    const secondsToTime = (secs) => {
        if(secs === 0){
            data.fetchFoodPartyData();
        }
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }
    return (

        < >
            {data.seconds <= 0?(<div>00:00</div>):
                (<span>{convertToPersian(secondsToTime(data.seconds - counter).s) } :
                    {convertToPersian(secondsToTime(data.seconds - counter).m) }</span>)}

        </>
    );

};


export default Timer;
