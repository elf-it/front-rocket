
export default function AddressButton({isConnected, setAddress, address, email}) {
    
    return(
        <>
            {isConnected && (
                <div className="flex mt-4 gap-x-2">
                    <button onClick={() => {setAddress({address, email})}} className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
                        Ok, Next
                    </button>
                </div>
            )}
        </>
    )
}