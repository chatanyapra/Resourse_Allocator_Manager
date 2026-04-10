"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // change to your backend

type Props = {
    podName: string;
};

export default function LogsViewer({ podName }: Props) {
    const [logs, setLogs] = useState<string[]>([]);
    const [status, setStatus] = useState("Connecting...");
    const logEndRef = useRef<HTMLDivElement>(null);

    // 🔁 Auto scroll to bottom
    const scrollToBottom = () => {
        logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [logs]);

    useEffect(() => {
        if (!podName) return;

        // 🔥 Start watching logs
        socket.emit("watch-logs", podName);

        // 📜 Receive logs
        socket.on("log-update", (data: string) => {
            setLogs((prev) => [...prev, data]);
        });

        // 📊 Receive status
        socket.on("pod-status", (data: string) => {
            setStatus(data);
        });

        return () => {
            socket.off("log-update");
            socket.off("pod-status");
        };
    }, [podName]);

    // 🧹 Clear logs
    const clearLogs = () => setLogs([]);

    // 🎨 Status color
    const getStatusColor = () => {
        if (status === "Running") return "bg-green-500";
        if (status === "Pending") return "bg-yellow-500";
        if (status === "Failed") return "bg-red-500";
        return "bg-gray-500";
    };

    return (
        <div className="bg-black text-white rounded-2xl shadow-lg p-4 w-full h-[500px] flex flex-col">

            {/* 🔝 Header */}
            <div className="flex justify-between items-center mb-3">
                <div>
                    <h2 className="text-lg font-semibold">Container Logs</h2>
                    <p className="text-sm text-gray-400">{podName}</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* 🟢 Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor()}`}>
                        {status}
                    </span>

                    {/* 🧹 Clear Button */}
                    <button
                        onClick={clearLogs}
                        className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* 📜 Logs Area */}
            <div className="flex-1 overflow-y-auto bg-[#0f172a] p-3 rounded-lg font-mono text-sm">
                {logs.length === 0 ? (
                    <p className="text-gray-500">No logs yet...</p>
                ) : (
                    logs.map((log, index) => (
                        <div key={index} className="whitespace-pre-wrap">
                            {log}
                        </div>
                    ))
                )}
                <div ref={logEndRef} />
            </div>
        </div>
    );
}