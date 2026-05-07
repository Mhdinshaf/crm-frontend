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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div className={`p-3 rounded-xl ${colorClass}`}><Icon size={24} /></div>
      <div><p className="text-sm font-medium text-gray-500">{title}</p><h3 className="text-2xl font-bold text-gray-900">{value}</h3></div>
    </div>
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="flex items-center space-x-2 px-4 py-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
          <span className="text-xl font-bold text-gray-900">VibeIt CRM</span>
        </div>
        <nav className="flex-1 space-y-1">
          <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium">
            <LayoutDashboard size={20} /><span>Dashboard</span>
          </Link>
          <Link to="/leads" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Users size={20} /><span>All Leads</span>
          </Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium mt-auto">
          <LogOut size={20} /><span>Logout</span>
        </button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Leads" value={totalLeads} icon={Users} colorClass="bg-blue-100 text-blue-600" />
          <StatCard title="New Leads" value={newLeads} icon={TrendingUp} colorClass="bg-orange-100 text-orange-600" />
          <StatCard title="Qualified Leads" value={qualifiedLeads} icon={Star} colorClass="bg-purple-100 text-purple-600" />
          <StatCard title="Won Deals" value={wonLeads} icon={CheckCircle} colorClass="bg-green-100 text-green-600" />
          <StatCard title="Lost Deals" value={lostLeads} icon={XCircle} colorClass="bg-red-100 text-red-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><DollarSign className="text-gray-400 mr-2" size={20} /> Total Estimated Deal Value</h3>
            <p className="text-4xl font-bold text-gray-900">Rs. {totalDealValue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><CheckCircle className="text-gray-400 mr-2" size={20} /> Total Value of Won Deals</h3>
            <p className="text-4xl font-bold text-green-600">Rs. {wonDealValue.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
