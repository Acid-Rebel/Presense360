import CircularProgressBar from "./CircularCircleBar"
function ProgressCircle(props)
{

    const total=props.data.total;
    const present=props.data.present;
    const late=props.data.late;
    const absent=total-present;
    return(
        <>
            <div className="h-[100px] w-[186px]  bg-[#FFFFFF] flex items-center">
                <div className="ml-[5px]">
                    <CircularProgressBar percentage={Math.trunc(present/total*100)} color={'green'}/>
                </div>
                <div className="ml-[10px] text-[20px]">
                    <p>Present</p>
                    <p>{present}</p>
                </div>
            </div>

            <div className="h-[100px] w-[186px] bg-[#FFFFFF] flex items-center">
                <div className="ml-[5px]">
                    <CircularProgressBar percentage={Math.trunc(absent/total*100) } color={'red'} />
                </div>
                <div className="ml-[10px] text-[20px]">
                    <p>Absent &<br/>On Leave</p>
                    <p>{absent}</p>
                </div>
            </div>

            <div className="h-[100px] w-[186px] bg-[#FFFFFF] flex items-center">
                <div className="ml-[5px]">
                    <CircularProgressBar percentage={Math.trunc((present-late)/present*100)} color={'green'}/>
                </div>
                <div className="ml-[10px] text-[20px]">
                    <p>On Time</p>
                    <p>{present-late}</p>
                </div>
            </div>

            <div className="h-[100px] w-[186px] bg-[#FFFFFF] flex items-center">
                <div className="ml-[5px]">
                    <CircularProgressBar percentage={Math.trunc((late)/present*100)} color={'yellow'}/>
                </div>
                <div className="ml-[10px] text-[20px]">
                    <p>Late</p>
                    <p>{late}</p>
                </div>
            </div>
        </>
    )
}
export default ProgressCircle