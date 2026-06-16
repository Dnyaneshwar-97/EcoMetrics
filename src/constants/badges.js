export const BADGE_DEFINITIONS = [
  {
    id: 'green-starter',
    name: 'Green Starter',
    description: 'Complete your first carbon footprint calculation.',
    icon: 'Sprout',
    criteria: { type: 'calculations', count: 1 },
  },
  {
    id: 'eco-learner',
    name: 'Eco Learner',
    description: 'Achieve a carbon score of 60 or above.',
    icon: 'BookOpen',
    criteria: { type: 'score', minScore: 60 },
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Complete 50% of your reduction planner tasks.',
    icon: 'Sword',
    criteria: { type: 'plannerProgress', percentage: 50 },
  },
  {
    id: 'climate-champion',
    name: 'Climate Champion',
    description: 'Reduce your footprint by 10% compared to your first calculation.',
    icon: 'Trophy',
    criteria: { type: 'reduction', percentage: 10 },
  },
  {
    id: 'earth-guardian',
    name: 'Earth Guardian',
    description: 'Achieve Excellent score and complete all planner tasks.',
    icon: 'Shield',
    criteria: { type: 'combined', minScore: 80, plannerComplete: true },
  },
];

export const BADGE_STATUS = {
  LOCKED: 'locked',
  EARNED: 'earned',
};
