'use client';

import { motion } from 'framer-motion';

interface Person {
  id: string;
  name: string;
  relationship: string;
  lastSent: string;
  initials: string;
}

const people: Person[] = [
  {
    id: '1',
    name: 'Grace',
    relationship: 'Mother',
    lastSent: '£50',
    initials: 'G'
  },
  {
    id: '2',
    name: 'Juma',
    relationship: 'Brother',
    lastSent: '£35.50',
    initials: 'J'
  },
  {
    id: '3',
    name: 'Zainab',
    relationship: 'Aunt',
    lastSent: '£75',
    initials: 'Z'
  },
  {
    id: '4',
    name: 'James',
    relationship: 'Uncle',
    lastSent: '£60',
    initials: 'J'
  },
];

export default function YourPeople() {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 border border-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Your People</h3>
      
      <div className="space-y-3">
        {people.map((person, idx) => (
          <motion.div
            key={person.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + idx * 0.05 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f4a426] to-[#c4820a] flex items-center justify-center text-white font-semibold">
                {person.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a]">{person.name}</p>
                <p className="text-xs text-[#6b7280]">{person.relationship}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-[#1a1a1a]">Last sent</p>
              <p className="text-xs text-[#6b7280]">{person.lastSent}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-semibold text-[#f4a426] hover:bg-[#f4a426]/5 rounded-lg transition">
        Add Person
      </button>
    </motion.div>
  );
}
