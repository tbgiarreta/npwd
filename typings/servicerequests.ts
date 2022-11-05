export enum ServiceRequestStatus {
  SUBMITTED = 'submitted',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}

export enum ServiceRequestTypes {
  POLICE = 'police',
  HOSPITAL = 'hospital',
  MECHANIC = 'mechanic',
  TAXI = 'taxi',
  REPORTER = 'reporter',
  ADMIN = 'admin',
}

export interface IServiceRequest {
  type: ServiceRequestTypes;
  date: number; // unix_timestamp
  description: string;
  claimed_by: string;
  claimed_by_id: number;
  claimed_at: number; // unix_timestamp
  status: ServiceRequestStatus;
  feedback: number;
  extra: any;
  location: { x: number; y: number; z: number };
  is_anonymous: boolean;
  requester: string;
  requester_id: number;
}

export enum ServiceRequestEvents {
  FETCH_REQUESTS = 'npwd::fetch_service_requests',
  CLAIM_REQUEST = 'npwd::claim_service_request',
  UNCLAIM_REQUEST = 'npwd::unclaim_service_request',
  SERVICE_FEEDBACK = 'npwd::service_request_feedback',
}

export const ServiceRequestsMock: IServiceRequest[] = [
  {
    type: ServiceRequestTypes.POLICE,
    date: 0,
    description: 'Preciso de polícia',
    claimed_by: undefined,
    claimed_by_id: undefined,
    claimed_at: undefined,
    status: ServiceRequestStatus.SUBMITTED,
    feedback: undefined,
    extra: {},
    location: { x: 0, y: 0, z: 0 },
    is_anonymous: false,
    requester: 'Rafael dos Anjos',
    requester_id: 19120,
  },
];
