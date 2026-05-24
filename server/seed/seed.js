const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Donor = require("../models/Donor");
const BloodRequest = require("../models/BloodRequest");
const BloodBank = require("../models/BloodBank");
const Contact = require("../models/Contact");
const Report = require("../models/Report");

dotenv.config();

// Source: Kerala State AIDS Control Society / Kerala State Blood Transfusion Council
// "List of Blood Centers in Kerala" public PDF. Phone numbers are not published
// in that list, so seeded records use a clear contact placeholder.
const districtCoordinates = {
  Alappuzha: [9.4981, 76.3388],
  Ernakulam: [9.9816, 76.2999],
  Idukki: [9.9189, 77.1025],
  Kannur: [11.8745, 75.3704],
  Kasargod: [12.4996, 74.9869],
  Kollam: [8.8932, 76.6141],
  Kottayam: [9.5916, 76.5222],
  Kozhikode: [11.2588, 75.7804],
  Malappuram: [11.051, 76.0711],
  Palakkad: [10.7867, 76.6548],
  Pathanamthitta: [9.2648, 76.787],
  Thrissur: [10.5276, 76.2144],
  Trivandrum: [8.5241, 76.9366],
  Wayanad: [11.6854, 76.132]
};

const officialBloodCentersRaw = `
K.V.M. Hospital|Chertala, Alappuzha, Kerala 688524|Alappuzha
Century Hospital|Mulakuzha, Chenganoor, Alappuzha, Kerala 689505|Alappuzha
Sacred Heart Hospital|Green Gardens, Mathilakom, Cherthala, Alappuzha, Kerala 688524|Alappuzha
V S M Hospital|Thattarambalam, Mavelikkara, Alappuzha, Kerala 690103|Alappuzha
Sanjivani Multispeciality Hospital|Alacode, Kollakadavu P O, Cheriyanad, Chengannur, Alappuzha, Kerala 690509|Alappuzha
Medical College Hospital|Vandanam, Alappuzha, Kerala 688005|Alappuzha
Women & Children Hospital|Beach Bazar P.O., Alappuzha, Kerala 688012|Alappuzha
General Hospital, Alappuzha|General Hospital Road, Anantha Narayanapuram, Alappuzha, Kerala 688011|Alappuzha
Carmel Hospital|Ashokapuram, Aluva, Ernakulam, Kerala 683101|Ernakulam
Little Flower Hospital|M.C. Road, Angamaly, Ernakulam, Kerala 683572|Ernakulam
Aster Medicity|Kuttysahib Road, South Chittoor P.O., Cheranelloor, Ernakulam, Kerala 682027|Ernakulam
Amrita Institute of Medical Sciences & Research Centre|Ponekkara P.O., Ernakulam, Kerala 682041|Ernakulam
INHS Sanjivani|Naval Base Parade Ground, Willingdon Island, Ernakulam, Kerala 682003|Ernakulam
Lisie Hospital|Kathrikadavu, Kaloor, Ernakulam, Kerala 682017|Ernakulam
MOSC Medical College Hospital|Kolencherry, Ernakulam, Kerala 680311|Ernakulam
Medical Trust Hospital|M.G. Road, Ernakulam, Kerala 682016|Ernakulam
Samaritan Hospital|Pazhanganad, Kizhakambalam, Ernakulam, Kerala 680562|Ernakulam
Sunrise Institute of Medical Sciences|Seaport-Airport Road, Kakkanad, Ernakulam, Kerala 682030|Ernakulam
Devamatha Hospital|Koothattukulam, Ernakulam, Kerala 686662|Ernakulam
Mar Baselios Medical Mission Hospital|NH49, Near Post Office, Kothamangalam P.O., Ernakulam, Kerala 686691|Ernakulam
St Joseph Hospital|Dharmagiri, Kothamangalam, Ernakulam, Kerala 686691|Ernakulam
Lakeshore Hospital & Research Centre Ltd|NH-47 Bypass, Maradu, Nettoor P.O., Ernakulam, Kerala 682040|Ernakulam
Nirmala Medical Center|Kizhakkekara, Moovattupuzha, Ernakulam, Kerala 686661|Ernakulam
Sree Narayana Institute of Medical Sciences|Chalakka, North Kuthyathode, Ernakulam, Kerala 683594|Ernakulam
Sanjoe Hospital|A.M. Road, Perumbavoor, Ernakulam, Kerala 680541|Ernakulam
Rajagiri Hospital|Chunangamvely, Aluva, Ernakulam, Kerala 683112|Ernakulam
Govt. Medical College Hospital|HMT Colony P.O., Kalamassery, Ernakulam, Kerala 683503|Ernakulam
General Hospital Ernakulam|Ernakulam, Kerala 682011|Ernakulam
IMA Voluntary Donor Blood Bank|T.D. Road, Ernakulam, Kerala 682011|Ernakulam
Lourdes Hospital|Pachalam, Ernakulam, Kerala 682012|Ernakulam
District Hospital Aluva|Aluva, Ernakulam, Kerala 683101|Ernakulam
Renai Medicity|Palarivattom P.O., Ernakulam, Kerala 682025|Ernakulam
MAGJ Hospital|Mookkannoor P.O., Angamaly, Ernakulam, Kerala 683577|Ernakulam
Adlux Medicity and Convention Centre Pvt Ltd|Cable Junction, Karukutty P.O., Angamaly, Ernakulam, Kerala 683576|Ernakulam
Morning Star Medical Centre|Nazareth Hill, Adimali, Idukki, Kerala 685561|Idukki
St Johns Hospital|Kattappana South P.O., Idukki, Kerala 685515|Idukki
M.M.T. Hospital|Mundakkayam East P.O., Idukki, Kerala 686513|Idukki
Tata Tea Limited General Hospital|Nullatanni, Munnar, Idukki, Kerala 685612|Idukki
Alphonsa Hospital|SH 19 Bypass, Anakkara, Murikkassery, Idukki, Kerala 685512|Idukki
Holy Family Hospital|Muthalakodam, Thodupuzha, Idukki, Kerala 686505|Idukki
Al-Azhar Medical College & Super Speciality Hospital|Ezhalloor P.O., Kumaramangalam, Thodupuzha, Idukki, Kerala 685605|Idukki
Govt. Medical College Hospital District Hospital|Painavu, Idukki, Kerala 685603|Idukki
IMA Blood Bank Society|Thodupuzha, Idukki, Kerala 685584|Idukki
Chazhikattu Hospital Pvt Ltd|Thodupuzha, Idukki, Kerala 685584|Idukki
Kannur Medical College and Hospital|Chovva Mattannur Road, Anjarakandy P.O., Kannur, Kerala 670612|Kannur
St Martin De Porres Hospital|Cherukunnu P.O., Kannur, Kerala 670301|Kannur
Cannanore Co-Op Hospital Society|Kasaragod-Kannur Road, Talap, Kannur, Kerala 670002|Kannur
Sara Memorial Medical Laboratory and Blood Bank|Brigade Centre, Fort Road, Kannur, Kerala 670001|Kannur
The Payyannur Co-operative Hospital Society Ltd|South Bazar, Payyanur, Kannur, Kerala 670503|Kannur
Tellichery Co-Operative Hospital|Thalassery, Kannur, Kerala 670101|Kannur
Josgiri Hospital|Thalassery, Kannur, Kerala 670101|Kannur
Govt Medical College Hospital Pariyaram|Pariyaram, Kannur, Kerala 670503|Kannur
District Hospital Kannur|Kannur, Kerala 670017|Kannur
General Hospital Thalassery|Thalassery, Kannur, Kerala 670101|Kannur
Malabar Cancer Centre|Moozhikkara P.O., Thalassery, Kannur, Kerala 670003|Kannur
Aster MIMS Kannur|Chala East, Kannur, Kerala 670621|Kannur
Co Operative Hospital Society Ltd Taliparamba|Taliparamba, Kannur, Kerala 670141|Kannur
District Hospital Kanhangad|Kanhangad, Kasaragod, Kerala 671315|Kasargod
General Hospital Kasaragod|Kasaragod, Kerala 671121|Kasargod
S.N. Trust Medical Mission Sankars Hospital|Q.S. Road, Kollam, Kerala 691001|Kollam
Upasana Hospital|Q.S. Road, N.H. 208, Kollam, Kerala 691001|Kollam
Padmavathy Medical Foundation|Sasthamkotta Road, Manakkara, Kollam, Kerala 690521|Kollam
Azeezia Medical College|Diamond Hill, Meeyanoor P.O., Kollam, Kerala 691537|Kollam
Travancore Medical College Hospital|Medicity, N.H. Bypass Road, Umayanalloor, Kollam, Kerala 691589|Kollam
Medical College Hospital Parippally|Parippally, Kollam, Kerala 691574|Kollam
Bishop Benziger Hospital|Beach Road, Kollam, Kerala 691001|Kollam
District Hospital Kollam|Chinnakada, Kollam, Kerala 691001|Kollam
Holy Cross Hospital|Kottiyam, Kollam, Kerala 691571|Kollam
IMA Blood Bank Kollam|IMA Centre, Ashramam, Kollam, Kerala 691002|Kollam
St Joseph Hospital Anchal|Anchal P.O., Kollam, Kerala 691306|Kollam
Taluk Head Quarters Hospital Kottarakara|Kollam-Chenkotta Road, Kottarakara, Kollam, Kerala 691506|Kollam
Taluk Head Quarters Hospital Punalur|Panamkuttymala, Punalur, Kollam, Kerala 691305|Kollam
Meditrina Hospital|Kollam-Ayoor Road, Ayathil, Kollam, Kerala 691021|Kollam
Mary Queens Mission Hospital|Palampra P.O., Kanjirapally, Kottayam, Kerala 686518|Kottayam
Little Lourde Mission Hospital|Kidangoor, Kottayam, Kerala 686752|Kottayam
St Thomas Hospital|Kurisummoodu P.O., Chettipuzha, Changanacherry, Kottayam, Kerala 686104|Kottayam
MUM Hospital|Monippally P.O., Kottayam, Kerala 686636|Kottayam
Holy Ghost Mission Hospital|Muttuchira, Kottayam, Kerala 686613|Kottayam
S.H. Medical Centre|Nagampadam, Kottayam, Kerala 686001|Kottayam
Carmel Medical Centre|Kizhathadiyoor P.O., Pala, Kottayam, Kerala 686574|Kottayam
Marian Medical Centre|Arunapuram P.O., Pala, Kottayam, Kerala 686574|Kottayam
Velankanni Matha Hospital Pvt Ltd|M.C. Road, Thellakom, Kottayam, Kerala 686630|Kottayam
Caritas Hospital|M.C. Road, Thellakom, Kottayam, Kerala 686630|Kottayam
Indo American Hospital|Chemmanakary, Akkarappadam P.O., Vaikom, Kottayam, Kerala 686143|Kottayam
Bharath Charitable Hospital Society|Azad Lane, Kottayam, Kerala 686001|Kottayam
District Hospital Kottayam|Kottayam-Kumily Road, Kottayam, Kerala 686001|Kottayam
I.H.M. Hospital|Bharananganam, Pala, Kottayam, Kerala 686578|Kottayam
Medical College Hospital Kottayam|Gandhi Nagar, Kottayam, Kerala 686008|Kottayam
Mar Sleeva Medicity Palai|Cherpunkal, Kezhuvankulam P.O., Kottayam, Kerala 686584|Kottayam
Malabar Medical College Hospital|Modakkallur, Atholi, Kozhikode, Kerala 673321|Kozhikode
Metromed International Cardiac Centre|Thondayad Bypass Road, Palazhi, Kozhikode, Kerala 673014|Kozhikode
Kozhikode District Co-Operative Hospital|Mini Bypass Road, Eranhipalam, Kozhikode, Kerala 673006|Kozhikode
Baby Memorial Hospital|Indira Gandhi Road, Arayidathupalam, Kozhikode, Kerala 673004|Kozhikode
KMCT Hospital|Manassery P.O., Mukkam, Kozhikode, Kerala 673602|Kozhikode
National Hospital|Mavoor Road, Near KSRTC Bus Stand, Kozhikode, Kerala 673001|Kozhikode
Malabar Institute Of Medical Sciences|Mini Bypass Road, Govindapuram, Kozhikode, Kerala 673016|Kozhikode
IQRAA Hospital|Malaparamba, Kozhikode, Kerala 673009|Kozhikode
Nirmala Hospital|Wayanad Road, Marikunnu, Vellimadukunnu, Kozhikode, Kerala 673012|Kozhikode
St Joseph's Hospital Mukkam|Agastianmoozhi, Mukkam, Kozhikode, Kerala 673602|Kozhikode
PVS Hospital|Railway Station Road, Kozhikode, Kerala 673002|Kozhikode
Santhi Hospital|Omaserry, Kozhikode, Kerala 673582|Kozhikode
Badagara Sahakarana Asupathri Ltd|Narayana Nagar, Vadakara, Kozhikode, Kerala 673101|Kozhikode
General Hospital Beach Kozhikode|Beach P.O., Kozhikode, Kerala 673032|Kozhikode
Govt. W & C Hospital Kottapparamba|Kottapparamba, Kozhikode, Kerala 673001|Kozhikode
Medical College Hospital Kozhikode|Kozhikode, Kerala 673008|Kozhikode
District Hospital Vadakara|Vadakara, Kozhikode, Kerala 673101|Kozhikode
Meitra Hospital|Mini Bypass Road, Edakkad, Kozhikode, Kerala 673005|Kozhikode
MVR Cancer Centre & Research Institute|Choolur, Vellasseri P.O., Poolacode, Kozhikode, Kerala 673601|Kozhikode
Edappal Hospital Pvt Ltd|Pattambi Road, Edappal, Malappuram, Kerala 679576|Malappuram
Malabar Institute of Medical Sciences Kottakkal|Changuvetty, Kottakkal P.O., Malappuram, Kerala 676503|Malappuram
Almas Hospital|Changuvetti, Kottakkal, Malappuram, Kerala 676503|Malappuram
Korambayil Hospital|East Road, Manjeri College P.O., Manjeri, Malappuram, Kerala 676122|Malappuram
Al-Shifa Hospital Pvt Ltd|Ootty Road, Perinthalmanna, Malappuram, Kerala 679322|Malappuram
MES Medical College Hospital|Malaparamba, Palachode P.O., Perinthalmanna, Malappuram, Kerala 679338|Malappuram
Medical College Hospital Manjeri|Vellarangal, Manjeri, Malappuram, Kerala 676121|Malappuram
Govt Hospital Perinthalmanna|Shanti Nagar, Perinthalmanna, Malappuram, Kerala 679322|Malappuram
District Hospital Tirur|Civil Station Road, Thrikandiyoor P.O., Tirur, Malappuram, Kerala 676104|Malappuram
Karuna Medical College Hospital|Vilayodi, Chittur, Palakkad, Kerala 678103|Palakkad
Valluvanad Hospital|Kanniyampuram Post, Ottapalam, Palakkad, Kerala 679104|Palakkad
Palakkad Blood Bank|Soorya Enclave, Opposite Palat Hospital, Civil Station Road, Palakkad, Kerala 678001|Palakkad
The Palakkad District Co-operative Hospital|Rajiv Gandhi Hospital Complex, Kallekkad, Kodunthirapully P.O., Palakkad, Kerala 678004|Palakkad
District Hospital Palakkad|Sultanpet, Palakkad, Kerala 678001|Palakkad
Ahalia Hospital|Kanal Pirivu, Palakkad, Kerala 678557|Palakkad
PK Das Institute of Medical Sciences|Vaniamkulam, Ottapalam, Palakkad, Kerala 679522|Palakkad
Kerala Medical College Hospital|Mangode, Cherpulassery, Palakkad, Kerala 679503|Palakkad
Mother Care Hospital|Vattambalam, Kumaramputhur P.O., Mannarkkad, Palakkad, Kerala 678583|Palakkad
Taluk Head Quarters Hospital Mannarkkad|Mannarkkad P.O., Palakkad, Kerala 678582|Palakkad
Lifeline Super Speciality Hospital|14th Mile, Melood P.O., Adoor, Pathanamthitta, Kerala 691554|Pathanamthitta
MGM Muthoot Medical Centre Kozhencherry|College Road, Kozhencherry, Pathanamthitta, Kerala 689641|Pathanamthitta
Fellowship Mission Hospital|Vellikkara, Kumbanad, Thiruvalla, Pathanamthitta, Kerala 689547|Pathanamthitta
Chithra Hospital|Main Central Road, Kadakkadu, Pandalam, Pathanamthitta, Kerala 689501|Pathanamthitta
Tiruvalla Medical Mission Hospital|Tiruvalla, Pathanamthitta, Kerala 689101|Pathanamthitta
Pushpagiri Hospital|Thiruvalla, Pathanamthitta, Kerala 689101|Pathanamthitta
Believers Church Medical College Hospital|St. Thomas Nagar, Kuttapuzha P.O., Thiruvalla, Pathanamthitta, Kerala 689103|Pathanamthitta
MGM Muthoot Medical Centre Pathanamthitta|Ring Road, Pathanamthitta, Kerala 689645|Pathanamthitta
Poyanil Hospital|Kozhencherry, Pathanamthitta, Kerala 689641|Pathanamthitta
Mount Zion Medical College Hospital|Ezhamkulam, Adoor, Pathanamthitta, Kerala 691556|Pathanamthitta
General Hospital Pathanamthitta|Pathanamthitta, Kerala 689645|Pathanamthitta
Taluk Headquarters Hospital Thiruvalla|Thiruvalla, Pathanamthitta, Kerala 689101|Pathanamthitta
Holy Cross Hospital Adoor|Kayamkulam-Pathanapuram Road, Adoor, Pathanamthitta, Kerala 691523|Pathanamthitta
St Gregorios Medical Mission Hospital|Parumala, Pathanamthitta, Kerala 689626|Pathanamthitta
Christian Mission Hospital|SH 1, Pandalam, Pathanamthitta, Kerala 689501|Pathanamthitta
Amala Institute of Medical Science|Amala Nagar P.O., Thrissur, Kerala 680555|Thrissur
St James Hospital|Old Highway, Chalakudy, Thrissur, Kerala 680307|Thrissur
St Josephs Hospital Choondal|Choondal, Thrissur, Kerala 680502|Thrissur
Mary Immaculate Mission Hospital|Chanthappadi, Polakkan, Engandiyoor, Thrissur, Kerala 680615|Thrissur
Modern Hospital|Kodungallur P.O., Thrissur, Kerala 680664|Thrissur
Unity Hospital Pvt Ltd|Kanippayyur P.O., Kunnamkulam, Thrissur, Kerala 680503|Thrissur
Maria Theresa Hospital|Kundai, Kuzhikkattussery, Mala, Thrissur, Kerala 680697|Thrissur
Mother Hospital|Pullazhi P.O., Olari, Thrissur, Kerala 680012|Thrissur
Sacred Heart Mission Hospital|Pullur P.O., Irinjalakuda, Thrissur, Kerala 680683|Thrissur
West Fort Hitech Hospital|Guruvayoor Road, Punkunnam, Thrissur, Kerala 680002|Thrissur
West Fort Hospital|Westfort, Thrissur, Kerala 680004|Thrissur
Jubilee Mission Hospital|Fathima Nagar, Nellikunnu, Thrissur, Kerala 680006|Thrissur
Malankara Medical Mission Hospital|Adupooty Hills, Kunnamkulam, Thrissur, Kerala 680503|Thrissur
General Hospital Thrissur|Thrissur, Kerala 680020|Thrissur
IMA Blood Bank Complex & Research Centre|Padukkad Road, Mannumkad, Ramavarmapuram P.O., Thrissur, Kerala 680631|Thrissur
Medical College Hospital Thrissur|Mulangunnathukavu, Thrissur, Kerala 680596|Thrissur
Aswini Hospital Limited|Karunakaran Nambiar Road, Patturaikkal, Thrissur, Kerala 680020|Thrissur
Dr Somervel CSI Mission Hospital|Karakonam P.O., Trivandrum, Kerala 695504|Trivandrum
NIMS Hospital|Aralumoodu, Neyyattinkara, Trivandrum, Kerala 695123|Trivandrum
PRS Hospital Private Limited|Killipalam, Trivandrum, Kerala 695002|Trivandrum
Ananthapuri Hospital and Research Institute|NH Bypass, Chacka, Trivandrum, Kerala 695024|Trivandrum
Kerala Institute of Medical Sciences|Anayara P.O., Trivandrum, Kerala 695029|Trivandrum
Sivagiri Sree Narayana Medical Mission Hospital|Puthenchanda P.O., Varkala, Trivandrum, Kerala 695145|Trivandrum
Cosmopolitan Hospitals Pvt Ltd|Pattom, Trivandrum, Kerala 695004|Trivandrum
Sree Uthradam Thirunal Hospital|Pattom, Trivandrum, Kerala 695004|Trivandrum
Sree Gokulam Medical College and Research Foundation|Aalamthara-Bhoothamadakki Road, Venjaramoodu, Trivandrum, Kerala 695607|Trivandrum
SUT Academy of Medical Science|Vencode P.O., Vattappara, Trivandrum, Kerala 695028|Trivandrum
General Hospital Thiruvananthapuram|Red Cross Road, Thiruvananthapuram, Kerala 695035|Trivandrum
Medical College Hospital Thiruvananthapuram|Ulloor, Thiruvananthapuram, Kerala 695011|Trivandrum
Regional Cancer Centre|Medical College Campus, Ulloor, Thiruvananthapuram, Kerala 695011|Trivandrum
Sree Chitra Thirunal Institute for Science & Technology|Medical College Campus, Ulloor, Thiruvananthapuram, Kerala 695011|Trivandrum
Taluk Headquarters Hospital Chirayinkeezhu|Chirayinkeezhu, Thiruvananthapuram, Kerala 695304|Trivandrum
W & C Hospital Thycaud|C.V. Raman Pillai Road, Thycaud, Thiruvananthapuram, Kerala 695014|Trivandrum
District Hospital Neyyattinkara|Alummoodu, Neyyattinkara, Thiruvananthapuram, Kerala 695121|Trivandrum
Sri Ramakrishna Ashrama Charitable Hospital|Sasthamangalam, Thiruvananthapuram, Kerala 695010|Trivandrum
Leo Hospital|Mandayapuram, Kalpetta P.O., Wayanad, Kerala 673121|Wayanad
D M Wayanad Institute of Medical Sciences|Naseera Nagar, Meppadi P.O., Kalpetta, Wayanad, Kerala 673577|Wayanad
District Hospital Mananthavady|Thazhe Angadi, Mananthavady, Wayanad, Kerala 670645|Wayanad
Taluk Headquarters Hospital Sulthan Bathery|Police Station Road, Fairland Colony, Sulthan Bathery, Wayanad, Kerala 673592|Wayanad
`;

const buildOfficialBloodBanks = () =>
  officialBloodCentersRaw
    .trim()
    .split("\n")
    .map((line, index) => {
      const [name, address, district] = line.split("|");
      const [baseLat, baseLng] = districtCoordinates[district] || [10.8505, 76.2711];
      const offset = ((index % 11) - 5) * 0.018;
      const ring = (Math.floor(index / 11) % 7) * 0.006;

      return {
        name,
        address,
        city: district,
        phone: "Contact hospital directly",
        latitude: Number((baseLat + offset + ring).toFixed(6)),
        longitude: Number((baseLng - offset + ring).toFixed(6)),
        openingHours: "Contact centre for current blood bank hours"
      };
    });

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Donor.deleteMany(),
    BloodRequest.deleteMany(),
    BloodBank.deleteMany(),
    Contact.deleteMany(),
    Report.deleteMany()
  ]);

  const password = await bcrypt.hash("admin123", 10);
  const admin = await User.create({
    name: "Kerala Blood Connect Admin",
    email: "admin@lifedrop.com",
    password,
    phone: "9999999999",
    role: "admin",
    isVerified: true
  });

  const donorPassword = await bcrypt.hash("donor123", 10);
  const donorUsers = [
    ["Anu Thomas", "anu@example.com", "9876543210"],
    ["Rahul Nair", "rahul@example.com", "9876501234"],
    ["Maya Joseph", "maya@example.com", "9876512345"],
    ["Arjun Menon", "arjun@example.com", "9847011122"],
    ["Fathima Rahman", "fathima@example.com", "9847022233"],
    ["Joel Mathew", "joel@example.com", "9847033344"],
    ["Sneha Varghese", "sneha@example.com", "9847044455"],
    ["Nikhil Das", "nikhil@example.com", "9847055566"],
    ["Meera Pillai", "meera@example.com", "9847066677"],
    ["Vishnu Prasad", "vishnu@example.com", "9847077788"]
  ];

  const donors = await User.insertMany(
    donorUsers.map(([name, email, phone]) => ({
      name,
      email,
      password: donorPassword,
      phone,
      role: "donor",
      isVerified: true
    }))
  );

  const donorDocs = await Donor.insertMany([
    {
      userId: donors[0]._id,
      name: "Anu Thomas",
      bloodGroup: "O+",
      phone: "9876543210",
      location: "Kochi",
      age: 28,
      availabilityStatus: true,
      lastDonationDate: new Date("2026-02-10"),
      donationHistory: [
        { date: new Date("2025-04-12"), hospital: "City Hospital" },
        { date: new Date("2025-09-18"), hospital: "Lakeshore Medical Centre" },
        { date: new Date("2026-02-10"), hospital: "City Hospital" }
      ]
    },
    {
      userId: donors[1]._id,
      name: "Rahul Nair",
      bloodGroup: "A+",
      phone: "9876501234",
      location: "Trivandrum",
      age: 33,
      availabilityStatus: true,
      lastDonationDate: new Date("2026-01-18"),
      donationHistory: [{ date: new Date("2026-01-18"), hospital: "General Hospital" }]
    },
    {
      userId: donors[2]._id,
      name: "Maya Joseph",
      bloodGroup: "B-",
      phone: "9876512345",
      location: "Kozhikode",
      age: 25,
      availabilityStatus: false,
      lastDonationDate: new Date("2026-03-02")
    },
    {
      userId: donors[3]._id,
      name: "Arjun Menon",
      bloodGroup: "AB+",
      phone: "9847011122",
      location: "Kochi",
      age: 31,
      availabilityStatus: true,
      lastDonationDate: new Date("2025-12-20")
    },
    {
      userId: donors[4]._id,
      name: "Fathima Rahman",
      bloodGroup: "O-",
      phone: "9847022233",
      location: "Malappuram",
      age: 29,
      availabilityStatus: true,
      lastDonationDate: new Date("2025-11-05")
    },
    {
      userId: donors[5]._id,
      name: "Joel Mathew",
      bloodGroup: "B+",
      phone: "9847033344",
      location: "Kottayam",
      age: 36,
      availabilityStatus: true,
      lastDonationDate: new Date("2026-02-28")
    },
    {
      userId: donors[6]._id,
      name: "Sneha Varghese",
      bloodGroup: "A-",
      phone: "9847044455",
      location: "Thrissur",
      age: 24,
      availabilityStatus: false,
      lastDonationDate: new Date("2026-04-01")
    },
    {
      userId: donors[7]._id,
      name: "Nikhil Das",
      bloodGroup: "AB-",
      phone: "9847055566",
      location: "Kannur",
      age: 41,
      availabilityStatus: true,
      lastDonationDate: new Date("2025-10-12")
    },
    {
      userId: donors[8]._id,
      name: "Meera Pillai",
      bloodGroup: "A+",
      phone: "9847066677",
      location: "Alappuzha",
      age: 27,
      availabilityStatus: true,
      lastDonationDate: new Date("2026-01-05")
    },
    {
      userId: donors[9]._id,
      name: "Vishnu Prasad",
      bloodGroup: "O+",
      phone: "9847077788",
      location: "Palakkad",
      age: 38,
      availabilityStatus: true,
      lastDonationDate: new Date("2025-08-22")
    }
  ]);

  const requestDocs = await BloodRequest.insertMany([
    {
      patientName: "Emergency Patient",
      bloodGroupNeeded: "O-",
      unitsRequired: 2,
      hospitalName: "Metro Medical Centre",
      location: "Kochi",
      contactNumber: "9898989898",
      urgencyLevel: "Emergency",
      isPublic: true
    },
    {
      patientName: "Suresh Kumar",
      bloodGroupNeeded: "A+",
      unitsRequired: 1,
      hospitalName: "General Hospital",
      location: "Trivandrum",
      contactNumber: "9797979797",
      urgencyLevel: "High",
      isPublic: true
    },
    {
      patientName: "Baby of Lakshmi",
      bloodGroupNeeded: "B+",
      unitsRequired: 3,
      hospitalName: "Medical College Hospital",
      location: "Kottayam",
      contactNumber: "9788811111",
      urgencyLevel: "Emergency",
      isPublic: true
    },
    {
      patientName: "Mary George",
      bloodGroupNeeded: "AB-",
      unitsRequired: 1,
      hospitalName: "District Hospital",
      location: "Kannur",
      contactNumber: "9788822222",
      urgencyLevel: "Medium",
      isPublic: true
    },
    {
      patientName: "Private Request",
      bloodGroupNeeded: "O+",
      unitsRequired: 2,
      hospitalName: "Care Hospital",
      location: "Thrissur",
      contactNumber: "9788833333",
      urgencyLevel: "Low",
      isPublic: false
    }
  ]);

  const bloodBanks = await BloodBank.insertMany(buildOfficialBloodBanks());

  await Contact.insertMany([
    {
      name: "Dr. Priya",
      email: "priya.hospital@example.com",
      phone: "9495000001",
      message: "Please add our hospital blood storage unit to Kerala Blood Connect."
    },
    {
      name: "Community Volunteer Group",
      email: "volunteers@example.com",
      phone: "9495000002",
      message: "We want to organize a donation camp next month.",
      status: "Read"
    }
  ]);

  await Report.insertMany([
    {
      reportedType: "donor",
      reportedId: donorDocs[2]._id,
      reason: "Phone number was unreachable during an emergency.",
      reportedBy: donors[1]._id,
      status: "Open"
    },
    {
      reportedType: "bloodRequest",
      reportedId: requestDocs[3]._id,
      reason: "Requester said the requirement is already fulfilled.",
      status: "Reviewed"
    }
  ]);

  console.log(`Seeded Kerala Blood Connect data. Admin id: ${admin._id}`);
  console.log(`Seeded ${bloodBanks.length} official Kerala blood centers from the KSACS/KSBTC list.`);
  console.log("Admin login: admin@lifedrop.com / admin123");
  console.log("Donor login: anu@example.com / donor123");
  process.exit(0);
};

if (require.main === module) {
  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { buildOfficialBloodBanks };
