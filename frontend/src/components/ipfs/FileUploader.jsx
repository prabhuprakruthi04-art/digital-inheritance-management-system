import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { validateFile } from "../../utils/fileValidation";


export default function FileUploader({ onUpload }) {


    const [error, setError] = useState("");



    const onDrop = (files) => {


        const file = files[0];


        const validation = validateFile(file);



        if (validation) {

            setError(validation);
            return;

        }


        setError("");

        onUpload(file);


    };



    const { getRootProps, getInputProps } = useDropzone({

        onDrop,

        multiple: false

    });



    return (

        <div>


            <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer"
            >


                <input {...getInputProps()} />


                <p>

                    Drag and drop document here

                    or click to browse

                </p>


            </div>



            {

                error &&

                <p className="text-red-500 mt-3">

                    {error}

                </p>

            }


        </div>

    );


}