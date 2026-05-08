import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Users, LayoutDashboard, LogOut, Plus, Search, MessageSquare, X, Edit2, Trash2, Filter } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterSalesperson, setFilterSalesperson] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editLeadId, setEditLeadId] = useState(null);
  const [currentLead, setCurrentLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  const [formData, setFormData] = useState({
    lead_name: '', company_name: '', email: '', phone: '', source: 'Website', status: 'New', deal_value: '', assigned_salesperson: 'Unassigned'
  });

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/leads', { headers: { Authorization: `Bearer ${token}` } });
      setLeads(response.data);
    } catch (error) { if (error.response?.status === 401) handleLogout(); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const handleSaveLead = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/leads/${editLeadId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post('http://localhost:5000/api/leads', formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      closeModal(); fetchLeads();
    } catch (error) { alert('Error saving lead.'); }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/leads/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchLeads();
      } catch (error) { alert('Error deleting lead.'); }
    }
  };

  const handleEditClick = (lead) => {
    setFormData({
      lead_name: lead.lead_name, company_name: lead.company_name, email: lead.email, phone: lead.phone,
      source: lead.source || 'Website', status: lead.status, deal_value: lead.deal_value, assigned_salesperson: lead.assigned_salesperson || 'Unassigned'
    });
    setEditLeadId(lead.id); setIsEditing(true); setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setFormData({ lead_name: '', company_name: '', email: '', phone: '', source: 'Website', status: 'New', deal_value: '', assigned_salesperson: 'Unassigned' });
    setIsEditing(false); setEditLeadId(null); setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setIsEditing(false); setEditLeadId(null); };

  const openNotes = async (lead) => { setCurrentLead(lead); setIsNotesModalOpen(true); fetchNotes(lead.id); };

  const fetchNotes = async (leadId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/notes/lead/${leadId}`, { headers: { Authorization: `Bearer ${token}` } });
      setNotes(response.data);
    } catch (error) { console.error('Error', error); }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/notes', { lead_id: currentLead.id, content: newNote }, { headers: { Authorization: `Bearer ${token}` } });
      setNewNote(''); fetchNotes(currentLead.id);
    } catch (error) { alert('Error adding note.'); }
  };

  const filteredLeads = leads.filter(lead => {
    const s = searchTerm.toLowerCase();
    const matchSearch = lead.lead_name.toLowerCase().includes(s) || lead.company_name.toLowerCase().includes(s) || lead.email.toLowerCase().includes(s);
    const matchStatus = filterStatus ? lead.status === filterStatus : true;
    const matchSource = filterSource ? lead.source === filterSource : true;
    const matchSalesperson = filterSalesperson ? lead.assigned_salesperson === filterSalesperson : true;
    
    return matchSearch && matchStatus && matchSource && matchSalesperson;
  });

  const salespeople = [...new Set(leads.map(l => l.assigned_salesperson || 'Unassigned'))];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white/60 backdrop-blur-xl border-r border-slate-200/60 p-6 flex flex-col shadow-[4px_0_24px_rgb(0,0,0,0.02)] z-10">
        <div className="flex items-center space-x-3 px-2 py-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">V</div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">VibeIt CRM</span>
        </div>
        <nav className="flex-1 space-y-2">
          <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-2xl font-semibold transition-all"><LayoutDashboard size={20} /><span>Dashboard</span></Link>
          <Link to="/leads" className="flex items-center space-x-3 px-4 py-3.5 bg-indigo-50 text-indigo-700 rounded-2xl font-semibold transition-all"><Users size={20} /><span>All Leads</span></Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl font-semibold mt-auto transition-all"><LogOut size={20} /><span>Logout</span></button>
      </div>

      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Leads Management</h1></div>
          <button onClick={handleAddNewClick} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-indigo-500 hover:to-blue-500 flex items-center space-x-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300">
            <Plus size={20} /><span>Add New Lead</span>
          </button>
        </div>

        <div className="bg-white p-5 rounded-t-3xl border border-b-0 border-slate-100 flex flex-wrap gap-4 items-center shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <div className="relative flex-1 min-w-[250px] group">
            <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" placeholder="Search name, company, or email..." 
              className="pl-12 pr-4 py-2.5 w-full border border-slate-200/60 bg-slate-50/50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-900 placeholder-slate-400"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2 text-sm font-semibold text-slate-500"><Filter size={18}/> <span>Filters:</span></div>
          
          <select className="border border-slate-200/60 bg-slate-50/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-medium text-slate-700 transition-all cursor-pointer" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="New">New</option><option value="Contacted">Contacted</option><option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option><option value="Won">Won</option><option value="Lost">Lost</option>
          </select>

          <select className="border border-slate-200/60 bg-slate-50/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-medium text-slate-700 transition-all cursor-pointer" value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
            <option value="">All Sources</option>
            <option value="Website">Website</option><option value="LinkedIn">LinkedIn</option>
            <option value="Referral">Referral</option><option value="Cold Email">Cold Email</option><option value="Event">Event</option>
          </select>

          <select className="border border-slate-200/60 bg-slate-50/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 font-medium text-slate-700 transition-all cursor-pointer" value={filterSalesperson} onChange={(e) => setFilterSalesperson(e.target.value)}>
            <option value="">All Salespeople</option>
            {salespeople.map(person => <option key={person} value={person}>{person}</option>)}
          </select>
        </div>

        <div className="bg-white border border-slate-100 rounded-b-3xl overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
                <th className="px-6 py-4 font-semibold tracking-wide">Lead Info</th>
                <th className="px-6 py-4 font-semibold tracking-wide">Source / Assignee</th>
                <th className="px-6 py-4 font-semibold tracking-wide">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wide">Deal Value</th>
                <th className="px-6 py-4 font-semibold tracking-wide text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{lead.lead_name}</div>
                    <div className="text-sm text-slate-500 font-medium mt-0.5">{lead.company_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold bg-slate-100 px-2.5 py-1 rounded-md text-slate-600 border border-slate-200/60">{lead.source}</span>
                    <div className="text-sm font-medium text-indigo-600 mt-1.5 flex items-center">👤 {lead.assigned_salesperson || 'Unassigned'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                      lead.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      lead.status === 'Proposal Sent' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      lead.status === 'Won' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      lead.status === 'Lost' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>{lead.status}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-900 font-bold">Rs. {Number(lead.deal_value).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openNotes(lead)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-xl transition-colors" title="Notes"><MessageSquare size={18} /></button>
                      <button onClick={() => handleEditClick(lead)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-xl transition-colors" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => handleDeleteLead(lead.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors" title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-slate-500 font-medium">No leads found matching your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900">{isEditing ? 'Edit Lead' : 'Add New Lead'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleSaveLead} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Lead Name</label><input required type="text" className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-2.5 rounded-xl outline-none transition-all font-medium" value={formData.lead_name} onChange={e => setFormData({...formData, lead_name: e.target.value})} /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Company</label><input required type="text" className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-2.5 rounded-xl outline-none transition-all font-medium" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label><input required type="email" className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-2.5 rounded-xl outline-none transition-all font-medium" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label><input required type="text" className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-2.5 rounded-xl outline-none transition-all font-medium" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lead Source</label>
                  <select className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-2.5 rounded-xl outline-none transition-all font-medium cursor-pointer" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                    <option value="Website">Website</option><option value="LinkedIn">LinkedIn</option><option value="Referral">Referral</option><option value="Cold Email">Cold Email</option><option value="Event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
                  <select className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-2.5 rounded-xl outline-none transition-all font-medium cursor-pointer" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="New">New</option><option value="Contacted">Contacted</option><option value="Qualified">Qualified</option><option value="Proposal Sent">Proposal Sent</option><option value="Won">Won</option><option value="Lost">Lost</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Deal Value (Rs)</label><input required type="number" className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-2.5 rounded-xl outline-none transition-all font-medium" value={formData.deal_value} onChange={e => setFormData({...formData, deal_value: e.target.value})} /></div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Salesperson</label>
                  <input type="text" placeholder="Eg: John Doe" className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-2.5 rounded-xl outline-none transition-all font-medium" value={formData.assigned_salesperson} onChange={e => setFormData({...formData, assigned_salesperson: e.target.value})} />
                </div>
              </div>

              <div className="mt-8 flex space-x-3">
                <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-500/30 transition-all duration-200">{isEditing ? 'Update Lead' : 'Save Lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isNotesModalOpen && currentLead && (
         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-5">
              <div><h2 className="text-2xl font-extrabold text-slate-900">Notes</h2><p className="text-sm text-slate-500 font-medium mt-1">{currentLead.lead_name} • {currentLead.company_name}</p></div>
              <button onClick={() => setIsNotesModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
              {notes.length === 0 ? <p className="text-center text-slate-400 font-medium py-8">No notes added yet.</p> : notes.map(note => (
                <div key={note.id} className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                  <p className="text-slate-700 text-sm font-medium leading-relaxed">{note.content}</p>
                  <div className="text-xs font-semibold text-slate-400 mt-3 flex justify-between"><span>{note.created_by_email || 'You'}</span><span>{new Date(note.created_at).toLocaleDateString()}</span></div>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddNote} className="mt-auto border-t border-slate-100 pt-5">
              <textarea required className="w-full border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-3.5 rounded-xl resize-none text-sm outline-none transition-all font-medium" rows="3" placeholder="Type your note here..." value={newNote} onChange={(e) => setNewNote(e.target.value)}></textarea>
              <button type="submit" className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 shadow-md transition-colors">Add Note</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
