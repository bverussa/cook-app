import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';

import { services } from '@/services';

import { Ingredient } from '../Ingredient';
import { Selected } from '../Selected';

import { Loading } from '../Loading';
import { styles } from './styles';

export function Ingredients() {
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);

    useEffect(() => {
        services.ingredients
            .findAll()
            .then(setIngredients)
            .finally(() => setIsLoading(false));
    }, []);

    function handleToggleSelected(value: string) {
        if (selected.includes(value)) {
            return setSelected((state) =>
                state.filter((item) => item !== value),
            );
        }
        setSelected((state) => [...state, value]);
    }

    function handleClearSelected() {
        Alert.alert('Limpar', 'Deseja limpar tudo?', [
            {
                text: 'Não',
                style: 'cancel',
            },
            {
                text: 'Sim',
                onPress: () => setSelected([]),
            },
        ]);
    }

    function handleSearch() {
        router.navigate('/recipes/' + selected);
    }

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {ingredients.map((item) => (
                    <Ingredient
                        key={item.id}
                        name={item.name}
                        image={`${services.storage.imagePath}/${item.image}`}
                        selected={selected.includes(item.id)}
                        onPress={() => handleToggleSelected(item.id)}
                    />
                ))}
            </ScrollView>

            {selected.length > 0 ? (
                <Selected
                    quantity={selected.length}
                    onClear={() => handleClearSelected()}
                    onSearch={() => handleSearch()}
                />
            ) : null}
        </>
    );
}
