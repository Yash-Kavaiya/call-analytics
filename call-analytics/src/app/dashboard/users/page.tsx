'use client';

import { useState } from 'react';
import { 
  User, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Shield, 
  Edit, 
  Trash, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronDown,
  UserPlus,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle,
  RefreshCw,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function UsersPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'grid'

  return (
    <div className="p-8 pt-24 bg-gradient-to-br from-indigo-50/40 to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
            Team Members
          </h1>
          <p className="text-gray-500 mt-1">Manage your organization's team and access permissions</p>
        </div>
        <div className="flex gap-3 self-end md:self-auto">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button 
              className={`px-3 py-1.5 text-sm ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setViewMode('list')}
            >
              <Filter className="h-4 w-4" />
            </button>
            <button 
              className={`px-3 py-1.5 text-sm ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setViewMode('grid')}
            >
              <Users className="h-4 w-4" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200">
            <UserPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-6 transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              filterOpen 
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                : 'border border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div 
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100 overflow-hidden transition-all duration-300 ${
            filterOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0 invisible'
          }`}
        >
          <div className="relative">
            <Shield className="h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select className="appearance-none pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Agent</option>
            </select>
            <ChevronDown className="h-4 w-4 absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <AlertCircle className="h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select className="appearance-none pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
            </select>
            <ChevronDown className="h-4 w-4 absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <Users className="h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select className="appearance-none pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
              <option>All Teams</option>
              <option>Sales</option>
              <option>Support</option>
              <option>Technical</option>
            </select>
            <ChevronDown className="h-4 w-4 absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* Users Table */
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-indigo-50/40 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{user.team}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                        ${user.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' :
                          user.status === 'Inactive' ? 'bg-red-50 text-red-700 border border-red-100' :
                          'bg-amber-50 text-amber-700 border border-amber-100'}`}
                      >
                        {user.status === 'Active' ? <CheckCircle className="h-3 w-3" /> :
                         user.status === 'Inactive' ? <XCircle className="h-3 w-3" /> :
                         <Clock className="h-3 w-3" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{user.lastActive}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-500 hover:text-indigo-600 transition-colors">
                          <UserCheck className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-500 hover:text-indigo-600 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors">
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-800">1-10</span> of <span className="font-medium text-gray-800">50</span> users
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-600 border-indigo-100">
                1
              </button>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200">
                2
              </button>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200">
                3
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-110 transition-transform duration-300">
                    <User className="h-6 w-6" />
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                    ${user.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-100' :
                      user.status === 'Inactive' ? 'bg-red-50 text-red-700 border border-red-100' :
                      'bg-amber-50 text-amber-700 border border-amber-100'}`}
                  >
                    {user.status === 'Active' ? <CheckCircle className="h-3 w-3" /> :
                      user.status === 'Inactive' ? <XCircle className="h-3 w-3" /> :
                      <Clock className="h-3 w-3" />}
                    {user.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <div className="text-sm text-gray-500 mt-1">{user.email}</div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Role:</span>
                    <span className="font-medium text-gray-900">{user.role}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Team:</span>
                    <span className="font-medium text-gray-900">{user.team}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last active:</span>
                    <span className="font-medium text-gray-900">{user.lastActive}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <div className="flex space-x-1">
                  <button className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-500 hover:text-indigo-600 transition-colors">
                    <UserCheck className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 hover:bg-indigo-50 rounded-lg text-gray-500 hover:text-indigo-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors">
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
                
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Activity Stats */}
      <div className="mt-8 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Team Activity</h3>
            <p className="text-sm text-gray-500 mt-1">Recent user activity and performance metrics</p>
          </div>
          <button className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <ActivityCard 
            title="New Users" 
            value="12" 
            change="+33%" 
            trend="up" 
            period="Last 30 days"
          />
          <ActivityCard 
            title="Active Rate" 
            value="82%" 
            change="+5%" 
            trend="up" 
            period="vs last month"
          />
          <ActivityCard 
            title="Avg. Session Time" 
            value="35m" 
            change="-12%" 
            trend="down" 
            period="vs last month"
          />
          <ActivityCard 
            title="Team Performance" 
            value="8.6/10" 
            change="+0.4" 
            trend="up" 
            period="vs last month"
          />
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ title, value, change, trend, period }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">{title}</h4>
          <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          trend === 'up' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {change}
        </span>
      </div>
      <div className="text-xs text-gray-500">{period}</div>
    </div>
  );
}

// Mock user data with enhanced fields
const users = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Admin',
    team: 'Management',
    status: 'Active',
    lastActive: '2 minutes ago'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'Manager',
    team: 'Sales',
    status: 'Active',
    lastActive: '15 minutes ago'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'm.brown@example.com',
    role: 'Agent',
    team: 'Support',
    status: 'Inactive',
    lastActive: '2 days ago'
  }
].concat(Array(7).fill(null).map((_, i) => ({
  id: i + 4,
  name: `User ${i + 4}`,
  email: `user${i + 4}@example.com`,
  role: ['Admin', 'Manager', 'Agent'][Math.floor(Math.random() * 3)],
  team: ['Sales', 'Support', 'Technical', 'Management'][Math.floor(Math.random() * 4)],
  status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
  lastActive: ['5 minutes ago', '1 hour ago', '1 day ago', '1 week ago'][Math.floor(Math.random() * 4)]
})));