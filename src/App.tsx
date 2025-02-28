import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import StatusPage from "./pages/DocumentStatusPage";
import { FileTextIcon, BarChartIcon } from "lucide-react";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-slate-900">
          <header className="border-b border-slate-700 bg-slate-800 shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-3">
              <nav className="flex items-center gap-6">
                <div className="text-indigo-400 font-bold text-xl mr-4">DocEditor</div>
                <Link 
                  to="/" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-slate-200 hover:bg-slate-700 hover:text-indigo-300 transition-colors"
                >
                  <FileTextIcon className="w-4 h-4" />
                  <span>Editor</span>
                </Link>
                <Link 
                  to="/status" 
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-slate-200 hover:bg-slate-700 hover:text-indigo-300 transition-colors"
                >
                  <BarChartIcon className="w-4 h-4" />
                  <span>Document Status</span>
                </Link>
              </nav>
            </div>
          </header>
          
          <main className="max-w-6xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<EditorPage />} />
              <Route path="/status" element={<StatusPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}