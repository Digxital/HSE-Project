import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { reportService } from '@/services/reportService';
import { authService } from '@/services/authService';

// Types
export type RiskLevel = 'High' | 'Medium' | 'Low';
export type ReportStatus = 'Open' | 'In Progress' | 'Closed';
export type ActionStatus = 'Open' | 'In Progress' | 'Completed';

export interface Action {
  id: string;
  action: string;
  assignedTo: string;
  dueDate: string;
  status: ActionStatus;
}
 
export interface Comment {
  id: string;
  author: string;
  role: 'Admin' | 'Supervisor';
  text: string;
  timestamp: string;
}

export interface Report {
  id: string;
  _id?: string;
  type: 'Incident' | 'Hazard';
  category: string;
  description: string;
  location: string;
  risk: RiskLevel;
  status: ReportStatus;
  dateReported: string;
  reportedBy: string;
  equipmentInvolved: string;
  actions: Action[];
  comments: Comment[];
}

interface ReportsContextType {
  reports: Report[];
  loading: boolean;
  error: string | null;
  refreshReports: () => Promise<void>;
  closeReport: (reportId: string) => void;
  addComment: (reportId: string, text: string, role: 'admin' | 'supervisor') => void;
  addAction: (reportId: string, actionData: {
    actionTitle: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
    description: string;
  }) => void;
}

const ReportsContext = createContext<ReportsContextType | null>(null);

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

const initialReports: Report[] = [
  {
    id: 'HAZ-0001',
    type: 'Hazard',
    category: 'Slippery Floor in Main Entrance',
    description: 'Water accumulation near the main entrance causing a slip hazard. Immediate attention required to prevent accidents.',
    location: 'Head Office - Main Entrance - Lobby',
    risk: 'High',
    status: 'Open',
    dateReported: '10 Mar 2026\n11:31 AM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'None',
    actions: [],
    comments: [],
  },
  {
    id: 'HAZ-0002',
    type: 'Hazard',
    category: 'Missing Fire Extinguisher Sign',
    description: 'Fire extinguisher location sign missing in corridor B. Staff having difficulty locating emergency equipment.',
    location: 'Head Office - Corridor B',
    risk: 'Medium',
    status: 'Open',
    dateReported: '10 Mar 2026\n11:35 AM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'Fire safety equipment',
    actions: [],
    comments: [],
  },
  {
    id: 'HAZ-0003',
    type: 'Hazard',
    category: 'Oil Spill Near Generator Area',
    description: 'Oil spill detected near generator unit A. Area has been cordoned off pending cleanup. Potential environmental contamination risk.',
    location: 'Refinery Site A - Generator Room',
    risk: 'High',
    status: 'Open',
    dateReported: '09 Mar 2026\n10:30 AM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'Generator Unit A',
    actions: [],
    comments: [],
  },
  {
    id: 'INC-0004',
    type: 'Incident',
    category: 'Worker Slipped on Wet Surface',
    description: 'A cafeteria staff member slipped on a wet surface near the kitchen entrance. No serious injuries, but minor bruising reported. First aid was administered on site.',
    location: 'Head Office - Cafeteria',
    risk: 'Medium',
    status: 'In Progress',
    dateReported: '09 Mar 2026\n12:45 PM',
    reportedBy: 'supervisor@gmail.com',
    equipmentInvolved: 'None',
    actions: [
      {
        id: 'ACT-001',
        action: 'Install wet floor signs',
        assignedTo: 'Maintenance Supervisor',
        dueDate: 'Mar 15, 2026',
        status: 'In Progress',
      },
    ],
    comments: [
      {
        id: 'CMT-001',
        author: 'Peter Omorogbolahan',
        role: 'Admin',
        text: 'Wet floor signs have been ordered. Maintenance team is scheduled to install them by end of week.',
        timestamp: '09 Mar 2026, 02:15 PM',
      },
    ],
  },
  {
    id: 'HAZ-0005',
    type: 'Hazard',
    category: 'Exposed Electrical Wiring in Storage',
    description: 'Exposed electrical wiring found in storage area 3 during routine inspection. Wire insulation has degraded, creating risk of electrical shock or fire.',
    location: 'Warehouse B - Storage Area 3',
    risk: 'High',
    status: 'Open',
    dateReported: '08 Mar 2026\n09:15 AM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'Electrical wiring system',
    actions: [],
    comments: [],
  },
  {
    id: 'INC-0006',
    type: 'Incident',
    category: 'Minor Chemical Splash on Worker',
    description: 'Lab technician experienced a minor chemical splash on forearm while handling solvents. PPE gloves were worn but did not extend to elbow. Area was decontaminated.',
    location: 'Refinery Site A - Lab Section',
    risk: 'Medium',
    status: 'In Progress',
    dateReported: '08 Mar 2026\n02:20 PM',
    reportedBy: 'supervisor@gmail.com',
    equipmentInvolved: 'Chemical solvents, Lab gloves',
    actions: [
      {
        id: 'ACT-002',
        action: 'Provide PPE refresher training',
        assignedTo: 'Safety Officer',
        dueDate: 'Mar 12, 2026',
        status: 'Open',
      },
    ],
    comments: [
      {
        id: 'CMT-002',
        author: 'Peter Omorogbolahan',
        role: 'Admin',
        text: 'PPE audit completed. Longer chemical-resistant gloves have been procured for all lab staff.',
        timestamp: '08 Mar 2026, 04:30 PM',
      },
      {
        id: 'CMT-003',
        author: 'John Matthew',
        role: 'Supervisor',
        text: 'Refresher training session scheduled for March 12. All lab technicians must attend.',
        timestamp: '09 Mar 2026, 09:00 AM',
      },
    ],
  },
  {
    id: 'HAZ-0007',
    type: 'Hazard',
    category: 'Broken Handrail on Staircase',
    description: 'Handrail on staircase B (2nd floor) is broken and wobbling. Multiple staff have reported instability while using the stairs. Risk of fall from height.',
    location: 'Head Office - Staircase B, 2nd Floor',
    risk: 'Medium',
    status: 'In Progress',
    dateReported: '07 Mar 2026\n08:00 AM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'Staircase handrail',
    actions: [
      {
        id: 'ACT-003',
        action: 'Replace broken handrail section',
        assignedTo: 'Maintenance Lead',
        dueDate: 'Mar 10, 2026',
        status: 'In Progress',
      },
    ],
    comments: [],
  },
  {
    id: 'HAZ-0008',
    type: 'Hazard',
    category: 'Obstructed Emergency Exit Door',
    description: 'Emergency exit door in loading bay blocked by stacked pallets and boxes. Exit route completely inaccessible. Violates fire safety regulations.',
    location: 'Warehouse B - Loading Bay',
    risk: 'High',
    status: 'Closed',
    dateReported: '07 Mar 2026\n10:45 AM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'Emergency exit door',
    actions: [
      {
        id: 'ACT-004',
        action: 'Clear obstructions and post warning signs',
        assignedTo: 'Warehouse Manager',
        dueDate: 'Mar 08, 2026',
        status: 'Completed',
      },
    ],
    comments: [],
  },
  {
    id: 'INC-0009',
    type: 'Incident',
    category: 'Forklift Collision with Racking',
    description: 'Forklift operator collided with storage racking in aisle 5, causing partial collapse of upper shelf. No personnel were injured. Operator reported limited visibility due to high load.',
    location: 'Warehouse B - Aisle 5',
    risk: 'High',
    status: 'In Progress',
    dateReported: '06 Mar 2026\n03:30 PM',
    reportedBy: 'supervisor@gmail.com',
    equipmentInvolved: 'Forklift FL-203, Storage racking',
    actions: [
      {
        id: 'ACT-005',
        action: 'Review forklift operator certification',
        assignedTo: 'Operations Manager',
        dueDate: 'Mar 13, 2026',
        status: 'Open',
      },
      {
        id: 'ACT-006',
        action: 'Repair damaged racking',
        assignedTo: 'Maintenance Lead',
        dueDate: 'Mar 10, 2026',
        status: 'In Progress',
      },
    ],
    comments: [],
  },
  {
    id: 'HAZ-0010',
    type: 'Hazard',
    category: 'Gas Odour Detected Near Pipeline',
    description: 'Strong gas odour detected near pipeline section 4 during morning inspection. Area evacuated as precaution. Leak detection equipment deployed.',
    location: 'Refinery Site A - Pipeline Section 4',
    risk: 'High',
    status: 'Open',
    dateReported: '06 Mar 2026\n07:50 AM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'Gas pipeline section 4',
    actions: [],
    comments: [],
  },
  {
    id: 'INC-0011',
    type: 'Incident',
    category: 'Scaffolding Collapse During Maintenance',
    description: 'Section of scaffolding collapsed during tank farm maintenance work. Two workers sustained minor injuries and were treated at the on-site medical facility. Work halted pending investigation.',
    location: 'Refinery Site A - Tank Farm',
    risk: 'High',
    status: 'In Progress',
    dateReported: '05 Mar 2026\n11:20 AM',
    reportedBy: 'supervisor@gmail.com',
    equipmentInvolved: 'Scaffolding structure',
    actions: [
      {
        id: 'ACT-007',
        action: 'Conduct scaffolding integrity inspection',
        assignedTo: 'Safety Officer',
        dueDate: 'Mar 08, 2026',
        status: 'Completed',
      },
      {
        id: 'ACT-008',
        action: 'Retrain scaffolding erection team',
        assignedTo: 'HSE Manager',
        dueDate: 'Mar 15, 2026',
        status: 'In Progress',
      },
    ],
    comments: [],
  },
  {
    id: 'HAZ-0012',
    type: 'Hazard',
    category: 'Unmarked Trip Hazard on Walkway',
    description: 'Raised concrete section on walkway near parking lot entrance is unmarked. Several near-miss incidents reported by staff entering the building.',
    location: 'Head Office - Parking Lot Entrance',
    risk: 'Low',
    status: 'Closed',
    dateReported: '05 Mar 2026\n09:00 AM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'None',
    actions: [
      {
        id: 'ACT-009',
        action: 'Paint hazard markings on raised surface',
        assignedTo: 'Facilities Team',
        dueDate: 'Mar 06, 2026',
        status: 'Completed',
      },
    ],
    comments: [],
  },
  {
    id: 'INC-0013',
    type: 'Incident',
    category: 'Heat Exhaustion Reported by Field Worker',
    description: 'Field worker experienced dizziness and nausea while working outdoors in high temperatures. Worker was moved to shaded area and given fluids. Recovered after 30 minutes rest.',
    location: 'Refinery Site A - Outdoor Processing Area',
    risk: 'Medium',
    status: 'Closed',
    dateReported: '04 Mar 2026\n01:15 PM',
    reportedBy: 'supervisor@gmail.com',
    equipmentInvolved: 'None',
    actions: [
      {
        id: 'ACT-010',
        action: 'Implement mandatory hydration breaks',
        assignedTo: 'Field Supervisor',
        dueDate: 'Mar 05, 2026',
        status: 'Completed',
      },
    ],
    comments: [],
  },
  {
    id: 'HAZ-0014',
    type: 'Hazard',
    category: 'Corroded Valve on Pressure Line',
    description: 'Significant corrosion observed on pressure line valve at compressor station. Valve integrity compromised, risk of pressure leak under high load conditions.',
    location: 'Refinery Site A - Compressor Station',
    risk: 'High',
    status: 'In Progress',
    dateReported: '04 Mar 2026\n08:30 AM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'Pressure line valve PV-112',
    actions: [
      {
        id: 'ACT-011',
        action: 'Schedule valve replacement',
        assignedTo: 'Maintenance Lead',
        dueDate: 'Mar 11, 2026',
        status: 'In Progress',
      },
    ],
    comments: [],
  },
  {
    id: 'HAZ-0015',
    type: 'Hazard',
    category: 'Poor Lighting in Underground Parking',
    description: 'Multiple light fixtures not functioning in basement parking area. Low visibility creating risk for pedestrians and vehicles. Three light panels completely out.',
    location: 'Head Office - Basement Parking',
    risk: 'Low',
    status: 'Open',
    dateReported: '03 Mar 2026\n04:00 PM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'Parking lot lighting system',
    actions: [],
    comments: [],
  },
  {
    id: 'INC-0016',
    type: 'Incident',
    category: 'Vehicle Reversed into Safety Barrier',
    description: 'Delivery truck reversed into safety barrier at gate entrance while manoeuvring. Barrier damaged but no personnel were in the area. Driver cited blind spot as cause.',
    location: 'Warehouse B - Gate Entrance',
    risk: 'Medium',
    status: 'Closed',
    dateReported: '03 Mar 2026\n10:10 AM',
    reportedBy: 'supervisor@gmail.com',
    equipmentInvolved: 'Delivery truck DT-045, Safety barrier',
    actions: [
      {
        id: 'ACT-012',
        action: 'Install reverse cameras on delivery vehicles',
        assignedTo: 'Fleet Manager',
        dueDate: 'Mar 10, 2026',
        status: 'Completed',
      },
    ],
    comments: [],
  },
  {
    id: 'HAZ-0017',
    type: 'Hazard',
    category: 'Unsecured Gas Cylinders in Workshop',
    description: 'Multiple gas cylinders found unsecured and without restraint chains in the maintenance workshop. Risk of cylinders falling over and causing injury or gas release.',
    location: 'Refinery Site A - Maintenance Workshop',
    risk: 'High',
    status: 'Closed',
    dateReported: '02 Mar 2026\n11:00 AM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'Gas cylinders (Oxygen, Acetylene)',
    actions: [
      {
        id: 'ACT-013',
        action: 'Install cylinder restraint chains',
        assignedTo: 'Workshop Supervisor',
        dueDate: 'Mar 04, 2026',
        status: 'Completed',
      },
    ],
    comments: [],
  },
  {
    id: 'INC-0018',
    type: 'Incident',
    category: 'Electrical Short Circuit in Control Room',
    description: 'Short circuit occurred in the main control room circuit breaker panel, causing a brief power outage. Backup systems activated. No injuries but operations disrupted for 45 minutes.',
    location: 'Refinery Site A - Control Room',
    risk: 'High',
    status: 'In Progress',
    dateReported: '02 Mar 2026\n02:45 PM',
    reportedBy: 'supervisor@gmail.com',
    equipmentInvolved: 'Circuit breaker panel CB-01',
    actions: [
      {
        id: 'ACT-014',
        action: 'Full electrical audit of control room',
        assignedTo: 'Electrical Engineer',
        dueDate: 'Mar 09, 2026',
        status: 'In Progress',
      },
      {
        id: 'ACT-015',
        action: 'Replace faulty circuit breaker panel',
        assignedTo: 'Maintenance Lead',
        dueDate: 'Mar 07, 2026',
        status: 'Completed',
      },
    ],
    comments: [],
  },
  {
    id: 'HAZ-0019',
    type: 'Hazard',
    category: 'Inadequate Ventilation in Confined Space',
    description: 'Air quality tests in underground tank showed oxygen levels below safe threshold. Ventilation fans not operational. All confined space entry permits suspended until resolved.',
    location: 'Refinery Site A - Underground Tank',
    risk: 'High',
    status: 'Open',
    dateReported: '01 Mar 2026\n09:30 AM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'Ventilation fans, Air quality monitor',
    actions: [],
    comments: [],
  },
  {
    id: 'INC-0020',
    type: 'Incident',
    category: 'PPE Failure During Welding Operation',
    description: 'Welding helmet auto-darkening feature malfunctioned during welding operation. Welder experienced brief flash exposure. Examined by on-site medic, no permanent damage.',
    location: 'Refinery Site A - Fabrication Bay',
    risk: 'Medium',
    status: 'Closed',
    dateReported: '01 Mar 2026\n03:15 PM',
    reportedBy: 'field@gmail.com',
    equipmentInvolved: 'Welding helmet WH-18',
    actions: [
      {
        id: 'ACT-016',
        action: 'Replace defective welding helmets',
        assignedTo: 'Safety Officer',
        dueDate: 'Mar 03, 2026',
        status: 'Completed',
      },
      {
        id: 'ACT-017',
        action: 'Audit all PPE inventory',
        assignedTo: 'HSE Manager',
        dueDate: 'Mar 08, 2026',
        status: 'Completed',
      },
    ],
    comments: [],
  },
];

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to load saved comments from localStorage
  const loadSavedComments = (): Record<string, Comment[]> => {
    try {
      const saved = localStorage.getItem('aegix_report_comments');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  // Helper to save comments to localStorage
  const saveCommentsToStorage = (reportId: string, comments: Comment[]) => {
    try {
      const saved = loadSavedComments();
      saved[reportId] = comments;
      localStorage.setItem('aegix_report_comments', JSON.stringify(saved));
    } catch (err) {
      console.error('Failed to save comments to localStorage:', err);
    }
  };

  // Merge saved comments into fetched reports
  const mergeWithSavedComments = (fetchedReports: Report[]): Report[] => {
    const saved = loadSavedComments();
    return fetchedReports.map(report => {
      const savedComments = saved[report.id];
      if (savedComments && savedComments.length > 0) {
        // Merge: add saved comments that aren't already in the report
        const existingIds = new Set(report.comments.map(c => c.id));
        const newComments = savedComments.filter(c => !existingIds.has(c.id));
        return { ...report, comments: [...newComments, ...report.comments] };
      }
      return report;
    });
  };

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getReports();
      setReports(mergeWithSavedComments(data));
    } catch (err) {
      console.error('Failed to fetch reports from API, using fallback data:', err);
      setError('Failed to load reports from server');
      // Fallback to hardcoded data so the UI still works
      setReports(mergeWithSavedComments(initialReports));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchReports();
    } else {
      setLoading(false);
    }
  }, [fetchReports]);

  const closeReport = async (reportId: string) => {
    // Find the report to get its backend _id
    const report = reports.find(r => r.id === reportId);
    const backendId = report?._id;

    // Optimistic update
    setReports(prev =>
      prev.map(r =>
        r.id === reportId ? { ...r, status: 'Closed' as ReportStatus } : r
      )
    );

    if (backendId) {
      try {
        await reportService.closeReport(backendId);
      } catch (err) {
        console.error('Failed to close report on server:', err);
        // Revert on failure
        fetchReports();
      }
    }
  };

  const addComment = async (reportId: string, text: string, role: 'admin' | 'supervisor') => {
    const report = reports.find(r => r.id === reportId);
    const backendId = report?._id;

    // Optimistic update
    const newComment: Comment = {
      id: `CMT-${Date.now()}`,
      author: role === 'supervisor' ? 'John Matthew' : 'Peter Omorogbolahan',
      role: role === 'supervisor' ? 'Supervisor' : 'Admin',
      text,
      timestamp: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }) + ', ' + new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          const updatedComments = [newComment, ...r.comments];
          // Persist to localStorage
          saveCommentsToStorage(reportId, updatedComments);
          return { ...r, comments: updatedComments };
        }
        return r;
      })
    );

    if (backendId) {
      try {
        await reportService.addComment(backendId, text, role);
      } catch (err) {
        console.error('Failed to add comment on server:', err);
      }
    }
  };

  const addAction = async (
    reportId: string,
    actionData: {
      actionTitle: string;
      assignedTo: string;
      dueDate: string;
      priority: string;
      description: string;
    }
  ) => {
    const report = reports.find(r => r.id === reportId);
    const backendId = report?._id;

    // Optimistic update
    const newActionId = `ACT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
    };

    const newAction: Action = {
      id: newActionId,
      action: actionData.actionTitle,
      assignedTo: actionData.assignedTo,
      dueDate: formatDate(actionData.dueDate),
      status: 'Open',
    };

    setReports(prev =>
      prev.map(r =>
        r.id === reportId
          ? { ...r, actions: [...r.actions, newAction] }
          : r
      )
    );

    if (backendId) {
      try {
        await reportService.addAction(backendId, actionData);
      } catch (err) {
        console.error('Failed to add action on server:', err);
      }
    }
  };

  return (
    <ReportsContext.Provider value={{ reports, loading, error, refreshReports: fetchReports, closeReport, addComment, addAction }}>
      {children}
    </ReportsContext.Provider>
  );
};
