export const RECOMMENDATION_RULES = [
  {
    id: 'high-electricity',
    category: 'electricity',
    threshold: 200,
    title: 'High Electricity Consumption',
    recommendations: [
      {
        title: 'Switch to LED Bulbs',
        description: 'Replace all incandescent bulbs with energy-efficient LEDs.',
        co2ReductionKg: 15,
        moneySaved: 500,
        treesEquivalent: 1,
      },
      {
        title: 'Use Energy-Efficient Appliances',
        description: 'Upgrade to BEE 5-star rated appliances.',
        co2ReductionKg: 25,
        moneySaved: 1200,
        treesEquivalent: 2,
      },
      {
        title: 'Install Solar Panels',
        description: 'Generate clean energy and reduce grid dependency.',
        co2ReductionKg: 80,
        moneySaved: 3000,
        treesEquivalent: 4,
      },
    ],
  },
  {
    id: 'high-transport',
    category: 'transportation',
    threshold: 500,
    title: 'High Vehicle Usage',
    recommendations: [
      {
        title: 'Use Public Transport',
        description: 'Switch to buses or metro for daily commute.',
        co2ReductionKg: 40,
        moneySaved: 2000,
        treesEquivalent: 2,
      },
      {
        title: 'Carpool with Colleagues',
        description: 'Share rides to reduce per-person emissions.',
        co2ReductionKg: 20,
        moneySaved: 1500,
        treesEquivalent: 1,
      },
      {
        title: 'Consider an Electric Vehicle',
        description: 'EVs produce significantly lower emissions per km.',
        co2ReductionKg: 60,
        moneySaved: 5000,
        treesEquivalent: 3,
      },
    ],
  },
  {
    id: 'frequent-flights',
    category: 'flights',
    threshold: 4,
    title: 'Frequent Air Travel',
    recommendations: [
      {
        title: 'Choose Train for Domestic Travel',
        description: 'Indian Railways emits 80% less CO2 than flights.',
        co2ReductionKg: 200,
        moneySaved: 3000,
        treesEquivalent: 10,
      },
      {
        title: 'Use Virtual Meetings',
        description: 'Replace unnecessary business trips with video calls.',
        co2ReductionKg: 150,
        moneySaved: 10000,
        treesEquivalent: 7,
      },
    ],
  },
  {
    id: 'high-meat',
    category: 'food',
    threshold: 4,
    title: 'High Meat Consumption',
    recommendations: [
      {
        title: 'Try Meatless Mondays',
        description: 'One meat-free day per week reduces food emissions.',
        co2ReductionKg: 10,
        moneySaved: 800,
        treesEquivalent: 1,
      },
      {
        title: 'Switch to Plant-Based Proteins',
        description: 'Lentils and beans have much lower carbon footprint.',
        co2ReductionKg: 20,
        moneySaved: 500,
        treesEquivalent: 1,
      },
    ],
  },
  {
    id: 'high-waste',
    category: 'waste',
    threshold: 10,
    title: 'High Waste Generation',
    recommendations: [
      {
        title: 'Start Composting',
        description: 'Compost organic waste to reduce landfill emissions.',
        co2ReductionKg: 8,
        moneySaved: 0,
        treesEquivalent: 1,
      },
      {
        title: 'Reduce Single-Use Plastics',
        description: 'Use reusable bags, bottles, and containers.',
        co2ReductionKg: 5,
        moneySaved: 300,
        treesEquivalent: 0,
      },
    ],
  },
];

export const PLANNER_TASKS = [
  { week: 1, task: 'Replace bulbs with LEDs', category: 'electricity', reductionPercent: 3 },
  { week: 1, task: 'Unplug devices when not in use', category: 'electricity', reductionPercent: 2 },
  { week: 2, task: 'Reduce AC usage by 1 hour daily', category: 'electricity', reductionPercent: 4 },
  { week: 2, task: 'Use natural light during daytime', category: 'electricity', reductionPercent: 2 },
  { week: 3, task: 'Use public transport twice a week', category: 'transportation', reductionPercent: 5 },
  { week: 3, task: 'Carpool or bike for short trips', category: 'transportation', reductionPercent: 3 },
  { week: 4, task: 'Plant two trees in your community', category: 'general', reductionPercent: 2 },
  { week: 4, task: 'Start composting kitchen waste', category: 'waste', reductionPercent: 3 },
];
