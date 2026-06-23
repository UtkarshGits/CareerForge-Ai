export interface College {
  name: string;
  shortName: string;
  location: "Noida" | "Greater Noida" | "Delhi" | "Ghaziabad" | "Meerut";
  courses: string[];
  fees: { [course: string]: string }; // e.g. { "B.Tech CSE": "₹1.5L/year", "MBA": "₹2.0L/year" }
  eligibility: string;
  avgPackage: string;
  highestPackage: string;
  recruiters: string[];
  description: string;
  highlights: string[];
}

export const collegesData: College[] = [
  // DELHI
  {
    name: "Indian Institute of Technology Delhi",
    shortName: "IIT Delhi",
    location: "Delhi",
    courses: ["B.Tech CSE", "B.Tech ECE", "M.Tech", "Ph.D."],
    fees: {
      "B.Tech CSE": "₹2.2L/year",
      "B.Tech ECE": "₹2.2L/year",
      "M.Tech": "₹1.5L/year"
    },
    eligibility: "JEE Advanced (Qualified) + 12th class with 75% marks",
    avgPackage: "₹24.0 LPA",
    highestPackage: "₹2.0 Cr per year (International)",
    recruiters: ["Google", "Microsoft", "Uber", "Apple", "Rubrik", "Optiver"],
    description: "IIT Delhi is a premier public research university and institute of technology, consistently ranked among the top engineering colleges in India.",
    highlights: ["Ranked #2 in NIRF Engineering", "Extremely strong global alumni network", "World-class research laboratories and incubation centers"]
  },
  {
    name: "Delhi Technological University",
    shortName: "DTU Delhi",
    location: "Delhi",
    courses: ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "MBA", "MCA"],
    fees: {
      "B.Tech CSE": "₹2.19L/year",
      "B.Tech IT": "₹2.19L/year",
      "MBA": "₹2.12L/year",
      "MCA": "₹1.80L/year"
    },
    eligibility: "JEE Main rank via JAC Delhi counselling + 60% in PCM in 12th",
    avgPackage: "₹15.3 LPA",
    highestPackage: "₹1.2 Cr per year",
    recruiters: ["Amazon", "Google", "Zomato", "Swiggy", "Paytm", "Microsoft", "Adobe"],
    description: "Formerly known as Delhi College of Engineering (DCE), DTU is renowned for its vast campus, excellent campus culture, and exceptional placement statistics.",
    highlights: ["Strong focus on coding culture", "85% Delhi quota in admissions", "Annual cultural fest Engifest is one of North India's largest"]
  },
  {
    name: "Netaji Subhas University of Technology",
    shortName: "NSUT Delhi",
    location: "Delhi",
    courses: ["B.Tech CSE", "B.Tech ECE", "MBA"],
    fees: {
      "B.Tech CSE": "₹2.29L/year",
      "B.Tech ECE": "₹2.29L/year",
      "MBA": "₹2.10L/year"
    },
    eligibility: "JEE Main rank via JAC Delhi counselling + 60% in PCM in 12th",
    avgPackage: "₹16.0 LPA",
    highestPackage: "₹1.25 Cr per year",
    recruiters: ["Microsoft", "Texas Instruments", "Qualcomm", "Apple", "Goldman Sachs"],
    description: "NSUT is a prestigious state university in Dwarka, Delhi. It is highly sought after for core hardware companies as well as premium software giants.",
    highlights: ["Lush green 145-acre campus in Dwarka", "Exceptional placements in tech and finance roles", "Active student societies and coding clubs"]
  },
  {
    name: "Indraprastha Institute of Information Technology Delhi",
    shortName: "IIIT Delhi",
    location: "Delhi",
    courses: ["B.Tech CSE", "B.Tech ECE", "M.Tech", "Ph.D."],
    fees: {
      "B.Tech CSE": "₹4.5L/year",
      "B.Tech ECE": "₹4.5L/year",
      "M.Tech": "₹3.0L/year"
    },
    eligibility: "JEE Main rank via JAC Delhi counselling + 70% in 12th math",
    avgPackage: "₹20.5 LPA",
    highestPackage: "₹51.0 LPA (Domestic)",
    recruiters: ["Adobe", "Qualcomm", "Goldman Sachs", "Google", "Facebook", "NVIDIA"],
    description: "IIIT Delhi is a research-oriented IT institute created by an act of the Delhi Government. It boasts a modern campus and highly qualified research faculty.",
    highlights: ["World-class faculty with Ph.D. degrees from international universities", "Heavy emphasis on research, publication, and AI/ML technologies", "State-of-the-art infrastructure and lab facilities"]
  },
  {
    name: "Maharaja Agrasen Institute of Technology",
    shortName: "MAIT Delhi",
    location: "Delhi",
    courses: ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "MBA"],
    fees: {
      "B.Tech CSE": "₹1.4L/year",
      "B.Tech IT": "₹1.4L/year",
      "MBA": "₹1.3L/year"
    },
    eligibility: "JEE Main rank via IPU CET / GGSIPU counselling + 55% in 12th PCM",
    avgPackage: "₹8.5 LPA",
    highestPackage: "₹57.0 LPA",
    recruiters: ["Amazon", "TCS", "Cognizant", "Infosys", "Wipro", "Accenture"],
    description: "Affiliated with Guru Gobind Singh Indraprastha University (GGSIPU), MAIT is one of the top private engineering colleges in Delhi, known for consistent placement records.",
    highlights: ["Ranked #1 private engineering college under GGSIPU", "Excellent location in Rohini, Delhi", "Vibrant tech communities and coding clubs"]
  },
  {
    name: "Jamia Millia Islamia",
    shortName: "JMI Delhi",
    location: "Delhi",
    courses: ["B.Tech CSE", "MBA", "MCA", "BCA"],
    fees: {
      "B.Tech CSE": "₹16,000/year",
      "MBA": "₹25,000/year",
      "MCA": "₹8,500/year",
      "BCA": "₹15,000/year"
    },
    eligibility: "JEE Main rank (for B.Tech) / JMI Entrance exam + 50% in 12th",
    avgPackage: "₹9.0 LPA",
    highestPackage: "₹25.0 LPA",
    recruiters: ["L&T", "Siemens", "Samsung", "TCS", "Wipro", "Honda"],
    description: "JMI is a central university in New Delhi, recognized for its historic heritage, high-quality central facilities, and exceptionally low fee structure.",
    highlights: ["Central University status", "Highest ROI (Return on Investment) due to minimal fees", "Diverse cultural exposure and large campus library"]
  },

  // NOIDA
  {
    name: "Amity University Noida",
    shortName: "Amity Noida",
    location: "Noida",
    courses: ["B.Tech CSE", "B.Tech ECE", "MBA", "MCA", "BCA", "BBA"],
    fees: {
      "B.Tech CSE": "₹3.5L/year",
      "MBA": "₹3.8L/year",
      "MCA": "₹2.2L/year",
      "BCA": "₹1.8L/year",
      "BBA": "₹2.5L/year"
    },
    eligibility: "Direct admission on 12th marks or Amity JEE score",
    avgPackage: "₹6.5 LPA",
    highestPackage: "₹61.0 LPA",
    recruiters: ["Wipro", "Cognizant", "Shell", "DXC Technology", "Capgemini", "Accenture"],
    description: "Amity University Noida is a massive private university offering high-tech infrastructure, global exposure, and extensive campus recruitment opportunities.",
    highlights: ["State-of-the-art campus with high-end sports facilities", "Study Abroad options with global partner universities", "Large scale placement drives with hundreds of recruiters"]
  },
  {
    name: "JSS Academy of Technical Education",
    shortName: "JSS Noida",
    location: "Noida",
    courses: ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "MBA", "MCA"],
    fees: {
      "B.Tech CSE": "₹1.30L/year",
      "B.Tech IT": "₹1.30L/year",
      "MBA": "₹1.20L/year",
      "MCA": "₹1.10L/year"
    },
    eligibility: "JEE Main rank / UPTAC Counselling + 12th class with 45% (PCM)",
    avgPackage: "₹6.5 LPA",
    highestPackage: "₹40.0 LPA",
    recruiters: ["Adobe", "Cisco", "TCS", "Accenture", "Wipro", "Samsung"],
    description: "JSS Noida is one of the leading institutions under AKTU (Dr. A.P.J. Abdul Kalam Technical University) and is highly preferred by engineering aspirants in Noida.",
    highlights: ["Excellent location in Sector 62, Noida (IT Hub)", "Consistently top-ranked under AKTU colleges", "Dedicated placement cell with good alumni network"]
  },
  {
    name: "Jaypee Institute of Information Technology",
    shortName: "JIIT Noida",
    location: "Noida",
    courses: ["B.Tech CSE", "B.Tech ECE", "M.Tech", "MBA", "BCA"],
    fees: {
      "B.Tech CSE": "₹2.70L/year",
      "B.Tech ECE": "₹2.70L/year",
      "MBA": "₹3.00L/year",
      "BCA": "₹1.50L/year"
    },
    eligibility: "JEE Main Rank or 12th Marks merit basis + 60% in PCM in 12th",
    avgPackage: "₹11.0 LPA",
    highestPackage: "₹82.8 LPA",
    recruiters: ["Amazon", "Morgan Stanley", "Adobe", "Qualcomm", "Goldman Sachs", "Intuit"],
    description: "JIIT Noida is a deemed university under the Jaypee Group. It is highly valued for its rigorous academic curriculum and superior placements in core IT firms.",
    highlights: ["Exceptional placement statistics for computer science engineering", "Well-equipped coding labs and academic infrastructure", "Separate campus at Sector 62 and Sector 128"]
  },
  {
    name: "Institute of Management Studies Noida",
    shortName: "IMS Noida",
    location: "Noida",
    courses: ["BCA", "BBA", "MBA", "MCA"],
    fees: {
      "BCA": "₹1.5L/year",
      "BBA": "₹1.6L/year",
      "MBA": "₹2.0L/year",
      "MCA": "₹1.4L/year"
    },
    eligibility: "12th board marks + IMS Entrance Test (Joint Admission Test)",
    avgPackage: "₹5.0 LPA",
    highestPackage: "₹12.0 LPA",
    recruiters: ["Deloitte", "Capgemini", "Wipro", "Tech Mahindra", "Axis Bank"],
    description: "IMS Noida is a premier institute focused on Management, IT, and Law courses, affiliated with CCS University, Meerut, and approved by AICTE.",
    highlights: ["Focus on industrial training and live projects", "Centrally located in Sector 62, Noida", "Strong placement cell with personality development classes"]
  },

  // GREATER NOIDA
  {
    name: "Galgotias University",
    shortName: "Galgotias Univ.",
    location: "Greater Noida",
    courses: ["B.Tech CSE", "MBA", "MCA", "BCA", "BBA"],
    fees: {
      "B.Tech CSE": "₹1.6L/year",
      "MBA": "₹1.5L/year",
      "MCA": "₹1.1L/year",
      "BCA": "₹90,000/year",
      "BBA": "₹1.0L/year"
    },
    eligibility: "12th board marks (Minimum 50%) or CUET score",
    avgPackage: "₹6.8 LPA",
    highestPackage: "₹35.0 LPA",
    recruiters: ["Infosys", "Cognizant", "Wipro", "TCS", "Capgemini", "DXC Technology"],
    description: "Galgotias University is a private university in Greater Noida, known for its high enrollment rates, active campus life, and multiple tie-ups with tech companies.",
    highlights: ["Vibrant campus life with 30+ student clubs", "Collaborations with IBM, Oracle, and Intel for curriculum", "Large scale job fairs and recruitment drives"]
  },
  {
    name: "GL Bajaj Institute of Technology and Management",
    shortName: "GL Bajaj",
    location: "Greater Noida",
    courses: ["B.Tech CSE", "B.Tech IT", "MBA", "MCA"],
    fees: {
      "B.Tech CSE": "₹1.4L/year",
      "B.Tech IT": "₹1.4L/year",
      "MBA": "₹1.3L/year",
      "MCA": "₹1.2L/year"
    },
    eligibility: "JEE Main rank / UPTAC Counselling + 12th class with 45% (PCM)",
    avgPackage: "₹7.1 LPA",
    highestPackage: "₹58.0 LPA",
    recruiters: ["Palo Alto Networks", "Bosch", "Amazon", "Capgemini", "LTIMindtree", "Cognizant"],
    description: "GL Bajaj is one of the highest-rated private colleges affiliated with AKTU in Greater Noida. It stands out for its high placement rates and training programs.",
    highlights: ["Top-ranked private engineering institute in Greater Noida under AKTU", "Excellent placement cell with dedicated soft skills training", "Modern robotics and coding labs"]
  },
  {
    name: "Sharda University",
    shortName: "Sharda Univ.",
    location: "Greater Noida",
    courses: ["B.Tech CSE", "MBA", "MCA", "BCA", "BBA"],
    fees: {
      "B.Tech CSE": "₹2.2L/year",
      "MBA": "₹2.5L/year",
      "MCA": "₹1.5L/year",
      "BCA": "₹1.2L/year"
    },
    eligibility: "Sharda University Admission Test (SUAT) / JEE Main",
    avgPackage: "₹6.0 LPA",
    highestPackage: "₹48.0 LPA",
    recruiters: ["Sleepwell", "Amazon", "Wipro", "Cognizant", "TCS", "HDFC Bank"],
    description: "Sharda University is a popular private university with a global student body representing 80+ countries. It features diverse academic tracks.",
    highlights: ["Global exposure with students from all around the world", "20-acre health campus with Sharda Hospital", "Strong research capabilities and international faculty exchange"]
  },
  {
    name: "Shiv Nadar University",
    shortName: "SNU Greater Noida",
    location: "Greater Noida",
    courses: ["B.Tech CSE", "B.Tech ECE", "MBA"],
    fees: {
      "B.Tech CSE": "₹4.0L/year",
      "B.Tech ECE": "₹4.0L/year",
      "MBA": "₹5.0L/year"
    },
    eligibility: "SNUSAT + APT exams / JEE Main percentile + Interview",
    avgPackage: "₹12.5 LPA",
    highestPackage: "₹58.0 LPA",
    recruiters: ["Goldman Sachs", "Microsoft", "Adobe", "Dell", "HCL", "Cognizant"],
    description: "Founded by HCL founder Shiv Nadar, SNU is a research-centric, multidisciplinary private university set on a sprawling 286-acre residential campus.",
    highlights: ["Outstanding multidisciplinary curriculum (Major/Minor system)", "Fully residential campus with premier sports facilities", "Strong research funding and student startup incubation"]
  },
  {
    name: "Noida Institute of Engineering and Technology",
    shortName: "NIET Gr. Noida",
    location: "Greater Noida",
    courses: ["B.Tech CSE", "B.Tech IT", "MBA", "MCA", "B.Pharm"],
    fees: {
      "B.Tech CSE": "₹1.3L/year",
      "MBA": "₹1.2L/year",
      "MCA": "₹1.1L/year",
      "B.Pharm": "₹1.25L/year"
    },
    eligibility: "JEE Main rank / UPTAC Counselling + 12th class with 45% (PCM)",
    avgPackage: "₹6.1 LPA",
    highestPackage: "₹44.0 LPA",
    recruiters: ["Capgemini", "TCS", "Virtusa", "Wipro", "Cognizant", "HCL"],
    description: "NIET is the first private autonomous institute in Greater Noida. It holds accreditation from NBA and NAAC and is associated with various corporate training labs.",
    highlights: ["First private autonomous college in Uttar Pradesh", "Authorized training hubs for Apple, AWS, Salesforce, and Cisco", "Strong emphasis on industry-readiness training"]
  },
  {
    name: "Bennett University",
    shortName: "Bennett Univ.",
    location: "Greater Noida",
    courses: ["B.Tech CSE", "BBA", "BCA", "MBA"],
    fees: {
      "B.Tech CSE": "₹3.6L/year",
      "BBA": "₹2.5L/year",
      "BCA": "₹1.5L/year",
      "MBA": "₹4.0L/year"
    },
    eligibility: "12th board marks (min 60% PCM) or JEE Main score",
    avgPackage: "₹8.5 LPA",
    highestPackage: "₹1.2 Cr per year",
    recruiters: ["Adobe", "Amazon", "Microsoft", "TCS", "Cognizant", "Times Internet"],
    description: "Initiated by The Times Group, Bennett University is a premium residential university offering top-tier infrastructure and a high level of corporate exposure.",
    highlights: ["Backed by India's largest media house (Times Group)", "Supercomputing Lab powered by NVIDIA", "Modern student housing and comprehensive sports complex"]
  },

  // GHAZIABAD
  {
    name: "Ajay Kumar Garg Engineering College",
    shortName: "AKGEC Ghaziabad",
    location: "Ghaziabad",
    courses: ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "MCA"],
    fees: {
      "B.Tech CSE": "₹1.4L/year",
      "B.Tech IT": "₹1.4L/year",
      "MCA": "₹1.2L/year"
    },
    eligibility: "JEE Main rank / UPTAC Counselling + 12th class with 45% (PCM)",
    avgPackage: "₹6.2 LPA",
    highestPackage: "₹1.13 Cr per year (International)",
    recruiters: ["Amazon", "TCS", "Infosys", "Wipro", "Cognizant", "L&T Infotech"],
    description: "AKGEC is highly regarded as one of the best engineering colleges affiliated with AKTU. It is well-known for its strict academic discipline and excellent lab facilities.",
    highlights: ["Industrial Robotics and Automation Centers", "Consistently wins AKTU academic awards", "High placements in software development and automation engineering"]
  },
  {
    name: "KIET Group of Institutions",
    shortName: "KIET Ghaziabad",
    location: "Ghaziabad",
    courses: ["B.Tech CSE", "B.Tech IT", "MCA", "MBA"],
    fees: {
      "B.Tech CSE": "₹1.38L/year",
      "MCA": "₹1.2L/year",
      "MBA": "₹1.25L/year"
    },
    eligibility: "JEE Main rank / UPTAC Counselling + 12th class with 45% (PCM)",
    avgPackage: "₹6.8 LPA",
    highestPackage: "₹48.4 LPA",
    recruiters: ["Palo Alto Networks", "Capgemini", "Cognizant", "Wipro", "TCS", "HCL"],
    description: "KIET is a leading engineering institute affiliated with AKTU, located in Ghaziabad. It places strong emphasis on student innovation and entrepreneurship.",
    highlights: ["NBA accredited courses and NAAC 'A+' grade", "Active technology business incubator (TBI) on campus", "Intense training on placement preparation and soft skills"]
  },
  {
    name: "ABES Engineering College",
    shortName: "ABES Ghaziabad",
    location: "Ghaziabad",
    courses: ["B.Tech CSE", "B.Tech ECE", "MBA", "MCA"],
    fees: {
      "B.Tech CSE": "₹1.45L/year",
      "MBA": "₹1.3L/year",
      "MCA": "₹1.25L/year"
    },
    eligibility: "JEE Main rank / UPTAC Counselling + 12th class with 45% (PCM)",
    avgPackage: "₹6.0 LPA",
    highestPackage: "₹47.0 LPA",
    recruiters: ["TCS", "Wipro", "Cisco", "Capgemini", "Accenture", "Cognizant"],
    description: "ABES EC is an engineering and management institute affiliated with AKTU. It is located on NH-24 in Ghaziabad and offers modern labs and training facilities.",
    highlights: ["Lush green campus with excellent connectivity", "Dedicated Center for Career Planning and Development", "Strong coding culture and hackathon participations"]
  },
  {
    name: "SRM Institute of Science and Technology, NCR Campus",
    shortName: "SRM Ghaziabad",
    location: "Ghaziabad",
    courses: ["B.Tech CSE", "BCA", "MBA", "MCA"],
    fees: {
      "B.Tech CSE": "₹2.5L/year",
      "BCA": "₹1.1L/year",
      "MBA": "₹1.8L/year",
      "MCA": "₹1.3L/year"
    },
    eligibility: "SRMJEEE score or JEE Main rank + 12th class marks",
    avgPackage: "₹7.5 LPA",
    highestPackage: "₹42.0 LPA",
    recruiters: ["Amazon", "Siemens", "PayPal", "Wipro", "TCS", "Cognizant"],
    description: "The NCR Campus of SRM IST offers the same curriculum and degree as the Chennai main campus, with good placements and proximity to Delhi.",
    highlights: ["Deemed University degree under SRM IST Chennai", "Opportunities for semester abroad and Chennai campus recruitment", "Modern residential facility"]
  },

  // MEERUT
  {
    name: "Meerut Institute of Engineering and Technology",
    shortName: "MIET Meerut",
    location: "Meerut",
    courses: ["B.Tech CSE", "B.Tech ECE", "MBA", "MCA"],
    fees: {
      "B.Tech CSE": "₹1.10L/year",
      "MBA": "₹95,000/year",
      "MCA": "₹90,000/year"
    },
    eligibility: "JEE Main rank / UPTAC Counselling or merit-based direct entry",
    avgPackage: "₹5.5 LPA",
    highestPackage: "₹28.0 LPA",
    recruiters: ["TCS", "Wipro", "Hexaware", "Infosys", "Cognizant", "Collabera"],
    description: "MIET is the flagship institute under AKTU in the Meerut region. It is recognized for its outstanding performance in pharmacy and engineering programs.",
    highlights: ["Oldest and largest private engineering college in Meerut", "Strong placement record in service sector companies", "Well-equipped pharmacy labs and research center"]
  },
  {
    name: "Chaudhary Charan Singh University",
    shortName: "CCSU Meerut",
    location: "Meerut",
    courses: ["BCA", "BBA", "MCA", "MBA"],
    fees: {
      "BCA": "₹40,000/year",
      "BBA": "₹45,000/year",
      "MCA": "₹60,000/year",
      "MBA": "₹70,000/year"
    },
    eligibility: "Merit-based admission on 12th marks or graduation marks",
    avgPackage: "₹4.5 LPA",
    highestPackage: "₹15.0 LPA",
    recruiters: ["HDFC Bank", "Wipro", "TCS", "ICICI Bank", "Tech Mahindra"],
    description: "CCSU is a famous state university in Meerut, serving the educational needs of western Uttar Pradesh with low-cost courses and a huge campus.",
    highlights: ["State University affiliation for regional colleges", "Large campus with affordable hostel accommodation", "Recognized sports achievements at national levels"]
  },
  {
    name: "Swami Vivekanand Subharti University",
    shortName: "Subharti Meerut",
    location: "Meerut",
    courses: ["B.Tech CSE", "MBA", "MCA", "BCA"],
    fees: {
      "B.Tech CSE": "₹90,000/year",
      "MBA": "₹1.1L/year",
      "MCA": "₹80,000/year",
      "BCA": "₹60,000/year"
    },
    eligibility: "Subharti Entrance Test or Merit + 12th class with 50%",
    avgPackage: "₹5.0 LPA",
    highestPackage: "₹18.0 LPA",
    recruiters: ["Info Edge", "Tech Mahindra", "Cognizant", "TCS", "HDFC Bank"],
    description: "Subharti University is a massive private university in Meerut, known for its diverse offering of professional courses, healthcare training, and a 1000-bed hospital.",
    highlights: ["Sprawling 250-acre campus", "Includes medical, dental, law, engineering, and nursing faculties", "Active entrepreneurship development cell"]
  },
  {
    name: "Shobhit Institute of Engineering and Technology",
    shortName: "Shobhit Meerut",
    location: "Meerut",
    courses: ["B.Tech CSE", "MBA", "MCA", "BCA"],
    fees: {
      "B.Tech CSE": "₹80,000/year",
      "MBA": "₹90,000/year",
      "MCA": "₹70,000/year",
      "BCA": "₹50,000/year"
    },
    eligibility: "12th board marks (Min 50%) or CUET score",
    avgPackage: "₹4.8 LPA",
    highestPackage: "₹12.0 LPA",
    recruiters: ["Biocon", "Wipro", "Tech Mahindra", "TCS", "Nestle"],
    description: "Shobhit University is a deemed-to-be university in Meerut, which focuses on technology-based learning, research publications, and agricultural engineering.",
    highlights: ["Pioneer in Agricultural Engineering in the region", "Strong research culture with international journals exposure", "Decent placement in agro-tech and software development companies"]
  }
];
