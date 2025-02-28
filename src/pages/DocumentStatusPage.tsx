"use client";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ClockIcon, UserIcon, FileTextIcon } from "lucide-react";

export default function StatusPage() {
  const document = useSelector((state: RootState) => state.document);
  
  // Format the date if it exists
  const formattedDate = document.lastUpdated 
    ? new Date(document.lastUpdated).toLocaleString() 
    : "Never";

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-slate-700 p-4 border-b border-slate-600">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileTextIcon className="w-5 h-5 text-indigo-400" />
          Document Status
        </h2>
      </div>
      
      <div className="p-6 text-slate-200 space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b border-slate-700">
          <ClockIcon className="w-5 h-5 text-indigo-400 mt-1" />
          <div>
            <p className="text-sm text-slate-400 mb-1">Last Updated</p>
            <p className="font-medium">{formattedDate}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 pb-4 border-b border-slate-700">
          <UserIcon className="w-5 h-5 text-indigo-400 mt-1" />
          <div>
            <p className="text-sm text-slate-400 mb-1">Updated By</p>
            <p className="font-medium">{document.updatedBy || "Unknown"}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-slate-400 mb-3">Content</p>
          <div 
            className="border border-slate-600 p-4 rounded-md bg-slate-900 text-slate-300 whitespace-pre-wrap min-h-32"
            dangerouslySetInnerHTML={{ __html: document.content || "No content available" }}
          />
        </div>
      </div>
    </div>
  );
}