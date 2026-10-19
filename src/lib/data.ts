import { slugify } from "./utils";
import type { Course, Instructor, Lesson, Level, Module } from "./types";

const BLOB_BASE =
  process.env.NEXT_PUBLIC_BLOB_BASE_URL?.replace(/\/$/, "") ||
  "https://deborahlearn.public.blob.vercel-storage.com";

export function lessonVideo(courseSlug: string, lessonSlug: string) {
  if (!process.env.NEXT_PUBLIC_BLOB_BASE_URL) {
    return `/videos/${courseSlug}.mp4`;
  }
  return `${BLOB_BASE}/courses/${courseSlug}/${lessonSlug}.mp4`;
}

type ModuleSpec = {
  title: string;
  lessons: string[];
  previewLesson?: number;
};

function buildModules(courseSlug: string, specs: ModuleSpec[]): Module[] {
  return specs.map((spec, moduleIndex) => {
    const moduleId = `m${moduleIndex + 1}`;
    const lessons: Lesson[] = spec.lessons.map((title, lessonIndex) => {
      const lessonSlug = slugify(title);
      return {
        id: `${courseSlug}-${moduleId}-l${lessonIndex + 1}`,
        slug: lessonSlug,
        title,
        minutes: 12 + ((moduleIndex * 7 + lessonIndex * 5) % 20),
        freePreview: lessonIndex === (spec.previewLesson ?? 0),
        videoUrl: lessonVideo(courseSlug, lessonSlug),
        notes:
          "Lesson notes: read the summary below, then complete the short reflection task before moving on. Your notes are saved in this browser so you can pick up where you left off.",
      };
    });
    return { id: moduleId, title: spec.title, lessons };
  });
}

function makeCourse(input: {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  level: Level;
  price: number;
  durationHours: number;
  students: number;
  rating: number;
  reviewCount: number;
  instructor: string;
  cover: string;
  summary: string;
  description: string;
  outcomes: string[];
  requirements: string[];
  audience: string[];
  modules: ModuleSpec[];
  featured?: boolean;
  updated?: string;
}): Course {
  const modules = buildModules(input.slug, input.modules);
  const lessonCount = modules.reduce((total, m) => total + m.lessons.length, 0);
  return {
    ...input,
    modules,
    includes: {
      videoHours: Math.round(input.durationHours * 0.7),
      articles: lessonCount + 4,
      certificate: true,
      downloadable: 8,
    },
    reviews: [
      {
        name: "Mercy Achieng",
        location: "Nairobi, Kenya",
        rating: 5,
        quote:
          "The lessons are short enough to finish after work, and the notes make revision simple. I used what I learned in my job the same week.",
      },
      {
        name: "Joseph Mutua",
        location: "Machakos, Kenya",
        rating: 4,
        quote:
          "Clear explanations and practical assignments. The certificate download worked immediately after I completed the last lesson.",
      },
      {
        name: "Sarah Nakato",
        location: "Kampala, Uganda",
        rating: 5,
        quote:
          "I studied from my phone on the bus and on my laptop at home. The progress tracking kept me going until the end.",
      },
    ],
    featured: input.featured ?? false,
    updated: input.updated ?? "September 2026",
  };
}

export const courses: Course[] = [
  makeCourse({
    slug: "small-business-growth-kenya",
    title: "Small Business Growth for Kenyan Entrepreneurs",
    category: "Business and Entrepreneurship",
    categorySlug: "business",
    level: "Beginner",
    price: 2500,
    durationHours: 9,
    students: 1240,
    rating: 4.8,
    reviewCount: 186,
    instructor: "grace-wanjiru",
    cover: "/images/course-business.jpg",
    summary:
      "Turn a small trading idea into a business with clear records, pricing, and a plan for growth.",
    description:
      "This course walks you through the practical side of running a small business in Kenya. You will build a simple bookkeeping system, price your products with confidence, understand licensing and tax basics, and write a one page growth plan you can act on immediately.",
    outcomes: [
      "Keep simple daily records that show whether your business is making money",
      "Price products and services so that costs, transport, and margin are covered",
      "Register a business name and understand basic tax and licensing steps",
      "Write a one page growth plan with realistic targets for the next six months",
    ],
    requirements: [
      "A business idea or an existing small business",
      "A notebook or spreadsheet app",
      "No prior business training needed",
    ],
    audience: [
      "Small shop and market traders",
      "Freelancers and side business owners",
      "Young people starting their first enterprise",
    ],
    modules: [
      {
        title: "Getting your business idea ready",
        lessons: [
          "What problem does your business solve",
          "Understanding your customer",
          "Testing your idea with little money",
        ],
      },
      {
        title: "Money and records",
        lessons: [
          "Separating business and personal money",
          "A simple daily sales book",
          "Pricing for profit",
          "Understanding costs and margins",
        ],
      },
      {
        title: "Growth and compliance",
        lessons: [
          "Registering your business name",
          "Tax and licence basics in Kenya",
          "Your one page growth plan",
        ],
      },
    ],
    featured: true,
  }),
  makeCourse({
    slug: "digital-marketing-east-africa",
    title: "Digital Marketing for East African Brands",
    category: "Business and Entrepreneurship",
    categorySlug: "business",
    level: "Intermediate",
    price: 3200,
    durationHours: 11,
    students: 860,
    rating: 4.7,
    reviewCount: 132,
    instructor: "grace-wanjiru",
    cover: "/images/course-business.jpg",
    summary:
      "Plan, create, and measure campaigns that reach customers across Kenya and East Africa.",
    description:
      "Learn how to build a marketing plan that fits an East African audience and a modest budget. You will set up a content calendar, write copy that sounds like a real person, run small paid campaigns, and read the numbers so you know what to repeat.",
    outcomes: [
      "Build a 30 day content calendar for your brand",
      "Write social copy and simple adverts that convert",
      "Run a small budget campaign on Meta and Google",
      "Read analytics and report on what worked",
    ],
    requirements: [
      "A business or brand page to practise with",
      "A phone or laptop with internet access",
      "Comfort using social media apps",
    ],
    audience: [
      "Business owners handling their own marketing",
      "Marketing assistants and interns",
      "Freelancers offering social media services",
    ],
    modules: [
      {
        title: "Knowing your audience",
        lessons: [
          "Researching East African customers",
          "Building a simple customer profile",
          "Choosing the right channels",
        ],
      },
      {
        title: "Content that earns attention",
        lessons: [
          "Copywriting for social media",
          "Photography and video with a phone",
          "Planning a 30 day calendar",
        ],
      },
      {
        title: "Paid campaigns and measurement",
        lessons: [
          "Setting a small campaign budget",
          "Running and adjusting a Meta campaign",
          "Reading results without guesswork",
        ],
      },
    ],
  }),
  makeCourse({
    slug: "web-development-foundations",
    title: "Web Development Foundations with JavaScript",
    category: "Technology and Coding",
    categorySlug: "technology",
    level: "Beginner",
    price: 4500,
    durationHours: 16,
    students: 2130,
    rating: 4.9,
    reviewCount: 412,
    instructor: "brian-otieno",
    cover: "/images/course-technology.jpg",
    summary:
      "Build your first two websites with HTML, CSS, and JavaScript, then publish them online.",
    description:
      "A hands on introduction to web development written for learners with no coding background. You will write your first page in the first hour, understand how browsers read your code, and finish with two small projects hosted online.",
    outcomes: [
      "Write clean HTML and CSS for responsive pages",
      "Use JavaScript to respond to clicks and form input",
      "Debug problems using the browser developer tools",
      "Publish two projects online and share the links",
    ],
    requirements: [
      "A laptop with a code editor installed",
      "A stable internet connection",
      "No previous coding experience",
    ],
    audience: [
      "Career changers moving into tech",
      "Students building a first portfolio",
      "Business owners who want to edit their own site",
    ],
    modules: [
      {
        title: "The building blocks",
        lessons: [
          "How the web works",
          "Your first HTML page",
          "Styling with CSS",
          "Responsive layout basics",
        ],
      },
      {
        title: "JavaScript essentials",
        lessons: [
          "Variables, functions, and decisions",
          "Working with the page",
          "Handling clicks and forms",
        ],
      },
      {
        title: "Build and publish",
        lessons: [
          "Build a landing page",
          "Build a simple calculator",
          "Publish your work online",
        ],
      },
    ],
    featured: true,
  }),
  makeCourse({
    slug: "data-analysis-python",
    title: "Data Analysis with Python for Beginners",
    category: "Technology and Coding",
    categorySlug: "technology",
    level: "Intermediate",
    price: 5200,
    durationHours: 14,
    students: 1580,
    rating: 4.8,
    reviewCount: 268,
    instructor: "brian-otieno",
    cover: "/images/course-technology.jpg",
    summary:
      "Clean data, find patterns, and present findings with Python, pandas, and clear charts.",
    description:
      "Move from spreadsheets to Python for real analysis work. You will load messy data, clean it, summarise it, and build charts that tell a story. The final project uses a public Kenyan dataset so your portfolio piece is grounded in local context.",
    outcomes: [
      "Load and clean data with pandas",
      "Summarise data with grouping and aggregation",
      "Build clear charts with matplotlib",
      "Write a short analysis report for a non technical reader",
    ],
    requirements: [
      "Comfort with spreadsheets",
      "Some basic programming experience is helpful",
      "A laptop that can run Python",
    ],
    audience: [
      "Analysts working in spreadsheets",
      "Researchers and monitoring officers",
      "Developers adding data skills",
    ],
    modules: [
      {
        title: "Python for data work",
        lessons: [
          "Setting up Python and notebooks",
          "Lists, dictionaries, and loops",
          "Loading a CSV file",
        ],
      },
      {
        title: "Cleaning and exploring",
        lessons: [
          "Handling missing values",
          "Filtering and grouping",
          "Summary tables that make sense",
        ],
      },
      {
        title: "Charts and reporting",
        lessons: [
          "Choosing the right chart",
          "Building charts with matplotlib",
          "Presenting your findings",
        ],
      },
    ],
  }),
  makeCourse({
    slug: "community-health-practice",
    title: "Community Health and Wellness Practice",
    category: "Health and Wellness",
    categorySlug: "health",
    level: "Beginner",
    price: 0,
    durationHours: 8,
    students: 3120,
    rating: 4.9,
    reviewCount: 524,
    instructor: "amina-hassan",
    cover: "/images/course-health.jpg",
    summary:
      "Practical public health skills for community workers, volunteers, and caregivers.",
    description:
      "A free course for anyone supporting health in their community. Learn how to share accurate health information, support hygiene and nutrition at household level, recognise danger signs, and refer people to the right facility.",
    outcomes: [
      "Share clear, accurate health information with families",
      "Support safe water, hygiene, and nutrition practices at home",
      "Recognise danger signs that need urgent referral",
      "Keep simple records for community health activities",
    ],
    requirements: [
      "An interest in community health work",
      "A phone or laptop with internet access",
      "No medical qualification required",
    ],
    audience: [
      "Community health volunteers",
      "Caregivers and parents",
      "NGO field officers",
    ],
    modules: [
      {
        title: "Health communication",
        lessons: [
          "Listening before advising",
          "Explaining health information simply",
          "Working with community leaders",
        ],
      },
      {
        title: "Healthy households",
        lessons: [
          "Safe water and hygiene",
          "Nutrition on a small budget",
          "Supporting mothers and young children",
        ],
      },
      {
        title: "When to refer",
        lessons: [
          "Danger signs in children",
          "Danger signs in adults",
          "Recording and following up referrals",
        ],
      },
    ],
    featured: true,
  }),
  makeCourse({
    slug: "mental-health-first-aid",
    title: "Mental Health First Aid for Schools",
    category: "Health and Wellness",
    categorySlug: "health",
    level: "Advanced",
    price: 3800,
    durationHours: 10,
    students: 640,
    rating: 4.7,
    reviewCount: 96,
    instructor: "amina-hassan",
    cover: "/images/course-health.jpg",
    summary:
      "Recognise distress, respond with care, and connect learners to professional support.",
    description:
      "Designed for teachers, school counsellors, and youth workers. This course covers listening skills, privacy and safeguarding, referral pathways, and how to build a school culture where young people feel safe to ask for help.",
    outcomes: [
      "Recognise early signs of distress in young people",
      "Hold a calm, confidential first conversation",
      "Follow a safeguarding and referral pathway",
      "Build a simple school wellbeing plan",
    ],
    requirements: [
      "Experience working with young people",
      "Approval from your school or organisation is recommended",
      "A quiet space for the role play exercises",
    ],
    audience: [
      "Teachers and school counsellors",
      "Youth group leaders",
      "Boarding school staff",
    ],
    modules: [
      {
        title: "Understanding distress",
        lessons: [
          "What mental health first aid is",
          "Signs that need attention",
          "Myths and stigma in schools",
        ],
      },
      {
        title: "The first conversation",
        lessons: [
          "Listening without judging",
          "Asking about safety",
          "Confidentiality and its limits",
        ],
      },
      {
        title: "Referral and support",
        lessons: [
          "Mapping local services",
          "Warm handover to a professional",
          "Looking after your own wellbeing",
        ],
      },
    ],
  }),
  makeCourse({
    slug: "teaching-with-technology",
    title: "Teaching with Technology in East African Classrooms",
    category: "Education and Teaching",
    categorySlug: "education",
    level: "Beginner",
    price: 2800,
    durationHours: 9,
    students: 1450,
    rating: 4.8,
    reviewCount: 214,
    instructor: "faith-njeri",
    cover: "/images/course-education.jpg",
    summary:
      "Plan lessons that work with a projector, a shared phone, or no device at all.",
    description:
      "A practical course for teachers working with limited equipment. You will design lessons that use one device well, use free tools for assessment, and plan offline activities that keep every learner involved.",
    outcomes: [
      "Plan a lesson that uses one device for a whole class",
      "Create quizzes and worksheets with free tools",
      "Use low bandwidth resources without losing quality",
      "Assess learning with or without devices",
    ],
    requirements: [
      "A phone or laptop",
      "A class or a lesson you are preparing",
      "Basic comfort using a browser",
    ],
    audience: [
      "Primary and secondary teachers",
      "Tutors and trainers",
      "School leaders planning digital learning",
    ],
    modules: [
      {
        title: "Planning with the tools you have",
        lessons: [
          "Choosing a realistic teaching goal",
          "One device, many learners",
          "Low bandwidth resources",
        ],
      },
      {
        title: "Activities and assessment",
        lessons: [
          "Free tools for quick quizzes",
          "Group work that uses technology once",
          "Assessment without devices",
        ],
      },
      {
        title: "Making it stick",
        lessons: [
          "Troubleshooting a lesson that stalls",
          "Involving parents and guardians",
          "Your term plan",
        ],
      },
    ],
    featured: true,
  }),
  makeCourse({
    slug: "early-childhood-literacy",
    title: "Early Childhood Literacy and Numeracy",
    category: "Education and Teaching",
    categorySlug: "education",
    level: "Intermediate",
    price: 3000,
    durationHours: 10,
    students: 720,
    rating: 4.6,
    reviewCount: 118,
    instructor: "faith-njeri",
    cover: "/images/course-education.jpg",
    summary:
      "Evidence based activities that build reading and number confidence in early years.",
    description:
      "Learn how young children build language, reading, and number skills, and how to support that development with simple materials. Includes assessment ideas that do not frighten children and activities families can repeat at home.",
    outcomes: [
      "Plan daily language and number activities",
      "Use local materials for early literacy games",
      "Assess reading readiness without pressure",
      "Guide parents on reading at home",
    ],
    requirements: [
      "Experience with early years learners",
      "A few simple classroom materials",
      "Willingness to try activities between lessons",
    ],
    audience: [
      "Early years teachers",
      "Daycare and pre primary staff",
      "Parents supporting learning at home",
    ],
    modules: [
      {
        title: "How young children learn",
        lessons: [
          "Language development milestones",
          "Play as learning",
          "Setting up a print rich room",
        ],
      },
      {
        title: "Reading and writing",
        lessons: [
          "Sounds and letters",
          "Shared reading with big books",
          "Early writing and drawing",
        ],
      },
      {
        title: "Numbers and family",
        lessons: [
          "Counting with everyday objects",
          "Simple number games",
          "Working with families",
        ],
      },
    ],
  }),
  makeCourse({
    slug: "digital-design-branding",
    title: "Digital Design and Branding for Creatives",
    category: "Creative Arts",
    categorySlug: "creative",
    level: "Beginner",
    price: 3500,
    durationHours: 12,
    students: 980,
    rating: 4.8,
    reviewCount: 164,
    instructor: "wanjiku-kamau",
    cover: "/images/course-creative.jpg",
    summary:
      "Design a brand identity and a portfolio that wins local and remote clients.",
    description:
      "Build a brand from the first sketch to a finished guideline. You will work with type, colour, and layout in free design tools, prepare files for print and screen, and package your work into a portfolio that clients understand.",
    outcomes: [
      "Create a logo and simple brand guidelines",
      "Use type, colour, and spacing with intention",
      "Prepare print ready and screen ready files",
      "Build a three project portfolio",
    ],
    requirements: [
      "A laptop that can run a design tool",
      "A free Figma account",
      "No formal design training needed",
    ],
    audience: [
      "Beginner designers",
      "Small business owners doing their own branding",
      "Illustrators adding design skills",
    ],
    modules: [
      {
        title: "Brand foundations",
        lessons: [
          "What a brand actually is",
          "Research and moodboards",
          "Sketching a logo",
        ],
      },
      {
        title: "Design craft",
        lessons: [
          "Type and colour",
          "Layout and spacing",
          "Designing for print and screen",
        ],
      },
      {
        title: "Portfolio and clients",
        lessons: [
          "Packaging a portfolio",
          "Pricing design work",
          "Presenting to a client",
        ],
      },
    ],
    featured: true,
  }),
  makeCourse({
    slug: "photography-storytelling",
    title: "Photography and Visual Storytelling",
    category: "Creative Arts",
    categorySlug: "creative",
    level: "Intermediate",
    price: 4200,
    durationHours: 11,
    students: 540,
    rating: 4.7,
    reviewCount: 88,
    instructor: "wanjiku-kamau",
    cover: "/images/course-creative.jpg",
    summary:
      "Use any camera, including your phone, to tell honest stories with light and framing.",
    description:
      "Learn to see light, frame a scene, and edit a set of images that works together. Assignments include photographing a local business and building a short photo story with captions.",
    outcomes: [
      "Control exposure and focus on any camera",
      "Frame portraits and documentary scenes",
      "Edit a consistent set of images",
      "Write captions that add context",
    ],
    requirements: [
      "A phone with a camera or a DSLR",
      "Free editing software such as Snapseed",
      "Willingness to photograph in your neighbourhood",
    ],
    audience: [
      "Content creators",
      "Journalists and communicators",
      "Small business owners",
    ],
    modules: [
      {
        title: "Seeing light",
        lessons: [
          "Natural light at home",
          "Exposure made simple",
          "Photographing people with respect",
        ],
      },
      {
        title: "Building a story",
        lessons: [
          "Wide, medium, and close",
          "Sequencing a photo story",
          "Captions and consent",
        ],
      },
      {
        title: "Editing and publishing",
        lessons: [
          "Editing for consistency",
          "Exporting for social and print",
          "Sharing your first photo story",
        ],
      },
    ],
  }),
  makeCourse({
    slug: "agribusiness-essentials",
    title: "Agribusiness and Food Science Essentials",
    category: "Agriculture and Food Science",
    categorySlug: "agriculture",
    level: "Beginner",
    price: 2200,
    durationHours: 9,
    students: 1100,
    rating: 4.8,
    reviewCount: 176,
    instructor: "samuel-kiprotich",
    cover: "/images/course-agriculture.jpg",
    summary:
      "Plan a profitable farm enterprise and handle produce safely from harvest to market.",
    description:
      "This course covers the business side of farming: costing an enterprise, choosing a market, handling produce, and reducing post harvest losses. You will build a simple farm budget and a harvest plan for one crop.",
    outcomes: [
      "Cost a crop or livestock enterprise",
      "Choose a market and negotiate a fair price",
      "Handle and store produce safely",
      "Reduce post harvest losses",
    ],
    requirements: [
      "Access to a farm or a farm enterprise idea",
      "A calculator or phone",
      "No prior agribusiness training",
    ],
    audience: [
      "Smallholder farmers",
      "Youth agribusiness groups",
      "Extension officers",
    ],
    modules: [
      {
        title: "Farm as a business",
        lessons: [
          "Costing your enterprise",
          "Choosing what to grow",
          "Records for a small farm",
        ],
      },
      {
        title: "Harvest and handling",
        lessons: [
          "Harvest timing",
          "Storage and hygiene",
          "Post harvest losses",
        ],
      },
      {
        title: "Markets",
        lessons: [
          "Finding buyers",
          "Negotiating price",
          "Selling as a group",
        ],
      },
    ],
    featured: true,
  }),
  makeCourse({
    slug: "climate-smart-farming",
    title: "Climate Smart Farming for Smallholders",
    category: "Agriculture and Food Science",
    categorySlug: "agriculture",
    level: "Advanced",
    price: 2600,
    durationHours: 10,
    students: 690,
    rating: 4.6,
    reviewCount: 74,
    instructor: "samuel-kiprotich",
    cover: "/images/course-agriculture.jpg",
    summary:
      "Adapt your farm to changing rains with soil, water, and crop practices that hold up.",
    description:
      "A field oriented course on soil health, water harvesting, and crop choices for a changing climate. Includes planning for dry spells and a simple risk plan for the coming season.",
    outcomes: [
      "Test and improve soil health on your farm",
      "Plan simple water harvesting structures",
      "Choose crops and varieties for variable rain",
      "Write a seasonal risk plan",
    ],
    requirements: [
      "A farm or garden to work with",
      "Basic farming experience",
      "A notebook for field observations",
    ],
    audience: [
      "Smallholder farmers",
      "Farm managers",
      "Agricultural extension officers",
    ],
    modules: [
      {
        title: "Soil and water",
        lessons: [
          "Reading your soil",
          "Compost and cover crops",
          "Water harvesting basics",
        ],
      },
      {
        title: "Crops for a changing climate",
        lessons: [
          "Choosing varieties",
          "Intercropping and rotation",
          "Dealing with dry spells",
        ],
      },
      {
        title: "Planning for risk",
        lessons: [
          "Seasonal forecasting",
          "A simple risk plan",
          "Sharing lessons with neighbours",
        ],
      },
    ],
  }),
];

export const categories = [
  {
    slug: "business",
    name: "Business and Entrepreneurship",
    description: "Start, run, and grow a business that fits your market.",
    icon: "briefcase",
    accent: "#7971ea",
  },
  {
    slug: "technology",
    name: "Technology and Coding",
    description: "Build digital skills that employers and clients are looking for.",
    icon: "code",
    accent: "#46ddb0",
  },
  {
    slug: "health",
    name: "Health and Wellness",
    description: "Practical public health knowledge for your community.",
    icon: "heart",
    accent: "#f23a2e",
  },
  {
    slug: "education",
    name: "Education and Teaching",
    description: "Teach with confidence, with or without technology.",
    icon: "graduation",
    accent: "#f89d13",
  },
  {
    slug: "creative",
    name: "Creative Arts",
    description: "Design and tell stories that clients remember.",
    icon: "palette",
    accent: "#e83e8c",
  },
  {
    slug: "agriculture",
    name: "Agriculture and Food Science",
    description: "Farm as a business and handle produce with care.",
    icon: "sprout",
    accent: "#8bc34a",
  },
] as const;

export const instructors: Instructor[] = [
  {
    slug: "grace-wanjiru",
    name: "Grace Wanjiru",
    subject: "Business and Entrepreneurship",
    role: "Business educator",
    bio: "Grace has spent twelve years helping small businesses in Nairobi keep better records and price their work properly.",
    longBio:
      "Grace Wanjiru is a business educator based in Nairobi. She has worked with market traders, salons, and small manufacturers across Kenya, helping them move from informal records to simple systems that show real profit. Grace teaches the way she learned: with notebooks, examples, and numbers from businesses like the ones her students run.",
    photo: "/images/instructor-grace.jpg",
    students: 6420,
    rating: 4.8,
    courses: ["small-business-growth-kenya", "digital-marketing-east-africa"],
    location: "Nairobi, Kenya",
    socials: {
      linkedin: "https://linkedin.com/in/grace-wanjiru",
      x: "https://x.com/gracewanjiru",
    },
  },
  {
    slug: "brian-otieno",
    name: "Brian Otieno",
    subject: "Technology and Coding",
    role: "Software engineer and trainer",
    bio: "Brian is a software engineer in Kisumu who teaches web development with real projects from day one.",
    longBio:
      "Brian Otieno builds web applications for schools and small enterprises. He started teaching community coding meetups in Kisumu and now leads Deborah Learn's technology curriculum. His classes focus on small, complete projects so learners finish with something they can show, not only notes.",
    photo: "/images/instructor-brian.jpg",
    students: 7890,
    rating: 4.9,
    courses: ["web-development-foundations", "data-analysis-python"],
    location: "Kisumu, Kenya",
    socials: {
      linkedin: "https://linkedin.com/in/brian-otieno",
      website: "https://brianotieno.dev",
    },
  },
  {
    slug: "amina-hassan",
    name: "Dr. Amina Hassan",
    subject: "Health and Wellness",
    role: "Public health specialist",
    bio: "Amina works with community health teams in Mombasa and teaches practical, respectful care.",
    longBio:
      "Dr. Amina Hassan is a public health specialist who has supported community health programmes along the Kenyan coast for more than fifteen years. She designs learning materials that health volunteers can use the same week, with clear language and strong referral pathways.",
    photo: "/images/instructor-amina.jpg",
    students: 5310,
    rating: 4.9,
    courses: ["community-health-practice", "mental-health-first-aid"],
    location: "Mombasa, Kenya",
    socials: {
      linkedin: "https://linkedin.com/in/amina-hassan",
    },
  },
  {
    slug: "samuel-kiprotich",
    name: "Samuel Kiprotich",
    subject: "Agriculture and Food Science",
    role: "Agronomist",
    bio: "Samuel trains smallholder farmers in Uasin Gishu on soil health and profitable harvesting.",
    longBio:
      "Samuel Kiprotich is an agronomist working with farmer groups in the North Rift. He combines field trials with farm business training, so farmers can see both the yield and the money. He teaches climate smart farming with examples from farms he visits every season.",
    photo: "/images/instructor-samuel.jpg",
    students: 3980,
    rating: 4.7,
    courses: ["agribusiness-essentials", "climate-smart-farming"],
    location: "Eldoret, Kenya",
    socials: {
      linkedin: "https://linkedin.com/in/samuel-kiprotich",
      website: "https://kiprotichfarms.co.ke",
    },
  },
  {
    slug: "faith-njeri",
    name: "Faith Njeri",
    subject: "Education and Teaching",
    role: "Teacher trainer",
    bio: "Faith supports teachers in public schools to plan lessons that work with the resources they already have.",
    longBio:
      "Faith Njeri is a teacher trainer who has worked with primary and secondary schools across Central Kenya. Her workshops are known for being practical: teachers leave with a plan they can use in the next double lesson, whether or not the school has working devices.",
    photo: "/images/instructor-faith.jpg",
    students: 4680,
    rating: 4.8,
    courses: ["teaching-with-technology", "early-childhood-literacy"],
    location: "Nyeri, Kenya",
    socials: {
      linkedin: "https://linkedin.com/in/faith-njeri",
      x: "https://x.com/faithnjeri",
    },
  },
  {
    slug: "wanjiku-kamau",
    name: "Wanjiku Kamau",
    subject: "Creative Arts",
    role: "Design director",
    bio: "Wanjiku runs a Nairobi design studio and teaches branding to designers starting their careers.",
    longBio:
      "Wanjiku Kamau is a design director who has built brands for Kenyan businesses for over a decade. She teaches the process behind the work: research, sketching, critique, and presentation. Her students finish with a portfolio they can defend in a client meeting.",
    photo: "/images/instructor-wanjiku.jpg",
    students: 2870,
    rating: 4.8,
    courses: ["digital-design-branding", "photography-storytelling"],
    location: "Nairobi, Kenya",
    socials: {
      linkedin: "https://linkedin.com/in/wanjiku-kamau",
      website: "https://wanjikukamau.design",
    },
  },
];

export const testimonials = [
  {
    name: "Mercy Achieng",
    role: "Shop owner, Nairobi",
    photo: "/images/learner-1.jpg",
    quote:
      "I used the record keeping lessons in my shop the same week. For the first time I can see what I actually earn after transport and stock.",
    course: "Small Business Growth for Kenyan Entrepreneurs",
  },
  {
    name: "Joseph Mutua",
    role: "Teacher, Machakos",
    photo: "/images/learner-2.jpg",
    quote:
      "The teaching with technology course assumed I had almost nothing. That honesty made it useful. My class now runs quizzes with one phone.",
    course: "Teaching with Technology in East African Classrooms",
  },
  {
    name: "Sarah Nakato",
    role: "Programme officer, Kampala",
    photo: "/images/learner-3.jpg",
    quote:
      "I downloaded the certificate after my last lesson and shared the verification link with my employer. It took less than a minute.",
    course: "Community Health and Wellness Practice",
  },
];

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}

export function getInstructor(slug: string) {
  return instructors.find((instructor) => instructor.slug === slug);
}

export function courseLessonCount(course: Course) {
  return course.modules.reduce((total, module) => total + module.lessons.length, 0);
}

export function courseLessonIds(course: Course) {
  return course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));
}

export function findLesson(course: Course, lessonSlug: string) {
  for (const module of course.modules) {
    const lesson = module.lessons.find((item) => item.slug === lessonSlug);
    if (lesson) return { module, lesson };
  }
  return null;
}

export function flatLessons(course: Course) {
  return course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title })),
  );
}

export function instructorCourses(slug: string) {
  return courses.filter((course) => course.instructor === slug);
}

export function categoryCount(slug: string) {
  return courses.filter((course) => course.categorySlug === slug).length;
}
