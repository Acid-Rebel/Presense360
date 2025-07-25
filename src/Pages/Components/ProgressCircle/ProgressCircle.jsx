import CircularProgressBar from "./CircularCircleBar";

function ProgressCircle(props) {
    const total = props.data.total;
    const present = props.data.present;
    const late = props.data.late;
    const absent = total - present;

    const onTimePercentage = present > 0 ? Math.trunc((present - late) / present * 100) : 0;
    const latePercentage = present > 0 ? Math.trunc((late) / present * 100) : 0;

    return (
        <div className="flex flex-wrap justify-center sm:justify-start gap-x-2 gap-y-3 md:gap-x-3 md:gap-y-4 w-full">
            <div className="flex items-center bg-white rounded-lg shadow-md p-2 
                            w-full sm:w-[calc(50%-0.25rem)] md:w-[calc(33.33%-0.5rem)] lg:w-[calc(25%-0.5625rem)] xl:w-[calc(25%-0.5625rem)]
                            h-24"> 
                <div className="flex-shrink-0">
                    <CircularProgressBar
                        percentage={Math.trunc(present / total * 100)}
                        color={'green'}
                        sizeClass="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
                    />
                </div>
                <div className="ml-2 text-xs sm:text-sm">
                    <p className="font-medium text-gray-700">Present</p>
                    <p className="font-bold text-gray-900">{present}</p>
                </div>
            </div>

            <div className="flex items-center bg-white rounded-lg shadow-md p-2 
                            w-full sm:w-[calc(50%-0.25rem)] md:w-[calc(33.33%-0.5rem)] lg:w-[calc(25%-0.5625rem)] xl:w-[calc(25%-0.5625rem)]
                            h-24"> 
                <div className="flex-shrink-0">
                    <CircularProgressBar
                        percentage={Math.trunc(absent / total * 100)}
                        color={'red'}
                        sizeClass="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
                    />
                </div>
                <div className="ml-2 text-xs sm:text-sm">
                    <p className="font-medium text-gray-700">Absent &<br/>On Leave</p>
                    <p className="font-bold text-gray-900">{absent}</p>
                </div>
            </div>

            
            <div className="flex items-center bg-white rounded-lg shadow-md p-2 
                            w-full sm:w-[calc(50%-0.25rem)] md:w-[calc(33.33%-0.5rem)] lg:w-[calc(25%-0.5625rem)] xl:w-[calc(25%-0.5625rem)]
                            h-24"> 
                <div className="flex-shrink-0">
                    <CircularProgressBar
                        percentage={onTimePercentage}
                        color={'green'}
                        sizeClass="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
                    />
                </div>
                <div className="ml-2 text-xs sm:text-sm">
                    <p className="font-medium text-gray-700">On Time</p>
                    <p className="font-bold text-gray-900">{present - late}</p>
                </div>
            </div>

            <div className="flex items-center bg-white rounded-lg shadow-md p-2 
                            w-full sm:w-[calc(50%-0.25rem)] md:w-[calc(33.33%-0.5rem)] lg:w-[calc(25%-0.5625rem)] xl:w-[calc(25%-0.5625rem)]
                            h-24"> 
                <div className="flex-shrink-0">
                    <CircularProgressBar
                        percentage={latePercentage}
                        color={'yellow'}
                        sizeClass="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
                    />
                </div>
                <div className="ml-2 text-xs sm:text-sm">
                    <p className="font-medium text-gray-700">Late</p>
                    <p className="font-bold text-gray-900">{late}</p>
                </div>
            </div>
        </div>
    );
}

export default ProgressCircle;