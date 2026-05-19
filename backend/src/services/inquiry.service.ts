import { inquiryRepository, type InquiryCreateData } from "../repositories/inquiry.repository";

export const inquiryService = {
  // Camada de serviço para encapsular a lógica de negócios e impedir que
  // o controller acesse diretamente o repositório.
  async createInquiry(data: InquiryCreateData) {
    return inquiryRepository.createInquiry(data);
  },
};
