import Club from '../models/Club.js';
import { isUsingMockDb, mockDb } from '../config/db.js';

export const BILINGUAL_CLUBS_DATA = [
  // EDUCATION (15 Clubs)
  {
    id: 1,
    name: { bn: "আলোর দিশারী পাঠাগার", en: "Alor Dishari Pathagar" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "সুবিধাবঞ্চিত ও পথশিশুদের মাঝে মৌলিক শিক্ষা এবং বিনামূল্যে বই বিতরণ ও পাঠাগার সেবা প্রদান।",
      en: "Providing basic education, free books, and library services to underprivileged and street children."
    },
    longDescription: {
      bn: "আলোর দিশারী পাঠাগার মূলত একটি অলাভজনক ও সেবামূলক শিক্ষা আন্দোলন। আমরা সমাজের সুবিধাবঞ্চিত ও পথশিশুদের মৌলিক শিক্ষার পাশাপাশি নৈতিক ও সামাজিক মূল্যবোধের শিক্ষা দিয়ে থাকি। আমাদের রয়েছে একটি সমৃদ্ধ গণপাঠাগার, যেখানে এলাকার যেকোনো শিক্ষার্থী এসে বিনামূল্যে বই ও পত্রপত্রিকা পড়তে পারে। এছাড়াও আমরা প্রতি বছর দরিদ্র শিক্ষার্থীদের মধ্যে খাতা, কলম ও অন্যান্য শিক্ষা উপকরণ বিতরণ করে আসছি।",
      en: "Alor Dishari Pathagar is a non-profit educational movement. We provide basic education and moral/social values to underprivileged and street children. We have a rich public library where any local student can read books and journals for free. We also distribute notebooks, pens, and educational materials to poor students annually."
    },
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০১৮", en: "2018" },
    members: { bn: "৪৫+", en: "45+" },
    impact: { bn: "১৫০০+ শিশু", en: "1500+ Children" },
    location: { bn: "মিরপুর, ঢাকা", en: "Mirpur, Dhaka" },
    email: "alordishari@example.com",
    phone: { bn: "01712-345678", en: "01712-345678" }
  },
  {
    id: 2,
    name: { bn: "বর্ণমালা সান্ধ্য স্কুল", en: "Bornomala Night School" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "দিনমজুর ও কর্মজীবী শিশুদের জন্য নৈশকালীন বিশেষ শিক্ষাদান ও অক্ষরজ্ঞান দান কার্যক্রম।",
      en: "Night-time special schooling and literacy programs for child laborers and working children."
    },
    longDescription: {
      bn: "যেসব শিশু দিনে কাজের কারণে স্কুলে যেতে পারে না, তাদের জন্য বর্ণমালা সান্ধ্য স্কুল রাতে বিশেষ শিক্ষার ব্যবস্থা করে। আমরা তাদের শুধু অক্ষরজ্ঞানই দেই না, বরং ব্যবহারিক হিসাব-নিকাশ এবং সচেতনতা মূলক শিক্ষাও প্রদান করি যাতে তারা তাদের দৈনন্দিন কাজে ঠকে না যায়। বিশ্ববিদ্যালয় পড়ুয়া একদল উদ্যমী তরুণ এই স্কুলটি পরিচালনা করছেন।",
      en: "For children who cannot attend school during the day due to work, Bornomala Night School provides special education at night. We do not just teach literacy; we also teach practical arithmetic and social awareness so they are not exploited. A group of enthusiastic university students runs this school."
    },
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০১৯", en: "2019" },
    members: { bn: "৩০+", en: "30+" },
    impact: { bn: "৮০০+ কর্মজীবী শিশু", en: "800+ Working Children" },
    location: { bn: "মোহাম্মদপুর, ঢাকা", en: "Mohammadpur, Dhaka" },
    email: "bornomala.night@example.com",
    phone: { bn: "01823-456789", en: "01823-456789" }
  },
  {
    id: 3,
    name: { bn: "স্বপ্নডানা একাডেমি", en: "Shopnodana Academy" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "ঝরে পড়া শিক্ষার্থীদের পুনরায় স্কুলে ফিরিয়ে আনতে ও তাদের বৃত্তি সহায়তা দিতে নিবেদিত।",
      en: "Dedicated to bringing dropout students back to school and providing scholarship support."
    },
    longDescription: {
      bn: "দারিদ্র্যের কারণে অনেক শিক্ষার্থী মাঝপথে পড়াশোনা বন্ধ করে দিতে বাধ্য হয়। স্বপ্নডানা একাডেমি এই ঝরে পড়া শিশুদের চিহ্নিত করে তাদের পরিবারকে বোঝানোর মাধ্যমে এবং মাসিক বৃত্তি প্রদানের মাধ্যমে পুনরায় শিক্ষা জীবনের মূলধারায় ফিরিয়ে আনে। আমরা স্কুল ফি ও পোশাকের দায়িত্বও বহন করি।",
      en: "Due to poverty, many students are forced to drop out midway. Shopnodana Academy identifies these dropout children, counsels their families, and provides monthly scholarships to bring them back to mainstream education. We also cover tuition fees and uniforms."
    },
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০১৭", en: "2017" },
    members: { bn: "৫০+", en: "50+" },
    impact: { bn: "৪০০+ ঝরে পড়া শিক্ষার্থী", en: "400+ Dropout Students" },
    location: { bn: "উত্তরা, ঢাকা", en: "Uttara, Dhaka" },
    email: "shopnodana@example.com",
    phone: { bn: "01934-567890", en: "01934-567890" }
  },
  {
    id: 4,
    name: { bn: "অক্ষর জ্ঞান সমাজ", en: "Okkhor Gyan Somaj" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "বয়স্ক নিরক্ষরতা দূরীকরণে নৈশকালীন শিক্ষা প্রদান এবং বয়স্কদের স্বাক্ষর করতে সাহায্য করা।",
      en: "Providing night classes to eliminate adult illiteracy and help elderly sign their names."
    },
    longDescription: {
      bn: "অক্ষর জ্ঞান সমাজ বিশ্বাস করে শিক্ষার কোনো বয়স নেই। আমরা বয়স্ক পুরুষ ও মহিলাদের জন্য স্বাক্ষরতা অভিযান চালাই, যেন তারা নিজেদের নাম সই করা এবং সাধারণ মোবাইল ব্যবহার ও সাইনবোর্ড পড়ার মতো প্রাথমিক জ্ঞান লাভ করতে পারেন। আমাদের রয়েছে বিশেষ প্রশিক্ষণপ্রাপ্ত শিক্ষক দল।",
      en: "Okkhor Gyan Somaj believes that education has no age limit. We run literacy campaigns for elderly men and women so they can learn basic skills like signing their names, using mobile phones, and reading signs. We have a specially trained teacher group."
    },
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০২০", en: "2020" },
    members: { bn: "২৫+", en: "25+" },
    impact: { bn: "১২০০+ বয়স্ক নাগরিক", en: "1200+ Elderly Citizens" },
    location: { bn: "যাত্রাবাড়ী, ঢাকা", en: "Jatrabari, Dhaka" },
    email: "okkhorgyan@example.com",
    phone: { bn: "01545-678901", en: "01545-678901" }
  },
  {
    id: 5,
    name: { bn: "বিদ্যানিকেতন কল্যাণ ট্রাস্ট", en: "Vidyaniketan Kalyan Trust" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "মেধাবী কিন্তু অর্থনৈতিকভাবে অসচ্ছল শিক্ষার্থীদের উচ্চশিক্ষার সুযোগ তৈরিতে বৃত্তি প্রদান।",
      en: "Providing scholarships to brilliant but financially struggling students for higher education."
    },
    longDescription: {
      bn: "অনেক মেধাবী শিক্ষার্থী অর্থনৈতিক অনটনের কারণে উচ্চশিক্ষা গ্রহণ করতে পারে না। বিদ্যানিকেতন কল্যাণ ট্রাস্ট এই প্রতিভাবান তরুণ-তরুণীদের বিশ্ববিদ্যালয়ের পড়াশোনার সম্পূর্ণ বা আংশিক খরচ বহন করার জন্য বৃত্তি দিয়ে থাকে। এর মাধ্যমে তারা দেশের সম্পদে পরিণত হচ্ছে।",
      en: "Many talented students cannot pursue higher education due to financial crises. Vidyaniketan Kalyan Trust provides scholarships to cover partial or full university costs for these bright minds, helping them transform into national assets."
    },
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০১৫", en: "2015" },
    members: { bn: "৬০+", en: "60+" },
    impact: { bn: "২৫০+ বিশ্ববিদ্যালয় শিক্ষার্থী", en: "250+ University Students" },
    location: { bn: "ধানমন্ডি, ঢাকা", en: "Dhanmondi, Dhaka" },
    email: "vidyaniketan@example.com",
    phone: { bn: "01656-789012", en: "01656-789012" }
  },
  {
    id: 6,
    name: { bn: "সবুজ কুঁড়ি শিশু নিকেতন", en: "Sobuj Kuri Shishu Niketan" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "বস্তি এলাকার প্রাক-প্রাথমিক শিশুদের খেলার ছলে আনন্দময় পরিবেশে বর্ণমালার পাঠদান।",
      en: "Teaching alphabets in a fun, playful environment to slum children at pre-primary levels."
    },
    longDescription: {
      bn: "বস্তি এলাকার সুবিধাবঞ্চিত শিশুদের প্রাতিষ্ঠানিক শিক্ষায় অভ্যস্ত করতে সবুজ কুঁড়ি শিশু নিকেতন প্রাক-প্রাথমিক স্তরে অত্যন্ত চমৎকার কারিকুলাম পরিচালনা করে। এখানে খেলার ছলে, গানের মাধ্যমে শিশুদের আনন্দময় শিক্ষা দেওয়া হয় যাতে তারা স্কুলের প্রতি আগ্রহ পায়।",
      en: "To prepare slum kids for formal schooling, Sobuj Kuri Shishu Niketan operates a creative pre-primary curriculum. We teach alphabets and numbers through play and music, fostering a love for learning in young children."
    },
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০২১", en: "2021" },
    members: { bn: "৩৫+", en: "35+" },
    impact: { bn: "৬০০+ শিশু", en: "600+ Children" },
    location: { bn: "তেজগাঁও, ঢাকা", en: "Tejgaon, Dhaka" },
    email: "sobujkuri@example.com",
    phone: { bn: "01767-890123", en: "01767-890123" }
  },
  {
    id: 7,
    name: { bn: "প্রত্যয় পাঠশালা", en: "Prottay Pathshala" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "গ্রামাঞ্চলের প্রান্তিক ও পিছিয়ে পড়া শিক্ষার্থীদের আধুনিক আইসিটি ও নৈতিক শিক্ষা প্রদান।",
      en: "Providing modern ICT training and moral education to marginal students in rural areas."
    },
    longDescription: {
      bn: "প্রত্যয় পাঠশালা শহরের আধুনিক শিক্ষার আলো প্রত্যন্ত গ্রামাঞ্চলে ছড়িয়ে দিতে কাজ করছে। আমরা নিয়মিত বিভিন্ন গ্রামে গিয়ে ভ্রাম্যমাণ সেশনের মাধ্যমে আধুনিক আইসিটি শিক্ষা, নৈতিকতা এবং ইন্টারনেটের ইতিবাচক ব্যবহারের বিষয়ে প্রশিক্ষণ দিয়ে আসছি।",
      en: "Prottay Pathshala is dedicated to bringing modern education to rural villages. We travel with mobile setups to host interactive workshops on computer skills, code basics, ethics, and safe internet usage."
    },
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০১৬", en: "2016" },
    members: { bn: "৪০+", en: "40+" },
    impact: { bn: "৩০০০+ গ্রামীণ শিক্ষার্থী", en: "3000+ Rural Students" },
    location: { bn: "সাভার, ঢাকা", en: "Savar, Dhaka" },
    email: "prottay.pathshala@example.com",
    phone: { bn: "01878-901234", en: "01878-901234" }
  },
  {
    id: 8,
    name: { bn: "সোপান শিক্ষালয়", en: "Sopan Shikshaloy" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "বিশেষ চাহিদাসম্পন্ন ও প্রতিবন্ধী শিশুদের বিশেষায়িত উপায়ে পাঠদান ও অধিকার সচেতনতা সৃষ্টি।",
      en: "Specialized teaching methods and rights advocacy for differently-abled and autistic children."
    },
    longDescription: {
      bn: "বিশেষ চাহিদাসম্পন্ন শিশুদের সমাজে বোঝা নয়, বরং সম্পদ হিসেবে গড়ে তুলতে সোপান শিক্ষালয় কাজ করছে। আমাদের শিক্ষকরা বিশেষভাবে প্রশিক্ষিত, যারা অত্যন্ত যত্ন সহকারে ইশারা ভাষা ও স্পেশাল থেরাপির মাধ্যমে এই শিশুদের সাধারণ জ্ঞান ও হাতের কাজ শেখান।",
      en: "Sopan Shikshaloy works to integrate children with special needs into mainstream society as assets rather than burdens. Our trained teachers use sign language, special therapies, and craft lessons to educate them with utmost care."
    },
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০১৮", en: "2018" },
    members: { bn: "২০+", en: "20+" },
    impact: { bn: "১৫০+ বিশেষ শিশু", en: "150+ Special Needs Kids" },
    location: { bn: "লালবাগ, ঢাকা", en: "Lalbagh, Dhaka" },
    email: "sopan@example.com",
    phone: { bn: "01989-012345", en: "01989-012345" }
  },
  {
    id: 9,
    name: { bn: "প্রগতির আলো যুব ক্লাব", en: "Progoti Youth Club" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "কিশোরদের জন্য বিজ্ঞানমনস্ক চিন্তা ও রোবোটিক্স ক্লাবের মাধ্যমে আধুনিক প্রযুক্তির পরিচয় করিয়ে দেয়া।",
      en: "Introducing teens to robotics, basic programming, and scientific curiosity."
    },
    longDescription: {
      bn: "বিজ্ঞানের আধুনিক রূপ ও ভবিষ্যৎ প্রযুক্তির সাথে কিশোরদের পরিচয় করিয়ে দিতে প্রগতির আলো যুব ক্লাব প্রতিনিয়ত সায়েন্স ক্যাম্প ও রোবোটিক্স ওয়ার্কশপ আয়োজন করে থাকে। এর উদ্দেশ্য শিক্ষার্থীদের পুঁথিগত বিদ্যার বাইরে ব্যবহারিক বিজ্ঞানে দক্ষ করে তোলা।",
      en: "Progoti Youth Club organizes regular science camps and robotics workshops to introduce teenagers to modern technologies. Our aim is to develop practical scientific thinking beyond rote learning."
    },
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০২২", en: "2022" },
    members: { bn: "৩০+", en: "30+" },
    impact: { bn: "৫০০+ বিজ্ঞানপ্রেমী", en: "500+ Science Enthusiasts" },
    location: { bn: "বনানী, ঢাকা", en: "Banani, Dhaka" },
    email: "progoti.science@example.com",
    phone: { bn: "01590-123456", en: "01590-123456" }
  },
  {
    id: 10,
    name: { bn: "অক্ষর ও জীবন ফাউন্ডেশন", en: "Okkhor O Jibon Foundation" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "চরাঞ্চল ও দুর্গম এলাকার শিশুদের জন্য ভাসমান নৌকায় ভ্রাম্যমাণ স্কুলের কার্যক্রম পরিচালনা।",
      en: "Running floating mobile schools in boats for children living in remote river-islands (Chars)."
    },
    longDescription: {
      bn: "বর্ষাকালে যেসব চরাঞ্চল প্লাবিত হয় এবং যোগাযোগ বিচ্ছিন্ন হয়ে পড়ে, সেখানে অক্ষর ও জীবন ফাউন্ডেশন ভাসমান নৌকায় স্কুল চালায়। নৌকার ভেতর চক-বোর্ড, বই এবং প্রজেক্টরের ব্যবস্থা আছে। শিক্ষকরা সরাসরি নৌকা নিয়ে শিশুদের বাড়ির ঘাটে গিয়ে তাদের শিক্ষা দেন।",
      en: "During monsoons when chars are flooded and isolated, Okkhor O Jibon Foundation operates schools inside floating boats. Equipped with chalkboards, books, and solar projectors, teachers go directly to children's doorsteps to teach."
    },
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০১৫", en: "2015" },
    members: { bn: "৪৫+", en: "45+" },
    impact: { bn: "৭০০+ চরের শিশু", en: "700+ Island Children" },
    location: { bn: "যমুনা নদীর চর", en: "Jamuna River Chars" },
    email: "okkhor.jibon@example.com",
    phone: { bn: "01312-345678", en: "01312-345678" }
  },
  {
    id: 11,
    name: { bn: "জ্ঞানালোক সমাজ কল্যাণ পরিষদ", en: "Gyanalok Kalyan Porishod" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "মেধাবী নারী শিক্ষার্থীদের বিনামূল্যে উচ্চশিক্ষার জন্য ভর্তি কোচিং ও বই কেনার সহায়তা।",
      en: "Free university admission coaching and book grants for meritorious female students."
    },
    longDescription: {
      bn: "মেধাবী তরুণীদের উচ্চশিক্ষায় অংশগ্রহণ বাড়াতে জ্ঞানালোক সমাজ কল্যাণ পরিষদ বিনামূল্যে বিশ্ববিদ্যালয় ভর্তি কোচিং, দিকনির্দেশনা ও হোস্টেল খরচ সংকুলানে সহায়তা দেয়। নারীদের উচ্চশিক্ষা এবং তাদের সাবলম্বী করাই আমাদের মূল লক্ষ্য।",
      en: "To encourage girls in higher education, Gyanalok Kalyan Porishod provides free university admission coaching, academic mentoring, and financial aid for hostel accommodations. Empowering women via education is our goal."
    },
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০১৪", en: "2014" },
    members: { bn: "৫০+", en: "50+" },
    impact: { bn: "৯০০+ ছাত্রী", en: "900+ Female Students" },
    location: { bn: "মতিঝিল, ঢাকা", en: "Motijheel, Dhaka" },
    email: "gyanalok@example.com",
    phone: { bn: "01423-456789", en: "01423-456789" }
  },
  {
    id: 12,
    name: { bn: "পাঠাগার আন্দোলন বাংলাদেশ", en: "Pathagar Andolon Bangladesh" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "প্রত্যেকটি পাড়া-মহল্লায় বই পড়ার অভ্যাস গড়ে তুলতে ছোট ছোট কমিউনিটি বুক কর্নার স্থাপন।",
      en: "Setting up small community book corners in local salons, stations, and cafes."
    },
    longDescription: {
      bn: "স্মার্টফোনের আসক্তি থেকে মানুষকে বইয়ের পাতায় ফিরিয়ে আনতে পাঠাগার আন্দোলন বাংলাদেশ কাজ করে যাচ্ছে। আমরা পাড়া-মহল্লায় সেলুন, রেলস্টেশন ও বাসস্ট্যান্ডে মিনি বুক কর্নার বা ক্যাবিনেট স্থাপন করি, যেন মানুষ অবসরে বই পড়তে পারে।",
      en: "To steer people back to reading from smartphone addictions, Pathagar Andolon installs mini book corners in neighborhoods, barbershops, railway stations, and bus terminals for passengers to read while waiting."
    },
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০১৬", en: "2016" },
    members: { bn: "১০০+", en: "100+" },
    impact: { bn: "৫০+ বুক কর্নার", en: "50+ Book Corners" },
    location: { bn: "ঢাকা ও খুলনা", en: "Dhaka & Khulna" },
    email: "pathagar.andolon@example.com",
    phone: { bn: "01734-567890", en: "01734-567890" }
  },
  {
    id: 13,
    name: { bn: "উদ্দীপন শিক্ষা নিকেতন", en: "Uddipon Shiksha Niketan" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "এতিম ও অনাথ শিশুদের আধুনিক আবাসিক শিক্ষা ও তাদের থাকার সম্পূর্ণ খরচের দায়ভার গ্রহণ।",
      en: "Providing free residential modern education and living costs for orphans."
    },
    longDescription: {
      bn: "উদ্দীপন শিক্ষা নিকেতন সম্পূর্ণ আবাসিক সুবিধাসহ একটি এতিমখানা ও বিদ্যালয় পরিচালনা করে। এখানে শিশুদের শিক্ষা, বাসস্থান, পুষ্টিকর খাদ্য ও খেলাধুলার আধুনিক সুবিধা বিনামূল্যে দেওয়া হয় যাতে তারা সমাজের মূল স্রোতে সুপ্রতিষ্ঠিত হতে পারে।",
      en: "Uddipon Shiksha Niketan runs a free residential orphanage and school. We provide free education, accommodation, nutrition, and recreation facilities to orphans so they can establish themselves in the mainstream society."
    },
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০১৩", en: "2013" },
    members: { bn: "৬০+", en: "60+" },
    impact: { bn: "৩০০+ অনাথ শিশু", en: "300+ Orphans" },
    location: { bn: "গাজীপুর", en: "Gazipur" },
    email: "uddipon@example.com",
    phone: { bn: "01845-678901", en: "01845-678901" }
  },
  {
    id: 14,
    name: { bn: "আলোড়ন শিশু পাঠশালা", en: "Aloron Shishu Pathshala" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "বেদে ও যাযাবর সম্প্রদায়ের শিশুদের জন্য ভ্রাম্যমাণ তাবুর নিচে প্রাথমিক অক্ষরজ্ঞান দান।",
      en: "Mobile canvas-tent classrooms offering basic alphabet schooling for gypsy children."
    },
    longDescription: {
      bn: "যাযাবর ও বেদে সম্প্রদায়ের শিশুরা স্থায়ী বসতি না থাকায় কোনো স্কুলে ভর্তি হতে পারে না। আলোড়ন শিশু পাঠশালা এই যাযাবর বহরের সাথে ঘুরে ঘুরে অস্থায়ী তাঁবুর নিচে শিশুদের প্রাথমিক গণিত, বাংলা ও স্বাস্থ্য সচেতনতার পাঠ দিয়ে থাকে।",
      en: "Due to temporary lifestyles, nomad (Bede) children cannot enroll in permanent schools. Aloron Shishu Pathshala travels with these mobile camps, establishing classes under temporary tents to teach reading, basic math, and health habits."
    },
    image: "https://images.unsplash.com/photo-1510531704581-5b2870972060?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০২০", en: "2020" },
    members: { bn: "১৫+", en: "15+" },
    impact: { bn: "৩৫০+ যাযাবর শিশু", en: "350+ Gypsy Kids" },
    location: { bn: "মুন্সীগঞ্জ", en: "Munshiganj" },
    email: "aloron.nomad@example.com",
    phone: { bn: "01956-789012", en: "01956-789012" }
  },
  {
    id: 15,
    name: { bn: "সৃজনশীল শিক্ষাব্রতী সংঘ", en: "Srijonsheel Debate Club" },
    category: "education",
    categoryName: { bn: "শিক্ষা ও সাক্ষরতা", en: "Education & Literacy" },
    shortDescription: {
      bn: "শিক্ষার্থীদের বুদ্ধিবৃত্তিক বিকাশ ও যুক্তি চর্চায় স্কুল-কলেজে বিতর্ক ক্লাব এবং কুইজ আয়োজন।",
      en: "Organizing debate clubs and quiz events in schools to develop logical thinking."
    },
    longDescription: {
      bn: "পুঁথিগত শিক্ষার বাইরে শিক্ষার্থীদের সৃজনশীল চিন্তাভাবনা ও বাকপটুতার বিকাশ ঘটাতে আমাদের এই সংঘ দেশজুড়ে স্কুল-কলেজগুলোতে ডিবেটিং সোসাইটি গঠন এবং কুইজ প্রতিযোগিতার আয়োজন করে থাকে। আমরা যুক্তিভিত্তিক যুক্তিবাদী তরুণ সমাজ গঠনে কাজ করি।",
      en: "To foster analytical thinking and public speaking beyond classroom syllabus, we assist in establishing debate clubs in schools and colleges, hosting national quiz programs. We strive to create a rational youth generation."
    },
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/education_cat.png",
    established: { bn: "২০১৭", en: "2017" },
    members: { bn: "৮০+", en: "80+" },
    impact: { bn: "২০০+ স্কুল ও কলেজ", en: "200+ Schools & Colleges" },
    location: { bn: "শাহবাগ, ঢাকা", en: "Shahbagh, Dhaka" },
    email: "srijonsheel.debate@example.com",
    phone: { bn: "01567-890123", en: "01567-890123" }
  },

  // SOCIAL WELFARE (10 Clubs)
  {
    id: 16,
    name: { bn: "সহমর্মিতা ফাউন্ডেশন", en: "Sohomormita Foundation" },
    category: "welfare",
    categoryName: { bn: "সমাজ কল্যাণ", en: "Social Welfare" },
    shortDescription: {
      bn: "শীতার্ত ও প্রাকৃতিক দুর্যোগ কবলিত মানুষের জন্য ত্রাণ বিতরণ এবং খাদ্য ব্যাংক পরিচালনা।",
      en: "Managing food banks and distributing relief to disaster-stricken and poor people."
    },
    longDescription: {
      bn: "সহমর্মিতা ফাউন্ডেশন যেকোনো প্রাকৃতিক দুর্যোগ বা মানবিক সংকটে সবচেয়ে আগে সাড়া দেয়। আমাদের একটি স্থায়ী 'খাদ্য ব্যাংক' রয়েছে যার মাধ্যমে আমরা প্রতিদিন অসহায়, ছিন্নমূল ও অভুক্ত মানুষদের একবেলা পুষ্টিকর খাদ্য সরবরাহ করি। এছাড়া শীতকালে আমরা হাজার হাজার কম্বল বিতরণ করে আসছি।",
      en: "Sohomormita Foundation responds rapidly to disasters. We operate a daily food bank serving free nutritious meals to street dwellers and run large-scale winter clothing drives distributing blankets to thousands of people in distress."
    },
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৫", en: "2015" },
    members: { bn: "১২০+", en: "120+" },
    impact: { bn: "৫০,০০০+ মানুষ", en: "50,000+ People" },
    location: { bn: "পুরান ঢাকা", en: "Old Dhaka" },
    email: "sohomormita@example.com",
    phone: { bn: "01778-901234", en: "01778-901234" }
  },
  {
    id: 17,
    name: { bn: "হিউম্যান কেয়ার সোসাইটি", en: "Human Care Society" },
    category: "welfare",
    categoryName: { bn: "সমাজ কল্যাণ", en: "Social Welfare" },
    shortDescription: {
      bn: "বৃদ্ধাশ্রমে থাকা প্রবীণদের মানসিক প্রশান্তি ও চিকিৎসাসেবা এবং উৎসবের আনন্দে শামিল করা।",
      en: "Providing medical aids, companionship, and festive gifts to elders in old age homes."
    },
    longDescription: {
      bn: "পরিবার থেকে বিচ্ছিন্ন ও বৃদ্ধাশ্রমে থাকা প্রবীণদের একাকীত্ব দূর করতে ও তাদের মুখে হাসি ফোটাতে হিউম্যান কেয়ার সোসাইটি কাজ করে। আমাদের স্বেচ্ছাসেবকরা প্রতি সপ্তাহে বৃদ্ধাশ্রমে গিয়ে তাদের সাথে সময় কাটান, গল্প করেন এবং তাদের প্রয়োজনীয় ওষুধ ও উন্নত খাদ্য সরবরাহ করেন।",
      en: "To alleviate loneliness and bring smiles to abandoned elders in old age homes, Human Care volunteers visit weekly to share stories, provide medical checkups, essential prescription drugs, and hold festive lunches."
    },
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৮", en: "2018" },
    members: { bn: "৪০+", en: "40+" },
    impact: { bn: "৩০০+ প্রবীণ", en: "300+ Elderly Citizens" },
    location: { bn: "উত্তরা, ঢাকা", en: "Uttara, Dhaka" },
    email: "humancare@example.com",
    phone: { bn: "01889-012345", en: "01889-012345" }
  },
  {
    id: 18,
    name: { bn: "বন্ধন সেবামূলক সংগঠন", en: "Bondhon Welfare Association" },
    category: "welfare",
    categoryName: { bn: "সমাজ কল্যাণ", en: "Social Welfare" },
    shortDescription: {
      bn: "অসহায় পরিবারের কন্যা সন্তানদের বিয়ের খরচ বহনে এবং বিধবা নারীদের স্বাবলম্বী করতে সাহায্য।",
      en: "Supporting marriage costs of poor girls and training widows for financial independence."
    },
    longDescription: {
      bn: "বন্ধন সেবামূলক সংগঠন সমাজের পিছিয়ে পড়া দরিদ্র নারীদের অর্থনৈতিকভাবে স্বাবলম্বী করার দায়িত্ব নিয়ে থাকে। আমরা বিধবা ও স্বামী পরিত্যক্তা নারীদের সেলাই মেশিন উপহার দিয়ে প্রশিক্ষণ দেই এবং চরম দরিদ্র পরিবারের মেয়েদের বিয়েতে প্রয়োজনীয় যৌতুকবিহীন উৎসব খরচে সহায়তা প্রদান করি।",
      en: "Bondhon Welfare focuses on financial independence for underprivileged women. We gift sewing machines and offer tailoring training to widows and distressed women, as well as cover basic marriage costs for daughters of extreme-poor families."
    },
    image: "https://images.unsplash.com/photo-1469571486090-7d99c43d34bc?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৬", en: "2016" },
    members: { bn: "৫০+", en: "50+" },
    impact: { bn: "১৫০+ স্বাবলম্বী পরিবার", en: "150+ Self-reliant Families" },
    location: { bn: "ধানমন্ডি, ঢাকা", en: "Dhanmondi, Dhaka" },
    email: "bondhon.welfare@example.com",
    phone: { bn: "01590-123456", en: "01590-123456" }
  },
  {
    id: 19,
    name: { bn: "একতা সমাজ কল্যাণ সংস্থা", en: "Ekota Somaj Kalyan" },
    category: "welfare",
    categoryName: { bn: "সমাজ কল্যাণ", en: "Social Welfare" },
    shortDescription: {
      bn: "মাদকাসক্ত যুবকদের স্বাভাবিক জীবনে ফিরিয়ে আনতে পুনর্বাসন সহায়তা ও কাউন্সিলিং সেশন।",
      en: "Rehabilitation support, awareness campaigns, and counseling for drug-addicted youth."
    },
    longDescription: {
      bn: "মাদকের করাল গ্রাস থেকে তরুণ সমাজকে বাঁচাতে একতা সমাজ কল্যাণ সংস্থা অত্যন্ত গুরুত্বের সাথে কাজ করে। আমরা সচেতনতামূলক উঠান বৈঠক আয়োজন করি এবং আক্রান্ত যুবকদের ভালো পুনর্বাসন সেন্টারে পাঠানো এবং সুস্থ হয়ে ফিরে আসার পর তাদের সামাজিক স্বীকৃতির কাজ করি।",
      en: "To save youth from the grip of drug addiction, Ekota conducts local anti-drug meetings, provides financial aid to send addicted youngsters to verified rehab centers, and helps them re-integrate and find jobs upon recovery."
    },
    image: "https://images.unsplash.com/photo-1508847154043-be12a62861c1?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৭", en: "2017" },
    members: { bn: "৩০+", en: "30+" },
    impact: { bn: "২০০+ পুনর্বাসিত যুবক", en: "200+ Rehabilitated Youth" },
    location: { bn: "খিলগাঁও, ঢাকা", en: "Khilgaon, Dhaka" },
    email: "ekota.rehab@example.com",
    phone: { bn: "01312-345678", en: "01312-345678" }
  },
  {
    id: 20,
    name: { bn: "আস্থা ভলান্টিয়ার গ্রুপ", en: "Astha Volunteer Group" },
    category: "welfare",
    categoryName: { bn: "সমাজ কল্যাণ", en: "Social Welfare" },
    shortDescription: {
      bn: "যেকোনো জরুরি উদ্ধার অভিযান ও অগ্নি নির্বাপণে ফায়ার সার্ভিসকে সহায়তা করার স্বেচ্ছাসেবক দল।",
      en: "Trained volunteer squad helping fire service and rescue efforts in emergencies."
    },
    longDescription: {
      bn: "আস্থা ভলান্টিয়ার গ্রুপ মূলত একটি দুর্যোগ প্রতিরোধ ও উদ্ধারকারী দল। আমাদের সকল সদস্যদের ফায়ার সার্ভিস ও সিভিল ডিফেন্স থেকে প্রফেশনাল উদ্ধার কাজের ও প্রাথমিক চিকিৎসার উপর প্রশিক্ষণ দেওয়া রয়েছে। আমরা অগ্নিকাণ্ড, বন্যা বা যেকোনো দুর্ঘটনায় আক্রান্তদের উদ্ধারে ঝাঁপিয়ে পড়ি।",
      en: "Astha is an emergency disaster rescue team. All members are trained by Fire Service & Civil Defense in fire safety, search-rescue, and first aid. We deploy alongside official departments during fires, floods, and building collapses."
    },
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৯", en: "2019" },
    members: { bn: "৭০+", en: "70+" },
    impact: { bn: "১০০+ সফল উদ্ধার অভিযান", en: "100+ Successful Operations" },
    location: { bn: "তেজগাঁও, ঢাকা", en: "Tejgaon, Dhaka" },
    email: "astha.emergency@example.com",
    phone: { bn: "01423-456789", en: "01423-456789" }
  },
  {
    id: 21,
    name: { bn: "উৎসর্গ ফাউন্ডেশন বাংলাদেশ", en: "Utshorgo Foundation" },
    category: "welfare",
    categoryName: { bn: "সমাজ কল্যাণ", en: "Social Welfare" },
    shortDescription: {
      bn: "প্রতিবন্ধী ও পঙ্গু ব্যক্তিদের জন্য বিনামূল্যে হুইলচেয়ার, কৃত্রিম পা ও সাহায্য বিতরণ।",
      en: "Distributing free wheelchairs and prosthetic limbs to physically challenged people."
    },
    longDescription: {
      bn: "শারীরিকভাবে অক্ষম বা পঙ্গু ব্যক্তিদের চলাফেরাকে সহজ করতে এবং তাদের নতুন করে বাঁচার স্বপ্ন দেখাতে উৎসর্গ ফাউন্ডেশন কাজ করছে। আমরা দরিদ্র পঙ্গু ব্যক্তিদের কৃত্রিম অঙ্গ সংযোজন, হুইলচেয়ার এবং বিশেষ ট্রাইসাইকেল বিনামূল্যে প্রদান করে থাকি।",
      en: "To facilitate mobility and restore hope for physically challenged people, Utshorgo Foundation distributes free wheelchairs, crutches, and funds prosthetic limb installations for poor disabled individuals."
    },
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৫", en: "2015" },
    members: { bn: "৮০+", en: "80+" },
    impact: { bn: "১২০০+ প্রতিবন্ধী ব্যক্তি", en: "1200+ Disabled Beneficiaries" },
    location: { bn: "পল্টন, ঢাকা", en: "Paltan, Dhaka" },
    email: "utshorgo.foundation@example.com",
    phone: { bn: "01734-567890", en: "01734-567890" }
  },
  {
    id: 22,
    name: { bn: "সেবার আলো সমাজ", en: "Sebar Alo Somaj" },
    category: "welfare",
    categoryName: { bn: "সমাজ কল্যাণ", en: "Social Welfare" },
    shortDescription: {
      bn: "ছিন্নমূল ও পথশিশুদের জন্য একটি স্থায়ী আশ্রয়কেন্দ্র ও পুনর্বাসনের ব্যবস্থা করা।",
      en: "Operating shelter homes and rehabilitation programs for homeless street children."
    },
    longDescription: {
      bn: "সেবার আলো সমাজ ঢাকা শহরের পথশিশুদের নিরাপদ আশ্রয় দিতে ডে-কেয়ার সেন্টার ও নৈশ আশ্রয়কেন্দ্র পরিচালনা করে। এখানে শিশুরা গোসল, স্বাস্থ্যকর খাবার ও নিরাপদে ঘুমানোর সুযোগ পায়। আমরা তাদের প্রাতিষ্ঠানিক ও বৃত্তিমূলক শিক্ষা নিশ্চিত করি।",
      en: "Sebar Alo Somaj provides safe shelter for street kids. We run day-care centers and night shelters offering hot meals, bath utilities, and secure beds, along with primary education and skill training."
    },
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১২", en: "2012" },
    members: { bn: "৫৫+", en: "55+" },
    impact: { bn: "৫০০+ আশ্রয়হীন শিশু", en: "500+ Homeless Children" },
    location: { bn: "কমলাপুর, ঢাকা", en: "Kamlapur, Dhaka" },
    email: "sebaralo@example.com",
    phone: { bn: "01845-678901", en: "01845-678901" }
  },
  {
    id: 23,
    name: { bn: "আলোড়িত সমাজ কল্যাণ সংঘ", en: "Alorit Kalyan Songho" },
    category: "welfare",
    categoryName: { bn: "সমাজ কল্যাণ", en: "Social Welfare" },
    shortDescription: {
      bn: "পরিচ্ছন্ন ও সুন্দর সমাজ গড়তে যুবকদের উদ্বুদ্ধ করে আত্মকর্মসংস্থান ও সমাজসেবায় সম্পৃক্ত করা।",
      en: "Empowering youth through interest-free micro-loans and community cleanliness drives."
    },
    longDescription: {
      bn: "আমাদের এই সংঘ মূলত যুবশক্তিকে সমাজ গঠনমূলক কাজে ডাইভার্ট করে থাকে। অলস যুবকদের সংগঠিত করে আমরা বিভিন্ন পাড়ায় পরিচ্ছন্নতা অভিযান, সামাজিক সচেতনতা তৈরি এবং ছোট ছোট ব্যবসা শুরু করতে তাদের সুদমুক্ত মূলধন ও ব্যবসায়িক জ্ঞান দিয়ে সাহায্য করি।",
      en: "Our association channels youth energy into community development. We organize local hygiene drives and offer interest-free start-up capital and mentoring for unemployed youth to launch micro-businesses."
    },
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৮", en: "2018" },
    members: { bn: "৯০+", en: "90+" },
    impact: { bn: "১৫০০+ যুব কর্মী", en: "1500+ Youth Engaged" },
    location: { bn: "বাসাবো, ঢাকা", en: "Basabo, Dhaka" },
    email: "alorit.youth@example.com",
    phone: { bn: "01956-789012", en: "01956-789012" }
  },
  {
    id: 24,
    name: { bn: "নিঃস্বার্থ বন্ধু ফোরাম", en: "Nisshartho Bondhu Forum" },
    category: "welfare",
    categoryName: { bn: "সমাজ কল্যাণ", en: "Social Welfare" },
    shortDescription: {
      bn: "দুস্থ ও দরিদ্র রোগীদের জন্য চিকিৎসায় আর্থিক সাহায্য, রক্তের ব্যবস্থা এবং মানসিক সহায়তা।",
      en: "Raising medical funds and blood donation networks for critical patients."
    },
    longDescription: {
      bn: "টাকার অভাবে যাদের জটিল চিকিৎসা (যেমন ক্যান্সার, কিডনি ডায়ালাইসিস বা হার্ট সার্জারি) বন্ধ হয়ে যাওয়ার উপক্রম হয়, নিঃস্বার্থ বন্ধু ফোরাম তাদের জন্য গণতহবিল বা ক্রাউডফান্ডিং-এর মাধ্যমে প্রয়োজনীয় অর্থ সংগ্রহ করে দেয়। এছাড়াও আমরা বিনামূল্যে রক্তের ব্যবস্থা করে থাকি।",
      en: "For patients whose life-saving treatments (like cancer therapies or heart surgeries) are stalled by costs, Nisshartho Bondhu raises crowdfunding support. We also run a 24/7 blood donation network."
    },
    image: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০২১", en: "2021" },
    members: { bn: "৪৫+", en: "45+" },
    impact: { bn: "৩০০+ জটিল রোগী", en: "300+ Critical Patients" },
    location: { bn: "শাহবাগ, ঢাকা", en: "Shahbagh, Dhaka" },
    email: "nissharthobondhu@example.com",
    phone: { bn: "01567-890123", en: "01567-890123" }
  },
  {
    id: 25,
    name: { bn: "নবদিগন্ত কল্যাণ সংঘ", en: "Nobodigonto Kalyan" },
    category: "welfare",
    categoryName: { bn: "সমাজ কল্যাণ", en: "Social Welfare" },
    shortDescription: {
      bn: "কারাগার থেকে মুক্তিপ্রাপ্ত কয়েদিদের সমাজে মানিয়ে নিতে ও জীবিকা অর্জনে পুনর্বাসন।",
      en: "Rehabilitating released ex-convicts to help them integrate into society."
    },
    longDescription: {
      bn: "জেলখানা থেকে অনেক মানুষ সাজার মেয়াদ শেষ করে বের হওয়ার পর সমাজ বা পরিবার তাদের গ্রহণ করতে চায় না। নবদিগন্ত কল্যাণ সংঘ এই সাবেক কয়েদিদের মনস্তাত্ত্বিক কাউন্সেলিং দেয় এবং তাদের জীবিকা নির্বাহের জন্য ছোটখাটো কাজের সুযোগ করে দেয় যাতে তারা আবার অপরাধে না জড়ায়।",
      en: "Ex-convicts released from prison often face severe social exclusion. Nobodigonto offers them psychological counseling and vocational links so they can start fresh, secure livelihoods, and avoid reoffending."
    },
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৪", en: "2014" },
    members: { bn: "৩৫+", en: "35+" },
    impact: { bn: "৮০+ পুনর্বাসিত ব্যক্তি", en: "80+ Rehabilitated Persons" },
    location: { bn: "কেরানীগঞ্জ, ঢাকা", en: "Keraniganj, Dhaka" },
    email: "nobodigonto@example.com",
    phone: { bn: "01712-345678", en: "01712-345678" }
  },

  // ENVIRONMENT (5 Clubs)
  {
    id: 26,
    name: { bn: "সবুজ বাংলাদেশ পরিবেশ ক্লাব", en: "Green Bangladesh Club" },
    category: "environment",
    categoryName: { bn: "পরিবেশ ও প্রকৃতি", en: "Environment & Nature" },
    shortDescription: {
      bn: "দেশব্যাপী বৃক্ষরোপণ, প্লাস্টিক বর্জন আন্দোলন ও নদী দূষণ রোধে গণসচেতনতা তৈরি।",
      en: "Nationwide tree plantation drives, anti-plastic campaigns, and river cleanup awareness."
    },
    longDescription: {
      bn: "সবুজ বাংলাদেশ পরিবেশ ক্লাব জলবায়ু পরিবর্তন মোকাবেলায় ও একটি বাসযোগ্য সবুজ দেশ গড়তে কাজ করে। আমরা প্রতি বছর বর্ষাকালে স্কুল ও কলেজের শিক্ষার্থীদের মাঝে লাখো ফলের ও ঔষধি গাছের চারা বিতরণ ও রোপণ করি। এছাড়া আমরা প্লাস্টিক বর্জনের জন্য জনসচেতনতা মূলক প্রচার চালাই।",
      en: "Green Bangladesh works on climate action. We distribute and plant hundreds of thousands of fruit and medicinal saplings via school/college drives annually and organize trash pick-up sessions near polluted riverbanks."
    },
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৬", en: "2016" },
    members: { bn: "১৫০+", en: "150+" },
    impact: { bn: "২ লাখ+ বৃক্ষরোপণ", en: "200k+ Trees Planted" },
    location: { bn: "ধানমন্ডি, ঢাকা", en: "Dhanmondi, Dhaka" },
    email: "sobujbd@example.com",
    phone: { bn: "01823-456789", en: "01823-456789" }
  },
  {
    id: 27,
    name: { bn: "ধরিত্রী রক্ষা আন্দোলন", en: "Save the Earth Movement" },
    category: "environment",
    categoryName: { bn: "পরিবেশ ও প্রকৃতি", en: "Environment & Nature" },
    shortDescription: {
      bn: "নগরাঞ্চলে ছাদ বাগান আন্দোলনে সহায়তা ও জলাশয় ভরাটের বিরুদ্ধে আইনি লড়াই।",
      en: "Assisting urban rooftop gardening and defending public wetlands legally."
    },
    longDescription: {
      bn: "ধরিত্রী রক্ষা আন্দোলন শহুরে তাপমাত্রা কমাতে ছাদ বাগান তৈরিতে মানুষকে উদ্বুদ্ধ করে ও কারিগরি সহায়তা দেয়। এছাড়াও শহরের নদী, পুকুর ও ঐতিহ্যবাহী খাল বেআইনিভাবে ভরাট হওয়া রুখতে আমরা আইনি সহায়তা ও প্রতিবাদ সভার আয়োজন করি।",
      en: "To lower urban heat island effects, we support residents in building rooftop gardens. We also file public interest litigations and hold protests against illegal encroachments on city canals, rivers, and ponds."
    },
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৫", en: "2015" },
    members: { bn: "৬০+", en: "60+" },
    impact: { bn: "৩০০+ ছাদ বাগান", en: "300+ Roof Gardens" },
    location: { bn: "লালমাটিয়া, ঢাকা", en: "Lalmatia, Dhaka" },
    email: "dhoritri@example.com",
    phone: { bn: "01934-567890", en: "01934-567890" }
  },
  {
    id: 28,
    name: { bn: "বৃক্ষরোপণ ও প্রকৃতি সংরক্ষণ সংঘ", en: "Nature Conservation Club" },
    category: "environment",
    categoryName: { bn: "পরিবেশ ও প্রকৃতি", en: "Environment & Nature" },
    shortDescription: {
      bn: "বন্যপ্রাণী ও পাখির অভয়ারণ্য তৈরি এবং বনাঞ্চলের গাছ কাটা বন্ধে গ্রাম্য সভা।",
      en: "Creating bird sanctuaries and educating rural villagers against illegal logging."
    },
    longDescription: {
      bn: "বন্যপ্রাণীদের সুরক্ষায় এবং তাদের জন্য নিরাপদ প্রাকৃতিক বাসস্থান তৈরিতে আমাদের এই ক্লাব কাজ করে। আমরা দেশের বিভিন্ন বনে কৃত্রিম মাটির বাসা তৈরি করে পাখির প্রজননে সাহায্য করি এবং সুন্দরবন ও অন্যান্য বনের আশেপাশের গ্রামে শিকার বন্ধ করতে প্রচার চালাই।",
      en: "We protect wildlife habitats. Our volunteers hang artificial clay pots in forests to aid bird nesting and run community campaigns in villages adjacent to reserve areas like Sundarbans to stop illegal poaching and logging."
    },
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৮", en: "2018" },
    members: { bn: "৪৫+", en: "45+" },
    impact: { bn: "১৫০০+ পাখির কৃত্রিম বাসা", en: "1500+ Nesting Boxes" },
    location: { bn: "শ্রীমঙ্গল, সিলেট", en: "Sreemangal, Sylhet" },
    email: "brikkho.nature@example.com",
    phone: { bn: "01545-678901", en: "01545-678901" }
  },
  {
    id: 29,
    name: { bn: "ক্লিন ঢাকা ক্লিন লাইফ", en: "Clean Dhaka Clean Life" },
    category: "environment",
    categoryName: { bn: "পরিবেশ ও প্রকৃতি", en: "Environment & Nature" },
    shortDescription: {
      bn: "শহরের ময়লা ফেলার নির্দিষ্ট জায়গা ব্যবহারে ও যত্রতত্র আবর্জনা না ফেলতে উদ্বুদ্ধ করা।",
      en: "Hosting regular cleaning campaigns and placing waste bins in public squares."
    },
    longDescription: {
      bn: "ক্লিন ঢাকা ক্লিন লাইফ ঢাকার গুরুত্বপূর্ণ পর্যটন ও জনবহুল স্থানে (যেমন টিএসসি, ধানমন্ডি লেক) নিয়মিত স্বেচ্ছাশ্রমে পরিচ্ছন্নতা অভিযান চালায়। আমরা ডাস্টবিন স্থাপন করি এবং পথচারীদের সচেতন করি যেন তারা ময়লা রাস্তায় ফেলে শহরের সৌন্দর্য নষ্ট না করে।",
      en: "Our club hosts street sweeps in tourist spots like Dhaka University TSC and Dhanmondi Lake. We install garbage bins and educate pedestrians to discard waste responsibly to keep public zones beautiful."
    },
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৯", en: "2019" },
    members: { bn: "১১০+", en: "110+" },
    impact: { bn: "১০০+ পরিচ্ছন্নতা ক্যাম্পেইন", en: "100+ Cleanup Drives" },
    location: { bn: "টিএসসি, ঢাকা", en: "TSC, Dhaka" },
    email: "cleandhaka@example.com",
    phone: { bn: "01656-789012", en: "01656-789012" }
  },
  {
    id: 30,
    name: { bn: "তরুণ পরিবেশকর্মী জোট", en: "Youth Environmentalist Alliance" },
    category: "environment",
    categoryName: { bn: "পরিবেশ ও প্রকৃতি", en: "Environment & Nature" },
    shortDescription: {
      bn: "বিদ্যালয়ের শিক্ষার্থীদের জলবায়ু পরিবর্তনের ক্ষতিকর প্রভাব সম্পর্কে সচেতনতা ও কর্মশালা।",
      en: "Conducting climate change workshops and forming eco-clubs in schools."
    },
    longDescription: {
      bn: "তরুণ পরিবেশকর্মী জোট মূলত স্কুলে পড়াশোনা করা ছোট বাচ্চাদের জলবায়ু পরিবর্তনের কারণ এবং এর ক্ষতিকর প্রভাবগুলো সহজ ভাষায় শেখায়। আমরা স্কুলে 'গ্রিন ক্লাব' তৈরি করি যাতে বাচ্চারা ছোটবেলা থেকেই পরিবেশ সচেতন হয়ে ওঠে ও ময়লা আলাদা করা শেখে।",
      en: "We teach school children about global warming and environmental protection in simple terms. We support setting up school 'Green Clubs' to practice recycling and plant care at a young age."
    },
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০২০", en: "2020" },
    members: { bn: "৪০+", en: "40+" },
    impact: { bn: "৮০+ স্কুল ও সেমিনার", en: "80+ School Seminars" },
    location: { bn: "মোহাম্মদপুর, ঢাকা", en: "Mohammadpur, Dhaka" },
    email: "greenyouth@example.com",
    phone: { bn: "01767-890123", en: "01767-890123" }
  },

  // HEALTH (5 Clubs)
  {
    id: 31,
    name: { bn: "নিরাময় স্বাস্থ্য সেবা ক্লাব", en: "Niramoy Health Club" },
    category: "health",
    categoryName: { bn: "স্বাস্থ্য ও সচেতনতা", en: "Health & Awareness" },
    shortDescription: {
      bn: "বস্তি ও চরাঞ্চলের প্রান্তিক জনগোষ্ঠীর জন্য বিনামূল্যে হেলথ ক্যাম্প ও বিনামূল্যে ওষুধ বিতরণ।",
      en: "Free medical camps and distribution of emergency medicines in remote sectors."
    },
    longDescription: {
      bn: "নিরাময় স্বাস্থ্য সেবা ক্লাব শহরের বস্তি এলাকা এবং দুর্গম গ্রামে যেখানে কোনো ডাক্তার থাকে না, সেখানে প্রতি মাসে এমবিবিএস ডাক্তারদের নিয়ে বিনামূল্যে মেডিকেল ক্যাম্প আয়োজন করে। আমরা বিনামূল্যে চেকআপ, ডায়াবেটিস টেস্ট ও এক মাসের জন্য প্রয়োজনীয় ওষুধ সরবরাহ করি।",
      en: "Niramoy runs free medical camps in slums and villages lacking access to clinics. Doctors volunteer to check patients, run basic tests, and hand out free prescription drugs to last a month."
    },
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৭", en: "2017" },
    members: { bn: "৮০+ (ডাক্তারসহ)", en: "88+ (incl. Doctors)" },
    impact: { bn: "৮০০০+ রোগী", en: "8000+ Patients Treated" },
    location: { bn: "তেজগাঁও, ঢাকা", en: "Tejgaon, Dhaka" },
    email: "niramoy@example.com",
    phone: { bn: "01878-901234", en: "01878-901234" }
  },
  {
    id: 32,
    name: { bn: "আরোগ্য ভলান্টিয়ার্স", en: "Arogyo Volunteers" },
    category: "health",
    categoryName: { bn: "স্বাস্থ্য ও সচেতনতা", en: "Health & Awareness" },
    shortDescription: {
      bn: "মানসিক অবসাদ ও ডিপ্রেশন মোকাবেলায় যুবকদের জন্য বিনামূল্যে হেল্পলাইন ও থেরাপি।",
      en: "Free tele-counseling support and awareness campaigns for youth mental health."
    },
    longDescription: {
      bn: "বর্তমান তরুণ সমাজের একটি বড় সমস্যা হলো মানসিক অবসাদ ও ডিপ্রেশন। আরোগ্য ভলান্টিয়ার্স পেশাদার সাইকোলজিস্ট ও কাউন্সেলরদের তত্ত্বাবধানে একটি সার্বক্ষণিক হটলাইন এবং ফ্রি অনলাইন থেরাপি সেশন পরিচালনা করে। আমরা মানসিক স্বাস্থ্যকে স্বাভাবিক বিষয় হিসেবে সমাজে প্রতিষ্ঠা করতে চাই।",
      en: "To fight depression and anxiety among youth, Arogyo operates a free tele-counseling helpline. Licensed psychologists volunteer to host webinars and individual therapy sessions to de-stigmatize mental illnesses."
    },
    image: "https://images.unsplash.com/photo-1527137341206-1d13650075c6?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০২০", en: "2020" },
    members: { bn: "২৫+ সাইকোলজিস্ট", en: "25+ Psychologists" },
    impact: { bn: "৩০০০+ কাউন্সেলিং", en: "3000+ Counseling Sessions" },
    location: { bn: "বনানী, ঢাকা", en: "Banani, Dhaka" },
    email: "arogyo.mind@example.com",
    phone: { bn: "01989-012345", en: "01989-012345" }
  },
  {
    id: 33,
    name: { bn: "রক্তদান ও জরুরি সেবা কেন্দ্র", en: "Emergency Blood Bank" },
    category: "health",
    categoryName: { bn: "স্বাস্থ্য ও সচেতনতা", en: "Health & Awareness" },
    shortDescription: {
      bn: "জরুরি রক্তের খোঁজে ২৪/৭ ভলান্টিয়ার নেটওয়ার্ক এবং থ্যালাসেমিয়া সচেতনতা ক্যাম্পেইন।",
      en: "24/7 volunteer network responding to urgent blood requests."
    },
    longDescription: {
      bn: "রক্তের অভাবে যেন কোনো প্রাণ অকালে ঝরে না যায়, সেই লক্ষ্যে কাজ করে আমাদের রক্তদান ও জরুরি সেবা কেন্দ্র। আমরা একটি বিশাল ডেটাবেজ মেইনটেইন করি, যার মাধ্যমে যেকোনো মুহূর্তে যেকোনো গ্রুপ ও নেগেটিভ গ্রুপের রক্তদাতার সন্ধান দেওয়া সম্ভব হয়। রক্তদানে উদ্বুদ্ধ করতে আমরা বিভিন্ন সেমিনারও করি।",
      en: "Our central database connects patients to verified donors instantly. We maintain a reliable network for rare negative blood types and host routine university drives to counter thalassemia and support hospitals."
    },
    image: "https://images.unsplash.com/photo-1615461066841-6116ecdccd04?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৩", en: "2013" },
    members: { bn: "৫০০+ রক্তদাতা", en: "500+ Listed Donors" },
    impact: { bn: "১২,০০০+ ব্যাগ রক্ত", en: "12,000+ Blood Bags" },
    location: { bn: "ডিএমসিএইচ, ঢাকা", en: "DMCH, Dhaka" },
    email: "blood.emergency@example.com",
    phone: { bn: "01590-123456", en: "01590-123456" }
  },
  {
    id: 34,
    name: { bn: "সচেতন মা ও মাতৃত্ব স্বাস্থ্য সংঘ", en: "Socheton Ma Association" },
    category: "health",
    categoryName: { bn: "স্বাস্থ্য ও সচেতনতা", en: "Health & Awareness" },
    shortDescription: {
      bn: "গর্ভবতী ও প্রসূতি মায়েদের পুষ্টিকর খাবার এবং নিরাপদ প্রসবের জন্য পরামর্শ প্রদান।",
      en: "Providing maternal nutrition guidance and safe child delivery counseling."
    },
    longDescription: {
      bn: "মাতৃমৃত্যু ও নবজাতকের মৃত্যুর হার কমাতে এবং মায়েদের সচেতন করতে আমাদের এই বিশেষ সংঘ কাজ করছে। আমরা গ্রামাঞ্চলে ধাত্রী ও গর্ভবতী মায়েদের নিয়ে সেশন করি, যেখানে গর্ভকালীন পুষ্টি, গর্ভকালীন জটিলতার লক্ষণসমূহ এবং নিরাপদ ও নিরাপদ প্রসব সম্পর্কে ডাক্তার দ্বারা পরামর্শ দেওয়া হয়।",
      en: "To reduce infant and maternal mortality, we host village meetups for expectant mothers. Doctors discuss pregnancy nutrition, symptoms of complications, and encourage sterile clinic deliveries over risky home births."
    },
    image: "https://images.unsplash.com/photo-1505151822060-229798444a0e?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৫", en: "2015" },
    members: { bn: "৩০+", en: "30+" },
    impact: { bn: "২০০০+ মা ও শিশু", en: "2000+ Mother-Child Pairs" },
    location: { bn: "সাভার, ঢাকা", en: "Savar, Dhaka" },
    email: "socheton.ma@example.com",
    phone: { bn: "01312-345678", en: "01312-345678" }
  },
  {
    id: 35,
    name: { bn: "সুরক্ষাধারা হাইজিন ক্লাব", en: "Shurokkhadhara Hygiene" },
    category: "health",
    categoryName: { bn: "স্বাস্থ্য ও সচেতনতা", en: "Health & Awareness" },
    shortDescription: {
      bn: "বস্তি ও প্রত্যন্ত স্কুলের মেয়েদের জন্য স্বাস্থ্যকর প্যাড ও নিরাপদ স্যানিটেশন সচেতনতা।",
      en: "Free sanitary pad distribution and menstrual health awareness for schoolgirls."
    },
    longDescription: {
      bn: "মেয়েদের প্রজনন স্বাস্থ্য ও স্যানিটেশনের অধিকার নিয়ে কাজ করছে সুরক্ষাধারা হাইজিন ক্লাব। আমরা বিশেষ করে বস্তি এবং দরিদ্র বিদ্যালয়ের মেয়েদের মাঝে বিনামূল্যে স্যানিটারি প্যাড বিতরণ করি এবং পিরিয়ডকালীন সময়ে ও স্বাস্থ্য সচেতনতার জন্য পরামর্শ ও নির্দেশনা দিয়ে থাকি।",
      en: "We support menstrual hygiene and dignity. Our team visits slum schools to hand out free sanitary pads, install disposal bins, and conduct medical counseling sessions to break period stigmas and prevent infections."
    },
    image: "https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৮", en: "2018" },
    members: { bn: "৩৫+", en: "35+" },
    impact: { bn: "৪০০০+ তরুণী", en: "4000+ Young Women" },
    location: { bn: "যাত্রাবাড়ী, ঢাকা", en: "Jatrabari, Dhaka" },
    email: "shurokkha@example.com",
    phone: { bn: "01423-456789", en: "01423-456789" }
  },

  // SKILLS (5 Clubs)
  {
    id: 36,
    name: { bn: "দক্ষ যুব উদ্যোক্তা ফোরাম", en: "Youth Entrepreneurship Forum" },
    category: "skills",
    categoryName: { bn: "দক্ষতা ও নেতৃত্ব", en: "Skills & Leadership" },
    shortDescription: {
      bn: "বেকার যুবকদের জন্য হস্তশিল্প, ওয়েল্ডিং, ড্রাইভিং ও স্বাবলম্বী হওয়ার কারিগরি শিক্ষা।",
      en: "Vocational lessons (driving, welding, sewing) helping unemployed youth earn a living."
    },
    longDescription: {
      bn: "দক্ষ যুব উদ্যোক্তা ফোরাম যুবসমাজকে অর্থনৈতিকভাবে স্বাধীন করতে কাজ করে। আমরা বেকার যুবকদের বিনামূল্যে ড্রাইভিং, হস্তশিল্প, টেইলরিং এবং ইলেকট্রনিক্স ও ওয়েল্ডিংয়ের মতো কারিগরি কাজ শেখাই। কোর্স শেষে আমরা তাদের কাজের ব্যবস্থা করতে ইন্টার্নশিপ বা চাকরির সাথে সংযুক্ত করি।",
      en: "We focus on economic independence. We train unemployed youths in practical trades like professional driving, appliance repair, welding, and fashion tailoring. Upon graduation, we link them to corporate jobs and workshops."
    },
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৫", en: "2015" },
    members: { bn: "৫০+", en: "50+" },
    impact: { bn: "৩০০০+ স্বাবলম্বী যুবক", en: "3000+ Independent Youths" },
    location: { bn: "মিরপুর, ঢাকা", en: "Mirpur, Dhaka" },
    email: "dokhkhyo.jubo@example.com",
    phone: { bn: "01734-567890", en: "01734-567890" }
  },
  {
    id: 37,
    name: { bn: "ক্যারিয়ার গাইডেন্স একাডেমি", en: "Career Guidance Academy" },
    category: "skills",
    categoryName: { bn: "দক্ষতা ও নেতৃত্ব", en: "Skills & Leadership" },
    shortDescription: {
      bn: "কলেজ ও বিশ্ববিদ্যালয়ের শিক্ষার্থীদের জন্য সিভি রাইটিং, মক ইন্টারভিউ ও লিডারশিপ ট্রেনিং।",
      en: "Soft-skills clinics, resume writing, mock interviews, and leadership training for graduates."
    },
    longDescription: {
      bn: "শিক্ষাজীবন শেষ করে পেশাজীবনে পদার্পণকারী শিক্ষার্থীদের জন্য ক্যারিয়ার গাইডেন্স একাডেমি এক অসাধারণ প্ল্যাটফর্ম। আমরা তরুণদের কর্পোরেট জগতের উপযোগী করে তুলতে সিভি লেখার কৌশল, ইন্টারভিউ দেওয়ার পদ্ধতি ও পাবলিক স্পিকিং-এর ওপর নিয়মিত কর্মশালার আয়োজন করি।",
      en: "Transitioning from university to the job market is tough. We prepare graduating seniors with corporate skills, mock interview panels, CV-writing seminars, and workshops in public speaking and professional communication."
    },
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৭", en: "2017" },
    members: { bn: "৪০+", en: "40+" },
    impact: { bn: "৫০০০+ গ্র্যাজুয়েট", en: "5000+ Graduates Helped" },
    location: { bn: "উত্তরা, ঢাকা", en: "Uttara, Dhaka" },
    email: "careerguidance@example.com",
    phone: { bn: "01845-678901", en: "01845-678901" }
  },
  {
    id: 38,
    name: { bn: "আইটি স্কিল ডেভেলপমেন্ট ইনস্টিটিউট", en: "IT Skill Development" },
    category: "skills",
    categoryName: { bn: "দক্ষতা ও নেতৃত্ব", en: "Skills & Leadership" },
    shortDescription: {
      bn: "কম্পিউটার ও তথ্যপ্রযুক্তির প্রাথমিক জ্ঞান, বেসিক কোডিং ও ফ্রিল্যান্সিং সেশন।",
      en: "Free basic IT literacy, web design, and digital freelancing modules."
    },
    longDescription: {
      bn: "ডিজিটাল যুগে আইটি দক্ষতার কোনো বিকল্প নেই। এই ইনস্টিটিউট পিছিয়ে পড়া মেধাবী ছাত্র-ছাত্রীদের সম্পূর্ণ বিনামূল্যে গ্রাফিক্স ডিজাইন, ওয়েব ডেভেলপমেন্ট এবং বেসিক কম্পিউটার চালনা শেখায়। উদ্দেশ্য হলো তাদের প্রযুক্তিগত জ্ঞান বাড়িয়ে স্বাবলম্বী করে তোলা।",
      en: "In this digital era, IT skills are paramount. We teach basic computer literacy, graphic design, and web development to underprivileged youth for free, enabling them to earn remotely through online outsourcing."
    },
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৯", en: "2019" },
    members: { bn: "৩০+ ইন্সট্রাক্টর", en: "30+ Instructors" },
    impact: { bn: "১৮০০+ তথ্যপ্রযুক্তি শিক্ষার্থী", en: "1800+ IT Learners" },
    location: { bn: "ধানমন্ডি, ঢাকা", en: "Dhanmondi, Dhaka" },
    email: "itskill@example.com",
    phone: { bn: "01956-789012", en: "01956-789012" }
  },
  {
    id: 39,
    name: { bn: "কর্মমুখী শিক্ষা ও নারী উন্নয়ন সংঘ", en: "Women's Empowerment Club" },
    category: "skills",
    categoryName: { bn: "দক্ষতা ও নেতৃত্ব", en: "Skills & Leadership" },
    shortDescription: {
      bn: "নারীদের জন্য হস্তশিল্প, ফ্যাশন ডিজাইন ও গৃহস্থালি খামার পরিচালনার ওপর প্রশিক্ষণ।",
      en: "Craft skills, fashion styling, and home-poultry management classes for rural women."
    },
    longDescription: {
      bn: "নারীদের আত্মনির্ভরশীল ও অর্থনৈতিক চালিকাশক্তি হিসেবে গড়ে তুলতে এই সংঘ বদ্ধপরিকর। আমরা নারীদের সেলাই, ফ্যাশন ডিজাইন, ব্লক-বাটিকের কাজ এবং কুটির শিল্প শেখাই। এছাড়াও আমরা বাড়ির আঙিনায় হাঁস-মুরগি লালনপালন বা শাকসবজি চাষের মতো কৃষিকাজেরও প্রশিক্ষণ দেই।",
      en: "To establish women as economic drivers, we offer training in block-batik printing, embroidery, and pottery. We also instruct them in establishing household poultry farms and vegetable gardens to secure stable incomes."
    },
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৬", en: "2016" },
    members: { bn: "৪৫+", en: "45+" },
    impact: { bn: "১৫০০+ স্বাবলম্বী নারী", en: "1500+ Self-reliant Women" },
    location: { bn: "মোহাম্মদপুর, ঢাকা", en: "Mohammadpur, Dhaka" },
    email: "narikormo@example.com",
    phone: { bn: "01567-890123", en: "01567-890123" }
  },
  {
    id: 40,
    name: { bn: "লিডারশিপ ও পার্সোনালিটি ক্লাব", en: "Leadership & Personality Club" },
    category: "skills",
    categoryName: { bn: "দক্ষতা ও নেতৃত্ব", en: "Skills & Leadership" },
    shortDescription: {
      bn: "তরুণদের সামাজিক দায়িত্ববোধ, সিদ্ধান্ত গ্রহণ এবং দল পরিচালনার দক্ষতা শেখানো।",
      en: "Youth bootcamps on teamwork, decision-making, and public leadership."
    },
    longDescription: {
      bn: "ভবিষ্যৎ বাংলাদেশের জন্য যোগ্য ও দক্ষ নেতা গড়ে তুলতে আমাদের এই ক্লাব প্রতিষ্ঠিত। আমরা শিক্ষার্থীদের দলগত কাজ, সিদ্ধান্ত গ্রহণের ক্ষমতা এবং সংকটের সময়ে সঠিক দিকনির্দেশনা দেওয়ার দক্ষতা বৃদ্ধির জন্য বিভিন্ন বুটক্যাম্প ও কর্মশালার আয়োজন করি।",
      en: "To build future leaders, we host camps for college youths. We focus on decision-making under crisis, teamwork, organization skills, and ethical social leadership to help them guide communities."
    },
    image: "https://images.unsplash.com/photo-1552581230-c01591d3c19e?auto=format&fit=crop&w=600&q=80",
    fallbackImage: "assets/welfare_cat.png",
    established: { bn: "২০১৮", en: "2018" },
    members: { bn: "৩৫+", en: "35+" },
    impact: { bn: "১২০০+ তরুণ নেতা", en: "1200+ Trained Leaders" },
    location: { bn: "শাহবাগ, ঢাকা", en: "Shahbagh, Dhaka" },
    email: "leadershippersonality@example.com",
    phone: { bn: "01712-345678", en: "01712-345678" }
  }
];

export const seedClubs = async () => {
  try {
    // Programmatically set established year of all 40 clubs to 2021 bilingually
    BILINGUAL_CLUBS_DATA.forEach(club => {
      club.established = { bn: "২০২১", en: "2021" };
    });

    if (isUsingMockDb) {
      mockDb.clubs = BILINGUAL_CLUBS_DATA;
      console.log(`✅ Loaded ${mockDb.clubs.length} clubs into memory mock database.`);
      return;
    }

    const count = await Club.countDocuments();
    if (count === 0) {
      await Club.deleteMany();
      await Club.insertMany(BILINGUAL_CLUBS_DATA);
      console.log('🌱 Database seeded successfully with 40 bilingual clubs!');
    } else {
      // Force update established years in existing MongoDB records if count > 0 to match 2021 requirement
      await Club.updateMany({}, { $set: { established: { bn: "২০২১", en: "2021" } } });
      console.log(`⚡ Database already seeded. Updated established years to 2021 in ${count} clubs.`);
    }
  } catch (error) {
    console.error('⚠️ Seeding failed:', error.message);
  }
};
