
import { ref, set, get, query, orderByChild } from "firebase/database";
import { database } from "../firebase";
import { ContractTemplate } from "./types";

export const saveTemplate = async (template: ContractTemplate) => {
  const templateRef = ref(database, `templates/${template.id}`);
  await set(templateRef, template);
};

export const getTemplates = async (): Promise<ContractTemplate[]> => {
  const templatesRef = ref(database, 'templates');
  const snapshot = await get(templatesRef);
  if (!snapshot.exists()) return [];
  return Object.values(snapshot.val());
};

export const getTemplateById = async (id: string): Promise<ContractTemplate | null> => {
  const templateRef = ref(database, `templates/${id}`);
  const snapshot = await get(templateRef);
  if (!snapshot.exists()) return null;
  return snapshot.val();
};

export const getTemplatesByCategory = async (category: string): Promise<ContractTemplate[]> => {
  const templatesRef = ref(database, 'templates');
  const templatesQuery = query(templatesRef, orderByChild('category'));
  const snapshot = await get(templatesQuery);
  if (!snapshot.exists()) return [];
  const templates = Object.values(snapshot.val()) as ContractTemplate[];
  return templates.filter(t => t.category === category);
};
