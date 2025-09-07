export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface Association {
  id: string;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  associationId: string;
  role: 'admin' | 'member' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  joinedAt: string;
  updatedAt: string;
}

export interface Operator {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'support';
  status: 'active' | 'inactive';
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalAssociations: number;
  totalMembers: number;
  activeAssociations: number;
  pendingApplications: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'association_created' | 'member_joined' | 'member_left' | 'status_changed';
  description: string;
  entityType: 'association' | 'member' | 'operator';
  entityId: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  services: Record<string, {
    status: 'up' | 'down' | 'degraded';
    responseTime?: number;
    lastCheck: string;
    error?: string;
  }>;
  timestamp: string;
  uptime: number;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

// Utility types
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'suspended';
export type UserRole = 'admin' | 'member' | 'moderator' | 'super_admin' | 'support';

// Request types
export interface CreateAssociationRequest {
  name: string;
  description?: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface UpdateAssociationRequest extends Partial<CreateAssociationRequest> {
  status?: EntityStatus;
}

export interface CreateMemberRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateMemberRequest extends Partial<CreateMemberRequest> {
  status?: EntityStatus;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, any>;
}
