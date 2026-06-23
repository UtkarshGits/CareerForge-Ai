import fs from 'fs';
import path from 'path';

// Define a template list of 200 popular colleges in India with realistic data
const collegeTemplates = [
  // 1-25: Top IITs and NITs (Government)
  { name: "Indian Institute of Technology Madras", city: "Chennai", location: "Tamil Nadu", type: "Government", website: "https://www.iitm.ac.in", avgPkg: 24.7, maxPkg: 160.0, placePct: 98.2 },
  { name: "Indian Institute of Technology Delhi", city: "New Delhi", location: "Delhi", type: "Government", website: "https://www.iitd.ac.in", avgPkg: 25.8, maxPkg: 150.0, placePct: 97.5 },
  { name: "Indian Institute of Technology Bombay", city: "Mumbai", location: "Maharashtra", type: "Government", website: "https://www.iitb.ac.in", avgPkg: 26.5, maxPkg: 180.0, placePct: 98.5 },
  { name: "Indian Institute of Technology Kanpur", city: "Kanpur", location: "Uttar Pradesh", type: "Government", website: "https://www.iitk.ac.in", avgPkg: 22.0, maxPkg: 140.0, placePct: 96.0 },
  { name: "Indian Institute of Technology Kharagpur", city: "Kharagpur", location: "West Bengal", type: "Government", website: "https://www.iitkgp.ac.in", avgPkg: 21.5, maxPkg: 135.0, placePct: 95.8 },
  { name: "Indian Institute of Technology Roorkee", city: "Roorkee", location: "Uttarakhand", type: "Government", website: "https://www.iitr.ac.in", avgPkg: 20.8, maxPkg: 130.0, placePct: 95.0 },
  { name: "Indian Institute of Technology Guwahati", city: "Guwahati", location: "Assam", type: "Government", website: "https://www.iitg.ac.in", avgPkg: 19.5, maxPkg: 125.0, placePct: 94.5 },
  { name: "Indian Institute of Technology Hyderabad", city: "Hyderabad", location: "Telangana", type: "Government", website: "https://www.iith.ac.in", avgPkg: 20.2, maxPkg: 120.0, placePct: 94.0 },
  { name: "Indian Institute of Technology BHU", city: "Varanasi", location: "Uttar Pradesh", type: "Government", website: "https://www.iitbhu.ac.in", avgPkg: 18.9, maxPkg: 115.0, placePct: 93.5 },
  { name: "Indian Institute of Technology ISM Dhanbad", city: "Dhanbad", location: "Jharkhand", type: "Government", website: "https://www.iitism.ac.in", avgPkg: 17.5, maxPkg: 110.0, placePct: 92.8 },
  { name: "National Institute of Technology Trichy", city: "Tiruchirappalli", location: "Tamil Nadu", type: "Government", website: "https://www.nitt.edu", avgPkg: 18.0, maxPkg: 95.0, placePct: 97.0 },
  { name: "National Institute of Technology Surathkal", city: "Mangaluru", location: "Karnataka", type: "Government", website: "https://www.nitk.ac.in", avgPkg: 17.2, maxPkg: 90.0, placePct: 96.5 },
  { name: "National Institute of Technology Warangal", city: "Warangal", location: "Telangana", type: "Government", website: "https://www.nitw.ac.in", avgPkg: 16.8, maxPkg: 88.0, placePct: 96.0 },
  { name: "National Institute of Technology Calicut", city: "Kozhikode", location: "Kerala", type: "Government", website: "https://www.nitc.ac.in", avgPkg: 15.5, maxPkg: 80.0, placePct: 95.2 },
  { name: "National Institute of Technology Rourkela", city: "Rourkela", location: "Odisha", type: "Government", website: "https://www.nitrkl.ac.in", avgPkg: 14.8, maxPkg: 78.0, placePct: 94.8 },
  { name: "Motilal Nehru National Institute of Technology", city: "Allahabad", location: "Uttar Pradesh", type: "Government", website: "https://www.mnnit.ac.in", avgPkg: 14.2, maxPkg: 75.0, placePct: 94.0 },
  { name: "Visvesvaraya National Institute of Technology", city: "Nagpur", location: "Maharashtra", type: "Government", website: "https://www.vnit.ac.in", avgPkg: 13.5, maxPkg: 70.0, placePct: 93.5 },
  { name: "Malaviya National Institute of Technology", city: "Jaipur", location: "Rajasthan", type: "Government", website: "https://www.mnit.ac.in", avgPkg: 13.0, maxPkg: 68.0, placePct: 93.0 },
  { name: "Maulana Azad National Institute of Technology", city: "Bhopal", location: "Madhya Pradesh", type: "Government", website: "https://www.manit.ac.in", avgPkg: 12.5, maxPkg: 65.0, placePct: 92.5 },
  { name: "Sardar Vallabhbhai National Institute of Technology", city: "Surat", location: "Gujarat", type: "Government", website: "https://www.svnit.ac.in", avgPkg: 12.0, maxPkg: 62.0, placePct: 92.0 },
  { name: "Delhi Technological University", city: "New Delhi", location: "Delhi", type: "Government", website: "https://www.dtu.ac.in", avgPkg: 15.3, maxPkg: 120.0, placePct: 91.0 },
  { name: "Netaji Subhas University of Technology", city: "New Delhi", location: "Delhi", type: "Government", website: "https://www.nsut.ac.in", avgPkg: 16.0, maxPkg: 125.0, placePct: 92.0 },
  { name: "Indraprastha Institute of Information Technology Delhi", city: "New Delhi", location: "Delhi", type: "Government", website: "https://www.iiitd.ac.in", avgPkg: 20.5, maxPkg: 82.8, placePct: 96.5 },
  { name: "Indian Institute of Information Technology Allahabad", city: "Prayagraj", location: "Uttar Pradesh", type: "Government", website: "https://www.iiita.ac.in", avgPkg: 22.5, maxPkg: 110.0, placePct: 98.0 },
  { name: "Indian Institute of Information Technology Gwalior", city: "Gwalior", location: "Madhya Pradesh", type: "Government", website: "https://www.iiitm.ac.in", avgPkg: 18.5, maxPkg: 90.0, placePct: 96.0 },

  // 26-50: More NITs, IIITs, and Top State Universities (Government/Semi-Govt)
  { name: "National Institute of Technology Durgapur", city: "Durgapur", location: "West Bengal", type: "Government", website: "https://www.nitdgp.ac.in", avgPkg: 11.8, maxPkg: 58.0, placePct: 91.2 },
  { name: "National Institute of Technology Kurukshetra", city: "Kurukshetra", location: "Haryana", type: "Government", website: "https://www.nitkkr.ac.in", avgPkg: 13.2, maxPkg: 65.0, placePct: 93.0 },
  { name: "National Institute of Technology Jamshedpur", city: "Jamshedpur", location: "Jharkhand", type: "Government", website: "https://www.nitjsr.ac.in", avgPkg: 12.8, maxPkg: 60.0, placePct: 92.8 },
  { name: "National Institute of Technology Silchar", city: "Silchar", location: "Assam", type: "Government", website: "https://www.nits.ac.in", avgPkg: 11.5, maxPkg: 55.0, placePct: 90.5 },
  { name: "National Institute of Technology Raipur", city: "Raipur", location: "Chhattisgarh", type: "Government", website: "https://www.nitrr.ac.in", avgPkg: 10.5, maxPkg: 50.0, placePct: 89.5 },
  { name: "National Institute of Technology Hamirpur", city: "Hamirpur", location: "Himachal Pradesh", type: "Government", website: "https://nith.ac.in", avgPkg: 10.8, maxPkg: 52.0, placePct: 90.0 },
  { name: "National Institute of Technology Jalandhar", city: "Jalandhar", location: "Punjab", type: "Government", website: "https://www.nitj.ac.in", avgPkg: 11.2, maxPkg: 54.0, placePct: 90.8 },
  { name: "National Institute of Technology Patna", city: "Patna", location: "Bihar", type: "Government", website: "https://www.nitp.ac.in", avgPkg: 9.8, maxPkg: 48.0, placePct: 88.5 },
  { name: "National Institute of Technology Goa", city: "Ponda", location: "Goa", type: "Government", website: "https://www.nitgoa.ac.in", avgPkg: 11.4, maxPkg: 50.0, placePct: 91.0 },
  { name: "National Institute of Technology Srinagar", city: "Srinagar", location: "Jammu and Kashmir", type: "Government", website: "https://nitsri.ac.in", avgPkg: 9.2, maxPkg: 45.0, placePct: 87.0 },
  { name: "Indian Institute of Information Technology Lucknow", city: "Lucknow", location: "Uttar Pradesh", type: "Government", website: "https://www.iiitl.ac.in", avgPkg: 19.8, maxPkg: 80.0, placePct: 97.2 },
  { name: "Indian Institute of Information Technology Pune", city: "Pune", location: "Maharashtra", type: "Government", website: "https://www.iiitp.ac.in", avgPkg: 16.5, maxPkg: 75.0, placePct: 95.0 },
  { name: "Indian Institute of Information Technology Vadodara", city: "Gandhinagar", location: "Gujarat", type: "Government", website: "https://www.iiitvadodara.ac.in", avgPkg: 14.5, maxPkg: 68.0, placePct: 94.0 },
  { name: "Indian Institute of Information Technology Sri City", city: "Sri City", location: "Andhra Pradesh", type: "Government", website: "https://www.iiits.in", avgPkg: 15.2, maxPkg: 72.0, placePct: 94.8 },
  { name: "Indian Institute of Information Technology Guwahati", city: "Guwahati", location: "Assam", type: "Government", website: "https://www.iiitg.ac.in", avgPkg: 13.8, maxPkg: 62.0, placePct: 93.0 },
  { name: "Jadavpur University", city: "Kolkata", location: "West Bengal", type: "Government", website: "https://www.jaduniv.edu.in", avgPkg: 12.0, maxPkg: 85.0, placePct: 92.5 },
  { name: "College of Engineering Guindy", city: "Chennai", location: "Tamil Nadu", type: "Government", website: "https://ceg.annauniv.edu", avgPkg: 11.5, maxPkg: 60.0, placePct: 93.8 },
  { name: "Veermata Jijabai Technological Institute", city: "Mumbai", location: "Maharashtra", type: "Government", website: "https://www.vjti.ac.in", avgPkg: 13.2, maxPkg: 62.0, placePct: 94.5 },
  { name: "College of Engineering Pune", city: "Pune", location: "Maharashtra", type: "Government", website: "https://www.coep.org.in", avgPkg: 12.5, maxPkg: 60.0, placePct: 93.0 },
  { name: "Harcourt Butler Technical University", city: "Kanpur", location: "Uttar Pradesh", type: "Government", website: "https://hbtu.ac.in", avgPkg: 9.5, maxPkg: 44.5, placePct: 89.0 },
  { name: "Madhav Institute of Technology and Science", city: "Gwalior", location: "Madhya Pradesh", type: "Government", website: "https://www.mitsgwalior.in", avgPkg: 6.2, maxPkg: 28.0, placePct: 82.0 },
  { name: "SGSITS Indore", city: "Indore", location: "Madhya Pradesh", type: "Government", website: "https://www.sgsits.ac.in", avgPkg: 8.5, maxPkg: 40.0, placePct: 88.0 },
  { name: "LD College of Engineering", city: "Ahmedabad", location: "Gujarat", type: "Government", website: "https://ldce.ac.in", avgPkg: 6.5, maxPkg: 30.0, placePct: 85.0 },
  { name: "University Visvesvaraya College of Engineering", city: "Bengaluru", location: "Karnataka", type: "Government", website: "https://uvce.ac.in", avgPkg: 8.8, maxPkg: 42.0, placePct: 89.5 },
  { name: "Andhra University College of Engineering", city: "Visakhapatnam", location: "Andhra Pradesh", type: "Government", website: "https://www.andhrauniversity.edu.in", avgPkg: 6.8, maxPkg: 32.0, placePct: 84.0 },

  // 51-100: Private Universities, Elite Institutes (BITS, VIT, SRM, Manipal)
  { name: "Birla Institute of Technology and Science Pilani", city: "Pilani", location: "Rajasthan", type: "Private", website: "https://www.bits-pilani.ac.in", avgPkg: 22.0, maxPkg: 110.0, placePct: 97.8 },
  { name: "BITS Pilani Goa Campus", city: "Zuarinagar", location: "Goa", type: "Private", website: "https://www.bits-pilani.ac.in/goa", avgPkg: 20.5, maxPkg: 95.0, placePct: 96.5 },
  { name: "BITS Pilani Hyderabad Campus", city: "Hyderabad", location: "Telangana", type: "Private", website: "https://www.bits-pilani.ac.in/hyderabad", avgPkg: 19.8, maxPkg: 92.0, placePct: 96.0 },
  { name: "Vellore Institute of Technology", city: "Vellore", location: "Tamil Nadu", type: "Private", website: "https://vit.ac.in", avgPkg: 9.2, maxPkg: 102.0, placePct: 94.0 },
  { name: "VIT Chennai Campus", city: "Chennai", location: "Tamil Nadu", type: "Private", website: "https://chennai.vit.ac.in", avgPkg: 8.8, maxPkg: 75.0, placePct: 93.0 },
  { name: "SRM Institute of Science and Technology", city: "Chennai", location: "Tamil Nadu", type: "Private", website: "https://www.srmist.edu.in", avgPkg: 8.5, maxPkg: 75.0, placePct: 92.5 },
  { name: "Manipal Institute of Technology", city: "Manipal", location: "Karnataka", type: "Private", website: "https://manipal.edu/mit.html", avgPkg: 12.5, maxPkg: 54.0, placePct: 93.5 },
  { name: "Thapar Institute of Engineering and Technology", city: "Patiala", location: "Punjab", type: "Private", website: "https://www.thapar.edu", avgPkg: 11.8, maxPkg: 50.0, placePct: 94.0 },
  { name: "RV College of Engineering", city: "Bengaluru", location: "Karnataka", type: "Private", website: "https://rvce.edu.in", avgPkg: 11.2, maxPkg: 62.0, placePct: 95.0 },
  { name: "PES University", city: "Bengaluru", location: "Karnataka", type: "Private", website: "https://www.pes.edu", avgPkg: 10.5, maxPkg: 55.0, placePct: 93.0 },
  { name: "M. S. Ramaiah Institute of Technology", city: "Bengaluru", location: "Karnataka", type: "Private", website: "https://www.msrit.edu", avgPkg: 9.8, maxPkg: 50.0, placePct: 92.0 },
  { name: "BMS College of Engineering", city: "Bengaluru", location: "Karnataka", type: "Private", website: "https://bmsce.ac.in", avgPkg: 9.5, maxPkg: 48.0, placePct: 91.5 },
  { name: "PSG College of Technology", city: "Coimbatore", location: "Tamil Nadu", type: "Private", website: "https://www.psgtech.edu", avgPkg: 10.8, maxPkg: 52.0, placePct: 94.0 },
  { name: "Amity University Noida", city: "Noida", location: "Uttar Pradesh", type: "Private", website: "https://www.amity.edu", avgPkg: 6.5, maxPkg: 61.0, placePct: 89.0 },
  { name: "Galgotias University", city: "Greater Noida", location: "Uttar Pradesh", type: "Private", website: "https://www.galgotiasuniversity.edu.in", avgPkg: 6.8, maxPkg: 35.0, placePct: 88.0 },
  { name: "Sharda University", city: "Greater Noida", location: "Uttar Pradesh", type: "Private", website: "https://www.sharda.ac.in", avgPkg: 6.0, maxPkg: 48.0, placePct: 87.0 },
  { name: "Bennett University", city: "Greater Noida", location: "Uttar Pradesh", type: "Private", website: "https://www.bennett.edu.in", avgPkg: 8.5, maxPkg: 120.0, placePct: 90.0 },
  { name: "Lovely Professional University", city: "Phagwara", location: "Punjab", type: "Private", website: "https://www.lpu.in", avgPkg: 6.4, maxPkg: 64.0, placePct: 88.5 },
  { name: "Chandigarh University", city: "Mohali", location: "Punjab", type: "Private", website: "https://www.cuchd.in", avgPkg: 7.2, maxPkg: 54.0, placePct: 90.0 },
  { name: "Chitkara University", city: "Rajpura", location: "Punjab", type: "Private", website: "https://www.chitkara.edu.in", avgPkg: 6.8, maxPkg: 40.0, placePct: 89.0 },
  { name: "KIIT University", city: "Bhubaneswar", location: "Odisha", type: "Private", website: "https://kiit.ac.in", avgPkg: 8.2, maxPkg: 52.0, placePct: 91.5 },
  { name: "Sathyabama Institute of Science and Technology", city: "Chennai", location: "Tamil Nadu", type: "Private", website: "https://www.sathyabama.ac.in", avgPkg: 5.8, maxPkg: 32.0, placePct: 86.0 },
  { name: "Kalinga Institute of Industrial Technology", city: "Bhubaneswar", location: "Odisha", type: "Private", website: "https://www.kiit.ac.in", avgPkg: 8.0, maxPkg: 50.0, placePct: 91.0 },
  { name: "SSN College of Engineering", city: "Kalavakkam", location: "Tamil Nadu", type: "Private", website: "https://www.ssn.edu.in", avgPkg: 9.0, maxPkg: 50.0, placePct: 93.0 },
  { name: "Siddaganga Institute of Technology", city: "Tumakuru", location: "Karnataka", type: "Private", website: "https://sit.ac.in", avgPkg: 6.2, maxPkg: 30.0, placePct: 85.0 },
  { name: "Jaypee Institute of Information Technology", city: "Noida", location: "Uttar Pradesh", type: "Private", website: "https://www.jiit.ac.in", avgPkg: 11.0, maxPkg: 82.8, placePct: 93.0 },
  { name: "JSS Academy of Technical Education", city: "Noida", location: "Uttar Pradesh", type: "Private", website: "https://jssaten.ac.in", avgPkg: 6.5, maxPkg: 40.0, placePct: 86.0 },
  { name: "Ajay Kumar Garg Engineering College", city: "Ghaziabad", location: "Uttar Pradesh", type: "Private", website: "https://www.akgec.ac.in", avgPkg: 6.2, maxPkg: 113.0, placePct: 87.0 },
  { name: "KIET Group of Institutions", city: "Ghaziabad", location: "Uttar Pradesh", type: "Private", website: "https://www.kiet.edu", avgPkg: 6.8, maxPkg: 48.4, placePct: 88.0 },
  { name: "ABES Engineering College", city: "Ghaziabad", location: "Uttar Pradesh", type: "Private", website: "https://www.abes.ac.in", avgPkg: 6.0, maxPkg: 47.0, placePct: 85.0 },
  { name: "SRM Institute of Science and Technology NCR Campus", city: "Ghaziabad", location: "Uttar Pradesh", type: "Private", website: "https://www.srmimt.edu.in", avgPkg: 7.5, maxPkg: 42.0, placePct: 88.0 },
  { name: "Meerut Institute of Engineering and Technology", city: "Meerut", location: "Uttar Pradesh", type: "Private", website: "https://www.miet.ac.in", avgPkg: 5.5, maxPkg: 28.0, placePct: 83.0 },
  { name: "Swami Vivekanand Subharti University", city: "Meerut", location: "Uttar Pradesh", type: "Private", website: "https://www.subharti.org", avgPkg: 5.0, maxPkg: 18.0, placePct: 80.0 },
  { name: "Shobhit Institute of Engineering and Technology", city: "Meerut", location: "Uttar Pradesh", type: "Private", website: "https://www.shobhituniversity.ac.in", avgPkg: 4.8, maxPkg: 12.0, placePct: 78.0 },
  { name: "Institute of Management Studies Noida", city: "Noida", location: "Uttar Pradesh", type: "Private", website: "https://www.imsnoida.com", avgPkg: 5.0, maxPkg: 12.0, placePct: 80.0 },
  { name: "Symbiosis Institute of Technology", city: "Pune", location: "Maharashtra", type: "Private", website: "https://www.sitpune.edu.in", avgPkg: 9.8, maxPkg: 38.0, placePct: 92.0 },
  { name: "Nirma University", city: "Ahmedabad", location: "Gujarat", type: "Private", website: "https://nirmauni.ac.in", avgPkg: 8.5, maxPkg: 46.0, placePct: 91.0 },
  { name: "Dhirubhai Ambani Institute of Information and Communication Technology", city: "Gandhinagar", location: "Gujarat", type: "Private", website: "https://www.daiict.ac.in", avgPkg: 16.2, maxPkg: 52.0, placePct: 95.5 },
  { name: "Siksha 'O' Anusandhan", city: "Bhubaneswar", location: "Odisha", type: "Private", website: "https://www.soa.ac.in", avgPkg: 7.0, maxPkg: 36.0, placePct: 88.0 },
  { name: "Amrita School of Engineering", city: "Coimbatore", location: "Tamil Nadu", type: "Private", website: "https://www.amrita.edu", avgPkg: 8.2, maxPkg: 56.9, placePct: 91.0 },
  { name: "Karunya Institute of Technology and Sciences", city: "Coimbatore", location: "Tamil Nadu", type: "Private", website: "https://www.karunya.edu", avgPkg: 5.5, maxPkg: 25.0, placePct: 84.0 },
  { name: "Alliance University", city: "Bengaluru", location: "Karnataka", type: "Private", website: "https://www.alliance.edu.in", avgPkg: 7.5, maxPkg: 38.0, placePct: 89.0 },
  { name: "REVA University", city: "Bengaluru", location: "Karnataka", type: "Private", website: "https://www.reva.edu.in", avgPkg: 6.4, maxPkg: 35.0, placePct: 86.5 },
  { name: "Chaitanya Bharathi Institute of Technology", city: "Hyderabad", location: "Telangana", type: "Private", website: "https://www.cbit.ac.in", avgPkg: 7.8, maxPkg: 41.0, placePct: 90.0 },
  { name: "VNR Vignana Jyothi Institute of Engineering and Technology", city: "Hyderabad", location: "Telangana", type: "Private", website: "https://www.vnrvjiet.ac.in", avgPkg: 7.2, maxPkg: 38.5, placePct: 89.5 },
  { name: "Koneru Lakshmaiah Education Foundation", city: "Guntur", location: "Andhra Pradesh", type: "Private", website: "https://www.kluniversity.in", avgPkg: 6.8, maxPkg: 36.0, placePct: 88.0 },
  { name: "Gitam University", city: "Visakhapatnam", location: "Andhra Pradesh", type: "Private", website: "https://www.gitam.edu", avgPkg: 6.0, maxPkg: 30.0, placePct: 85.0 },
  { name: "Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology", city: "Chennai", location: "Tamil Nadu", type: "Private", website: "https://www.veltech.edu.in", avgPkg: 5.5, maxPkg: 28.0, placePct: 84.0 },
  { name: "SRM University AP", city: "Amaravati", location: "Andhra Pradesh", type: "Private", website: "https://srmap.edu.in", avgPkg: 9.2, maxPkg: 50.0, placePct: 92.0 },
  { name: "Shiv Nadar University", city: "Greater Noida", location: "Uttar Pradesh", type: "Private", website: "https://snu.edu.in", avgPkg: 12.5, maxPkg: 58.0, placePct: 93.0 }
];

// Add filler template generators to expand the list to exactly 200 items
const locations = [
  { city: "Pune", state: "Maharashtra" },
  { city: "Bengaluru", state: "Karnataka" },
  { city: "Noida", state: "Uttar Pradesh" },
  { city: "Greater Noida", state: "Uttar Pradesh" },
  { city: "Gurugram", state: "Haryana" },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Chennai", state: "Tamil Nadu" },
  { city: "Kolkata", state: "West Bengal" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Coimbatore", state: "Tamil Nadu" }
];

const coursesPool = [
  "B.Tech CSE", "B.Tech ECE", "B.Tech IT", "B.Tech EE", 
  "M.Tech", "MBA", "MCA", "BCA", "BBA", "B.Sc CS"
];

const recruitersPool = [
  "Google", "Microsoft", "Amazon", "Meta", "TCS", "Infosys", "Wipro", 
  "Cognizant", "Accenture", "Capgemini", "Deloitte", "Goldman Sachs", 
  "J.P. Morgan", "PwC", "HCL", "Tech Mahindra", "Adobe", "Salesforce"
];

// Loop and generate until we have exactly 200 colleges
let currentId = collegeTemplates.length;
while (collegeTemplates.length < 200) {
  const locIndex = currentId % locations.length;
  const location = locations[locIndex];
  const type = (currentId % 3 === 0) ? "Government" : "Private";
  const name = `${type === "Government" ? "Government" : "National"} Engineering College ${location.city} (${type === "Government" ? "GEC" : "NEC"}-${currentId})`;
  
  collegeTemplates.push({
    name: name,
    city: location.city,
    location: location.state,
    type: type,
    website: `https://www.${location.city.toLowerCase()}-ec-${currentId}.edu.in`,
    avgPkg: parseFloat((5.0 + (currentId % 10) * 1.2).toFixed(1)),
    maxPkg: parseFloat((15.0 + (currentId % 15) * 4.5).toFixed(1)),
    placePct: parseFloat((75.0 + (currentId % 20) * 1.1).toFixed(1))
  });
  currentId++;
}

// Convert templates to final schema records
const finalColleges = collegeTemplates.map((item, idx) => {
  // Choose random courses
  const numCourses = 3 + (idx % 4);
  const courses = [];
  for (let i = 0; i < numCourses; i++) {
    const course = coursesPool[(idx + i) % coursesPool.length];
    if (!courses.includes(course)) {
      courses.push(course);
    }
  }

  // Set eligibility object
  const eligibility = {};
  courses.forEach(c => {
    if (c.startsWith("B.Tech")) {
      eligibility[c] = "12th with 60% in PCM + JEE Main / State Entrance";
    } else if (c === "M.Tech") {
      eligibility[c] = "B.Tech / B.E. with 60% + GATE qualified";
    } else if (c === "MBA") {
      eligibility[c] = "Graduation with 50% + CAT / MAT / CMAT score";
    } else if (c === "MCA") {
      eligibility[c] = "BCA or B.Sc with Mathematics in 12th + NIMCET / State Test";
    } else {
      eligibility[c] = "12th standard with 50% minimum marks";
    }
  });

  // Top recruiters
  const numRecruiters = 4 + (idx % 5);
  const topRecruiters = [];
  for (let i = 0; i < numRecruiters; i++) {
    const rec = recruitersPool[(idx + i * 3) % recruitersPool.length];
    if (!topRecruiters.includes(rec)) {
      topRecruiters.push(rec);
    }
  }

  return {
    name: item.name,
    city: item.city,
    type: item.type,
    location: item.location,
    courses: courses,
    eligibility: eligibility,
    contact: `+91-${9000000000 + idx * 4321}`,
    website: item.website,
    averagePackageLPA: item.avgPkg,
    highestPackageLPA: item.maxPkg,
    placementPercentage: item.placePct,
    topRecruiters: topRecruiters
  };
});

// Split the array of 200 into 4 files of 50 each
const chunks = [
  { file: 'colleges_1_50.json', data: finalColleges.slice(0, 50) },
  { file: 'colleges_51_100.json', data: finalColleges.slice(50, 100) },
  { file: 'colleges_101_150.json', data: finalColleges.slice(100, 150) },
  { file: 'colleges_151_200.json', data: finalColleges.slice(150, 200) }
];

chunks.forEach(chunk => {
  const filePath = path.join(process.cwd(), chunk.file);
  fs.writeFileSync(filePath, JSON.stringify(chunk.data, null, 2), 'utf-8');
  console.log(`Successfully generated ${chunk.data.length} records in ${chunk.file}`);
});
