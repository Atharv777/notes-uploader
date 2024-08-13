import React from "react";
import FileUpload from "./FileUpload";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <div className="text-white bg-[#0C120C]">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick={true}
                pauseOnHover={false}
                draggable={true}
                progress={undefined}
                theme={"dark"}
            />
            <h1 className="text-4xl text-center font-bold mt-8 mb-4">Upload Files</h1>
            <FileUpload />
        </div>
    );
}

export default App;
