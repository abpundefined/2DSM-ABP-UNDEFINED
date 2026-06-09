import {
  inquiryRepository,
  type InquiryCreateData,
  type InquiryStatus,
} from "../repositories/inquiry.repository";

import { emailService } from "./email.service";

export const inquiryService = {
  async createInquiry(data: InquiryCreateData) {
    const inquiry = await inquiryRepository.createInquiry(data);

    await emailService.sendInquiryNotification({
      requesterName: data.requester_name,
      requesterEmail: data.requester_email,
      question: data.question,
    });

    return inquiry;
  },

  async findAll() {
    return inquiryRepository.findAll();
  },

  async updateStatus(id: number, status: InquiryStatus, answeredBy: string | null) {
    return inquiryRepository.updateStatus(id, status, answeredBy);
  },
};