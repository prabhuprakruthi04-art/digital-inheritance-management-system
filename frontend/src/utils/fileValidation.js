const allowedTypes = [

"application/pdf",

"image/jpeg",

"image/png",

"application/msword",

"application/vnd.openxmlformats-officedocument.wordprocessingml.document"

];


export function validateFile(file){


if(!allowedTypes.includes(file.type)){

return "File type not supported";

}



if(file.size > 10*1024*1024){

return "File size should be less than 10MB";

}



return null;


}