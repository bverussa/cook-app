import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { services } from '@/services';

import { IngredientsList } from '@/components/IngredientsList';
import { Recipe } from '@/components/Recipe';

import { Loading } from '@/components/Loading';
import { styles } from './styles';

export default function Recipes() {
    const [isLoading, setIsLoading] = useState(true);
    const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);
    const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
    const params = useLocalSearchParams<{ ingredientsIds: string }>();
    const ingredientsIds = params.ingredientsIds.split(',');

    useEffect(() => {
        services.ingredients
            .findByIds(ingredientsIds)
            .then(setIngredients)
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        services.recipes
            .findByIngredientsIds(ingredientsIds)
            .then(setRecipes)
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons
                    name="arrow-back"
                    size={32}
                    onPress={() => router.back()}
                />
                <Text style={styles.title}>Ingredientes</Text>
            </View>

            <IngredientsList ingredients={ingredients} />

            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Recipe
                        recipe={item}
                        onPress={() => router.navigate('/recipe/' + item.id)}
                    />
                )}
                style={styles.recipes}
                contentContainerStyle={styles.recipesContent}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ gap: 16 }}
                numColumns={2}
            />
        </View>
    );
}
