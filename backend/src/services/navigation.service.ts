import { navigationRepository } from "../repositories/navigation.repository";

export const navigationService = {
  async getRoot() {
    const nodes = await navigationRepository.findRoot();
    return nodes;
  },
  
  async getChildren(slug: string) {
  return navigationRepository.findChildrenBySlug(slug);
}
};