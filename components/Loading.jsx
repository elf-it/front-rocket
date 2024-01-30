import Image from 'next/image'
import Anim1 from "../public/loader/anim3.svg"
import Anim2 from "../public/loader/anim3.svg"
import Anim3 from "../public/loader/anim3.svg"

export default function Loading() {
    return(
        <>
            <div className="fixed z-[9999] bg-none left-1/3 top-1/3 right-1/3 bottom-1/3 overflow-hidden text-center text-[14px] text-fefefe font-lato">
                <Image className="animate-ping absolute h-[34.52%] w-[19.18%] top-[29.99%] right-[40.41%] bottom-[35.49%] left-[40.41%] max-w-full overflow-hidden max-h-full" alt="" src={Anim1} />
                <Image className="animate-ping absolute h-[34.52%] w-[19.18%] top-[29.99%] right-[40.41%] bottom-[35.49%] left-[40.41%] max-w-full overflow-hidden max-h-full" alt="" src={Anim2} />
                <Image className="animate-ping absolute h-[34.52%] w-[19.18%] top-[29.99%] right-[40.41%] bottom-[35.49%] left-[40.41%] max-w-full overflow-hidden max-h-full" alt="" src={Anim3} />
            </div>
            <div className="fixed inset-0 z-[9990] left-0 top-0 bottom-0 right-0 backdrop-blur-md bg-gray-800/40"></div>
        </>
    )
}