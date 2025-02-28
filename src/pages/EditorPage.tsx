"use client";

import { Plate } from "@udecode/plate/react";
import { useCreateEditor } from "@/components/editor/use-create-editor";
import { MarkToolbarButton } from "../components/plate-ui/mark-toolbar-button";
import { BoldIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon, FileIcon, Code, Superscript, Subscript, Palette } from "lucide-react";
import { Editor, EditorContainer } from "../components/plate-ui/editor";
import { editorPlugins } from "../components/editor/plugins/editor-plugins";

import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { updateDocumentStatus } from "../redux/documentSlice";
import { Toolbar } from "@/components/plate-ui/toolbar";
import { Button } from "@/components/ui/button";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { ColorDropdownMenu } from "@/components/plate-ui/color-dropdown-menu";
export default function EditorPage() {
  const dispatch = useDispatch();

  // Safely get initial value from localStorage with error handling
  const getInitialValue = () => {
    try {
      const localValue = typeof window !== "undefined" && localStorage.getItem("editorContent");
      return localValue
        ? JSON.parse(localValue)
        : [{ type: "p", children: [{ text: "Start typing..." }] }];
    } catch (err) {
      console.error("Error parsing stored content:", err);
      return [{ type: "p", children: [{ text: "Start typing..." }] }];
    }
  };

  const initialValue = getInitialValue();

  const editor = useCreateEditor({
    plugins: [...editorPlugins, ],
    
    initialValue,
  });

  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Memoize updateRedux to avoid recreating it on each render
  const updateRedux = useCallback((content) => {
    dispatch(
      updateDocumentStatus({
        content,
        lastUpdated: new Date().toISOString(),
        updatedBy: "Anonymous",
      }),
    );
    // Visual feedback for save status
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  }, [dispatch]);

  React.useEffect(() => {
    if (!editor) return;
    
    // Handle content updates
    const handleContentChange = () => {
      if (!Array.isArray(editor.children)) return;
      
      try {
        // Create preview HTML
        const content = editor.children
          .map((node) => {
            if (!node || !node.children) return "";
            
            if (node.type === "h1") return `<h1>${node.children.map(child => child.text).join('')}</h1>`;
            if (node.type === "h2") return `<h2>${node.children.map(child => child.text).join('')}</h2>`;
            if (node.type === "p") return `<p>${node.children.map(child => child.text).join('')}</p>`;
            return "";
          })
          .join("");

        setPreview(content);
        
        // Save to localStorage for persistence
        localStorage.setItem("editorContent", JSON.stringify(editor.children));
        
        // Debounce Redux updates to avoid excessive dispatches
        const timeoutId = setTimeout(() => {
          updateRedux(content);
        }, 800);
        
        return () => clearTimeout(timeoutId);
      } catch (err) {
        console.error("Error updating preview:", err);
      }
    };

    // Set up editor onChange handler 
    const originalOnChange = editor.onChange;
    editor.onChange = (...args) => {
      originalOnChange?.(...args);
      handleContentChange();
    };

    // Initial content update
    handleContentChange();

    // Cleanup
    return () => {
      editor.onChange = originalOnChange;
    };
  }, [editor, updateRedux]);

  const handleDownloadDocx = () => {
    if (!editor || !editor.children || !editor.children.length) {
      console.warn("No content to download");
      return;
    }
  
    try {
      // Create DOCX document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: editor.children.map((node) => {
              if (!node || !node.children) return new Paragraph({});
              
              // Create a paragraph for each node
              const paragraph = new Paragraph({});
              
              // Process each child within the node to preserve individual formatting
              node.children.forEach((child) => {
                // Extract text content
                const text = child.text || "";
                
                // Configure text run with all formatting options
                const textRunOptions: any = {
                  text,
                  bold: child.bold || (node.type === "h1" || node.type === "h2"),
                  italics: child.italic,
                  strike: child.strikethrough,
                  underline: child.underline,
                  superScript: child.superscript,
                  subScript: child.subscript,
                };
                
                // Handle text color
                if (child.color) {
                  // Convert color value to hexadecimal format if it's not already
                  let hexColor = child.color as string;
                  
                  // Handle named colors or RGB values
                  if (!hexColor.startsWith('#')) {
                    // If it's an RGB format like rgb(0,0,0)
                    if (hexColor.startsWith('rgb')) {
                      // Extract RGB values
                      const rgb = hexColor.match(/\d+/g);
                      if (rgb && rgb.length === 3) {
                        // Convert to hex
                        hexColor = '#' + rgb.map(x => {
                          const hex = parseInt(x).toString(16);
                          return hex.length === 1 ? '0' + hex : hex;
                        }).join('');
                      }
                    }
                  }
                  
                  // Remove # from hex color for docx
                  if (hexColor.startsWith('#')) {
                    hexColor = hexColor.substring(1);
                  }
                  
                  textRunOptions.color = hexColor;
                }
                
                // Add the formatted text run to the paragraph
                paragraph.addChildElement(new TextRun(textRunOptions));
              });
              
              return paragraph;
            }),
          },
        ],
      });
  
      // Generate and download the document
      Packer.toBlob(doc)
        .then((blob) => {
          saveAs(blob, "document.docx");
        })
        .catch((err) => {
          console.error("Error creating document blob:", err);
        });
    } catch (err) {
      console.error("Error preparing document:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6 bg-slate-50">
      <Plate editor={editor}>
        <div className="border border-slate-200 rounded-lg shadow-md overflow-hidden bg-white">
          <Toolbar className="flex items-center border-b border-slate-200 p-3 gap-2 bg-slate-100">
            <div className="flex items-center space-x-2 px-1">
              <MarkToolbarButton 
                nodeType="bold" 
                className="p-2 rounded-md hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
              >
                <BoldIcon className="w-5 h-5" />
              </MarkToolbarButton>

              <MarkToolbarButton 
                nodeType="italic" 
                className="p-2 rounded-md hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
              >
                <ItalicIcon className="w-5 h-5" />
              </MarkToolbarButton>

              <MarkToolbarButton 
                nodeType="underline" 
                className="p-2 rounded-md hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
              >
                <UnderlineIcon className="w-5 h-5" />
              </MarkToolbarButton>

              <MarkToolbarButton 
                nodeType="strikethrough" 
                className="p-2 rounded-md hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
              >
                <StrikethroughIcon className="w-5 h-5" /    >
              </MarkToolbarButton>
              <MarkToolbarButton 
                nodeType="code" 
                className="p-2 rounded-md hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
              >
               <Code className="w-5 h-5"  />
              </MarkToolbarButton>
              <MarkToolbarButton 
                nodeType="superscript" 
                className="p-2 rounded-md hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
              >
               <Superscript  className="w-5 h-5"/ >
              </MarkToolbarButton>
              <MarkToolbarButton 
                nodeType="subscript" 
                className="p-2 rounded-md hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
              >
               <Subscript  className="w-5 h-5"/ >
              </MarkToolbarButton>
              <MarkToolbarButton 
                nodeType="" 
                className="p-2 rounded-md hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition-colors"
              >
               <Subscript  className="w-5 h-5"/ >
              </MarkToolbarButton>
           
                <ColorDropdownMenu 
                nodeType = "color">
                 <Palette className="w-5 h-5" />
                </ColorDropdownMenu>
        
            </div>

            <Button
              className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-md ${
                isSaving 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white transition-colors`}
              onClick={handleDownloadDocx}
              disabled={isSaving}
            >
              <FileIcon className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Download DOCX"}</span>
            </Button>
          </Toolbar>

          <EditorContainer className="p-6 h-[500px] overflow-auto">
            <Editor placeholder="Type something..." />
          </EditorContainer>
        </div>
      </Plate>
      
      <div className="border border-slate-200 rounded-lg shadow-md overflow-hidden bg-white">
        <div className="bg-slate-100 border-b border-slate-200 p-4">
          <h2 className="text-lg font-medium text-slate-800">Preview</h2>
        </div>
        <div className="p-6 prose max-w-none min-h-[200px]" dangerouslySetInnerHTML={{ __html: preview }} />
      </div>
    </div>
  );
}