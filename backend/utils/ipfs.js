import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const uploadToIPFS = async (filePath) => {
  try {
    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    );

    return res.data.IpfsHash;
  } catch (error) {
    console.error("IPFS Upload Error:", error.response?.data || error.message);
    throw error;
  }
};