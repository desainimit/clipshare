"use client";
import Button from "@/app/Components/Button";
import clipboard from "clipboardy";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import QRCode from "qrcode.react";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CopyToClipboard from "react-copy-to-clipboard";

export default function Clipboard() {
  const [url, setURL] = useState("");
  const socket = io(process.env.NEXT_PUBLIC_SERVER_URL as string);
  const path = usePathname();
  const [baseUrl, setBaseUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [clipboardText, setClipboardText] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [clipboardHistory, setClipboardHistory] = useState<any[]>([]); // State to store the clipboard history

  // Fetch and listen for clipboard data via socket.io
  useEffect(() => {
    socket.on("clipboardData", (data: any) => {
      setClipboardText(data);
    });

    return () => {
      socket.off("clipboardData");
    };
  }, [clipboardText, socket]);

  // Set URL and base URL when component mounts
  useEffect(() => {
    setBaseUrl(`${window.location.protocol}//${window.location.host}` + path);
    setURL(`${window.location.protocol}//${window.location.host}`);
    setIsMobile(window.innerWidth < 500 ? true : false);
    fetchClipboardHistory(); // Fetch clipboard history when the component mounts
  }, []);

  const handleChange = (event: any) => {
    const text = event.target.value;
    setClipboardText(text);
    socket.emit("clipboardData", text);
  };

  const handleCopy = ({ text }: any) => {
    setCopied(true); // Set copied state to true when text is copied
    toast("😉: Text Copied !!");
    setTimeout(() => {
      setCopied(false); // Reset copied state after 2 seconds
    }, 2000);
  };

  // Function to save clipboard data
  const saveClipboardData = async () => {
    try {
      const confirm = window.confirm("Are you sure you want to save?");
      if (!confirm) {
        return;
      }
      const roomId = path.split("/")[2];

      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL as string;
      if (!serverUrl) {
        throw new Error(
          "Server URL is not defined in the environment variables."
        );
      }

      if (!clipboardText) {
        alert("Clipboard data is empty. Please type something to save.");
        return;
      }

      // Make the POST request to save clipboard data
      const response = await axios.post(`${serverUrl}/save-clipboard`, {
        clipData: clipboardText,
        roomId: roomId,
      });
      fetchClipboardHistory();

      console.log(response.data.message);
      alert("Clipboard data saved successfully!");

      // Fetch the updated clipboard history after saving new data
      fetchClipboardHistory();
    } catch (error) {
      console.error("Error saving clipboard data:", error);
      alert("Failed to save clipboard data.");
    }
  };

  // Function to fetch clipboard history
  const fetchClipboardHistory = async () => {
    try {
      const roomId = path.split("/")[2];
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/get-clipboard/${roomId}`
      );
      setClipboardHistory(response.data); // Set the clipboard history data to state
    } catch (error) {
      console.error("Error fetching clipboard history:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex sm:gap-[2vw] max-sm:gap-[2rem] w-full justify-center mb-5">
        <div className="flex flex-col items-center">
          <QRCode size={isMobile ? 280 : 400} value={baseUrl} />
          <h1 className="max-sm:hidden text-center p-[.5vw] font-semibold max-sm:text-xl sm:text-[1.2vw] text-slate-700">
            Scan QR code for open clipboard on your mobile
          </h1>
          <Button
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?&text=Open%20this%20link%20to%20your%20browser:%20${baseUrl}`
              )
            }
            hoverColor="hover:bg-green-500/50"
            color="bg-green-500"
            title="Share Link via Whatsapp"
          />
        </div>

        <div className="flex flex-col justify-center items-center gap-4">
          <textarea
            className="outline-none max-sm:rounded-2xl max-sm:text-xl sm:text-[1vw] sm:w-[60vw] max-sm:h-[30vh] sm:h-[70vh] border-slate-500/20 focus:border-slate-500/50 border-2 sm:p-[2vw] max-sm:p-10 bg-white shadow-xl rounded-[1.5vw]"
            value={clipboardText}
            onChange={handleChange}
            placeholder="Type something..."
          />
          <div className="flex w-full gap-2">
            <Button
              color="bg-red-500"
              hoverColor="hover:bg-red-500/50"
              title="Delete"
              onClick={() => setClipboardText("")}
            />
            <CopyToClipboard text={clipboardText} onCopy={handleCopy}>
              <Button title="Copy" />
            </CopyToClipboard>
            <Button
              title="Save"
              color="bg-blue-500"
              hoverColor="hover:bg-blue-500/50"
              onClick={saveClipboardData}
            />
          </div>
        </div>
      </div>

      {/* Move Clipboard History to a new line below the main content */}
      <div className="flex flex-col gap-4 my-5 w-full">
        <h1 className="text-xl font-semibold text-slate-700 text-center">
          Saved Notes History
        </h1>
        <ul className="border rounded p-4 bg-white shadow-md">
          {clipboardHistory.length === 0 ? (
            <p className="text-center">No clipboard data found.</p>
          ) : (
            clipboardHistory.map((item, index) => (
              <li key={item._id} className="border-b py-2">
                <p>
                  <span className="font-semibold">{index + 1}. </span>
                  <span>{item.clipData}</span> {/* Display the saved note */}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
