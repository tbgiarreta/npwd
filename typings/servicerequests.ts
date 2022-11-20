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
}

export const ServiceRequestAppNames = {
  [ServiceRequestTypes.POLICE]: 'POLICE_SERVICE_REQUESTS',
  [ServiceRequestTypes.HOSPITAL]: 'HOSPITAL_SERVICE_REQUESTS',
  [ServiceRequestTypes.MECHANIC]: 'MECHANIC_SERVICE_REQUESTS',
  [ServiceRequestTypes.TAXI]: 'TAXI_SERVICE_REQUESTS',
  [ServiceRequestTypes.REPORTER]: 'REPORTER_SERVICE_REQUESTS',
};

export interface IServiceRequest {
  id: string;
  request_type: ServiceRequestTypes;
  date: number; // unix_timestamp
  description: string;
  claimed_by?: string;
  claimed_by_id?: string;
  claimed_at: number; // unix_timestamp
  status: ServiceRequestStatus;
  feedback: number;
  extra: any;
  location: { x: number; y: number; z: number };
  is_anonymous: boolean;
  requester?: string;
  requester_id?: string;
}

export enum ServiceRequestEvents {
  ADD_REQUEST = 'npwd::add_service_requests',
  ADD_REQUEST_BROADCAST_SUCCESS = 'npwd::add_service_requests_broadcast_success',
  FETCH_REQUESTS = 'npwd::fetch_service_requests',
  CLAIM_REQUEST = 'npwd::claim_service_request',
  CLAIM_REQUEST_BROADCAST_SUCCESS = 'npwd::claim_service_requests_broadcast_success',
  UNCLAIM_REQUEST = 'npwd::unclaim_service_request',
  UNCLAIM_REQUEST_BROADCAST_SUCCESS = 'npwd::unclaim_service_requests_broadcast_success',
  SERVICE_FEEDBACK = 'npwd::service_request_feedback',
  SERVICE_FEEDBACK_BROADCAST_SUCCESS = 'npwd::service_request_feedback_broadcast_success',
}

export const ServiceRequestsMock: IServiceRequest[] = [
  {
    id: '00001',
    request_type: ServiceRequestTypes.POLICE,
    date: 0,
    description: 'Preciso de polícia',
    claimed_by: undefined,
    claimed_by_id: undefined,
    claimed_at: undefined,
    status: ServiceRequestStatus.SUBMITTED,
    feedback: undefined,
    extra: {},
    location: {x: 0, y: 0, z: 0},
    is_anonymous: true,
    requester: 'Rafael dos Anjos',
    requester_id: '19120',
  },
  {
    id: '00002',
    request_type: ServiceRequestTypes.HOSPITAL,
    date: 0,
    description: 'Preciso de médico aqui por favor',
    claimed_by: 'Mico laqui',
    claimed_by_id: '12345',
    claimed_at: (new Date()).getTime(),
    status: ServiceRequestStatus.IN_PROGRESS,
    feedback: undefined,
    extra: {contact: "999-5587"},
    location: {x: 0, y: 0, z: 0},
    is_anonymous: false,
    requester: 'Rafael dos Anjos',
    requester_id: '19120',
  },

  {
    id: '00003',
    request_type: ServiceRequestTypes.HOSPITAL,
    date: 0,
    description: 'Preciso de médico',
    claimed_by: undefined,
    claimed_by_id: undefined,
    claimed_at: undefined,
    status: ServiceRequestStatus.SUBMITTED,
    feedback: undefined,
    extra: {contact: "955-3510"},
    location: {x: 0, y: 0, z: 0},
    is_anonymous: false,
    requester: 'Willanna Lívia',
    requester_id: '19121',
  },

  {
    id: '00004',
    request_type: ServiceRequestTypes.POLICE,
    date: 0,
    description: 'Preciso de polícia aqui por favor',
    claimed_by: 'Mico laqui',
    claimed_by_id: '12345',
    claimed_at: (new Date()).getTime(),
    status: ServiceRequestStatus.IN_PROGRESS,
    feedback: undefined,
    extra: {contact: "955-3510"},
    location: {x: 0, y: 0, z: 0},
    is_anonymous: true,
    requester: 'Rafael dos Anjos',
    requester_id: '19120',
  },
];
