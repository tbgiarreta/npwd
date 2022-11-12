import { mainLogger } from '../sv_logger';

export const serviceRequestsLogger = mainLogger.child({ module: 'service_requests' });
