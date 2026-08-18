import type { Community } from '@/types'

export const DEPARTMENTS = [
  'All Departments',
  'Student Development and Welfare (SDW)',
  'COHORT Special',
  'AIML Department',
  'CIVIL Department',
  'Computer Department',
  'Computer Regional Department',
  'ENTC Department',
  'IT Department',
  'Mechanical Department',
] as const

function c(partial: Omit<Community, 'id' | 'memberCount'> & { memberCount?: number }): Community {
  return {
    id: `com-${partial.handle}`,
    memberCount: partial.memberCount ?? Math.floor(40 + Math.random() * 200),
    subscribed: false,
    ...partial,
  }
}

export const seedCommunities: Community[] = [
  // SDW
  c({ handle: 'iicpccoe', name: "Institution's Innovation Council", description: 'Fostering innovation, incubation and entrepreneurship culture on campus.', department: 'Student Development and Welfare (SDW)' }),
  c({ handle: 'isrpccoe', name: 'Institutional Social Responsibility', description: 'Campus-wide social responsibility drives and outreach programs.', department: 'Student Development and Welfare (SDW)' }),
  c({ handle: 'ircpccoe', name: 'International Relations Cell', description: 'Exchange programs, international collaborations and global exposure.', department: 'Student Development and Welfare (SDW)' }),
  c({ handle: 'nsspccoe', name: 'National Service Scheme', description: 'Community service, blood donation camps, and social welfare activities.', department: 'Student Development and Welfare (SDW)' }),
  c({ handle: 'artcirclepccoe', name: 'PCCOE Art Circle', description: 'A creative space for painting, sketching, and visual arts on campus.', department: 'Student Development and Welfare (SDW)' }),
  c({ handle: 'sportscellpccoe', name: 'PCCOE Sports Cell', description: 'Organizing inter-college tournaments and campus sports events.', department: 'Student Development and Welfare (SDW)' }),
  c({ handle: 'sdwpccoe', name: 'Student Development and Welfare', description: 'The umbrella body coordinating student welfare initiatives.', department: 'Student Development and Welfare (SDW)' }),
  c({ handle: 'swadcellpccoe', name: 'Students Welfare Grievance Handling Cell', description: 'A dedicated cell for handling student grievances confidentially.', department: 'Student Development and Welfare (SDW)' }),
  // COHORT Special
  c({ handle: 'cohort', name: 'COHORT — A Social Platform for PCCOE', description: 'The official home of Cohort. Updates, announcements, and behind-the-scenes.', department: 'COHORT Special', memberCount: 410, subscribed: true }),
  c({ handle: 'studygrouppccoe', name: 'PCCOE Study Groups', description: 'Find study partners and exam-prep groups by subject and semester.', department: 'COHORT Special', isNew: true }),
  c({ handle: 'pccoetechclub', name: 'PCCOE Tech Club', description: 'Cross-department tech talks, workshops and hackathon squads.', department: 'COHORT Special' }),
  c({ handle: 'photography', name: 'Photography Club', description: 'Campus photo walks, gear talk, and photo-of-the-week contests.', department: 'COHORT Special', isNew: true }),
  c({ handle: 'pccoeplacements', name: 'Placement Preparation Club', description: 'Mock interviews, resume reviews, and placement drive updates.', department: 'COHORT Special' }),
  // AIML
  c({ handle: 'aaai', name: 'AAAI Student Chapter', description: 'AI research talks, paper reading groups and competitions.', department: 'AIML Department' }),
  c({ handle: 'abhyudayapccoe', name: 'Abhyudaya E-Cell', description: 'Entrepreneurship cell running startup bootcamps and pitch events.', department: 'AIML Department' }),
  c({ handle: 'aimsapccoe', name: 'AIML Student Association', description: 'The official student association for the AIML department.', department: 'AIML Department' }),
  c({ handle: 'gfgpccoe', name: 'Geeks For Geeks', description: 'Competitive programming, DSA sessions and coding contests.', department: 'AIML Department' }),
  c({ handle: 'higherstudies', name: 'Higher Studies Club CAT/GMAT', description: 'Guidance and prep resources for CAT and GMAT aspirants.', department: 'AIML Department' }),
  c({ handle: 'higherstudiespccoe', name: 'Higher Studies Club UPSC/MPSC', description: 'Guidance and prep resources for UPSC and MPSC aspirants.', department: 'AIML Department' }),
  c({ handle: 'ieeecs', name: 'IEEE Computer Society', description: 'Talks and workshops on computing research and emerging tech.', department: 'AIML Department' }),
  c({ handle: 'innspccoe', name: 'International Neural Networks Society', description: 'Deep learning research group and reading circle.', department: 'AIML Department' }),
  c({ handle: 'ieeepccoe', name: 'PCCOE IEEE Computational Intelligence Society', description: 'Computational intelligence talks, projects and competitions.', department: 'AIML Department' }),
  // CIVIL
  c({ handle: 'ciesapccoe', name: "Civil Engineering Student's Association", description: 'The official student association for the Civil department.', department: 'CIVIL Department' }),
  // Computer
  c({ handle: 'codechefpccoe', name: 'CodeChef', description: 'Weekly contests and competitive programming practice.', department: 'Computer Department' }),
  c({ handle: 'cesapccoe', name: 'Computer Engineering Student Association', description: 'The official student association for the Computer department.', department: 'Computer Department' }),
  c({ handle: 'gdgcpccoe', name: 'Google Developer Groups PCCoE', description: 'Study jams, dev talks and hands-on Google tech workshops.', department: 'Computer Department' }),
  c({ handle: 'iotclubpccoe', name: 'IOT Club', description: 'Hardware + embedded projects, sensor hacking and demo days.', department: 'Computer Department' }),
  c({ handle: 'lfdtpccoe', name: 'LFDT Student Chapter', description: 'Linux Foundation Decentralized Trust — blockchain and Web3 sessions.', department: 'Computer Department' }),
  c({ handle: 'owasppccoe', name: 'OWASP', description: 'Application security, CTFs and secure-coding workshops.', department: 'Computer Department' }),
  c({ handle: 'acmpccoe', name: 'PCCOE ACM Student Chapter', description: 'Talks, research and community for computing enthusiasts.', department: 'Computer Department' }),
  c({ handle: 'acmwpccoe', name: 'PCCOE ACMW Student Chapter', description: 'Championing women in computing through mentorship and events.', department: 'Computer Department' }),
  // Computer Regional
  c({ handle: 'cresapccoe', name: 'Computer Regional Student Association', description: 'The official student association for Computer Regional.', department: 'Computer Regional Department' }),
  // ENTC
  c({ handle: 'etsapccoe', name: 'ENTC Student Association', description: 'The official student association for the ENTC department.', department: 'ENTC Department' }),
  // IT
  c({ handle: 'itsapccoe', name: 'IEEE Student Branch', description: 'IEEE chapter activities, workshops and technical talks.', department: 'IT Department' }),
  c({ handle: 'mlscpccoe', name: 'Microsoft Learn Student Chapter', description: 'Microsoft tech workshops, certifications and cloud sessions.', department: 'IT Department' }),
  // Mechanical
  c({ handle: 'ishraepccoe', name: 'ISHRAE Student Chapter', description: 'HVAC&R talks, site visits and industry mentorship.', department: 'Mechanical Department' }),
  c({ handle: 'mesapccoe', name: 'Mechanical Engg Students Association', description: 'The official student association for the Mechanical department.', department: 'Mechanical Department' }),
  c({ handle: 'teamambush', name: 'Team Ambush', description: 'Off-road vehicle design team competing in BAJA SAE.', department: 'Mechanical Department' }),
  c({ handle: 'teamautomatons', name: 'Team Automatons', description: 'Robotics and automation competition team.', department: 'Mechanical Department' }),
  c({ handle: 'teamkratosracing', name: 'Team Kratos Racing', description: 'Formula-style race car design and fabrication team.', department: 'Mechanical Department' }),
  c({ handle: 'teammaverick', name: 'Team Maverick', description: 'Go-kart design and racing competition team.', department: 'Mechanical Department' }),
  c({ handle: 'teamredbaron', name: 'Team Red Baron', description: 'Aero-design and RC aircraft competition team.', department: 'Mechanical Department' }),
  c({ handle: 'teamsolariumindia', name: 'Team Solarium India', description: 'Solar vehicle design team.', department: 'Mechanical Department' }),
  c({ handle: 'ieopccoe', name: 'The Institution of Engineers PCCOE', description: 'Professional engineering body student chapter.', department: 'Mechanical Department' }),
]

export function getCommunityByHandle(handle: string): Community | undefined {
  return seedCommunities.find((c) => c.handle === handle)
}
