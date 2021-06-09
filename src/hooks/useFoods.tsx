import { 
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch, 
  SetStateAction 
} from 'react';
import api from '../services/api';

import { Food, FoodInput } from '../types';

interface FoodsContextData {
    foods: Food[];
    handleAddFood: (food: FoodInput) => Promise<void>;
    handleUpdateFood: (food: Food) => Promise<void>;
    handleDeleteFood: (id: number) => Promise<void>;
    handleEditFood: (food: Food) => void;
    toggleModal: () => void;
    toggleEditModal: () => void;
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    editingFood: FoodInput;
    editModalOpen: boolean;
}

const FoodsContext = createContext({} as FoodsContextData);

interface FoodsProviderProps {
    children: ReactNode;
}

export function FoodsProvider({ children }: FoodsProviderProps) {
    const [foods, setFoods] = useState<Food[]>([]);
    const [editingFood, setEditingFood] = useState({} as Food);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

    useEffect(() => {
        async function allFoods() {
            const response = await api.get('foods');
            setFoods(response.data); 
        }
        allFoods();
    }, []);

    console.log('context', foods);

    async function handleAddFood(food: FoodInput) {
        try {
            const response = await api.post('/foods', {
            ...food,
            available: true,
            });

            setFoods([
              ...foods, 
              response.data
            ]);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleUpdateFood (food: Food) {
        try {
            const foodUpdated = await api.put(
            `/foods/${editingFood.id}`,
            { ...editingFood, ...food },
            );

            const foodsUpdated = foods.map((foods: { id: any; }) =>
            foods.id !== foodUpdated.data.id ? foods : foodUpdated.data,
            );

            setFoods(foodsUpdated);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleDeleteFood (id: number) {
        await api.delete(`/foods/${id}`);

        const foodsFiltered = foods.filter((food: { id: number; }) => food.id !== id);

        setFoods(foodsFiltered);
    }

    function handleEditFood (food: Food) {
        setEditingFood(food);
        setEditModalOpen(true);
    }

    function toggleModal () {
        setModalOpen(!modalOpen);
    }

    function toggleEditModal () {
        setEditModalOpen(!editModalOpen);
    }

    return (
        <FoodsContext.Provider
            value={{
                foods,
                handleAddFood,
                handleUpdateFood,
                handleDeleteFood,
                handleEditFood,
                toggleModal,
                toggleEditModal,
                modalOpen,
                setModalOpen,
                editingFood,
                editModalOpen
            }}
        >
            {children}
        </FoodsContext.Provider>
    )
}

export function useFoods() {
    const context = useContext(FoodsContext);

    return context;
}