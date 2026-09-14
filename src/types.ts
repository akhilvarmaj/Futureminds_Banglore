export type IssueSeverity = 'critical' | 'warning' | 'good';
export type IssueCategory = 'technical' | 'onpage' | 'schema' | 'local';

export interface AuditIssue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  title: string;
  description: string;
  recommendation: string;
}

export interface AuditMetadata {
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  canonical: string;
  viewport: boolean;
  og: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    url?: string;
  };
  twitter: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  h1: string[];
  h2: string[];
  imagesTotal: number;
  imagesWithoutAlt: number;
  schemasCount: number;
  robotsStatus: number;
  sitemapStatus: number;
}

export interface AuditResult {
  url: string;
  fetchStatus: number;
  responseTime: number;
  overallScore: number;
  categoryScores: {
    technical: number;
    onpage: number;
    schema: number;
    local: number;
  };
  counts: {
    critical: number;
    warning: number;
    good: number;
  };
  metadata: AuditMetadata;
  issues: AuditIssue[];
}

export interface KeywordItem {
  id: string;
  keyword: string;
  category: 'Local Bangalore' | 'Robotics Classes' | 'Coding & Python' | 'Grades 1-10' | 'Near Me Queries';
  searchIntent: 'Transactional' | 'Commercial' | 'Informational';
  monthlyVolume: number;
  difficulty: 'Low' | 'Medium' | 'High';
  priority: 'Quick Win' | 'High Value' | 'Long-term Authority';
  targetUrl: string;
  serpFeatures: string[];
  suggestedAnchor: string;
}

export interface ContentPillar {
  title: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  searchIntent: string;
  targetAudience: string;
  estimatedVolume: string;
  wordCount: string;
  slug: string;
  summary: string;
  keyTakeaways: string[];
}
