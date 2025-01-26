'use client';

import { useState } from 'react';
import { 
  User, Search, Filter, Plus, MoreVertical, 
  Mail, Phone, Shield, Edit2, Trash2, 
  CheckCircle, XCircle, Clock 
} from 'lucide-react';

export default function UsersPage() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="p-8 pt-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Team Members</h1>
          <p className="text-neutral-500">Manage your team and their permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {filterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
            <select className="px-4 py-2 border border-neutral-200 rounded-lg">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Agent</option>
            </select>
            <select className="px-4 py-2 border border-neutral-200 rounded-lg">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
            </select>
            <select className="px-4 py-2 border border-neutral-200 rounded-lg">
              <option>All Teams</option>
              <option>Sales</option>
              <option>Support</option>
              <option>Technical</option>
            </select>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">User</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Team</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Last Active</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{user.name}</div>
                      <div className="text-sm text-neutral-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-neutral-400" />
                    <span>{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{user.team}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${user.status === 'Active' ? 'bg-green-100 text-green-700' :
                      user.status === 'Inactive' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'}`}
                  >
                    {user.status === 'Active' ? <CheckCircle className="h-3 w-3" /> :
                     user.status === 'Inactive' ? <XCircle className="h-3 w-3" /> :
                     <Clock className="h-3 w-3" />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-500">{user.lastActive}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1 hover:bg-neutral-100 rounded">
                      <Edit2 className="h-4 w-4 text-neutral-500" />
                    </button>
                    <button className="p-1 hover:bg-neutral-100 rounded">
                      <Trash2 className="h-4 w-4 text-neutral-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Showing 1 to 10 of 50 users
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50">
              Previous
            </button>
            <button className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock user data
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
