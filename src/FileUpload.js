import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./firebase";
import { toast } from "react-toastify";

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});

    const onDrop = (acceptedFiles) => {
        console.log("Files dropped: ", acceptedFiles);

        const totalSizeMB = acceptedFiles.reduce((acc, file) => acc + file.size / (1024 * 1024), 0);

        if (totalSizeMB > 200) {
            toast.error('Total files size exceeds maximum allowed 200 MB!');
            return;
        }

        if (acceptedFiles.length > 5) {
            toast.error('Maximum 5 files allowed at once!');
            setFiles(acceptedFiles.slice(0, 5));
        }
        else {
            setFiles(acceptedFiles);
        }
    };

    const handleUpload = () => {
        if (files.length === 0) {
            toast.error("Please select files to upload.");
            return;
        }

        files.forEach((file) => {
            const storageRef = ref(storage, `chem/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    setUploadProgress((prevProgress) => ({
                        ...prevProgress,
                        [file.name]: progress,
                    }));
                },
                (error) => {
                    console.error("Upload failed:", error);
                    toast.error('An error occurred!');
                },
                () => {
                    console.log(`${file.name} uploaded successfully.`);
                    toast.success('Files Uploaded Successfully!');
                }
            );
        });
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className="max-w-xl mx-auto p-4 text-white bg-[#0C120C]">
            <div
                {...getRootProps()}
                className="border-dashed border-2 border-white/20 hover:border-white/30 p-6 py-14 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent group transition"
            >
                <input {...getInputProps()} />
                <p className="text-center text-white/30 group-focus:text-white/50 group-hover:text-white/40">
                    Drag & drop some files here, or click to select files
                </p>
            </div>

            <button
                onClick={handleUpload}
                className="mt-4 w-full bg-white/10 border border-white/20 text-white font-medium py-2 rounded-lg hover:bg-white/20 hover:border-white/30 transition"
            >
                Upload
            </button>

            <div className="mt-6">
                {files.length > 0 &&
                    files.map((file) => (
                        <div key={file.name} className="mb-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-white/40">
                                    {file.name}
                                    <span className="text-white/20 ml-3">{`(${(file.size / (1024 * 1024)).toFixed(2)} mb)`}</span>
                                </span>
                                <span className="text-sm text-white/40">
                                    {
                                        Math.round(uploadProgress[file.name] || 0) === 100
                                            ? "Done"
                                            : Math.round(uploadProgress[file.name] || 0) + "%"
                                    }
                                </span>
                            </div>
                            <div className="relative w-full h-2 bg-white/10 border border-white/10 rounded mt-1">
                                <div
                                    className="absolute h-full bg-white rounded"
                                    style={{
                                        width: `${uploadProgress[file.name] || 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default FileUpload;
