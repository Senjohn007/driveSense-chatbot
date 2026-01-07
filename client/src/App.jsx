import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="max-w-xl w-full px-6 py-8 rounded-2xl bg-slate-800 shadow-lg">
        <h1 className="text-3xl font-bold text-emerald-400 mb-4 text-center">
          DriveSense Chatbot
        </h1>
        <p className="text-sm text-slate-300 mb-6 text-center">
          Frontend is ready with React + Tailwind. Next step is to build the chat UI and connect to your Node/Express backend.
        </p>
        <div className="flex flex-col gap-3">
          <button className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-medium">
            New chat
          </button>
          <button className="w-full py-2 rounded-lg border border-slate-600 hover:bg-slate-700">
            Load previous conversations
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
