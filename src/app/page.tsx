import { useState } from 'react';

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  activities: {
    date: string;
    puasa: boolean;
    ngaji: boolean;
    olahraga: boolean;
  }[];
}

const familyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'Ihsan',
    avatar: '/ihsan.jpg',
    score: 0,
    streak: 0,
    activities: []
  },
  {
    id: '2',
    name: 'Muti',
    avatar: '/muti.jpg',
    score: 0,
    streak: 0,
    activities: []
  },
  {
    id: '3',
    name: 'Hafizh',
    avatar: '/hafizh.jpg',
    score: 0,
    streak: 0,
    activities: []
  },
  {
    id: '4',
    name: 'Hasna',
    avatar: '/hasna.jpg',
    score: 0,
    streak: 0,
    activities: []
  }
];

export default function Home() {
  const [members, setMembers] = useState(familyMembers);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const updateActivity = (memberId: string, activity: 'puasa' | 'ngaji' | 'olahraga', value: boolean) => {
    setMembers(members => members.map(member => {
      if (member.id === memberId) {
        const updatedActivities = member.activities.map(a => {
          if (a.date === selectedDate) {
            return { ...a, [activity]: value };
          }
          return a;
        });
        
        // If no activity for today, add it
        if (!member.activities.find(a => a.date === selectedDate)) {
          updatedActivities.push({
            date: selectedDate,
            puasa: activity === 'puasa' ? value : false,
            ngaji: activity === 'ngaji' ? value : false,
            olahraga: activity === 'olahraga' ? value : false
          });
        }
        
        return {
          ...member,
          activities: updatedActivities,
          score: calculateScore(updatedActivities),
          streak: calculateStreak(updatedActivities)
        };
      }
      return member;
    }));
  };

  const calculateScore = (activities: any[]) => {
    return activities.reduce((total, activity) => {
      let score = 0;
      if (activity.puasa) score += 10;
      if (activity.ngaji) score += 5;
      if (activity.olahraga) score += 3;
      return total + score;
    }, 0);
  };

  const calculateStreak = (activities: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let currentDate = today;
    
    while (true) {
      const activity = activities.find(a => a.date === currentDate);
      if (!activity || (!activity.puasa && !activity.ngaji && !activity.olahraga)) {
        break;
      }
      streak++;
      const date = new Date(currentDate);
      date.setDate(date.getDate() - 1);
      currentDate = date.toISOString().split('T')[0];
    }
    
    return streak;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Ramadhan Tracker</h1>
          <p className="text-gray-600">Tracking Ibadah Keluarga</p>
        </div>

        {/* Date Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Tanggal:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Leaderboard */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Leaderboard</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Anggota</th>
                  <th className="px-6 py-3 text-left">Score</th>
                  <th className="px-6 py-3 text-left">Streak</th>
                </tr>
              </thead>
              <tbody>
                {members
                  .sort((a, b) => b.score - a.score)
                  .map((member) => (
                    <tr key={member.id} className="border-b">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-green-600">{member.score}</td>
                      <td className="px-6 py-4 text-blue-600">{member.streak} hari</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Family Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3"
                />
                <h3 className="text-lg font-semibold text-blue-600">{member.name}</h3>
                <p className="text-sm text-gray-600">Score: {member.score}</p>
                <p className="text-sm text-gray-600">Streak: {member.streak}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Puasa</span>
                  <input
                    type="checkbox"
                    checked={member.activities.find(a => a.date === selectedDate)?.puasa || false}
                    onChange={(e) => updateActivity(member.id, 'puasa', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ngaji</span>
                  <input
                    type="checkbox"
                    checked={member.activities.find(a => a.date === selectedDate)?.ngaji || false}
                    onChange={(e) => updateActivity(member.id, 'ngaji', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Olahraga</span>
                  <input
                    type="checkbox"
                    checked={member.activities.find(a => a.date === selectedDate)?.olahraga || false}
                    onChange={(e) => updateActivity(member.id, 'olahraga', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}