import userIamge from './user.png';
function Header()
{
    return(
        <div className="overflow-hidden">
            <header className="flex items-center justify-between bg-[#4F6C93] w-screen h-[66px] text-white ">
                    <div className='flex ml-5 items-center text-3xl'>
                        <p>Presense360</p>
                    </div>

                    <div className='flex mr-5 items-center text-2xl '>
                        <button className='flex'>Username<img src={userIamge} height={25} width={30}/></button>
                    </div>
            </header>
            <hr className="border-3 border-[#111763] w-screen"/>

            <div className="flex bg-[#4F6C93] h-[calc(100vh-71px)] w-[242px]">
                
            </div>
        </div>

    );
}

export default Header;