const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to VibeIt CRM Dashboard</h1>
      <p className="mt-4 text-gray-600">You are successfully logged in!</p>
      <button 
        onClick={() => { localStorage.clear(); window.location.reload(); }}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;