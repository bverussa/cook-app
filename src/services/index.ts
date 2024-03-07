import * as ingredients from './ingredientsService';
import * as preparations from './preparationsService';
import * as recipes from './recipesService';

export const services = {
  ingredients,
  preparations,
  recipes,
  storage: {
    imagePath: process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL as string ?? '',
  }
};