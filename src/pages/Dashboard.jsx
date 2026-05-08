import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, CheckCircle, XCircle, LogOut, LayoutDashboard, Star } from 'lucide-react';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/leads', { headers: { Authorization: `Bearer ${token}` } });
      setLeads(response.data);
      setLoading(false); 
    } catch (error) {
      console.error("Error fetching leads:", error);
      setLoading(false); 
      if (error.response?.status === 401) handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); navigate('/login');
  };

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const qualifiedLeads = leads.filter(l => l.status === 'Qualified').length;
  const wonLeads = leads.filter(l => l.status === 'Won').length;
  const lostLeads = leads.filter(l => l.status === 'Lost').length;
  
  const totalDealValue = leads.reduce((sum, lead) => sum + Number(lead.deal_value || 0), 0);
  const wonDealValue = leads.filter(l => l.status === 'Won').reduce((sum, lead) => sum + Number(lead.deal_value || 0), 0);

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 flex items-center space-x-4 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
      <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-20 backdrop-blur-sm`}><Icon size={24} /></div>
      <div><p className="text-sm font-semibold text-slate-500 tracking-wide">{title}</p><h3 className="text-3xl font-extrabold text-slate-900 mt-1">{value}</h3></div>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white/60 backdrop-blur-xl border-r border-slate-200/60 p-6 flex flex-col shadow-[4px_0_24px_rgb(0,0,0,0.02)] z-10">
        <div className="flex items-center space-x-3 px-2 py-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">V</div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">VibeIt CRM</span>
        </div>
        <nav className="flex-1 space-y-2">
          <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3.5 bg-indigo-50 text-indigo-700 rounded-2xl font-semibold transition-all">
            <LayoutDashboard size={20} /><span>Dashboard</span>
          </Link>
          <Link to="/leads" className="flex items-center space-x-3 px-4 py-3.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-2xl font-semibold transition-all">
            <Users size={20} /><span>All Leads</span>
          </Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl font-semibold mt-auto transition-all">
          <LogOut size={20} /><span>Logout</span>
        </button>
      </div>

      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <StatCard title="Total Leads" value={totalLeads} icon={Users} colorClass="bg-blue-100 text-blue-600" />
          <StatCard title="New Leads" value={newLeads} icon={TrendingUp} colorClass="bg-orange-100 text-orange-600" />
          <StatCard title="Qualified Leads" value={qualifiedLeads} icon={Star} colorClass="bg-purple-100 text-purple-600" />
          <StatCard title="Won Deals" value={wonLeads} icon={CheckCircle} colorClass="bg-emerald-100 text-emerald-600" />
          <StatCard title="Lost Deals" value={lostLeads} icon={XCircle} colorClass="bg-red-100 text-red-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
            <h3 className="text-lg font-semibold text-slate-500 mb-4 flex items-center tracking-wide"><DollarSign className="text-indigo-400 mr-2" size={24} /> Total Estimated Deal Value</h3>
            <p className="text-5xl font-extrabold text-slate-900">Rs. {totalDealValue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
            <h3 className="text-lg font-semibold text-slate-500 mb-4 flex items-center tracking-wide"><CheckCircle className="text-emerald-400 mr-2" size={24} /> Total Value of Won Deals</h3>
            <p className="text-5xl font-extrabold text-emerald-500 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-400">Rs. {wonDealValue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
