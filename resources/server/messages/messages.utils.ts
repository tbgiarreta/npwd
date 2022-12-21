import { mainLogger } from '../sv_logger';

export const messagesLogger = mainLogger.child({ module: 'messages' });
