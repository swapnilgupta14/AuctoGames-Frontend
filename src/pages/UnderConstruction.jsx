const UnderConstruction = ()=>{
    
    return(
        <div className="flex justify-center items-center w-full h-full">
            <span>
                Welcome {localStorage.getItem("email")}, this page is under construction
            </span>
        </div>
    )
}

export default UnderConstruction;