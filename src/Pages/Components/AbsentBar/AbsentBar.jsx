import profilePic from './pfp.png'

function AbsentBar(props)
{
    return(
        <div className='w-[375px] '>
            <div className='border-b-[#F0F0F0] border-b-3  bg-white'>
                <h1 className='ml-[5px]'>{props.type}</h1>
            </div> 
            <div className="overflow-y-auto  bg-white h-[246px]">
                   
                <ol>
                    <li className='border-b-3 border-b-[#F0F0F0] '>
                        <div className="flex items-center p-[10px] pl-[20px]" >
                            <img src={profilePic} height={55} width={55}/>
                            <div className='ml-[10px]'>
                                <p>Rincy</p>
                            </div>
                        </div>
                    </li>
        
                    <li className='border-b-3 border-b-[#F0F0F0] '>
                        <div className="flex items-center p-[10px] pl-[20px]" >
                            <img src={profilePic} height={55} width={55}/>
                            <div className='ml-[10px]'>
                                <p>Rincy</p>
                            </div>
                        </div>
                    </li>
        
                    <li className='border-b-3 border-b-[#F0F0F0] '>
                        <div className="flex items-center p-[10px] pl-[20px]" >
                            <img src={profilePic} height={55} width={55}/>
                            <div className='ml-[10px]'>
                                <p>Rincy</p>
                            </div>
                        </div>
                    </li>
        
                    <li className='border-b-3 border-b-[#F0F0F0] '>
                        <div className="flex items-center p-[10px] pl-[20px]" >
                            <img src={profilePic} height={55} width={55}/>
                            <div className='ml-[10px]'>
                                <p>Rincy</p>
                            </div>
                        </div>
                    </li>
        
                    <li className='border-b-3 border-b-[#F0F0F0] '>
                        <div className="flex items-center p-[10px] pl-[20px]" >
                            <img src={profilePic} height={55} width={55}/>
                            <div className='ml-[10px]'>
                                <p>Rincy</p>
                            </div>
                        </div>
                    </li>
        
                    <li className='border-b-3 border-b-[#F0F0F0] '>
                        <div className="flex items-center p-[10px] pl-[20px]" >
                            <img src={profilePic} height={55} width={55}/>
                            <div className='ml-[10px]'>
                                <p>Rincy</p>
                            </div>
                        </div>
                    </li>
        
                    <li className='border-b-3 border-b-[#F0F0F0] '>
                        <div className="flex items-center p-[10px] pl-[20px]" >
                            <img src={profilePic} height={55} width={55}/>
                            <div className='ml-[10px]'>
                                <p>Rincy</p>
                            </div>
                        </div>
                    </li>
        
                    <li className='border-b-3 border-b-[#F0F0F0] '>
                        <div className="flex items-center p-[10px] pl-[20px]" >
                            <img src={profilePic} height={55} width={55}/>
                            <div className='ml-[10px]'>
                                <p>Rincy</p>
                            </div>
                        </div>
                    </li>
        
                    <li className='border-b-3 border-b-[#F0F0F0] '>
                        <div className="flex items-center p-[10px] pl-[20px]" >
                            <img src={profilePic} height={55} width={55}/>
                            <div className='ml-[10px]'>
                                <p>Rincy</p>
                            </div>
                        </div>
                    </li>
                    
                </ol>
            </div>
        </div>
    );
}

export default AbsentBar