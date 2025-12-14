// Central export for all services
export { spaceService } from './spaceService';
export { bookingService } from './bookingService';
export { paymentService } from './paymentService';
export type { PaymentProvider } from './paymentService';
export { contractService, generateContractHtml } from './contractService';
export type { ContractTemplateData } from './contractService';
export { vacancyReportService } from './vacancyReportService';
export {
  checkinService,
  checkoutService,
  damageReportService,
  roomAreaLabels,
  damageSeverityLabels,
} from './checkinService';
