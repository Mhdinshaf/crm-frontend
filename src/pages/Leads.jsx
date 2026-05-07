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
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="flex items-center space-x-2 px-4 py-3 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">V</div>
          <span className="text-xl font-bold text-gray-900">VibeIt CRM</span>
        </div>
        <nav className="flex-1 space-y-1">
          <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors"><LayoutDashboard size={20} /><span>Dashboard</span></Link>
          <Link to="/leads" className="flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium"><Users size={20} /><span>All Leads</span></Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium mt-auto"><LogOut size={20} /><span>Logout</span></button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-2xl font-bold text-gray-900">Leads Management</h1></div>
          <button onClick={handleAddNewClick} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 flex items-center space-x-2 shadow-sm">
            <Plus size={20} /><span>Add New Lead</span>
          </button>
        </div>

        <div className="bg-white p-4 rounded-t-2xl border border-b-0 border-gray-200 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
              type="text" placeholder="Search name, company, or email..." 
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg outline-none"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600"><Filter size={18}/> <span>Filters:</span></div>
          
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="New">New</option><option value="Contacted">Contacted</option><option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option><option value="Won">Won</option><option value="Lost">Lost</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
            <option value="">All Sources</option>
            <option value="Website">Website</option><option value="LinkedIn">LinkedIn</option>
            <option value="Referral">Referral</option><option value="Cold Email">Cold Email</option><option value="Event">Event</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" value={filterSalesperson} onChange={(e) => setFilterSalesperson(e.target.value)}>
            <option value="">All Salespeople</option>
            {salespeople.map(person => <option key={person} value={person}>{person}</option>)}
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-b-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Lead Info</th>
                <th className="p-4 font-medium">Source / Assignee</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Deal Value</th>
                <th className="p-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{lead.lead_name}</div>
                    <div className="text-sm text-gray-500">{lead.company_name}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-md text-gray-600">{lead.source}</span>
                    <div className="text-sm text-blue-600 mt-1">👤 {lead.assigned_salesperson || 'Unassigned'}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'Proposal Sent' ? 'bg-purple-100 text-purple-700' :
                      lead.status === 'Won' ? 'bg-green-100 text-green-700' :
                      lead.status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{lead.status}</span>
                  </td>
                  <td className="p-4 text-gray-900 font-medium">Rs. {Number(lead.deal_value).toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex justify-center items-center space-x-2">
                      <button onClick={() => openNotes(lead)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg" title="Notes"><MessageSquare size={18} /></button>
                      <button onClick={() => handleEditClick(lead)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => handleDeleteLead(lead.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg" title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-500">No leads found matching your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Lead' : 'Add New Lead'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            <form onSubmit={handleSaveLead} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Lead Name</label><input required type="text" className="w-full border p-2 rounded-lg" value={formData.lead_name} onChange={e => setFormData({...formData, lead_name: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Company</label><input required type="text" className="w-full border p-2 rounded-lg" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Email</label><input required type="email" className="w-full border p-2 rounded-lg" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Phone</label><input required type="text" className="w-full border p-2 rounded-lg" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Lead Source</label>
                  <select className="w-full border p-2 rounded-lg" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                    <option value="Website">Website</option><option value="LinkedIn">LinkedIn</option><option value="Referral">Referral</option><option value="Cold Email">Cold Email</option><option value="Event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select className="w-full border p-2 rounded-lg" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="New">New</option><option value="Contacted">Contacted</option><option value="Qualified">Qualified</option><option value="Proposal Sent">Proposal Sent</option><option value="Won">Won</option><option value="Lost">Lost</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Deal Value (Rs)</label><input required type="number" className="w-full border p-2 rounded-lg" value={formData.deal_value} onChange={e => setFormData({...formData, deal_value: e.target.value})} /></div>
                
            
                <div>
                  <label className="block text-sm font-medium mb-1">Salesperson</label>
                  <input type="text" placeholder="Eg: John Doe" className="w-full border p-2 rounded-lg" value={formData.assigned_salesperson} onChange={e => setFormData({...formData, assigned_salesperson: e.target.value})} />
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700">{isEditing ? 'Update Lead' : 'Save Lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isNotesModalOpen && currentLead && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-4 border-b pb-4">
              <div><h2 className="text-xl font-bold text-gray-900">Notes for {currentLead.lead_name}</h2><p className="text-sm text-gray-500">{currentLead.company_name}</p></div>
              <button onClick={() => setIsNotesModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
              {notes.length === 0 ? <p className="text-center text-gray-500 py-4">No notes added yet.</p> : notes.map(note => (
                <div key={note.id} className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                  <p className="text-gray-800 text-sm">{note.content}</p>
                  <div className="text-xs text-gray-500 mt-2 flex justify-between"><span>By: {note.created_by_email || 'You'}</span><span>{new Date(note.created_at).toLocaleDateString()}</span></div>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddNote} className="mt-auto border-t pt-4">
              <textarea required className="w-full border p-3 rounded-xl resize-none text-sm" rows="3" placeholder="Type your note here..." value={newNote} onChange={(e) => setNewNote(e.target.value)}></textarea>
              <button type="submit" className="w-full mt-2 bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-gray-800">Add Note</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
