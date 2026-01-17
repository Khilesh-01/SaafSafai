// Civic Simulator Logic
const scenarios = {
  easy: [
    {
      id: 'park_renovation',
      title: 'Community Park Renovation',
      description: 'The city needs to renovate Central Park. How would you allocate the budget?',
      context: 'Central Park has been neglected for years. The playground equipment is outdated, paths need repair, and residents want new amenities. You have a limited budget to make improvements.',
      budget: 500000,
      impacts: [
        { category: 'Community', type: 'social', level: 'medium' },
        { category: 'Recreation', type: 'social', level: 'high' },
        { category: 'Property Values', type: 'economic', level: 'low' }
      ],
      decisions: [
        {
          key: 'playground',
          title: 'Playground Equipment',
          description: 'How much should we spend on new playground equipment?',
          type: 'budget',
          min: 0,
          max: 150000,
          step: 5000
        },
        {
          key: 'paths',
          title: 'Path Maintenance',
          description: 'Budget for repairing and improving walking paths',
          type: 'budget',
          min: 0,
          max: 100000,
          step: 2500
        },
        {
          key: 'amenities',
          title: 'New Amenities',
          description: 'What new amenities should we add?',
          type: 'multiple',
          options: [
            { label: 'Picnic Tables & Benches', value: 'furniture' },
            { label: 'Exercise Equipment', value: 'fitness' },
            { label: 'Community Garden', value: 'garden' },
            { label: 'Water Fountain', value: 'water' }
          ]
        },
        {
          key: 'lighting',
          title: 'Security Lighting',
          description: 'Should we install new security lighting?',
          type: 'boolean',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        }
      ]
    },
    {
      id: 'school_funding',
      title: 'School District Budget',
      description: 'Allocate funding across different school programs and needs.',
      context: 'The school district received additional funding and needs to decide how to best use it to improve education outcomes.',
      budget: 1000000,
      impacts: [
        { category: 'Education', type: 'social', level: 'high' },
        { category: 'Future Economy', type: 'economic', level: 'medium' },
        { category: 'Community', type: 'social', level: 'medium' }
      ],
      decisions: [
        {
          key: 'teachers',
          title: 'Teacher Salaries',
          description: 'Increase teacher salaries to attract better talent',
          type: 'budget',
          min: 0,
          max: 400000,
          step: 10000
        },
        {
          key: 'technology',
          title: 'Technology Upgrades',
          description: 'Invest in new computers and educational technology',
          type: 'budget',
          min: 0,
          max: 300000,
          step: 5000
        },
        {
          key: 'programs',
          title: 'Special Programs',
          description: 'Which programs should receive additional funding?',
          type: 'multiple',
          options: [
            { label: 'Arts & Music', value: 'arts' },
            { label: 'Sports & Athletics', value: 'sports' },
            { label: 'STEM Programs', value: 'stem' },
            { label: 'Special Education', value: 'special_ed' }
          ]
        },
        {
          key: 'afterschool',
          title: 'After-School Programs',
          description: 'Should we expand after-school programs?',
          type: 'boolean',
          options: [
            { label: 'Yes', value: true },
            { label: 'No', value: false }
          ]
        }
      ]
    }
  ],
  medium: [
    {
      id: 'traffic_congestion',
      title: 'Downtown Traffic Solutions',
      description: 'Address growing traffic congestion in the downtown area.',
      context: 'Downtown traffic has increased 40% in the last two years. Citizens complain about commute times, while businesses worry about customer access. Multiple solutions are possible.',
      budget: 2000000,
      impacts: [
        { category: 'Transportation', type: 'social', level: 'high' },
        { category: 'Business', type: 'economic', level: 'medium' },
        { category: 'Environment', type: 'environmental', level: 'medium' },
        { category: 'Safety', type: 'safety', level: 'medium' }
      ],
      decisions: [
        {
          key: 'public_transit',
          title: 'Public Transit Expansion',
          description: 'Invest in bus routes and transit infrastructure',
          type: 'budget',
          min: 0,
          max: 800000,
          step: 25000
        },
        {
          key: 'bike_lanes',
          title: 'Bike Lane Network',
          description: 'Create protected bike lanes throughout downtown',
          type: 'budget',
          min: 0,
          max: 400000,
          step: 15000
        },
        {
          key: 'parking',
          title: 'Parking Strategy',
          description: 'How should we handle downtown parking?',
          type: 'multiple',
          options: [
            { label: 'Build New Parking Garage', value: 'garage' },
            { label: 'Increase Parking Fees', value: 'fees' },
            { label: 'Time Limits Only', value: 'limits' },
            { label: 'Remove Some Parking', value: 'remove' }
          ]
        },
        {
          key: 'road_improvements',
          title: 'Road Infrastructure',
          description: 'Budget for road widening and signal improvements',
          type: 'budget',
          min: 0,
          max: 600000,
          step: 20000
        },
        {
          key: 'car_restrictions',
          title: 'Vehicle Restrictions',
          description: 'Should we implement any vehicle restrictions?',
          type: 'boolean',
          options: [
            { label: 'Yes - Peak Hour Restrictions', value: true },
            { label: 'No - Keep All Access', value: false }
          ]
        }
      ]
    },
    {
      id: 'housing_crisis',
      title: 'Affordable Housing Initiative',
      description: 'Address the growing affordable housing shortage in the city.',
      context: 'Housing costs have risen 35% in three years. Many families are being priced out, while others argue new development changes neighborhood character.',
      budget: 3000000,
      impacts: [
        { category: 'Housing', type: 'social', level: 'high' },
        { category: 'Economy', type: 'economic', level: 'high' },
        { category: 'Development', type: 'environmental', level: 'medium' },
        { category: 'Community', type: 'social', level: 'medium' }
      ],
      decisions: [
        {
          key: 'affordable_units',
          title: 'New Affordable Housing',
          description: 'Build new affordable housing units',
          type: 'budget',
          min: 0,
          max: 1500000,
          step: 50000
        },
        {
          key: 'rent_assistance',
          title: 'Rental Assistance Program',
          description: 'Provide direct rental assistance to families',
          type: 'budget',
          min: 0,
          max: 500000,
          step: 25000
        },
        {
          key: 'development_incentives',
          title: 'Developer Incentives',
          description: 'How should we incentivize private developers?',
          type: 'multiple',
          options: [
            { label: 'Tax Breaks for Affordable Units', value: 'tax_breaks' },
            { label: 'Zoning Flexibility', value: 'zoning' },
            { label: 'Fast-Track Permitting', value: 'permits' },
            { label: 'No Special Incentives', value: 'none' }
          ]
        },
        {
          key: 'first_time_buyers',
          title: 'First-Time Buyer Support',
          description: 'Budget for first-time homebuyer assistance',
          type: 'budget',
          min: 0,
          max: 400000,
          step: 20000
        },
        {
          key: 'rent_control',
          title: 'Rent Control Policy',
          description: 'Should we implement rent control measures?',
          type: 'boolean',
          options: [
            { label: 'Yes - Implement Rent Control', value: true },
            { label: 'No - Market-Based Pricing', value: false }
          ]
        }
      ]
    }
  ],
  hard: [
    {
      id: 'climate_adaptation',
      title: 'Climate Change Adaptation',
      description: 'Prepare the city for climate change impacts including flooding and extreme weather.',
      context: 'Climate scientists predict more frequent flooding and extreme weather events. The city must balance immediate needs with long-term resilience, while considering economic impacts.',
      budget: 5000000,
      impacts: [
        { category: 'Environment', type: 'environmental', level: 'high' },
        { category: 'Safety', type: 'safety', level: 'high' },
        { category: 'Economy', type: 'economic', level: 'high' },
        { category: 'Infrastructure', type: 'social', level: 'medium' }
      ],
      decisions: [
        {
          key: 'flood_infrastructure',
          title: 'Flood Protection Systems',
          description: 'Invest in levees, storm drains, and flood barriers',
          type: 'budget',
          min: 0,
          max: 2000000,
          step: 100000
        },
        {
          key: 'green_infrastructure',
          title: 'Green Infrastructure',
          description: 'Natural flood management through parks and wetlands',
          type: 'budget',
          min: 0,
          max: 1500000,
          step: 75000
        },
        {
          key: 'building_codes',
          title: 'Building Code Updates',
          description: 'How strict should new climate resilience requirements be?',
          type: 'multiple',
          options: [
            { label: 'Minimal Changes', value: 'minimal' },
            { label: 'Moderate Requirements', value: 'moderate' },
            { label: 'Strict New Standards', value: 'strict' },
            { label: 'Phase Implementation', value: 'phased' }
          ]
        },
        {
          key: 'emergency_systems',
          title: 'Emergency Response Systems',
          description: 'Upgrade emergency communication and response capabilities',
          type: 'budget',
          min: 0,
          max: 800000,
          step: 50000
        },
        {
          key: 'renewable_energy',
          title: 'Renewable Energy Transition',
          description: 'Budget for city renewable energy projects',
          type: 'budget',
          min: 0,
          max: 1200000,
          step: 60000
        },
        {
          key: 'relocation_assistance',
          title: 'Vulnerable Area Relocation',
          description: 'Should we help residents relocate from flood-prone areas?',
          type: 'boolean',
          options: [
            { label: 'Yes - Provide Relocation Assistance', value: true },
            { label: 'No - Focus on Protection', value: false }
          ]
        }
      ]
    },
    {
      id: 'economic_development',
      title: 'Economic Development Strategy',
      description: 'Revitalize the local economy while balancing growth with community needs.',
      context: 'The city has lost several major employers and needs economic revitalization. However, rapid development can displace existing residents and change community character.',
      budget: 4000000,
      impacts: [
        { category: 'Economy', type: 'economic', level: 'high' },
        { category: 'Employment', type: 'social', level: 'high' },
        { category: 'Community', type: 'social', level: 'medium' },
        { category: 'Development', type: 'environmental', level: 'medium' }
      ],
      decisions: [
        {
          key: 'business_incentives',
          title: 'Business Attraction Incentives',
          description: 'Tax incentives and grants to attract new businesses',
          type: 'budget',
          min: 0,
          max: 1500000,
          step: 75000
        },
        {
          key: 'workforce_development',
          title: 'Workforce Training Programs',
          description: 'Invest in training programs for local residents',
          type: 'budget',
          min: 0,
          max: 800000,
          step: 40000
        },
        {
          key: 'development_type',
          title: 'Development Focus',
          description: 'What type of economic development should we prioritize?',
          type: 'multiple',
          options: [
            { label: 'Tech & Innovation Hub', value: 'tech' },
            { label: 'Manufacturing & Industry', value: 'manufacturing' },
            { label: 'Tourism & Entertainment', value: 'tourism' },
            { label: 'Mixed-Use Development', value: 'mixed' }
          ]
        },
        {
          key: 'small_business_support',
          title: 'Small Business Support',
          description: 'Programs to support local entrepreneurs',
          type: 'budget',
          min: 0,
          max: 600000,
          step: 30000
        },
        {
          key: 'infrastructure_upgrades',
          title: 'Infrastructure for Business',
          description: 'Upgrade roads, utilities, and digital infrastructure',
          type: 'budget',
          min: 0,
          max: 1000000,
          step: 50000
        },
        {
          key: 'displacement_protection',
          title: 'Anti-Displacement Measures',
          description: 'Should we implement measures to prevent gentrification?',
          type: 'boolean',
          options: [
            { label: 'Yes - Protect Current Residents', value: true },
            { label: 'No - Focus on Growth', value: false }
          ]
        }
      ]
    }
  ]
};

export const getRandomScenario = (difficulty) => {
  const scenarioList = scenarios[difficulty] || scenarios.medium;
  const randomIndex = Math.floor(Math.random() * scenarioList.length);
  return scenarioList[randomIndex];
};

export const calculateResults = (scenario, decisions) => {
  let overallScore = 0;
  let impacts = [];
  let positives = [];
  let improvements = [];
  let learningPoints = [];
  let xpGained = 0;
  let budgetEfficiency = 0;
  let civicStyle = 'Balanced';
  let badgeEarned = null;
  let badgeDescription = '';

  // Calculate budget efficiency
  const budgetUsed = Object.values(decisions).reduce((sum, value) => {
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
  budgetEfficiency = Math.round((budgetUsed / scenario.budget) * 100);

  // Base XP calculation
  xpGained = 25; // Base XP for completion

  // Scenario-specific calculations
  switch (scenario.id) {
    case 'park_renovation':
      overallScore = calculateParkScore(decisions, scenario.budget);
      impacts = calculateParkImpacts(decisions);
      ({ positives, improvements } = getParkFeedback(decisions));
      learningPoints = getParkLearningPoints(decisions);
      civicStyle = determineCivicStyle(decisions, 'community');
      if (overallScore >= 80) {
        badgeEarned = 'Community Champion';
        badgeDescription = 'Excellent community space planning';
        xpGained += 15;
      }
      break;
      
    case 'school_funding':
      overallScore = calculateSchoolScore(decisions, scenario.budget);
      impacts = calculateSchoolImpacts(decisions);
      ({ positives, improvements } = getSchoolFeedback(decisions));
      learningPoints = getSchoolLearningPoints(decisions);
      civicStyle = determineCivicStyle(decisions, 'education');
      if (decisions.teachers > 200000) {
        badgeEarned = 'Education Advocate';
        badgeDescription = 'Strong support for teaching quality';
        xpGained += 10;
      }
      break;
      
    case 'traffic_congestion':
      overallScore = calculateTrafficScore(decisions, scenario.budget);
      impacts = calculateTrafficImpacts(decisions);
      ({ positives, improvements } = getTrafficFeedback(decisions));
      learningPoints = getTrafficLearningPoints(decisions);
      civicStyle = determineCivicStyle(decisions, 'transportation');
      if (decisions.public_transit > 400000) {
        badgeEarned = 'Transit Visionary';
        badgeDescription = 'Champion of sustainable transportation';
        xpGained += 20;
      }
      break;
      
    case 'housing_crisis':
      overallScore = calculateHousingScore(decisions, scenario.budget);
      impacts = calculateHousingImpacts(decisions);
      ({ positives, improvements } = getHousingFeedback(decisions));
      learningPoints = getHousingLearningPoints(decisions);
      civicStyle = determineCivicStyle(decisions, 'housing');
      if (decisions.affordable_units > 1000000) {
        badgeEarned = 'Housing Hero';
        badgeDescription = 'Committed to affordable housing solutions';
        xpGained += 25;
      }
      break;
      
    case 'climate_adaptation':
      overallScore = calculateClimateScore(decisions, scenario.budget);
      impacts = calculateClimateImpacts(decisions);
      ({ positives, improvements } = getClimateFeedback(decisions));
      learningPoints = getClimateLearningPoints(decisions);
      civicStyle = determineCivicStyle(decisions, 'environment');
      if (decisions.green_infrastructure > 800000) {
        badgeEarned = 'Climate Guardian';
        badgeDescription = 'Leader in sustainable climate solutions';
        xpGained += 30;
      }
      break;
      
    case 'economic_development':
      overallScore = calculateEconomicScore(decisions, scenario.budget);
      impacts = calculateEconomicImpacts(decisions);
      ({ positives, improvements } = getEconomicFeedback(decisions));
      learningPoints = getEconomicLearningPoints(decisions);
      civicStyle = determineCivicStyle(decisions, 'economic');
      if (decisions.workforce_development > 400000) {
        badgeEarned = 'Economic Strategist';
        badgeDescription = 'Focused on inclusive economic growth';
        xpGained += 25;
      }
      break;
      
    default:
      overallScore = 70;
      impacts = [{ category: 'general', change: 5, description: 'Positive community impact' }];
      positives = ['Good decision-making process'];
      improvements = ['Consider more stakeholder input'];
      learningPoints = ['Civic decisions have multiple impacts'];
  }

  // Add efficiency bonus
  if (budgetEfficiency > 90 && budgetEfficiency <= 100) {
    xpGained += 10;
    if (!badgeEarned) {
      badgeEarned = 'Budget Master';
      badgeDescription = 'Excellent budget utilization';
    }
  }

  return {
    overallScore,
    impacts,
    positives,
    improvements,
    learningPoints,
    xpGained,
    budgetEfficiency,
    civicStyle,
    badgeEarned,
    badgeDescription
  };
};

// Helper functions for specific scenarios
const calculateParkScore = (decisions, budget) => {
  let score = 60; // Base score
  
  if (decisions.playground > 75000) score += 15;
  if (decisions.paths > 50000) score += 10;
  if (decisions.amenities) score += 10;
  if (decisions.lighting) score += 5;
  
  return Math.min(score, 100);
};

const calculateParkImpacts = (decisions) => {
  const impacts = [
    { category: 'recreation', change: 15, description: 'Improved recreational opportunities' },
    { category: 'safety', change: decisions.lighting ? 10 : 0, description: decisions.lighting ? 'Enhanced safety through lighting' : 'No safety improvements' },
    { category: 'property', change: 8, description: 'Increased property values nearby' }
  ];
  
  return impacts.filter(impact => impact.change > 0);
};

const getParkFeedback = (decisions) => {
  const positives = [];
  const improvements = [];
  
  if (decisions.playground > 100000) {
    positives.push('Excellent investment in children\'s recreation');
  }
  if (decisions.lighting) {
    positives.push('Safety considerations addressed');
  }
  if (decisions.paths < 25000) {
    improvements.push('Consider investing more in accessibility');
  }
  
  return { positives, improvements };
};

const getParkLearningPoints = (decisions) => {
  return [
    'Public spaces require ongoing maintenance funding',
    'Community input is crucial for successful park design',
    'Accessibility features benefit all community members',
    'Safety features increase park usage during evening hours'
  ];
};

const calculateSchoolScore = (decisions, budget) => {
  let score = 50;
  
  if (decisions.teachers > 200000) score += 20;
  if (decisions.technology > 150000) score += 15;
  if (decisions.programs) score += 10;
  if (decisions.afterschool) score += 5;
  
  return Math.min(score, 100);
};

const calculateSchoolImpacts = (decisions) => {
  return [
    { category: 'education', change: 20, description: 'Improved educational outcomes' },
    { category: 'employment', change: decisions.teachers > 200000 ? 15 : 5, description: 'Better teacher retention' },
    { category: 'technology', change: decisions.technology > 150000 ? 12 : 3, description: 'Enhanced digital learning' }
  ];
};

const getSchoolFeedback = (decisions) => {
  const positives = [];
  const improvements = [];
  
  if (decisions.teachers > 300000) {
    positives.push('Strong commitment to teacher compensation');
  }
  if (decisions.technology > 200000) {
    positives.push('Future-focused technology investment');
  }
  if (decisions.teachers < 100000) {
    improvements.push('Teacher retention may suffer with low salary investment');
  }
  
  return { positives, improvements };
};

const getSchoolLearningPoints = (decisions) => {
  return [
    'Teacher quality is the most important factor in student success',
    'Technology must be paired with training for effectiveness',
    'Special programs serve diverse student needs',
    'After-school programs support working families'
  ];
};

const calculateTrafficScore = (decisions, budget) => {
  let score = 40;
  
  if (decisions.public_transit > 400000) score += 25;
  if (decisions.bike_lanes > 200000) score += 15;
  if (decisions.parking === 'fees' || decisions.parking === 'limits') score += 10;
  if (decisions.car_restrictions) score += 10;
  
  return Math.min(score, 100);
};

const calculateTrafficImpacts = (decisions) => {
  return [
    { category: 'transportation', change: decisions.public_transit > 400000 ? 25 : 10, description: 'Improved public transit access' },
    { category: 'environment', change: decisions.bike_lanes > 200000 ? 15 : 5, description: 'Reduced carbon emissions' },
    { category: 'business', change: decisions.parking === 'garage' ? 10 : -5, description: 'Impact on business accessibility' }
  ];
};

const getTrafficFeedback = (decisions) => {
  const positives = [];
  const improvements = [];
  
  if (decisions.public_transit > 500000) {
    positives.push('Excellent public transit investment');
  }
  if (decisions.bike_lanes > 300000) {
    positives.push('Strong support for sustainable transportation');
  }
  if (decisions.road_improvements < 100000) {
    improvements.push('Existing road infrastructure needs attention');
  }
  
  return { positives, improvements };
};

const getTrafficLearningPoints = (decisions) => {
  return [
    'Public transit reduces individual car dependency',
    'Bike infrastructure requires protected lanes for safety',
    'Parking policy significantly affects downtown dynamics',
    'Integrated transportation planning is most effective'
  ];
};

const calculateHousingScore = (decisions, budget) => {
  let score = 45;
  
  if (decisions.affordable_units > 1000000) score += 20;
  if (decisions.rent_assistance > 200000) score += 15;
  if (decisions.first_time_buyers > 200000) score += 10;
  if (decisions.rent_control) score += 10;
  
  return Math.min(score, 100);
};

const calculateHousingImpacts = (decisions) => {
  return [
    { category: 'housing', change: decisions.affordable_units > 1000000 ? 30 : 15, description: 'Increased affordable housing availability' },
    { category: 'economy', change: decisions.development_incentives === 'tax_breaks' ? 10 : 5, description: 'Economic development impact' },
    { category: 'community', change: decisions.rent_control ? 15 : -5, description: 'Community stability impact' }
  ];
};

const getHousingFeedback = (decisions) => {
  const positives = [];
  const improvements = [];
  
  if (decisions.affordable_units > 1200000) {
    positives.push('Strong commitment to affordable housing');
  }
  if (decisions.rent_assistance > 300000) {
    positives.push('Immediate relief for struggling families');
  }
  if (decisions.development_incentives === 'none') {
    improvements.push('Developer incentives could increase housing supply');
  }
  
  return { positives, improvements };
};

const getHousingLearningPoints = (decisions) => {
  return [
    'Housing affordability affects entire community health',
    'Supply and demand both influence housing costs',
    'Short-term relief and long-term solutions are both needed',
    'Developer incentives must balance public and private interests'
  ];
};

const calculateClimateScore = (decisions, budget) => {
  let score = 35;
  
  if (decisions.flood_infrastructure > 1000000) score += 20;
  if (decisions.green_infrastructure > 800000) score += 20;
  if (decisions.renewable_energy > 600000) score += 15;
  if (decisions.building_codes === 'strict') score += 10;
  
  return Math.min(score, 100);
};

const calculateClimateImpacts = (decisions) => {
  return [
    { category: 'environment', change: decisions.green_infrastructure > 800000 ? 35 : 20, description: 'Climate resilience improved' },
    { category: 'safety', change: decisions.flood_infrastructure > 1000000 ? 25 : 10, description: 'Flood protection enhanced' },
    { category: 'economy', change: decisions.renewable_energy > 600000 ? 15 : 5, description: 'Long-term economic benefits' }
  ];
};

const getClimateFeedback = (decisions) => {
  const positives = [];
  const improvements = [];
  
  if (decisions.green_infrastructure > 1000000) {
    positives.push('Excellent natural climate solutions');
  }
  if (decisions.renewable_energy > 800000) {
    positives.push('Strong renewable energy commitment');
  }
  if (decisions.emergency_systems < 200000) {
    improvements.push('Emergency response systems need more investment');
  }
  
  return { positives, improvements };
};

const getClimateLearningPoints = (decisions) => {
  return [
    'Climate adaptation requires long-term planning',
    'Green infrastructure provides multiple benefits',
    'Building codes are crucial for resilience',
    'Emergency preparedness saves lives and property'
  ];
};

const calculateEconomicScore = (decisions, budget) => {
  let score = 40;
  
  if (decisions.workforce_development > 400000) score += 20;
  if (decisions.small_business_support > 300000) score += 15;
  if (decisions.infrastructure_upgrades > 500000) score += 15;
  if (decisions.displacement_protection) score += 10;
  
  return Math.min(score, 100);
};

const calculateEconomicImpacts = (decisions) => {
  return [
    { category: 'employment', change: decisions.workforce_development > 400000 ? 25 : 15, description: 'Job opportunities increased' },
    { category: 'business', change: decisions.small_business_support > 300000 ? 20 : 10, description: 'Small business growth supported' },
    { category: 'community', change: decisions.displacement_protection ? 15 : -10, description: 'Community stability impact' }
  ];
};

const getEconomicFeedback = (decisions) => {
  const positives = [];
  const improvements = [];
  
  if (decisions.workforce_development > 500000) {
    positives.push('Excellent workforce development investment');
  }
  if (decisions.displacement_protection) {
    positives.push('Community-focused development approach');
  }
  if (decisions.infrastructure_upgrades < 300000) {
    improvements.push('Infrastructure investment crucial for business growth');
  }
  
  return { positives, improvements };
};

const getEconomicLearningPoints = (decisions) => {
  return [
    'Workforce development creates sustainable employment',
    'Small businesses are the backbone of local economy',
    'Economic growth must consider community impact',
    'Infrastructure investment attracts quality businesses'
  ];
};

const determineCivicStyle = (decisions, category) => {
  const styles = {
    community: {
      high_investment: 'Community Champion',
      balanced: 'Collaborative Leader',
      conservative: 'Pragmatic Planner'
    },
    education: {
      high_investment: 'Education Advocate',
      balanced: 'Balanced Educator',
      conservative: 'Fiscal Conservative'
    },
    transportation: {
      high_investment: 'Transit Visionary',
      balanced: 'Integrated Planner',
      conservative: 'Traditional Approach'
    },
    housing: {
      high_investment: 'Housing Champion',
      balanced: 'Market Moderator',
      conservative: 'Development Focused'
    },
    environment: {
      high_investment: 'Climate Guardian',
      balanced: 'Sustainability Advocate',
      conservative: 'Practical Environmentalist'
    },
    economic: {
      high_investment: 'Growth Catalyst',
      balanced: 'Economic Strategist',
      conservative: 'Business Focused'
    }
  };

  // Calculate investment level based on budget allocation
  const totalBudget = Object.values(decisions).reduce((sum, value) => {
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);

  let investmentLevel = 'balanced';
  if (totalBudget > 2000000) investmentLevel = 'high_investment';
  if (totalBudget < 1000000) investmentLevel = 'conservative';

  return styles[category]?.[investmentLevel] || 'Civic Leader';
};