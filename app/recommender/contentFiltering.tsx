import { memoize } from 'lodash';
import FuzzySet from 'fuzzyset.js';

export const AVAILABLE_SKILLS = [
  'C', 'C++', 'Python', 'Java', 'JavaScript', 'React', 'Angular', 'Vue',
  'Node.js', 'Django', 'Flask', 'Ruby on Rails', 'Go', 'Rust', 'Swift',
  'Kotlin', 'TypeScript', 'PHP', 'C#', 'Unity', 'TensorFlow', 'PyTorch',
  'Machine Learning', 'Data Science', 'HTML', 'CSS', 'SQL', 'Firebase',
  'Docker', 'Kubernetes', 'GraphQL', 'ARM', 'Keil'
].sort();

export interface Project {
  id: string;
  uid: string;
  skillsRequired: string[];
  assignedStudents?: string[];
  title: string;
  description: string;
  similarity?: number;
}

// Create a FuzzySet of available skills for fuzzy matching
const skillFuzzySet = FuzzySet(AVAILABLE_SKILLS);

// Memoized function to get the closest matching skill
const getClosestSkill = memoize((skill: string): string => {
  const match = skillFuzzySet.get(skill);
  return match && match[0][0] > 0.8 ? match[0][1] : skill;
});

// Calculate IDF (Inverse Document Frequency) for each skill
const calculateIDF = (projects: Project[]): Map<string, number> => {
  const idf = new Map<string, number>();
  const totalProjects = projects.length;

  AVAILABLE_SKILLS.forEach(skill => {
    const projectsWithSkill = projects.filter(p => p.skillsRequired.includes(skill)).length;
    idf.set(skill, Math.log(totalProjects / (projectsWithSkill + 1)));
  });

  return idf;
};

// Create a weighted skill vector using TF-IDF
const createWeightedSkillVector = (skills: string[], idf: Map<string, number>): number[] => {
  const normalizedSkills = skills.map(s => getClosestSkill(s.toLowerCase().trim()));
  return AVAILABLE_SKILLS.map(skill => {
    const count = normalizedSkills.filter(s => s === skill).length;
    return (count / skills.length) * (idf.get(skill) || 0);
  });
};

// Improved cosine similarity calculation
const cosineSimilarity = (vectorA: number[], vectorB: number[]): number => {
  if (vectorA.length !== vectorB.length) {
    console.error("Vectors must have the same length");
    return 0;
  }

  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return Math.max(0, Math.min(1, dotProduct / (magnitudeA * magnitudeB)));
};

// Dynamic threshold calculation
const calculateDynamicThreshold = (userSkillCount: number): number => {
  const baseThreshold = 0.1;
  const maxThreshold = 0.3;
  const thresholdIncrement = 0.01;
  return Math.min(maxThreshold, baseThreshold + (userSkillCount * thresholdIncrement));
};

// Improved project filtering function
export const filterProjects = (projects: Project[], userSkills: string[]): Project[] => {
  const idf = calculateIDF(projects);
  const userSkillVector = createWeightedSkillVector(userSkills, idf);
  const threshold = calculateDynamicThreshold(userSkills.length);

  const projectsWithSimilarity = projects.map(project => {
    const projectSkillVector = createWeightedSkillVector(project.skillsRequired, idf);
    const similarity = cosineSimilarity(userSkillVector, projectSkillVector);
    return { ...project, similarity };
  });

  let filteredProjects = projectsWithSimilarity
    .filter(project => (project.similarity || 0) >= threshold)
    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

  // Fallback: If no projects meet the threshold, return top 5 most similar projects
  if (filteredProjects.length === 0) {
    filteredProjects = projectsWithSimilarity
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, 5);
  }

  return filteredProjects;
};

// Helper function to get top N skills from a weighted skill vector
export const getTopSkills = (skillVector: number[], n: number = 5): string[] => {
  return skillVector
    .map((weight, index) => ({ skill: AVAILABLE_SKILLS[index], weight }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, n)
    .map(item => item.skill);
};

// Function to analyze skill gaps
export const analyzeSkillGaps = (userSkills: string[], projectSkills: string[]): string[] => {
  const userSkillSet = new Set(userSkills.map(s => getClosestSkill(s.toLowerCase().trim())));
  return projectSkills.filter(skill => !userSkillSet.has(getClosestSkill(skill.toLowerCase().trim())));
};