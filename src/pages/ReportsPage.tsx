import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { ReportDetailsModal } from '@/components/reports/ReportDetailsModal';

type ReportType = 'All' | 'Incidents' | 'Hazard';
type RiskLevel = 'High' | 'Medium' | 'Low';
type ReportStatus = 'Open' | 'In Progress' | 'Closed';
type ActionStatus = 'Open' | 'In Progress' | 'Completed';

interface Action {
  id: string;
  action: string;
  assignedTo: string;
  dueDate: string;
  status: ActionStatus;
}

interface Report {
  id: string;
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
}

export const ReportsPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ReportType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [reports, setReports] = useState<Report[]>([
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
    },
  ]);

  const types: { label: ReportType; count: number }[] = [
    { label: 'All', count: reports.length },
    { label: 'Incidents', count: reports.filter((r) => r.type === 'Incident').length },
    { label: 'Hazard', count: reports.filter((r) => r.type === 'Hazard').length },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesType = 
      selectedType === 'All' || 
      (selectedType === 'Incidents' && report.type === 'Incident') ||
      (selectedType === 'Hazard' && report.type === 'Hazard');
    const matchesSearch =
      searchQuery === '' ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.risk.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.status.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const handleCloseReport = (reportId: string) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId ? { ...report, status: 'Closed' as ReportStatus } : report
      )
    );
    setSelectedReport(null); // Close the modal
  };

  const handleAddAction = (
    reportId: string,
    actionData: {
      actionTitle: string;
      assignedTo: string;
      dueDate: string;
      priority: string;
      description: string;
    }
  ) => {
    // Generate a new action ID
    const newActionId = `ACT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    // Format the due date to match the existing format (e.g., "Feb 08, 2026")
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

    // Update the reports array with the new action
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? { ...report, actions: [...report.actions, newAction] }
          : report
      )
    );

    // Update selectedReport to reflect the new action immediately in the modal
    setSelectedReport(prevReport =>
      prevReport && prevReport.id === reportId
        ? { ...prevReport, actions: [...prevReport.actions, newAction] }
        : prevReport
    );
  };

  const getRiskBadge = (risk: RiskLevel) => {
    const styles = {
      High: 'bg-red-500 text-white',
      Medium: 'bg-orange-500 text-white',
      Low: 'bg-green-500 text-white',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[risk]}`}>
        {risk}
      </span>
    );
  };

  const getStatusText = (status: ReportStatus) => {
    const styles = {
      Open: 'text-[#FF3B30] font-medium',
      'In Progress': 'text-[#FF9500] font-medium',
      Closed: 'text-gray-500 font-medium',
    };

    return <span className={styles[status]}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Report"
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={true}
          userName="Peter Omorogbolahan"
          userRole="System Administrator"
          notificationCount={4}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8">
          <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6" data-aos="fade-down">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-gray-900">Reports List</h1>
                <div 
                  className="relative"
                  onMouseEnter={() => setShowHeaderTooltip(true)}
                  onMouseLeave={() => setShowHeaderTooltip(false)}
                >
                  <button 
                    onClick={() => setShowHeaderTooltip(!showHeaderTooltip)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  
                  {/* Tooltip */}
                  {showHeaderTooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/90 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
                      View and manage all submitted reports
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/90"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-3 mb-6" data-aos="fade-up" data-aos-delay="50">
              {types.map((type) => (
                <button
                  key={type.label}
                  onClick={() => setSelectedType(type.label)}
                  className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                    selectedType === type.label
                      ? 'bg-orange-50 text-[#C24438] border border-[#C24438]'
                      : 'bg-[#FFF9F5] text-gray-600 hover:bg-[#FFFEFB]'
                  }`}
                >
                  {type.label}
                  <span
                    className={`ml-1 px-1.5 md:px-2 py-0.5 rounded-full text-xs ${
                      selectedType === type.label
                        ? 'bg-[#C24438] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {type.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="flex flex-row gap-3 mb-6" data-aos="fade-up" data-aos-delay="100">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by incident, hazard, Risk level, status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F5] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C24438] focus:border-transparent text-sm"
                />
              </div>
              <button className="px-4 py-2.5 bg-[#FFF9F5] border border-gray-200 rounded-lg hover:bg-[#FFFEFB] transition-colors flex items-center gap-2 text-sm font-medium text-gray-700 justify-center whitespace-nowrap">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter
              </button>
            </div>

            {/* Reports Table */}
            <div className="overflow-x-auto -mx-3 md:mx-0" data-aos="fade-up" data-aos-delay="150">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-[#FFF9F5] border-b border-gray-200">
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Report ID</th>
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500 hidden md:table-cell">
                        Type
                      </th>
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Category</th>
                      <th className="hidden lg:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Location
                      </th>
                      <th className="text-left py-2 md:py-3 px-3 md:px-4 text-xs md:text-sm font-medium text-gray-500">Risk</th>
                      <th className="hidden md:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="hidden lg:table-cell text-left py-3 px-4 text-sm font-medium text-gray-500">
                        Date Reported
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        className="bg-[#FFFAF5] hover:bg-[#FFFEFB] transition-colors border-l-4 border-l-[#C24438] border-b border-b-gray-200 cursor-pointer"
                      >
                        <td className="py-3 md:py-4 px-3 md:px-4">
                          <div className="font-medium text-gray-900 text-xs md:text-sm">{report.id}</div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4 hidden md:table-cell">
                          <div className="text-gray-900 text-sm">{report.type}</div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4">
                          <div className="text-gray-600 text-xs md:text-sm">{report.category}</div>
                        </td>
                        <td className="hidden lg:table-cell py-4 px-4">
                          <div className="text-gray-600">{report.location}</div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4">{getRiskBadge(report.risk)}</td>
                        <td className="hidden md:table-cell py-4 px-4">{getStatusText(report.status)}</td>
                        <td className="hidden lg:table-cell py-4 px-4">
                          <div className="text-gray-600 text-sm whitespace-pre-line">{report.dateReported}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        </main>
      </div>

      {/* Report Details Modal */}
      <ReportDetailsModal
        isOpen={selectedReport !== null}
        onClose={() => setSelectedReport(null)}
        onCloseReport={handleCloseReport}
        onAddAction={handleAddAction}
        report={selectedReport}
      />
    </div>
  );
};
