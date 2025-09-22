import { createHelia } from "helia";
import { dagJson } from "@helia/dag-json";
import fs from "fs";
import pinataSDK from "@pinata/sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize Pinata with your API Key and Secret
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

// Initialize Helia and DAG-JSON
const helia = await createHelia();
const d = dagJson(helia);

// Function to upload files and return CIDs
async function uploadFiles(filePaths) {
  let fileLinks = [];

  // Ensure the backup directory exists
  const backupDir = "./backup";
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  for (let i = 0; i < filePaths.length; i++) {
    try {
      const buffer = fs.readFileSync(filePaths[i]);
      const fileObject = { file: buffer };

      // Upload file to Helia (DAG-JSON)
      const fileCID = await d.add(fileObject);
      console.log(`File uploaded with CID: ${fileCID.toString()}`);

      // Backup the file to local storage
      await backupFileBeforeShutdown(fileCID.toString(), buffer);

      // Pin the file to Pinata for persistence and get the IPFS hash
      const ipfsHash = await pinFileToPinata(fileCID.toString(), buffer);

      // Save the file's IPFS link
      fileLinks.push(ipfsHash);
    } catch (err) {
      console.error(`Error uploading file ${filePaths[i]}:`, err);
    }
  }

  return fileLinks;
}

// Function to backup the file before shutdown
async function backupFileBeforeShutdown(cid, buffer) {
  try {
    const backupPath = `./backup/${cid}.jpg`;

    // Write the file to the backup folder before pinning
    fs.writeFileSync(backupPath, buffer);
    console.log(`File backed up to: ${backupPath}`);
  } catch (err) {
    console.error("Error backing up file:", err);
  }
}

// Function to pin file to Pinata and return the IPFS hash
async function pinFileToPinata(fileCID, buffer) {
  try {
    const backupPath = `./backup/${fileCID}.jpg`;
    const readableStreamForFile = fs.createReadStream(backupPath);

    const options = {
      pinataMetadata: {
        name: fileCID,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    };

    // Pin file to Pinata by uploading it directly
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);

    if (result && result.IpfsHash) {
      const ipfsHash = result.IpfsHash;
      console.log(
        `File with CID ${fileCID} pinned to Pinata. IPFS Hash: ${ipfsHash}`
      );

      // Return the IPFS hash for the file
      return ipfsHash;
    } else {
      console.error(
        `Failed to pin file with CID ${fileCID} to Pinata. No IpfsHash in response.`
      );
    }
  } catch (err) {
    console.error("Error pinning file to Pinata:", err);
  }
}

export { uploadFiles };

// Example of how to use these functions

// 1. Upload files and get their CIDs
/*const filePaths = ["/home/nikohackto/FinalCapstone/backend/image2.jpg"];

const fileLinks = await uploadFiles(filePaths);
console.log("All file links (IPFS Links):");

// 2. Display the clickable public links to the IPFS files
fileLinks.forEach((link) => {
  console.log(
    `File is accessible at: https://gateway.pinata.cloud/ipfs/${link}`
  );
});*/
