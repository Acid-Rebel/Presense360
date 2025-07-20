import bar from "./circular.webp";
function ProgressCircle()
{
    return(
        <div className="h-[100px] w-[186px] bg-[#FFFFFF] flex items-center">
            <div>
                <img src={bar} className="h-[72px] w-[82px]"/>
            </div>
            <div>
                <p>Present</p>
                <p>25</p>
            </div>
        </div>
    )
}
export default ProgressCircle