import {
  CreateFeedbackData,
  CreateInquiryData,
  navigationRepository,
} from "../repositories/navigation.repository";

export const navigationService = {
  async getRoot() {
    const nodes = await navigationRepository.findRoot();
    return nodes;
  },
  
  async getChildren(slug: string) {
  return navigationRepository.findChildrenBySlug(slug);
},

  async createInquiry(data: CreateInquiryData) {
    return navigationRepository.createInquiry(data);
  },

  async createFeedback(data: CreateFeedbackData) {
    return navigationRepository.createFeedback(data);
  }
};
